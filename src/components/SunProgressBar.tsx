import { ProgressBar } from "@progress/kendo-react-progressbars";
import { SunriseIcon, SunsetIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface SunProgressBarProps {
  sunrise: number; // Unix timestamp
  sunset: number;  // Unix timestamp
  timezoneOffset: number; // Timezone offset in seconds
}

export function SunProgressBar({ sunrise, sunset, timezoneOffset }: SunProgressBarProps) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const updateProgress = () => {
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const adjustedNow = now + timezoneOffset; // Adjust for timezone
      const adjustedSunrise = sunrise + timezoneOffset;
      const adjustedSunset = sunset + timezoneOffset;
      
      // Calculate progress (0 = sunrise, 100 = sunset)
      if (adjustedNow <= adjustedSunrise) {
        setProgress(0); // Before sunrise
      } else if (adjustedNow >= adjustedSunset) {
        setProgress(100); // After sunset
      } else {
        const dayDuration = adjustedSunset - adjustedSunrise;
        const timeElapsed = adjustedNow - adjustedSunrise;
        const progressPercent = (timeElapsed / dayDuration) * 100;
        setProgress(Math.min(100, Math.max(0, progressPercent)));
      }
    };

    updateProgress();
    
    // Update every minute
    const interval = setInterval(updateProgress, 60000);
    
    return () => clearInterval(interval);
  }, [sunrise, sunset, timezoneOffset]);

  const formatTime = (timestamp: number): string => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'UTC' // Since we already adjusted for timezone
    });
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backdropFilter: 'blur(10px)',
      padding: '0.5rem 1rem',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        {/* Sunrise Icon and Time */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          minWidth: '80px'
        }}>
          <SunriseIcon 
            size={16} 
            color="white" 
          />
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '500',
            color: 'white'
          }}>
            {formatTime(sunrise)}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ flex: 1, position: 'relative' }}>
          <ProgressBar
            value={progress}
            style={{
              height: '8px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
            progressStyle={{
              backgroundColor: 'rgba(255,255,255,0.8)',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.9) 100%)',
              borderRadius: '4px',
              transition: 'all 0.3s ease-in-out'
            }}
          />
          
          {/* Sun indicator */}
          <div style={{
            position: 'absolute',
            top: '-4px',
            left: `${progress}%`,
            transform: 'translateX(-50%)',
            width: '16px',
            height: '16px',
            backgroundColor: 'white',
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.8)',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
            transition: 'left 0.3s ease-in-out'
          }}>
          </div>
        </div>

        {/* Sunset Icon and Time */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          minWidth: '80px',
          justifyContent: 'flex-end'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '500',
            color: 'white'
          }}>
            {formatTime(sunset)}
          </div>
          <SunsetIcon 
            size={16} 
            color="white" 
          />
        </div>
      </div>
    </div>
  );
}
