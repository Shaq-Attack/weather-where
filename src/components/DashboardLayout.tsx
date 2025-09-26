import React from 'react';
import '@progress/kendo-theme-material/dist/all.css';

interface DashboardLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  header,
  sidebar,
  mainContent,
  rightPanel
}) => {

  return (
    <div className="dashboard-container">
      <style dangerouslySetInnerHTML={{__html: `
        .dashboard-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8f9fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .dashboard-header {
          height: 80px;
          background: #3b82f6;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
          z-index: 1000;
          position: relative;
        }

        .dashboard-body {
          flex: 1;
          display: flex;
          overflow: hidden;
          height: calc(100vh - 80px);
        }

        .dashboard-sidebar {
          width: 280px;
          height: 100%;
          background: #ffffff;
          border-right: 1px solid rgba(230, 236, 245, 0.8);
          padding: 0;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
          position: relative;
          z-index: 100;
        }

        .dashboard-main-content {
          flex: 1;
          padding: 24px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
        }

        .dashboard-right-panel {
          width: 360px;
          height: 100%;
          background: #ffffff;
          border-left: 1px solid rgba(230, 236, 245, 0.8);
          padding: 24px;
          overflow-y: auto;
          overflow-x: hidden;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.05);
          position: relative;
        }



        /* Custom scrollbar for main content */
        .dashboard-main-content::-webkit-scrollbar,
        .dashboard-right-panel::-webkit-scrollbar {
          width: 8px;
        }

        .dashboard-main-content::-webkit-scrollbar-track,
        .dashboard-right-panel::-webkit-scrollbar-track {
          background: rgba(241, 243, 246, 0.8);
          border-radius: 4px;
        }

        .dashboard-main-content::-webkit-scrollbar-thumb,
        .dashboard-right-panel::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 3px;
        }

        .dashboard-main-content::-webkit-scrollbar-thumb:hover,
        .dashboard-right-panel::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }

        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .dashboard-right-panel {
            width: 300px;
            padding: 20px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-right-panel {
            display: none;
          }
          
          .dashboard-sidebar {
            width: 260px;
            position: absolute;
            height: 100%;
            z-index: 200;
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
          }
          
          .dashboard-main-content {
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .dashboard-header {
            height: 70px;
          }
          
          .dashboard-body {
            height: calc(100vh - 70px);
          }
          
          .dashboard-main-content {
            padding: 12px;
          }
        }
      `}} />
      
      {/* Dashboard Header */}
      <div className="dashboard-header">
        {header}
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-body">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          {sidebar}
        </div>

        {/* Main Content Area */}
        <div className="dashboard-main-content">
          {mainContent}
        </div>
        
        {/* Right Panel (Optional) */}
        {rightPanel && (
          <div className="dashboard-right-panel">
            {rightPanel}
          </div>
        )}
      </div>
    </div>
  );
};
