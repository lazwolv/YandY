import { afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

/**
 * Global test setup for frontend tests
 *
 * This file runs before all tests and sets up:
 * - Testing Library cleanup
 * - Global mocks (localStorage, IntersectionObserver, etc.)
 * - Mock Service Worker for API mocking
 * - React Three Fiber canvas mocks
 */

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// Mock HTMLCanvasElement.getContext for Three.js
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(),
  putImageData: vi.fn(),
  createImageData: vi.fn(),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
})) as any;

// Mock WebGLRenderingContext for Three.js (not used but kept for potential future use)

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};
globalThis.localStorage = localStorageMock as any;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};
globalThis.sessionStorage = sessionStorageMock as any;

// Mock navigator.language
Object.defineProperty(window.navigator, 'language', {
  writable: true,
  value: 'en-US',
});

// Mock window.alert, confirm, prompt
globalThis.alert = vi.fn();
globalThis.confirm = vi.fn(() => true);
globalThis.prompt = vi.fn(() => '');

// Mock scrollTo
window.scrollTo = vi.fn() as any;

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Suppress expected errors in tests
  console.error = (...args: any[]) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      (message.includes('Not implemented: HTMLFormElement.prototype.submit') ||
        message.includes('Warning: ReactDOM.render') ||
        message.includes('Warning: useLayoutEffect'))
    ) {
      return;
    }
    originalConsoleError(...args);
  };

  console.warn = (...args: any[]) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      (message.includes('componentWillReceiveProps') ||
        message.includes('componentWillMount'))
    ) {
      return;
    }
    originalConsoleWarn(...args);
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

/**
 * Global test helpers
 */
export const testHelpers = {
  /**
   * Mock user in localStorage
   */
  mockAuthenticatedUser(user = {
    userId: 'test-user-id',
    email: 'test@example.com',
    fullName: 'Test User',
    role: 'CUSTOMER',
  }) {
    const token = 'mock-jwt-token';
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', 'mock-refresh-token');
    return { user, token };
  },

  /**
   * Clear authentication
   */
  clearAuth() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  /**
   * Wait for async updates
   */
  async waitFor(callback: () => void, timeout = 3000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      try {
        callback();
        return;
      } catch (error) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    throw new Error('Timeout waiting for condition');
  },
};
