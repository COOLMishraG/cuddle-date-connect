import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define user type
type User = {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  role?: string;
  phone?: string;
  location?: string;
} | null;

// Define signup data type based on your backend model
export type SignupData = {
  name: string;
  email: string;
  password: string;
  role: 'OWNER' | 'SITTER' | 'VET';
  phone?: string;
  location?: string;
};

// Define context type
type AuthContextType = {
  currentUser: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email?: string, password?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (data: SignupData) => Promise<void>;
  signOut: () => Promise<void>;
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
    // Simulate checking local storage or session for existing user
    const checkUserSession = () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error restoring session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserSession();
  }, []);

  // Sign in with email and password
  const signIn = async (email?: string, password?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would call your backend API here
      // For now, we'll simulate it
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app this would come from your backend
      const mockUser = {
        id: "user-123",
        name: "Pet Lover",
        email: email,
        photoUrl: "/placeholder.svg",
        role: "OWNER"
      };
      
      setCurrentUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.");
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
      // This is a simulation - in a real app, you would use OAuth
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Mock user data
      const mockUser = {
        id: "google-user-123",
        name: "Pet Lover",
        email: "pet.lover@example.com",
        photoUrl: "/placeholder.svg",
        role: "OWNER"
      };
      
      setCurrentUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (data: SignupData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would call your backend API here
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Mock user registration - in real app this would call your backend API
      const newUser = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
        photoUrl: "/placeholder.svg",
        role: data.role,
        phone: data.phone,
        location: data.location
      };
      
      // Auto sign-in after successful registration
      setCurrentUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (err: any) {
      setError(err.message || "Failed to sign up. Please try again.");
      console.error("Sign up error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setIsLoading(true);
    
    try {
      // Clear user data
      setCurrentUser(null);
      localStorage.removeItem("user");
    } catch (err: any) {
      setError(err.message || "Failed to sign out. Please try again.");
      console.error("Sign out error:", err);
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
    error,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
