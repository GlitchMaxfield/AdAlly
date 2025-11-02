import React, { useState, useEffect } from "react";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import VideoModal from "./components/VideoModal";
import ImageModal from "./components/ImageModal";
import AuthModal from "./components/auth/AuthModal";
import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/PortfolioPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import PricingPage from "./pages/PricingPage";

const videoData = [
  {
    id: 1,
    title: "Boat Rockerz",
    thumbnail:
      "https://m.media-amazon.com/images/S/aplus-media/vc/09679e0b-d23f-4afb-a821-7bd728d91562.__CR0,0,970,600_PT0_SX970_V1___.png",
    video: "https://youtube.com/embed/j22SuzGzg78",
    orientation: "landscape",
  },
  {
    id: 2,
    title: "Smart Water", 
    thumbnail:
      "https://images-na.ssl-images-amazon.com/images/I/31GjEJUp2EL.jpg",
    video: "https://youtube.com/embed/IElyVw87iWE",
    orientation: "vertical",
  },
  {
    id: 3,
    title: "Lamborghini Huracan",
    thumbnail:
      "https://www.exoticcarhacks.com/wp-content/uploads/2024/02/D-8WJU7I-scaled.jpeg",
    video: "https://www.youtube.com/embed/dCr_STXffWU",
    orientation: "landscape",
  },
  {
    id: 4,
    title: "Gruns",
    thumbnail:
      "https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/screenshot-2025-10-27-at-12.12.50a-am-YD0EMaO9GwcBWn3n.png",
    video: "https://www.youtube.com/embed/7I073l2A3Ok",
    orientation: "vertical",
  },
  {
    id: 5,
    title: "Jaguar",
    thumbnail:
      "https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/jjj-Yg24pvezZ9hJnQDz.png",
    video: "https://www.youtube.com/embed/QmhYvijIrZ0",
    orientation: "landscape",
  },
  {
    id: 6,
    title: "Perplexity",
    thumbnail:
      "https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/5556effb-f8b3-451e-98ad-9a07d45bc0da_1920x1080-YyvDpqxzVVIZRlNz.png",
    video: "https://www.youtube.com/embed/5Wo7Ljn-Hdw?feature=share",
    orientation: "vertical",
  },
  {
    id: 7,
    title: "Muscle Nectar",
    thumbnail: "https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/muscle-nectar-01-YyvDpqb4rGSXkz5X.webp",
    video: "https://www.youtube.com/embed/hvxnUYH6kss",
    orientation: "landscape",
  },
  {
    id: 8,
    title: "Puffy Mattress",
    thumbnail:
      "https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/screenshot-2025-10-27-at-1.06.15a-am-mxB2p0gN4DhPwXWZ.png",
    video: "https://youtube.com/embed/ArwzR5cSSDQ?feature=share",
    orientation: "vertical",
  },
  {
    id: 9,
    title: "COMET",
    thumbnail:
      "https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/3-min-mePg8PkVPoC3pgze.webp",
    video: "https://youtube.com/embed/qTyk95uVvOw?feature=share",
    orientation: "vertical",
  },
   {
    id: 10,
    title: "Hotwheels",
    thumbnail:
      "https://shop.mattel.com.au/cdn/shop/files/Poster_Thumbnail.png?v=1710824118&width=1100",
    video: "https://youtube.com/embed/C90KWPgs6Xs",
    orientation: "landscape",
  },
  {
    id: 11,
    title: "Raycon",
    thumbnail:
      "https://m.media-amazon.com/images/I/51ZMBTjBG8L.jpg",
    video: "https://youtube.com/embed/qIenNou0Un8",
    orientation: "vertical",
  },  
];

const imageData = [
  {
    id: 1,
    title: "Goibibo",
    thumbnail: "https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/gemini_generated_image_fed7ybfed7ybfed7-Yg24pZ62rnFK94Ej.png",
    orientation: "vertical",
  },
  {
    id: 2,
    title: "Souled Store",
    thumbnail: "https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/gemini_generated_image_t1xfxt1xfxt1xfxt-Aq2Gp5NGNwt1qleW.png",
    orientation: "landscape",
  },
  {
    id: 3,
    title: "Swiggy : Food Delivery",
    thumbnail: "https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/unnamed-1-dWxLW2EZpyIz8DGV.jpg",
    orientation: "vertical",
  },
  {
    id: 4,
    title: "Oven Story Pizza",
    thumbnail: "https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/gemini_generated_image_r5y9hsr5y9hsr5y9-YyvDpxNX3acP6g0l.png",
    orientation: "landscape", 
  },
  {
    id: 5,
    title: "ThinkPrint",
    thumbnail: "https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/whatsapp-image-2025-10-28-at-18.39.44-A85MJ5W6bzTKbVap.jpeg",
    orientation: "landscape",
  },
  {
    id: 6,
    title: "Muscle Nectar",
    thumbnail: "https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/gemini_generated_image_lii2nilii2nilii2-m6L2W7pG5ehLkVgV.png",
    orientation: "landscape",
  },
  {
    id: 7,
    title: "First Crush",
    thumbnail: "https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/gemini_generated_image_bcsmwsbcsmwsbcsm-AQEe7q25JNI2R1zM.png",
    orientation: "vertical",
  },
  {
    id: 8,
    title: "ZARA",
    thumbnail: "https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/gemini_generated_image_826qwl826qwl826q-A3QlqLLWWEIRrDxo.png", 
    orientation: "landscape",
  },
];

function AppContent() {
  const [activeItem, setActiveItem] = useState("home");
  const [selectedVideo, setSelectedVideo] = useState<
    (typeof videoData)[0] | null
  >(null);
  const [selectedImage, setSelectedImage] = useState<
    (typeof imageData)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const { user, loading } = useAuth();

  const handleVideoPlay = (video: (typeof videoData)[0]) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleImageView = (image: (typeof imageData)[0]) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const handleBackToHome = () => {
    setActiveItem("home");
  };

  const handleStartCreating = () => {
    if (user) {
      setActiveItem("dashboard");
    } else {
      setAuthMode('signup');
      setIsAuthModalOpen(true);
    }
  };

  const handleLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleSignup = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    // Add global styles for animations
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0) translateX(0) rotate(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(20px) rotate(360deg); opacity: 0; }
      }
      @keyframes shine {
        from { transform: translateX(-100%) rotate(0deg); }
        to { transform: translateX(100%) rotate(5deg); }
      }
      @keyframes gradient-x {
        0% { background-size: 100%; background-position: 0% 0%; }
        50% { background-size: 200%; background-position: 100% 0%; }
        100% { background-size: 100%; background-position: 0% 0%; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation 
        activeItem={activeItem} 
        setActiveItem={setActiveItem}
        user={user}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />

      {/* Page Content */}
      {activeItem === "home" && (
        <HomePage 
          videoData={videoData}
          imageData={imageData}
          onVideoPlay={handleVideoPlay} 
          onImageView={handleImageView}
          onStartCreating={handleStartCreating}
        />
      )}
      {activeItem === "portfolio" && (
        <PortfolioPage
          videoData={videoData}
          onVideoPlay={handleVideoPlay}
          onBack={handleBackToHome}
        />
      )}
      {activeItem === "about" && (
        <AboutPage onBack={handleBackToHome} />
      )}
      {activeItem === "contact" && (
        <ContactPage onBack={handleBackToHome} />
      )}
      {activeItem === "pricing" && (
        <PricingPage
          onBack={handleBackToHome}
          onContactClick={() => setActiveItem("contact")}
        />
      )}
      {activeItem === "dashboard" && user && (
        <DashboardPage />
      )}

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;