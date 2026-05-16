import React from "react";
import "@progress/kendo-theme-material/dist/all.css";

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
  rightPanel,
}) => {
  return (
    <div className="dashboard-container">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .dashboard-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f1f5f9;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .dashboard-header {
          height: 80px;
          background: #0f172a;
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.06);
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
          border-right: 1px solid #e2e8f0;
          padding: 0;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          position: relative;
          z-index: 100;
        }

        .dashboard-main-content {
          flex: 1;
          padding: 24px;
          background: #f1f5f9;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
        }

        .dashboard-right-panel {
          width: 360px;
          height: 100%;
          background: #ffffff;
          border-left: 1px solid #e2e8f0;
          padding: 24px;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
        }



        /* Custom scrollbar for main content */
        .dashboard-main-content::-webkit-scrollbar,
        .dashboard-right-panel::-webkit-scrollbar {
          width: 6px;
        }

        .dashboard-main-content::-webkit-scrollbar-track,
        .dashboard-right-panel::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .dashboard-main-content::-webkit-scrollbar-thumb,
        .dashboard-right-panel::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .dashboard-main-content::-webkit-scrollbar-thumb:hover,
        .dashboard-right-panel::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
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
      `,
        }}
      />

      {/* Dashboard Header */}
      <div className="dashboard-header">{header}</div>

      {/* Main Dashboard Content */}
      <div className="dashboard-body">
        {/* Sidebar */}
        <div className="dashboard-sidebar">{sidebar}</div>

        {/* Main Content Area */}
        <div className="dashboard-main-content">{mainContent}</div>

        {/* Right Panel (Optional) */}
        {rightPanel && (
          <div className="dashboard-right-panel">{rightPanel}</div>
        )}
      </div>
    </div>
  );
};
