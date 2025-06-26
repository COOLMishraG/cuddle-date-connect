import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { userApi, authApi, API_BASE_URL } from "@/services/api";
import { User as UserType, SignupData as SignupDataType, UserRole } from "@/types/user";

// Define user type
type User = UserType | null;

// Re-export SignupData for convenience
export type SignupData = SignupDataType;

// Define context type
type AuthContextType = {
  currentUser: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username?: string, password?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (data: SignupData) => Promise<void>;
  signOut: () => Promise<void>;
  handleOAuthCallback: (token: string) => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  handleOAuthCallback: async () => {},
  error: null,
  setError: () => {},
});

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Check for existing user session on mount
  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true);
      try {
        // Check if we have a user in localStorage (try both possible keys)
        const savedUser = localStorage.getItem("user") || localStorage.getItem("currentUser");
        
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            console.info("Found saved user data:", parsedUser.username || parsedUser.email);
            console.log("Complete user object:", parsedUser); // Add this line for debugging
            setCurrentUser(parsedUser);
            
            // Standardize to use "user" key
            localStorage.setItem("user", JSON.stringify(parsedUser));
            localStorage.removeItem("currentUser"); // Remove old key if it exists
            localStorage.removeItem("isAuthenticated"); // Remove redundant key
            
          } catch (parseError) {
            console.error("Error parsing saved user data:", parseError);
            // Clear corrupted data
            localStorage.removeItem("user");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("isAuthenticated");
            setCurrentUser(null);
          }
        } else {
          console.info("No saved user data found");
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error restoring session:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserSession();
  }, []);  // Sign in with username and password
  const signIn = async (username?: string, password?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!username || !password) {
        throw new Error("Username and password are required");
      }
      
      // Call the backend API to authenticate the user
      const loginResponse = await authApi.login(username, password);
      
      // Handle the response structure from your backend
      let userData;
      if (loginResponse.user) {
        // Backend returned { success: true, user: {...}, token: "..." } format
        userData = loginResponse.user;
      } else if (loginResponse.id) {
        // Backend returned user data directly
        userData = loginResponse;
      } else {
        throw new Error("Invalid response from authentication server");
      }
      
      if (!userData || !userData.id) {
        throw new Error("Invalid user data from authentication server");
      }
      
      // Create user object based on backend response
      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        profileImage: userData.profileImage || "/placeholder.svg",
        role: userData.role,
        phone: userData.phone || null,
        location: userData.location || null,
        username: userData.username || (userData.email ? userData.email.split('@')[0] : ''),
        displayName: userData.displayName || userData.name
      };
      
      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Log successful login
      console.info("User logged in successfully:", username);
    } catch (err: any) {
      // Handle specific error types
      if (err.message.includes('404') || err.message.includes('User not found')) {
        setError("User not found. Please check your username.");
      } else if (err.message.includes('401') || err.message.includes('Invalid credentials')) {
        setError("Invalid password. Please try again.");
      } else if (err.message.includes('429')) {
        setError("Too many login attempts. Please try again later.");
      } else {
        setError(err.message || "Failed to sign in. Please try again.");
      }
      
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Google sign in function
  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Since your backend returns JSON instead of redirecting,
      // we'll redirect to Google OAuth directly and handle the callback
      window.location.href = `${API_BASE_URL}/auth/google`;
      
      // Note: The page will redirect to Google, then to your backend,
      // then your backend should redirect to /oauth/callback with the token
      // Make sure your backend redirects to: http://localhost:5173/oauth/callback?token=${token}
      
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google. Please try again.");
      console.error("Google sign in error:", err);
      setIsLoading(false);
    }
  };  // Sign up function
  const signUp = async (userData: SignupData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await authApi.register(userData);
      
      // Log the entire response to see its structure
      console.log('User registration response:', result);
      
      // Set the current user with the registered user data
      if (result && result.id) {
        // We have a valid user object with an ID
        setCurrentUser(result);
        // Use consistent localStorage key
        localStorage.setItem('user', JSON.stringify(result));
        
        console.log('User registered and authenticated successfully:', result);
      } else {
        console.error('Invalid user data received:', result);
        throw new Error("Registration completed but returned invalid user data");
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setIsLoading(true);
    
    try {
      // Call the backend to invalidate the session (if endpoint exists)
      try {
        await authApi.logout();
      } catch (logoutError) {
        console.warn("Logout endpoint not available or failed:", logoutError);
        // Continue with local cleanup even if backend logout fails
      }
      
      // Clear user data locally
      setCurrentUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("currentUser"); // Remove old key if it exists
      localStorage.removeItem("isAuthenticated"); // Remove redundant key
      
      console.info("User signed out successfully");
    } catch (err: any) {
      setError(err.message || "Failed to sign out. Please try again.");
      console.error("Sign out error:", err);
      
      // Still clear local data even if the API call failed
      setCurrentUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isAuthenticated");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OAuth callback from backend
  const handleOAuthCallback = async (token: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🎫 Handling OAuth callback with token:', token);
      
      // Validate the token with the backend
      const response = await authApi.validateToken(token);
      
      console.log('✅ Token validation response:', response);
      
      // Handle the response structure from your backend (same logic as api.ts)
      let userData;
      if (response.user) {
        // Backend returned { user: {...}, token: "..." } format
        userData = response.user;
      } else if (response.id) {
        // Backend returned user data directly
        userData = response;
      } else {
        throw new Error('Invalid token or user data from server');
      }
      
      if (!userData || !userData.id) {
        throw new Error("Invalid user data from authentication server");
      }
      
      // Create user object (same logic as signIn function)
      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        profileImage: userData.profileImage || "/placeholder.svg",
        role: userData.role,
        phone: userData.phone || null,
        location: userData.location || null,
        username: userData.username || (userData.email ? userData.email.split('@')[0] : ''),
        displayName: userData.displayName || userData.name
      };
      
      // Store user in context and localStorage
      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      
      console.log('✅ OAuth authentication successful:', user.username || user.email);
      
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Please try again.");
      console.error("OAuth callback error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  // Context value
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    handleOAuthCallback,
    error,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
