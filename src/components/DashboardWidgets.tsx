import { AirQualityCard } from "./weather/AirQualityCard";
import { WeatherInsights } from "./weather/WeatherInsights";
import { UVIndexCard } from "./weather/UVIndexCard";
import "@progress/kendo-theme-material/dist/all.css";

interface DashboardWidgetsProps {
  lat?: number | null;
  lon?: number | null;
}

export const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({
  lat,
  lon,
}) => {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .widgets-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 0;
          height: auto;
          min-height: 100%;
          overflow-y: auto;
        }

        .widget-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          transition: box-shadow 0.2s ease;
          overflow: hidden;
          position: relative;
          height: auto;
          min-height: fit-content;
        }

        .widget-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10);
        }

        .widget-header {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 14px 20px;
        }

        .widget-title {
          font-size: 0.75rem;
          font-weight: 600;
          margin: 0;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .widget-body {
          padding: 24px;
          height: auto;
          min-height: fit-content;
        }

        .quick-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .stat-tile {
          background: #f8fafc;
          border-radius: 6px;
          padding: 16px;
          text-align: center;
          border-left: 3px solid;
          transition: background 0.15s ease;
          border-top: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }

        .stat-tile:hover {
          background: #f1f5f9;
        }

        .stat-title {
          font-size: 0.7rem;
          color: #64748b;
          margin-bottom: 8px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
          line-height: 1;
        }

        .stat-trend {
          font-size: 0.75rem;
          color: #16a34a;
          font-weight: 600;
        }

        .calendar-widget {
          min-height: 400px;
        }

        .scheduler-widget {
          min-height: 450px;
        }

        .chat-widget {
          height: 500px;
        }

        .stats-widget {
          min-height: 320px;
        }

        .chat-container {
          height: 380px;
          border: 1px solid rgba(230, 236, 245, 0.8);
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        }

        .weather-tip {
          background: white;
          border-radius: 6px;
          padding: 14px 16px;
          margin-bottom: 12px;
          border-left: 3px solid #2563eb;
          border-top: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }

        .tip-title {
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 6px;
          font-size: 0.875rem;
        }

        .tip-content {
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.5;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .action-btn {
          background: white;
          color: #0f172a;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 7px 14px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          justify-content: center;
          min-width: 100px;
        }

        .action-btn:hover {
          border-color: #2563eb;
          color: #2563eb;
        }

        /* Enhanced KendoReact component styling */
        .k-calendar {
          border: none !important;
          background: transparent !important;
          border-radius: 12px !important;
          width: 100% !important;
        }

        .k-calendar .k-header {
          background: #f8fafc !important;
          color: #0f172a !important;
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          padding: 12px !important;
        }

        .k-calendar .k-content {
          border: none !important;
        }

        .k-calendar td {
          border-radius: 6px !important;
          transition: all 0.3s ease !important;
        }

        .k-calendar .k-selected {
          background: #3b82f6 !important;
          color: white !important;
        }

        .k-scheduler {
          border: none !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
        }

        .k-scheduler-header {
          background: #f8fafc !important;
          color: #0f172a !important;
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }

        .k-chat {
          border: none !important;
          border-radius: 12px !important;
          background: transparent !important;
          height: 100% !important;
        }

        .k-message-box {
          background: rgba(248, 249, 250, 0.8) !important;
          border-top: 1px solid rgba(230, 236, 245, 0.8) !important;
          border-radius: 0 0 12px 12px !important;
        }

        .k-message-list {
          background: transparent !important;
        }

        /* Custom scrollbar for widgets */
        .widgets-container::-webkit-scrollbar {
          width: 8px;
        }

        .widgets-container::-webkit-scrollbar-track {
          background: rgba(241, 243, 246, 0.8);
          border-radius: 4px;
        }

        .widgets-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .widgets-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @media (max-width: 768px) {
          .quick-stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .stat-tile {
            padding: 16px;
          }
          
          .stat-value {
            font-size: 1.6rem;
          }
          
          .widget-body {
            padding: 20px;
            height: auto;
            min-height: fit-content;
          }
          
          .action-buttons {
            flex-direction: column;
            gap: 10px;
          }
          
          .action-btn {
            flex: none;
          }
          
          .chat-widget {
            height: 400px;
          }
          
          .chat-container {
            height: 300px;
          }
        }

        @media (max-width: 480px) {
          .widget-body {
            padding: 16px;
            height: auto;
            min-height: fit-content;
          }
          
          .weather-tip {
            padding: 14px;
            margin-bottom: 14px;
          }
          
          .stat-tile {
            padding: 14px;
          }
        }
      `,
        }}
      />

      <div className="widgets-container">
        {/* Air Quality Index Widget */}
        <AirQualityCard lat={lat ?? undefined} lon={lon ?? undefined} />

        {/* UV Index Widget */}
        <UVIndexCard lat={lat ?? undefined} lon={lon ?? undefined} />

        {/* Weather Insights */}
        <WeatherInsights lat={lat} lon={lon} />
      </div>
    </>
  );
};
