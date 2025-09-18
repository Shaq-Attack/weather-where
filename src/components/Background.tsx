import { useState, useEffect } from 'react';

interface BackgroundProps {
  weatherCondition: string;
  children: React.ReactNode;
}

// Weather-to-gradient mapping function
const getBackgroundGradient = (condition: string): string => {
  const cond = condition.toLowerCase();
  
  console.log('Getting background gradient for condition:', cond);
  
  // Using simple two-color weather-appropriate gradients
  if (cond.includes("rain")) {
    return "linear-gradient(180deg, #2c3e50 0%, #95a5a6 100%)"; // Dark stormy gradient
  }
  if (cond.includes("cloud")) {
    return "linear-gradient(180deg, #bdc3c7 0%, #2c3e50 100%)"; // Overcast gradient
  }
  if (cond.includes("snow")) {
    return "linear-gradient(180deg, #ecf0f1 0%, #34495e 100%)"; // Cold winter gradient
  }
  if (cond.includes("clear")) {
    return "linear-gradient(180deg, #dbad68ff 0%, #e7a43eff 100%)"; // Bright sunny gradient
  }
  
  // Default fallback - clear sky gradient
  return "linear-gradient(180deg, #87CEEB 0%, #FF6347 100%)";
};

export function Background({ weatherCondition, children }: BackgroundProps) {
  const [currentGradient, setCurrentGradient] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [fadeClass, setFadeClass] = useState('fade-in');

  useEffect(() => {
    const newGradient = getBackgroundGradient(weatherCondition);
    
    console.log('Weather condition:', weatherCondition, 'New gradient:', newGradient);
    
    // If it's the same gradient, don't reload
    if (newGradient === currentGradient) {
      setIsLoading(false);
      return;
    }

    // Fade out current gradient
    setFadeClass('fade-out');
    
    // Set new gradient after a brief delay for smooth transition
    setTimeout(() => {
      setCurrentGradient(newGradient);
      setIsLoading(false);
      setFadeClass('fade-in');
    }, 300); // Wait for fade-out to complete
  }, [weatherCondition, currentGradient]);

  // Initialize with the first gradient
  useEffect(() => {
    if (!currentGradient) {
      const initialGradient = getBackgroundGradient(weatherCondition);
      setCurrentGradient(initialGradient);
      setIsLoading(false);
    }
  }, [weatherCondition, currentGradient]);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%',
      minHeight: '400vh', // Tall enough for all 4 full-screen components
    }}>
      {/* Background Gradient Container */}
      <div
        className={`background-gradient ${fadeClass}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: currentGradient || 'linear-gradient(180deg, #87CEEB 0%, #FF6347 100%)',
          zIndex: -2,
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.6s ease-in-out',
        }}
      />
      
      {/* Subtle overlay for text legibility */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0.25) 100%)',
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
        .background-gradient {
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
