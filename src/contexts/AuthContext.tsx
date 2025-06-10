import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define user type
type User = {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
} | null;

// Define context type
type AuthContextType = {
  currentUser: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  error: null
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

  // Sign in function (simulates Google OAuth)
  const signIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This is a simulation - in a real app, you would use Firebase Auth, Auth0, etc.
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Mock user data
      const mockUser = {
        id: "google-user-123",
        name: "Pet Lover",
        email: "pet.lover@example.com",
        photoUrl: "/placeholder.svg"
      };
      
      setCurrentUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      console.error("Sign in error:", err);
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
    } catch (err) {
      setError("Failed to sign out. Please try again.");
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
    signOut,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
