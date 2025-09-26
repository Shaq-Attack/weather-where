/**
 * Shared styling utilities and constants for consistent design across components
 */

// Common card styles
export const cardStyles = {
  base: {
    borderRadius: "20px",
    margin: "1rem auto",
    maxWidth: "600px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  },

  hover: {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    minHeight: "250px",
  },

  error: {
    padding: "2rem",
    textAlign: "center" as const,
  },
} as const;

// Header styles
export const headerStyles = {
  base: {
    textAlign: "center" as const,
    fontWeight: "bold" as const,
    padding: "1.5rem 1.5rem 1rem",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
  },

  title: {
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
} as const;

// Body styles
export const bodyStyles = {
  base: {
    padding: "1.5rem",
    textAlign: "center" as const,
  },

  grid: {
    display: "grid",
    gap: "1rem",
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
} as const;

// Animation classes as CSS strings
export const animationStyles = `
  .fade-in {
    opacity: 1;
    transition: opacity 0.3s ease-in;
  }
  
  .fade-out {
    opacity: 0.3;
    transition: opacity 0.3s ease-out;
  }
  
  .card-hover {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }
`;

// Color palette
export const colors = {
  primary: "#667eea",
  secondary: "#f093fb",
  success: "#4ade80",
  warning: "#fbbf24",
  error: "#ef4444",
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
} as const;

// Spacing scale
export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
} as const;

// Border radius scale
export const borderRadius = {
  sm: "6px",
  md: "12px",
  lg: "20px",
  full: "50%",
} as const;
