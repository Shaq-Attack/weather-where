import React, { useState, useEffect } from "react";
import "@progress/kendo-theme-material/dist/all.css";

interface DashboardSidebarProps {
  collapsed?: boolean;
  onNavigate?: (route: string) => void;
  currentView?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  collapsed = false,
  onNavigate,
  currentView = "overview",
}) => {
  const [activeItem, setActiveItem] = useState(currentView);

  // Keep activeItem in sync with currentView prop
  useEffect(() => {
    setActiveItem(currentView);
  }, [currentView]);

  const navigationItems = [
    {
      id: "overview",
      title: "Overview",
      icon: "k-i-dashboard",
      route: "overview",
    },
    {
      id: "forecast",
      title: "Forecast",
      icon: "k-i-calendar",
      route: "forecast",
    },
    {
      id: "hourly",
      title: "Hourly",
      icon: "k-i-clock",
      route: "hourly",
    },
    {
      id: "details",
      title: "Details",
      icon: "k-i-info",
      route: "details",
    },
  ];

  const handleItemClick = (item: any) => {
    setActiveItem(item.id);
    if (onNavigate) {
      onNavigate(item.route);
    }
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .dashboard-sidebar-container {
          height: 100%;
          background: #ffffff;
          position: relative;
          overflow: hidden;
          border-radius: 0;
        }

        .sidebar-header {
          padding: 20px 16px;
          border-bottom: 1px solid #e5e7eb;
          text-align: center;
          background: #f8f9fa;
        }

        .sidebar-header.collapsed {
          padding: 16px 8px;
        }

        .sidebar-logo {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .sidebar-navigation {
          padding: 16px 12px;
        }

        .nav-item {
          margin-bottom: 4px;
        }

        .nav-button {
          width: 100%;
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          position: relative;
        }

        .nav-button:hover {
          background: #f1f5f9;
          color: #3b82f6;
          transform: translateX(2px);
        }

        .nav-button.active {
          background: #3b82f6;
          color: white;
          transform: translateX(2px);
        }

        .nav-button.active:hover {
          background: #2563eb;
          transform: translateX(4px);
        }

        .nav-button.collapsed {
          padding: 14px;
          justify-content: center;
        }

        .nav-button.collapsed .nav-text {
          display: none;
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .sidebar-section {
          margin-top: 32px;
          padding: 0 12px;
        }

        .section-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 10px;
          padding: 0 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section-title.collapsed {
          display: none;
        }

        .tree-container {
          margin-top: 16px;
        }

        .k-treeview {
          background: transparent;
          border: none;
        }

        .k-treeview .k-item {
          padding: 2px 0;
        }

        .k-treeview .k-in {
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .k-treeview .k-in:hover {
          background: #f1f5f9;
          color: #3b82f6;
          transform: translateX(2px);
        }

        .quick-actions {
          position: absolute;
          bottom: 24px;
          left: 12px;
          right: 12px;
        }

        .quick-action-btn {
          width: 100%;
          margin-bottom: 8px;
          background: #f8f9fa;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
          cursor: pointer;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .quick-action-btn:hover {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
          transform: translateY(-1px);
        }

        .quick-action-btn.collapsed {
          padding: 10px;
          text-align: center;
          justify-content: center;
        }

        .quick-action-btn.collapsed .btn-text {
          display: none;
        }

        /* Custom scrollbar for sidebar */
        .dashboard-sidebar-container::-webkit-scrollbar {
          width: 4px;
        }

        .dashboard-sidebar-container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }

        .dashboard-sidebar-container::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 2px;
        }

        .dashboard-sidebar-container::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `,
        }}
      />

      <div className="dashboard-sidebar-container">
        {/* Main Navigation */}
        <div className="sidebar-navigation">
          {navigationItems.map((item) => (
            <div key={item.id} className="nav-item">
              <button
                className={`nav-button ${collapsed ? "collapsed" : ""} ${
                  activeItem === item.id ? "active" : ""
                }`}
                onClick={() => handleItemClick(item)}
              >
                <span className={`nav-icon ${item.icon}`}></span>
                {!collapsed && <span className="nav-text">{item.title}</span>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
