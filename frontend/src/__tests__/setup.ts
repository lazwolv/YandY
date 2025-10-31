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
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
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

// Mock WebGLRenderingContext for Three.js
class WebGLRenderingContextMock {
  canvas = document.createElement('canvas');
  drawingBufferWidth = 800;
  drawingBufferHeight = 600;
  getExtension = vi.fn();
  getParameter = vi.fn();
  getContextAttributes = vi.fn(() => ({
    alpha: true,
    antialias: true,
    depth: true,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'default',
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    stencil: false,
    desynchronized: false,
  }));
  createBuffer = vi.fn();
  createTexture = vi.fn();
  createProgram = vi.fn();
  createShader = vi.fn();
  shaderSource = vi.fn();
  compileShader = vi.fn();
  attachShader = vi.fn();
  linkProgram = vi.fn();
  useProgram = vi.fn();
  getProgramParameter = vi.fn(() => true);
  getShaderParameter = vi.fn(() => true);
  viewport = vi.fn();
  clear = vi.fn();
  clearColor = vi.fn();
  enable = vi.fn();
  disable = vi.fn();
  depthFunc = vi.fn();
  blendFunc = vi.fn();
  getAttribLocation = vi.fn(() => 0);
  getUniformLocation = vi.fn(() => ({}));
  bindBuffer = vi.fn();
  bufferData = vi.fn();
  vertexAttribPointer = vi.fn();
  enableVertexAttribArray = vi.fn();
  drawArrays = vi.fn();
  drawElements = vi.fn();
  deleteShader = vi.fn();
  deleteProgram = vi.fn();
  deleteBuffer = vi.fn();
  deleteTexture = vi.fn();
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};
global.localStorage = localStorageMock as any;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};
global.sessionStorage = sessionStorageMock as any;

// Mock navigator.language
Object.defineProperty(window.navigator, 'language', {
  writable: true,
  value: 'en-US',
});

// Mock window.alert, confirm, prompt
global.alert = vi.fn();
global.confirm = vi.fn(() => true);
global.prompt = vi.fn(() => '');

// Mock scrollTo
window.scrollTo = vi.fn();

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
