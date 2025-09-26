/**
 * Shared style components and CSS-in-JS utilities
 */

import React from "react";
import { animationStyles } from "./styles";

/**
 * Global animation styles component
 */
export function GlobalAnimationStyles() {
  return (
    <style>
      {animationStyles}
      {`
        .sun-times {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin: 1rem 0;
        }
        
        .sun-time-item {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 12px;
          text-align: center;
        }
        
        .sun-time-icon {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .sun-time-label {
          font-size: 0.8rem;
          color: #6c757d;
          margin-bottom: 0.25rem;
        }
        
        .sun-time-value {
          font-size: 1rem;
          font-weight: bold;
          color: #2c3e50;
        }
        
        .protection-tip {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 1rem;
          border-radius: 12px;
          margin-top: 1rem;
          border-left: 4px solid #3b82f6;
        }
        
        .protection-tip-title {
          font-size: 0.9rem;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        .protection-tip-content {
          font-size: 0.85rem;
          color: #495057;
          line-height: 1.4;
        }
        
        .metric-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          font-size: 0.95rem;
          opacity: 0.9;
          padding: 1rem 0;
          border-top: 1px solid rgba(255,255,255,0.15);
        }
        
        .metric-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
        }
        
        .metric-label {
          font-size: 0.8rem;
          opacity: 0.8;
        }
        
        .metric-value {
          font-weight: 600;
        }
        
        .circular-indicator {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: white;
          font-weight: bold;
          font-size: 1.3rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .info-badge {
          margin: 1rem 0;
          padding: 0.75rem;
          background: #fff3cd;
          border-radius: 8px;
          border: 1px solid #ffeaa7;
        }
        
        .info-badge-content {
          font-weight: bold;
          font-size: 0.9rem;
          color: #856404;
        }
      `}
    </style>
  );
}

/**
 * Metric display component
 */
interface MetricItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export function MetricItem({ icon, label, value }: MetricItemProps) {
  return (
    <div className="metric-item">
      {icon}
      <div>
        <div className="metric-label">{label}</div>
        <div className="metric-value">{value}</div>
      </div>
    </div>
  );
}

/**
 * Sun time display component
 */
interface SunTimeProps {
  icon: string;
  label: string;
  time: string;
}

export function SunTime({ icon, label, time }: SunTimeProps) {
  return (
    <div className="sun-time-item">
      <div className="sun-time-icon">{icon}</div>
      <div className="sun-time-label">{label}</div>
      <div className="sun-time-value">{time}</div>
    </div>
  );
}

/**
 * Circular indicator component (for UV Index, AQI, etc.)
 */
interface CircularIndicatorProps {
  value: string | number;
  label: string;
  color: string;
  size?: number;
}

export function CircularIndicator({
  value,
  label,
  color,
  size = 100,
}: CircularIndicatorProps) {
  return (
    <div
      className="circular-indicator"
      style={{
        backgroundColor: color,
        width: size,
        height: size,
      }}
    >
      <div>
        <div style={{ fontSize: "1.8rem" }}>{value}</div>
        <div style={{ fontSize: "0.7rem" }}>{label}</div>
      </div>
    </div>
  );
}

/**
 * Protection tip component
 */
interface ProtectionTipProps {
  title: string;
  content: string;
}

export function ProtectionTip({ title, content }: ProtectionTipProps) {
  return (
    <div className="protection-tip">
      <div className="protection-tip-title">{title}</div>
      <div
        className="protection-tip-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

/**
 * Info badge component
 */
interface InfoBadgeProps {
  children: React.ReactNode;
  icon?: string;
}

export function InfoBadge({ children, icon }: InfoBadgeProps) {
  return (
    <div className="info-badge">
      <div className="info-badge-content">
        {icon && <span>{icon} </span>}
        {children}
      </div>
    </div>
  );
}
