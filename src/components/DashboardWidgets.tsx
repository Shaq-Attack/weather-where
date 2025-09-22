import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardTitle } from '@progress/kendo-react-layout';
import { Calendar } from '@progress/kendo-react-dateinputs';
import { Scheduler } from '@progress/kendo-react-scheduler';
import { Chat } from '@progress/kendo-react-conversational-ui';
import { Button } from '@progress/kendo-react-buttons';
import '@progress/kendo-theme-material/dist/all.css';

export const DashboardWidgets: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [messages, setMessages] = useState([
    {
      author: { id: 1, name: "Weather Bot", avatarUrl: "☁️" },
      text: "Welcome to Weather Dashboard! I can help you with weather insights.",
      timestamp: new Date()
    }
  ]);

  // Mock weather events for scheduler
  const weatherEvents = [
    {
      id: 1,
      title: "Heavy Rain Expected",
      start: new Date(2024, 11, 25, 14, 0),
      end: new Date(2024, 11, 25, 18, 0),
      description: "Prepare for heavy rainfall"
    },
    {
      id: 2,
      title: "Sunny Day",
      start: new Date(2024, 11, 26, 8, 0),
      end: new Date(2024, 11, 26, 19, 0),
      description: "Perfect day for outdoor activities"
    },
    {
      id: 3,
      title: "Temperature Drop",
      start: new Date(2024, 11, 27, 20, 0),
      end: new Date(2024, 11, 28, 6, 0),
      description: "Significant temperature decrease expected"
    }
  ];

  const onSendMessage = (event: any) => {
    const newMessage = {
      author: { id: 2, name: "You", avatarUrl: "👤" },
      text: event.message.text,
      timestamp: new Date()
    };
    
    const botResponse = {
      author: { id: 1, name: "Weather Bot", avatarUrl: "☁️" },
      text: generateBotResponse(),
      timestamp: new Date(Date.now() + 1000)
    };

    setMessages([...messages, newMessage, botResponse]);
  };

  const generateBotResponse = () => {
    const responses = [
      "Based on current conditions, I'd recommend checking the hourly forecast for more details.",
      "The weather patterns show interesting trends. Would you like me to explain?",
      "I see you're interested in weather data. Let me pull up the latest information.",
      "That's a great question! The meteorological data suggests several factors at play.",
      "Weather patterns can be complex. I'm here to help you understand them better."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .widgets-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 0;
          height: 100%;
          overflow-y: auto;
        }

        .widget-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(230, 236, 245, 0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          position: relative;
        }

        .widget-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: height 0.3s ease;
        }

        .widget-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .widget-card:hover::before {
          height: 6px;
        }

        .widget-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 18px 24px;
          position: relative;
          overflow: hidden;
        }

        .widget-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="lines" width="40" height="40" patternUnits="userSpaceOnUse"><path d="m 0,40 l 40,-40 M -10,10 l 20,-20 M 30,50 l 20,-20" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23lines)"/></svg>');
          opacity: 0.4;
        }

        .widget-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
          position: relative;
          z-index: 1;
          letter-spacing: -0.5px;
        }

        .widget-body {
          padding: 24px;
        }

        .quick-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .stat-tile {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          border-left: 4px solid;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(230, 236, 245, 0.6);
        }

        .stat-tile::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }

        .stat-tile:hover::before {
          left: 100%;
        }

        .stat-tile:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
        }

        .stat-title {
          font-size: 0.8rem;
          color: #6c757d;
          margin-bottom: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 6px;
          line-height: 1;
        }

        .stat-trend {
          font-size: 0.8rem;
          color: #28a745;
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
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
          border-radius: 12px;
          padding: 18px;
          margin-bottom: 18px;
          border-left: 4px solid #667eea;
          border: 1px solid rgba(102, 126, 234, 0.2);
          transition: all 0.3s ease;
        }

        .weather-tip:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
        }

        .tip-title {
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 0.95rem;
        }

        .tip-content {
          font-size: 0.9rem;
          color: #495057;
          line-height: 1.5;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .action-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          justify-content: center;
          min-width: 100px;
        }

        .action-btn:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6b4190 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .action-btn:active {
          transform: translateY(0);
        }

        /* Enhanced KendoReact component styling */
        .k-calendar {
          border: none !important;
          background: transparent !important;
          border-radius: 12px !important;
          width: 100% !important;
        }

        .k-calendar .k-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          border: none !important;
          border-radius: 12px 12px 0 0 !important;
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
        }

        .k-scheduler {
          border: none !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
        }

        .k-scheduler-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          border: none !important;
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
        }

        .widgets-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6b4190 100%);
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
          }
          
          .weather-tip {
            padding: 14px;
            margin-bottom: 14px;
          }
          
          .stat-tile {
            padding: 14px;
          }
        }
      `}} />

      <div className="widgets-container">
        {/* Calendar Widget */}
        <Card className="widget-card calendar-widget">
          <CardHeader className="widget-header">
            <CardTitle className="widget-title">Weather Calendar</CardTitle>
          </CardHeader>
          <CardBody className="widget-body">
            <Calendar
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.value || new Date())}
            />
            
            <div className="weather-tip">
              <div className="tip-title">💡 Today's Tip</div>
              <div className="tip-content">
                Perfect weather for a morning walk! Temperature will be ideal between 8-10 AM.
              </div>
            </div>

            <div className="action-buttons">
              <Button className="action-btn" icon="calendar">
                Plan Day
              </Button>
              <Button className="action-btn" icon="notification">
                Set Alert
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Weather Events Scheduler */}
        <Card className="widget-card scheduler-widget">
          <CardHeader className="widget-header">
            <CardTitle className="widget-title">Weather Events</CardTitle>
          </CardHeader>
          <CardBody className="widget-body">
            <Scheduler
              data={weatherEvents}
              defaultDate={new Date()}
              view="week"
              timezone="Etc/UTC"
            />
          </CardBody>
        </Card>

        {/* Weather Assistant Chat */}
        <Card className="widget-card chat-widget">
          <CardHeader className="widget-header">
            <CardTitle className="widget-title">Weather Assistant</CardTitle>
          </CardHeader>
          <CardBody className="widget-body">
            <div className="chat-container">
              <Chat
                user={{ id: 2, name: "You" }}
                messages={messages}
                onMessageSend={onSendMessage}
                placeholder="Ask me about the weather..."
                width="100%"
              />
            </div>
          </CardBody>
        </Card>

        {/* Weather Insights */}
        <Card className="widget-card">
          <CardHeader className="widget-header">
            <CardTitle className="widget-title">Weather Insights</CardTitle>
          </CardHeader>
          <CardBody className="widget-body">
            <div className="weather-tip">
              <div className="tip-title">🌡️ Temperature Trend</div>
              <div className="tip-content">
                Temperatures have been 2°C above average this week. Expect gradual cooling.
              </div>
            </div>

            <div className="weather-tip">
              <div className="tip-title">🌧️ Precipitation Forecast</div>
              <div className="tip-content">
                15% chance of rain today. No significant precipitation expected this week.
              </div>
            </div>

            <div className="weather-tip">
              <div className="tip-title">💨 Wind Advisory</div>
              <div className="tip-content">
                Moderate winds expected. Good conditions for outdoor activities.
              </div>
            </div>

            <div className="action-buttons">
              <Button className="action-btn" icon="refresh">
                Refresh
              </Button>
              <Button className="action-btn" icon="download">
                Export
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Location Tiles */}
        <Card className="widget-card">
          <CardHeader className="widget-header">
            <CardTitle className="widget-title">Favorite Locations</CardTitle>
          </CardHeader>
          <CardBody className="widget-body">
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ background: '#667eea', color: 'white', borderRadius: '8px', padding: '16px' }}>
                <h4 style={{ margin: 0 }}>New York</h4>
                <p style={{ margin: '4px 0', fontSize: '1.2rem' }}>22°C</p>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Partly Cloudy</p>
              </div>

              <div style={{ background: '#4ecdc4', color: 'white', borderRadius: '8px', padding: '16px' }}>
                <h4 style={{ margin: 0 }}>London</h4>
                <p style={{ margin: '4px 0', fontSize: '1.2rem' }}>18°C</p>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Light Rain</p>
              </div>

              <div style={{ background: '#45b7d1', color: 'white', borderRadius: '8px', padding: '16px' }}>
                <h4 style={{ margin: 0 }}>Tokyo</h4>
                <p style={{ margin: '4px 0', fontSize: '1.2rem' }}>26°C</p>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Sunny</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};
