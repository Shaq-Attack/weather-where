import React from "react";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
} from "@progress/kendo-react-layout";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Switch } from "@progress/kendo-react-inputs";
import "@progress/kendo-theme-material/dist/all.css";

interface DashboardHeaderProps {
  cities: string[];
  selectedCityValue: string | null;
  onCityChange: (city: string) => void;
  isCelsius: boolean;
  onUnitToggle: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  cities,
  selectedCityValue,
  onCityChange,
  isCelsius,
  onUnitToggle,
}) => {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `

        .dashboard-header-container {
          height: 100%;
          background: #3b82f6;
          color: white;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .dashboard-appbar {
          background: transparent !important;
          border: none !important;
          padding: 0 20px;
          height: 60px;
          display: flex;
          align-items: center;
        }

        .header-logo {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
          height: 60px;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 20px;
          height: 60px;
        }

        .header-dropdown {
          min-width: 180px;
          background: rgba(255,255,255,0.2) !important;
          border: 1px solid rgba(255,255,255,0.3) !important;
          border-radius: 6px !important;
          color: white !important;
          padding: 8px 12px !important;
          transition: all 0.2s ease !important;
          display: flex;
          align-items: center;
          height: 40px;
        }

        .header-dropdown:hover {
          background: rgba(255,255,255,0.25) !important;
          border-color: rgba(255,255,255,0.5) !important;
        }

        .header-switch {
          background: rgba(255,255,255,0.2);
          border-radius: 6px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          border: 1px solid rgba(255,255,255,0.3);
          transition: all 0.2s ease;
          height: 40px;
        }

        .header-switch:hover {
          background: rgba(255,255,255,0.25);
        }

        .header-button {
          background: rgba(255,255,255,0.2) !important;
          border: 1px solid rgba(255,255,255,0.3) !important;
          border-radius: 6px !important;
          color: white !important;
          padding: 8px 12px !important;
          transition: all 0.2s ease !important;
          font-weight: 500 !important;
          min-width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-button:hover {
          background: rgba(255,255,255,0.25) !important;
          border-color: rgba(255,255,255,0.5) !important;
        }

        .notification-badge {
          position: relative;
        }



        /* Responsive design */
        @media (max-width: 1200px) {
          .header-search {
            min-width: 220px;
          }
          
          .header-dropdown {
            min-width: 160px;
          }
          
          .header-controls {
            gap: 16px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-appbar {
            padding: 0 16px;
          }
          
          .header-logo {
            font-size: 1.4rem;
          }
          
          .header-search {
            min-width: 180px;
          }
          
          .header-dropdown {
            min-width: 140px;
          }
          
          .header-controls {
            gap: 12px;
          }
          
          .header-button {
            padding: 8px 12px !important;
            min-width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .header-search {
            display: none;
          }
          
          .header-switch {
            padding: 6px 12px;
            font-size: 0.8rem;
          }
          

        }
      `,
        }}
      />

      <div className="dashboard-header-container">
        <AppBar className="dashboard-appbar">
          <AppBarSection>
            <div className="header-logo">⛅ Weather Dashboard</div>
          </AppBarSection>

          <AppBarSpacer />

          <AppBarSection>
            <div className="header-controls">
              {/* City Selector */}
              <DropDownList
                className="header-dropdown"
                data={cities}
                value={selectedCityValue}
                onChange={(e) => onCityChange(e.target.value)}
              />

              {/* Temperature Unit Toggle */}
              <div className="header-switch">
                °F
                <Switch checked={isCelsius} onChange={onUnitToggle} />
                °C
              </div>
            </div>
          </AppBarSection>
        </AppBar>
      </div>
    </>
  );
};
