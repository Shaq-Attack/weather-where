import "@progress/kendo-theme-default/dist/all.css";
import { AppBar } from "@progress/kendo-react-layout";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Switch } from '@progress/kendo-react-inputs';

// Add custom CSS for ocean blue theme
const customStyles = `
  .weather-app-bar .k-switch {
    --kendo-color-primary: #006bb3;
    --kendo-color-primary-hover: #005080;
    --kendo-color-primary-active: #004060;
  }
  
  .weather-app-bar .k-dropdownlist {
    --kendo-color-primary: #006bb3 !important;
    --kendo-color-primary-hover: #005080 !important;
    --kendo-color-primary-active: #004060 !important;
  }
  
  .weather-app-bar .k-dropdownlist.k-focus,
  .weather-app-bar .k-dropdownlist:focus {
    border-color: #006bb3 !important;
    box-shadow: 0 0 0 2px rgba(0, 107, 179, 0.2) !important;
  }
  
  /* Override Kendo's default orange theme for dropdown items */
  .k-animation-container .k-list-item.k-selected,
  .k-popup .k-list-item.k-selected,
  .weather-app-bar .k-list-item.k-selected,
  .k-list-item.k-state-selected {
    background-color: #006bb3 !important;
    color: white !important;
    border-color: #006bb3 !important;
  }
  
  .k-animation-container .k-list-item:hover,
  .k-popup .k-list-item:hover,
  .weather-app-bar .k-list-item:hover,
  .k-list-item.k-state-hover {
    background-color: #005080 !important;
    color: white !important;
    border-color: #005080 !important;
  }
  
  .k-animation-container .k-list-item.k-focus,
  .k-popup .k-list-item.k-focus,
  .weather-app-bar .k-list-item.k-focus,
  .k-list-item.k-state-focused {
    background-color: #006bb3 !important;
    color: white !important;
    border-color: #006bb3 !important;
  }
  
  /* Additional specific overrides for Kendo theme */
  .k-theme-default .k-list-item.k-selected,
  .k-theme-default .k-list-item.k-state-selected {
    background-color: #006bb3 !important;
    color: white !important;
  }
  
  .k-theme-default .k-list-item:hover,
  .k-theme-default .k-list-item.k-state-hover {
    background-color: #005080 !important;
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

export function WeatherAppBar({ cities,city, onCityChange, isCelsius, onUnitToggle }: WeatherAppBarProps) {

  return (
    <AppBar
      className="weather-app-bar"
      style={{ 
        background: "#1e2a38", 
        color: "white", 
        padding: "0 1rem",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1000
      }}
      position="top"
    >
       <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px",
          width: "100%",
        }}
      >
        {/* Left: App Name */}
        <div style={{ 
          fontWeight: "bold", 
          fontSize: "1.4rem", 
          letterSpacing: "1px",
          flex: "1 1 auto",
        }}>
          Weather & Wonders
        </div>

        {/* Center: City Selector */}
        <div style={{ 
          flex: "0 0 auto",
          margin: "0 1rem",
        }}>
          <DropDownList
            data={cities}
            value={city}
            onChange={(e) => onCityChange(e.value)}
            style={{
              width: 180,
              borderRadius: "8px",
              padding: "0.3rem 0.5rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
            popupSettings={{ className: "k-popup-custom" }}
          />
        </div>

        {/* Right: Temperature Toggle */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "1rem",
          flex: "1 1 auto",
          justifyContent: "flex-end",
        }}>
          <Switch 
            checked={isCelsius} 
            onChange={onUnitToggle}
            onLabel="°C"
            offLabel="°F"
          />
        </div>
      </div>
    </AppBar>
  );
}
