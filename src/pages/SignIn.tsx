import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, Heart, User, Mail, Lock, Check, Phone, MapPin, Shield, Users, Star } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, SignupData } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import Header from '../components/Header';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-pink-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header />
      
      <div className="pt-24 pb-12 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Welcome Content */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  Join PetMatch Today
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Connect with a loving community of pet enthusiasts and discover amazing services for your furry friends.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Find Perfect Matches</h3>
                    <p className="text-gray-600">Connect with compatible pets for breeding, playdates, and lifelong friendships.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Trusted Pet Sitters</h3>
                    <p className="text-gray-600">Book verified, professional pet sitters who treat your pets like family.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Expert Veterinary Care</h3>
                    <p className="text-gray-600">Access certified veterinarians and emergency care services 24/7.</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">50K+</div>
                  <div className="text-sm text-gray-600">Happy Pets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">15K+</div>
                  <div className="text-sm text-gray-600">Pet Sitters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">1K+</div>
                  <div className="text-sm text-gray-600">Veterinarians</div>
                </div>
              </div>

              {/* Testimonial */}
              <Card className="glass-card border-0 bg-white/40 backdrop-blur-lg p-6">
                <div className="flex items-start space-x-4">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=SarahTestimonial&backgroundColor=ffd93d&clothingColor=65c9ff" 
                    alt="Sarah M."
                    className="w-12 h-12 rounded-full object-cover bg-white p-1"
                  />
                  <div>
                    <p className="text-gray-700 italic mb-2">"PetMatch helped me find the perfect sitter for my Golden Retriever. The peace of mind is invaluable!"</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-800">Sarah M.</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Side - Sign In Form */}
            <div className="flex justify-center lg:justify-end">
              <Card className="glass-card border-0 bg-white/40 backdrop-blur-lg w-full max-w-md p-8 shadow-xl">
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 premium-gradient rounded-2xl flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600">Sign in to continue your pet care journey</p>
                </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup")}>
          <TabsList className="grid grid-cols-2 mb-6 w-full bg-white/50 backdrop-blur-sm">
            <TabsTrigger 
              value="signin" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          {/* Sign In Form */}
          <TabsContent value="signin">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Your username"
                    value={signinData.username}
                    onChange={handleSignInChange}
                    className="pl-10 modern-input border-0 focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={signinData.password}
                    onChange={handleSignInChange}
                    className="pl-10 modern-input border-0 focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full premium-gradient text-white hover:shadow-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-white/30" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white/50 backdrop-blur-sm px-3 py-1 text-xs text-gray-500 rounded-full">OR</span>
                </div>
              </div>
              
              <Button
                onClick={handleGoogleSignIn}
                type="button"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200 backdrop-blur-sm transition-all duration-300"
              >
                <Globe className="w-5 h-5" />
                {isLoading ? "Signing in..." : "Sign in with Google"}
              </Button>
            </form>
          </TabsContent>
          
          {/* Sign Up Form */}
          <TabsContent value="signup">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-gray-700 font-medium">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="signup-name"
                    name="name"
                    placeholder="Your Name"
                    value={signupData.name}
                    onChange={handleSignUpChange}
                    className="pl-10 modern-input border-0 focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-username" className="text-gray-700 font-medium">
                  Username <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="signup-username"
                    name="username"
                    placeholder="Choose a username"
                    value={signupData.username}
                    onChange={handleSignUpChange}
                    className="pl-10 modern-input border-0 focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-gray-700 font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={signupData.email}
                    onChange={handleSignUpChange}
                    className="pl-10 modern-input border-0 focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-gray-700 font-medium">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={signupData.password}
                    onChange={handleSignUpChange}
                    className="pl-10 modern-input border-0 focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-role" className="text-gray-700 font-medium">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select 
                  defaultValue={signupData.role} 
                  onValueChange={handleRoleChange}
                  required
                >
                  <SelectTrigger id="signup-role" className="modern-input border-0 focus:ring-2 focus:ring-indigo-500/50">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-lg border border-white/20">
                    <SelectItem value="OWNER">Pet Owner</SelectItem>
                    <SelectItem value="SITTER">Pet Sitter</SelectItem>
                    <SelectItem value="VET">Veterinarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="signup-phone" className="text-gray-700 font-medium">Phone (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="signup-phone"
                      name="phone"
                      placeholder="Your Phone Number"
                      value={signupData.phone}
                      onChange={handleSignUpChange}
                      className="pl-10 modern-input border-0 focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-location" className="text-gray-700 font-medium">Location (Optional)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="signup-location"
                      name="location"
                      placeholder="City, Country"
                      value={signupData.location}
                      onChange={handleSignUpChange}
                      className="pl-10 modern-input border-0 focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full premium-gradient text-white hover:shadow-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-white/30" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white/50 backdrop-blur-sm px-3 py-1 text-xs text-gray-500 rounded-full">OR</span>
                </div>
              </div>
              
              <Button
                onClick={handleGoogleSignIn}
                type="button"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200 backdrop-blur-sm transition-all duration-300"
              >
                <Globe className="w-5 h-5" />
                {isLoading ? "Signing up..." : "Continue with Google"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            By signing in or signing up, you agree to our{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
