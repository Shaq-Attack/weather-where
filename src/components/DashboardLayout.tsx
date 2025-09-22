import React, { useState } from 'react';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelVisible] = useState(true);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="dashboard-container">
      <style dangerouslySetInnerHTML={{__html: `
        .dashboard-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .dashboard-header {
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.25);
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
          width: ${sidebarCollapsed ? '60px' : '280px'};
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

        .sidebar-toggle-btn {
          position: absolute;
          top: 20px;
          left: ${sidebarCollapsed ? '20px' : '240px'};
          z-index: 1001;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          font-size: 14px;
          font-weight: 600;
          color: #495057;
          backdrop-filter: blur(10px);
        }

        .sidebar-toggle-btn:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .sidebar-toggle-btn:active {
          transform: translateY(0);
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
        }

        .dashboard-main-content::-webkit-scrollbar-thumb:hover,
        .dashboard-right-panel::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6b4190 100%);
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
            width: ${sidebarCollapsed ? '0px' : '260px'};
            position: absolute;
            height: 100%;
            z-index: 200;
            box-shadow: ${sidebarCollapsed ? 'none' : '4px 0 20px rgba(0, 0, 0, 0.15)'};
          }
          
          .sidebar-toggle-btn {
            left: ${sidebarCollapsed ? '20px' : '220px'};
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
          
          .sidebar-toggle-btn {
            width: 32px;
            height: 32px;
            top: 15px;
          }
        }
      `}} />
      
      {/* Dashboard Header */}
      <div className="dashboard-header">
        {header}
      </div>

      {/* Sidebar Toggle Button */}
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        {sidebarCollapsed ? '→' : '←'}
      </button>

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
        {rightPanelVisible && rightPanel && (
          <div className="dashboard-right-panel">
            {rightPanel}
          </div>
        )}
      </div>
    </div>
  );
};
