import React from 'react';
import { 
  Sparkles, 
  Zap, 
  Award, 
  FastForward, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';
import AnimatedStatsCard from '../AnimatedStatsCard';
import VideoCarousel from '../components/VideoCarousel';
import ImageCarousel from '../components/ImageCarousel';
import Footer from '../components/Footer';

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  video: string;
  orientation: string;
}

interface Image {
  id: number;
  title: string;
  thumbnail: string;
  orientation: string;
}

interface HomePageProps {
  videoData: Video[];
  imageData: Image[];
  onVideoPlay: (video: Video) => void;
  onImageView: (image: Image) => void;
  onStartCreating: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  videoData,
  imageData,
  onVideoPlay,
  onImageView,
  onStartCreating,
}) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8">
        {/* Main Hero Content - Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 items-start mb-12">
          
          {/* Left Side - Text Content */}
          {/* CHANGED: Swapped to a flex-col layout with items-start */}
          <div className="md:col-span-1 flex flex-col items-start space-y-6 mt-12 sm:mt-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-sm">
              <span className="bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
                AI-Generated
                <br />
                Ads & Short Films
              </span>
            </h1>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-sm">
              Unleashing storytelling with AI creativity.
            </p>

            {/* CHANGED: Removed wrapper div and added 'self-end' to the button */}
            <button
              onClick={onStartCreating}
              className="group relative self-end inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-300 bg-gradient-to-r from-black to-gray-800 rounded-full hover:from-gray-800 hover:to-black hover:scale-105 hover:shadow-2xl hover:shadow-black/25"
            >
              <span className="relative z-10">Start Creating Now</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </button>
          </div>

          {/* Right Side - NEW AESTHETIC: Cascading Glass Cards */}
          <div className="md:col-span-2 mt-12 sm:mt-16 flex flex-col md:flex-row gap-4 items-start justify-center">

            {/* Card 1: Time */}
            <div className="w-44 h-32 sm:w-48 sm:h-36 bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-4 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer -rotate-3">
              <FastForward className="w-6 h-6 text-black/70" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-black">1/10th</div>
                <div className="text-sm font-medium text-black/70">Time</div>
              </div>
            </div>

            {/* Card 2: Cost */}
            <div className="w-44 h-32 sm:w-48 sm:h-36 bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-4 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer rotate-2">
              <DollarSign className="w-6 h-6 text-black/70" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-black">1/20th</div>
                <div className="text-sm font-medium text-black/70">Cost</div>
              </div>
            </div>

            {/* Card 3: Engagement */}
            <div className="w-44 h-32 sm:w-48 sm:h-36 bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-4 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer -rotate-2">
              <TrendingUp className="w-6 h-6 text-black/70" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-black">5X</div>
                <div className="text-sm font-medium text-black/70">Engagement</div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Video Ads Carousel */}
        <div className="w-full max-w-5xl mx-auto mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">Video Ads</h2>
            <p className="text-gray-600 text-sm sm:text-base">AI-generated video advertisements</p>
          </div>
          <VideoCarousel videoData={videoData} onVideoPlay={onVideoPlay} />
        </div>

        {/* Static Ads Carousel */}
        <div className="w-full max-w-5xl mx-auto mb-16">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">Static Ads</h2>
            <p className="text-gray-600 text-sm sm:text-base">AI-generated static advertisements</p>
          </div>
          <ImageCarousel imageData={imageData} onImageView={onImageView} />
        </div>

        {/* Stats Section - Animated Cards with Counters */}
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 px-4 w-full max-w-4xl mx-auto mb-16 sm:mb-24">
          <AnimatedStatsCard
            icon={Zap}
            number="50+"
            label="ADS CREATED"
            delay={0}
          />
          <AnimatedStatsCard
            icon={Award}
            number="10+"
            label="HAPPY CLIENTS"
            delay={200}
          />
          <AnimatedStatsCard
            icon={Sparkles}
            number="100"
            label="PRODUCTIVITY"
            delay={400}
          />
        </div>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;