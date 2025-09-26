import React, { useState, useEffect } from 'react';
import '@progress/kendo-theme-material/dist/all.css';

interface DashboardSidebarProps {
  collapsed?: boolean;
  onNavigate?: (route: string) => void;
  currentView?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  collapsed = false,
  onNavigate,
  currentView = 'overview'
}) => {
  const [activeItem, setActiveItem] = useState(currentView);

  // Keep activeItem in sync with currentView prop
  useEffect(() => {
    setActiveItem(currentView);
  }, [currentView]);

  const navigationItems = [
    {
      id: 'overview',
      title: 'Overview',
      icon: 'k-i-dashboard',
      route: 'overview'
    },
    {
      id: 'forecast',
      title: 'Forecast',
      icon: 'k-i-calendar',
      route: 'forecast'
    },
    {
      id: 'hourly',
      title: 'Hourly',
      icon: 'k-i-clock',
      route: 'hourly'
    },
    {
      id: 'details',
      title: 'Details',
      icon: 'k-i-info',
      route: 'details'
    }
  ];

  const handleItemClick = (item: any) => {
    setActiveItem(item.id);
    if (onNavigate) {
      onNavigate(item.route);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .dashboard-sidebar-container {
          height: 100%;
          background: #ffffff;
          position: relative;
          overflow: hidden;
          border-radius: 0;
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(230, 236, 245, 0.8);
          text-align: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .sidebar-header.collapsed {
          padding: 20px 10px;
        }

        .sidebar-logo {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2c3e50;
          letter-spacing: -0.5px;
        }

        .sidebar-navigation {
          padding: 16px 12px;
        }

        .nav-item {
          margin-bottom: 6px;
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-button {
          width: 100%;
          padding: 14px 18px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: #495057;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 14px;
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .nav-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .nav-button:hover::before {
          left: 100%;
        }

        .nav-button:hover {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          color: #667eea;
          transform: translateX(6px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
        }

        .nav-button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          transform: translateX(6px);
        }

        .nav-button.active:hover {
          transform: translateX(8px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
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
          font-weight: 700;
          color: #6c757d;
          margin-bottom: 12px;
          padding: 0 18px;
          text-transform: uppercase;
          letter-spacing: 1px;
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
          padding: 10px 18px;
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .k-treeview .k-in:hover {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          color: #667eea;
          transform: translateX(4px);
        }

        .quick-actions {
          position: absolute;
          bottom: 24px;
          left: 12px;
          right: 12px;
        }

        .quick-action-btn {
          width: 100%;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 1px solid rgba(230, 236, 245, 0.8);
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          color: #495057;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quick-action-btn:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
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
          width: 6px;
        }

        .dashboard-sidebar-container::-webkit-scrollbar-track {
          background: rgba(241, 243, 246, 0.5);
          border-radius: 3px;
        }

        .dashboard-sidebar-container::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px;
        }

        .dashboard-sidebar-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6b4190 100%);
        }
      `}} />

      <div className="dashboard-sidebar-container">

        {/* Main Navigation */}
        <div className="sidebar-navigation">
          {navigationItems.map((item) => (
            <div key={item.id} className="nav-item">
              <button
                className={`nav-button ${collapsed ? 'collapsed' : ''} ${
                  activeItem === item.id ? 'active' : ''
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
