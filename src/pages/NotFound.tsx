import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-red-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="glass-card border-0 bg-white/40 backdrop-blur-lg p-12 text-center z-10 max-w-md mx-4">
        <div className="text-8xl mb-6">🙀</div>
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! We couldn't find that page</p>
        <p className="text-gray-600 mb-8">The page you're looking for seems to have wandered off like a curious pet!</p>
        <a 
          href="/" 
          className="premium-gradient text-white py-3 px-8 rounded-lg font-medium hover:shadow-lg inline-block transition-all duration-300"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
