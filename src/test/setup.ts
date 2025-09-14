import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// Mock environment variables for tests
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_OPENWEATHER_API_KEY: 'test-api-key',
  },
  writable: true,
});

// Mock fetch for API calls
globalThis.fetch = vi.fn();

// Mock geolocation
Object.defineProperty(globalThis.navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn(),
  },
  configurable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
