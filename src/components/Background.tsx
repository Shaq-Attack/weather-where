import { useState, useEffect } from 'react';

interface BackgroundProps {
  weatherCondition: string;
  children: React.ReactNode;
}

// Weather-to-image mapping function
const getBackgroundImage = (condition: string): string => {
  const cond = condition.toLowerCase();
  
  console.log('Getting background for condition:', cond);
  
  // Using high-quality portrait cityscape images that start with sky at top
  if (cond.includes("rain")) {
    return "https://images.unsplash.com/photo-1433477155337-9aea4e790195?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=2160&q=80"; // Rainy city
  }
  if (cond.includes("cloud")) {
    return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=2160&q=80"; // Cloudy city
  }
  if (cond.includes("snow")) {
    return "https://images.unsplash.com/photo-1548919973-5cef591cdbc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=2160&q=80"; // Snowy city
  }
  if (cond.includes("clear")) {
    return "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=2160&q=80"; // Clear blue sky with modern city
  }
  
  // Default fallback - beautiful clear city skyline
  return "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=2160&q=80";
};

export function Background({ weatherCondition, children }: BackgroundProps) {
  const [currentImage, setCurrentImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [fadeClass, setFadeClass] = useState('fade-in');

  // Preload images for smooth transitions
  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  };

  useEffect(() => {
    const newImage = getBackgroundImage(weatherCondition);
    
    console.log('Weather condition:', weatherCondition, 'New image:', newImage);
    
    // If it's the same image, don't reload
    if (newImage === currentImage) {
      setIsLoading(false);
      return;
    }

    // Fade out current image
    setFadeClass('fade-out');
    
    // Preload new image
    preloadImage(newImage)
      .then(() => {
        setTimeout(() => {
          setCurrentImage(newImage);
          setIsLoading(false);
          setFadeClass('fade-in');
        }, 300); // Wait for fade-out to complete
      })
      .catch(() => {
        // Fallback to default if loading fails
        const fallbackImage = getBackgroundImage('default');
        setCurrentImage(fallbackImage);
        setIsLoading(false);
        setFadeClass('fade-in');
      });
  }, [weatherCondition, currentImage]);

  // Initialize with the first image
  useEffect(() => {
    if (!currentImage) {
      const initialImage = getBackgroundImage(weatherCondition);
      preloadImage(initialImage)
        .then(() => {
          setCurrentImage(initialImage);
          setIsLoading(false);
        })
        .catch(() => {
          setCurrentImage(getBackgroundImage('default'));
          setIsLoading(false);
        });
    }
  }, [weatherCondition, currentImage]);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%',
      minHeight: '400vh', // Tall enough for all 4 full-screen components
    }}>
      {/* Background Image Container */}
      <div
        className={`background-image ${fadeClass}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: currentImage ? `url(${currentImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          zIndex: -2,
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.6s ease-in-out',
        }}
      />
      
      {/* Dark overlay for text legibility */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.5) 100%)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      {/* CSS for fade transitions */}
      <style>{`
        .background-image {
          transition: opacity 0.6s ease-in-out;
        }
        
        .fade-in {
          opacity: 1;
        }
        
        .fade-out {
          opacity: 0;
        }
        
        /* Ensure smooth scrolling performance */
        @media (prefers-reduced-motion: no-preference) {
          .background-image {
            will-change: opacity;
          }
        }
      `}</style>
    </div>
  );
}
