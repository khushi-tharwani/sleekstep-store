
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative bg-black overflow-hidden min-h-[600px] flex items-center">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1542291026-7eec264c27ff')`,
          filter: 'brightness(0.4)'
        }}
      ></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight animate-fade-in">
            Step Into <span className="text-primary">Style</span> & <span className="text-primary">Comfort</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover our premium collection of footwear for every occasion. 
            From athletic performance to casual elegance, find your perfect pair.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Shop Now
              </Button>
            </Link>
            <Link to="/categories">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="hidden lg:block absolute bottom-0 right-0 w-1/2 h-20 bg-gradient-to-l from-primary/20 to-transparent z-10"></div>
    </div>
  );
};

export default Hero;
