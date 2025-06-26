import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, Heart, User, Mail, Lock, Check, Phone, MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, SignupData } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import Header from '@/components/Header';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle, signUp, isAuthenticated, isLoading, error, setError } = useAuth();
  
  // Default to sign-in tab
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
    // Form states
  const [signinData, setSigninData] = useState({
    username: "",
    password: "",
  });
    const [signupData, setSignupData] = useState<SignupData>({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "OWNER",
    phone: "",
    location: "",
  });
  
  // Get the redirect path from location state or default to profile
  const redirectTo = location.state?.redirectTo || '/profile';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  // Check for OAuth errors in URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const oauthError = searchParams.get('error');
    if (oauthError) {
      if (oauthError === 'authentication_failed') {
        setError('Google authentication failed. Please try again.');
      } else {
        setError(decodeURIComponent(oauthError));
      }
      // Clean up the URL
      navigate('/signin', { replace: true });
    }
  }, [location.search, setError, navigate]);  

  // Handle input change for sign in form
  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSigninData(prev => ({ ...prev, [name]: value }));
  };

  // Handle input change for sign up form
  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle role selection
  const handleRoleChange = (value: string) => {
    setSignupData(prev => ({ 
      ...prev, 
      role: value as 'OWNER' | 'SITTER' | 'VET' 
    }));
  };
    // Handle sign in submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signinData.username || !signinData.password) {
      setError("Please enter both username and password");
      return;
    }
    
    try {
      await signIn(signinData.username, signinData.password);
      navigate(redirectTo);
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };
  
  // Handle sign up submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
      // Validate required fields
    if (!signupData.name || !signupData.username || !signupData.email || !signupData.password) {
      setError("Please fill in all required fields");
      return;
    }
    
    // Validate username (no spaces, special characters allowed are _ and .)
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(signupData.username)) {
      setError("Username can only contain letters, numbers, underscores, and periods");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // Validate password strength
    if (signupData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    try {
      await signUp(signupData);
      toast({
        title: "Account created successfully!",
        description: "Welcome to PetMatch. Your pet's adventure begins now.",
      });
      navigate(redirectTo);
    } catch (error) {
      console.error("Sign up failed:", error);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(redirectTo);
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
      
      <Card className="romantic-card-accent w-full max-w-md p-6 relative z-10">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-burgundy" />
          </div>
          <h1 className="text-3xl font-bold fredoka mb-2 text-burgundy">Welcome to PetMatch</h1>
          <p className="text-deep-rose">Join the pet dating adventure</p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup")}>
          <TabsList className="grid grid-cols-2 mb-6 w-full">
            <TabsTrigger value="signin" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">Sign Up</TabsTrigger>
          </TabsList>
          
          {/* Sign In Form */}
          <TabsContent value="signin">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSignIn} className="space-y-4">              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Your username"
                    value={signinData.username}
                    onChange={handleSignInChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={signinData.password}
                    onChange={handleSignInChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-burgundy hover:bg-deep-rose text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-2 text-xs text-muted-foreground">OR</span>
                </div>
              </div>
              
              <Button
                onClick={handleGoogleSignIn}
                type="button"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black font-medium py-3 px-4 rounded-lg border border-gray-300"
              >
                <Globe className="w-5 h-5" />
                {isLoading ? "Signing in..." : "Sign in with Google"}
              </Button>
            </form>
          </TabsContent>
          
          {/* Sign Up Form */}
          <TabsContent value="signup">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">
                  Full Name <span className="text-burgundy">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="signup-name"
                    name="name"
                    placeholder="Your Name"
                    value={signupData.name}
                    onChange={handleSignUpChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-username">
                  Username <span className="text-burgundy">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="signup-username"
                    name="username"
                    placeholder="Choose a username"
                    value={signupData.username}
                    onChange={handleSignUpChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">
                  Email <span className="text-burgundy">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={signupData.email}
                    onChange={handleSignUpChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">
                  Password <span className="text-burgundy">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={signupData.password}
                    onChange={handleSignUpChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-role">
                  Role <span className="text-burgundy">*</span>
                </Label>
                <Select 
                  defaultValue={signupData.role} 
                  onValueChange={handleRoleChange}
                  required
                >
                  <SelectTrigger id="signup-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OWNER">Pet Owner</SelectItem>
                    <SelectItem value="SITTER">Pet Sitter</SelectItem>
                    <SelectItem value="VET">Veterinarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-phone"
                      name="phone"
                      placeholder="Your Phone Number"
                      value={signupData.phone}
                      onChange={handleSignUpChange}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-location">Location (Optional)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-location"
                      name="location"
                      placeholder="City, Country"
                      value={signupData.location}
                      onChange={handleSignUpChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-burgundy hover:bg-deep-rose text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-2 text-xs text-muted-foreground">OR</span>
                </div>
              </div>
              
              <Button
                onClick={handleGoogleSignIn}
                type="button"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black font-medium py-3 px-4 rounded-lg border border-gray-300"
              >
                <Globe className="w-5 h-5" />
                {isLoading ? "Signing up..." : "Continue with Google"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center">          <p className="text-muted-foreground text-xs">
            By signing in or signing up, you agree to our{" "}
            <a href="#" className="text-burgundy hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}            <a href="#" className="text-burgundy hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
