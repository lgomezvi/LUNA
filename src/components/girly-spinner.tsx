import React from 'react';
import { Heart, Sparkles, Star } from 'lucide-react';

export const GirlySpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        {/* Center heart */}
        <div className="animate-bounce">
          <Heart 
            size={40} 
            className="text-pink-500 animate-pulse"
            fill="#EC4899"
          />
        </div>
        
        {/* Orbiting elements */}
        <div className="absolute top-0 left-0 w-full h-full animate-spin [animation-duration:3s]">
          <Sparkles 
            size={24} 
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-purple-400"
          />
          <Star 
            size={24} 
            className="absolute top-1/2 -right-8 -translate-y-1/2 text-pink-400"
            fill="#F472B6"
          />
          <Sparkles 
            size={24} 
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-purple-400"
          />
          <Star 
            size={24} 
            className="absolute top-1/2 -left-8 -translate-y-1/2 text-pink-400"
            fill="#F472B6"
          />
        </div>

        {/* Loading text */}
        <div className="mt-4 text-center font-medium text-pink-500 animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
};
