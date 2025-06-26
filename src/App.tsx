import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Breeding from "./pages/Breeding";
import PetSitting from "./pages/PetSitting";
import Veterinary from "./pages/Veterinary";
import Community from "./pages/Community";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AuthError from "./pages/AuthError";
import ProtectedRoute from "./components/ProtectedRoute";
import OAuthCallback from "./components/OAuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>        <BrowserRouter>          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/breeding" element={<ProtectedRoute><Breeding /></ProtectedRoute>} />
            <Route path="/pet-sitting" element={<ProtectedRoute><PetSitting /></ProtectedRoute>} />
            <Route path="/veterinary" element={<ProtectedRoute><Veterinary /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<SignIn />} />            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="/oauth/success" element={<OAuthCallback />} />
            <Route path="/auth/error" element={<AuthError />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
