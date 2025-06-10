import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import Header from '@/components/Header';

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, isLoading, error } = useAuth();
    // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);
  const handleGoogleSignIn = async () => {
    try {
      await signIn();
      navigate('/profile');
    } catch (error) {
      console.error("Google sign in failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBE7E7] flex items-center justify-center p-4">
      {/* Floating Background Shapes - same as other pages */}
      <div className="floating-shape absolute top-[5%] left-[5%] text-4xl float-1">💕</div>
      <div className="floating-shape absolute top-[10%] right-[8%] text-3xl float-2">🐾</div>
      <div className="floating-shape absolute bottom-[20%] left-[7%] text-5xl float-3">❤️</div>
      <div className="floating-shape absolute top-[25%] left-[33%] text-2xl float-1" style={{ animationDelay: '2s' }}>🏠</div>
      <div className="floating-shape absolute bottom-[25%] right-[25%] text-3xl float-2" style={{ animationDelay: '3s' }}>🩺</div>
      <div className="floating-shape absolute top-[40%] right-[5%] text-4xl float-3" style={{ animationDelay: '1s' }}>💖</div>
      <div className="floating-shape absolute bottom-[10%] left-[50%] text-2xl float-1" style={{ animationDelay: '4s' }}>🐕</div>
      
      <Card className="romantic-card-accent w-full max-w-md p-8 relative z-10">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-burgundy" />
          </div>
          <h1 className="text-3xl font-bold fredoka mb-2 text-burgundy">Welcome to PetMatch</h1>
          <p className="text-deep-rose">Sign in to continue to your pet's dating adventure</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black font-medium py-3 px-4 rounded-lg border border-gray-300 shadow-sm"
        >
          <Globe className="w-5 h-5" />
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </Button>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            By signing in, you agree to our{" "}
            <a href="#" className="text-burgundy hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-burgundy hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
