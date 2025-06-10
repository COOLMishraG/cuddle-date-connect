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
    <div className="min-h-screen flex items-center justify-center bg-[#FBE7E7] relative overflow-hidden">
      {/* Floating Background Shapes */}
      <div className="floating-shape absolute top-[15%] left-[12%] text-4xl float-1">🙀</div>
      <div className="floating-shape absolute top-[25%] right-[15%] text-3xl float-2">❓</div>
      <div className="floating-shape absolute bottom-[25%] left-[18%] text-5xl float-3">🐾</div>
      <div className="floating-shape absolute top-[45%] left-[25%] text-2xl float-1" style={{ animationDelay: '2s' }}>🔍</div>
      <div className="floating-shape absolute bottom-[30%] right-[22%] text-3xl float-2" style={{ animationDelay: '3s' }}>❤️</div>
      <div className="floating-shape absolute top-[60%] right-[10%] text-4xl float-3" style={{ animationDelay: '1s' }}>🐶</div>

      <div className="romantic-card-accent p-8 text-center z-10">
        <h1 className="text-6xl font-bold mb-4 fredoka text-burgundy">404</h1>
        <p className="text-xl text-deep-rose mb-6">Oops! We couldn't find that page</p>
        <p className="mb-8">The page you're looking for doesn't seem to exist.</p>
        <a 
          href="/" 
          className="btn-gradient py-2 px-4 rounded-lg text-burgundy font-medium hover:shadow-md inline-block"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
