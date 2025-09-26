import { AppBar } from "@progress/kendo-react-layout";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Switch } from '@progress/kendo-react-inputs';
import { Button } from "@progress/kendo-react-buttons";

// Add custom CSS for modern styling
const customStyles = `
  .modern-weather-app-bar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  }
  
  .modern-weather-app-bar .k-switch {
    --kendo-color-primary: #ffffff;
    --kendo-color-primary-hover: #f0f0f0;
    --kendo-color-primary-active: #e0e0e0;
  }
  
  .modern-weather-app-bar .k-dropdownlist {
    background: rgba(255,255,255,0.1) !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
    color: white !important;
    backdrop-filter: blur(10px);
    border-radius: 12px !important;
  }
  
  .modern-weather-app-bar .k-dropdownlist:hover {
    background: rgba(255,255,255,0.15) !important;
    border-color: rgba(255,255,255,0.3) !important;
  }
  
  .modern-weather-app-bar .k-dropdownlist.k-focus,
  .modern-weather-app-bar .k-dropdownlist:focus {
    border-color: rgba(255,255,255,0.4) !important;
    box-shadow: 0 0 0 2px rgba(255,255,255,0.2) !important;
    background: rgba(255,255,255,0.15) !important;
  }

  .nav-button {
    background: rgba(255,255,255,0.1) !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
    color: white !important;
    border-radius: 8px !important;
    padding: 0.5rem 1rem !important;
    font-size: 0.85rem !important;
    font-weight: 500 !important;
    transition: all 0.3s ease !important;
    backdrop-filter: blur(10px);
  }
  
  .nav-button:hover {
    background: rgba(255,255,255,0.2) !important;
    border-color: rgba(255,255,255,0.3) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  }
  
  .nav-button:active {
    transform: translateY(0);
  }
  
  /* Override dropdown popup styles */
  .k-animation-container .k-list-item.k-selected,
  .k-popup .k-list-item.k-selected {
    background-color: rgba(102, 126, 234, 0.8) !important;
    color: white !important;
  }
  
  .k-animation-container .k-list-item:hover,
  .k-popup .k-list-item:hover {
    background-color: rgba(102, 126, 234, 0.6) !important;
    color: white !important;
  }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customStyles;
  document.head.appendChild(styleElement);
}

interface WeatherAppBarProps {
  cities: string[];
  city: string;
  onCityChange: (city: string) => void;
  isCelsius: boolean;
  onUnitToggle: () => void;
}

export function WeatherAppBar({ cities, city, onCityChange, isCelsius, onUnitToggle }: WeatherAppBarProps) {
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <AppBar
      className="modern-weather-app-bar"
      style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white", 
        padding: "0 2rem",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1000,
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
      }}
      position="top"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "80px",
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto"
        }}
      >
        {/* Left: App Name */}
        <div style={{ 
          fontWeight: "600", 
          fontSize: "1.5rem", 
          letterSpacing: "0.5px",
          flex: "0 0 auto",
          background: "linear-gradient(45deg, #fff, #e8f4f8)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Weather & Wonders
        </div>

        {/* Center: Navigation */}
        <div style={{ 
          display: "flex",
          gap: "1rem",
          flex: "1 1 auto",
          justifyContent: "center",
          margin: "0 2rem"
        }}>
          <Button
            className="nav-button"
            onClick={() => scrollToSection('weather-current')}
          >
            Current
          </Button>
          <Button
            className="nav-button"
            onClick={() => scrollToSection('weather-hourly')}
          >
            Hourly
          </Button>
          <Button
            className="nav-button"
            onClick={() => scrollToSection('weather-forecast')}
          >
            Forecast
          </Button>
          <Button
            className="nav-button"
            onClick={() => scrollToSection('weather-facts')}
          >
            Facts
          </Button>
        </div>

        {/* Right: Controls */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "1.5rem",
          flex: "0 0 auto"
        }}>
          <DropDownList
            data={cities}
            value={city}
            onChange={(e) => onCityChange(e.value)}
            style={{
              width: 200,
              borderRadius: "12px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)"
            }}
          />
          
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.75rem"
          }}>
            <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>°F</span>
            <Switch 
              checked={isCelsius} 
              onChange={onUnitToggle}
              onLabel=""
              offLabel=""
            />
            <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>°C</span>
          </div>
        </div>
      </div>
    </AppBar>
  );
}
