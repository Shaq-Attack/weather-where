import React, { useState } from 'react';
import { AppBar, AppBarSection, AppBarSpacer } from '@progress/kendo-react-layout';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Switch } from '@progress/kendo-react-inputs';
import { TextBox } from '@progress/kendo-react-inputs';
import { Breadcrumb } from '@progress/kendo-react-layout';
import '@progress/kendo-theme-material/dist/all.css';

interface DashboardHeaderProps {
  cities: string[];
  city: string;
  onCityChange: (city: string) => void;
  isCelsius: boolean;
  onUnitToggle: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  cities,
  city,
  onCityChange,
  isCelsius,
  onUnitToggle
}) => {
  const [searchValue, setSearchValue] = useState('');

  const breadcrumbItems = [
    { text: 'Dashboard', url: '#' },
    { text: 'Weather Analytics', url: '#' },
    { text: city || 'Current Location' }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .dashboard-header-container {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .dashboard-header-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          opacity: 0.4;
        }

        .dashboard-appbar {
          background: transparent !important;
          border: none !important;
          position: relative;
          z-index: 1;
          padding: 0 24px;
          height: 60px;
          display: flex;
          align-items: center;
        }

        .header-logo {
          font-size: 1.6rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-search {
          min-width: 280px;
          background: rgba(255,255,255,0.15) !important;
          border: 1px solid rgba(255,255,255,0.25) !important;
          border-radius: 25px !important;
          color: white !important;
          backdrop-filter: blur(10px);
          padding: 8px 16px !important;
          font-size: 0.9rem !important;
          transition: all 0.3s ease !important;
        }

        .header-search:focus {
          background: rgba(255,255,255,0.2) !important;
          border-color: rgba(255,255,255,0.4) !important;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.1) !important;
        }

        .header-search::placeholder {
          color: rgba(255,255,255,0.7) !important;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-dropdown {
          min-width: 200px;
          background: rgba(255,255,255,0.15) !important;
          border: 1px solid rgba(255,255,255,0.25) !important;
          border-radius: 10px !important;
          color: white !important;
          backdrop-filter: blur(10px);
          padding: 8px 12px !important;
          transition: all 0.3s ease !important;
        }

        .header-dropdown:hover {
          background: rgba(255,255,255,0.2) !important;
          border-color: rgba(255,255,255,0.4) !important;
          transform: translateY(-1px);
        }

        .header-switch {
          background: rgba(255,255,255,0.15);
          border-radius: 25px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }

        .header-switch:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }

        .header-button {
          background: rgba(255,255,255,0.15) !important;
          border: 1px solid rgba(255,255,255,0.25) !important;
          border-radius: 10px !important;
          color: white !important;
          padding: 10px 18px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          backdrop-filter: blur(10px);
          font-weight: 500 !important;
          min-width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .header-button:hover {
          background: rgba(255,255,255,0.25) !important;
          border-color: rgba(255,255,255,0.4) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .header-button:active {
          transform: translateY(0);
        }

        .notification-badge {
          position: relative;
        }

        .breadcrumb-container {
          background: rgba(255,255,255,0.08);
          padding: 10px 24px;
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255,255,255,0.1);
          height: 20px;
          display: flex;
          align-items: center;
        }

        .custom-breadcrumb {
          color: white !important;
          font-size: 0.85rem;
        }

        .custom-breadcrumb a {
          color: rgba(255,255,255,0.8) !important;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .custom-breadcrumb a:hover {
          color: white !important;
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
          
          .breadcrumb-container {
            padding: 8px 16px;
          }
        }
      `}} />

      <div className="dashboard-header-container">
        <AppBar className="dashboard-appbar">
          <AppBarSection>
            <div className="header-logo">
              ⛅ Weather Dashboard
            </div>
          </AppBarSection>

          <AppBarSection>
            <TextBox
              className="header-search"
              placeholder="Search locations..."
              value={searchValue}
              onChange={(e) => setSearchValue(String(e.target.value || ''))}
            />
          </AppBarSection>

          <AppBarSpacer />

          <AppBarSection>
            <div className="header-controls">
              {/* City Selector */}
              <DropDownList
                className="header-dropdown"
                data={cities}
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                defaultValue="Select city..."
              />

              {/* Temperature Unit Toggle */}
              <div className="header-switch">
                °F
                <Switch
                  checked={isCelsius}
                  onChange={onUnitToggle}
                />
                °C
              </div>

            </div>
          </AppBarSection>
        </AppBar>

        {/* Breadcrumb Navigation */}
        <div className="breadcrumb-container">
          <Breadcrumb
            className="custom-breadcrumb"
            data={breadcrumbItems}
          />
        </div>
      </div>
    </>
  );
};
