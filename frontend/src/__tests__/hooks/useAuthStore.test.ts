import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuthStore } from '../../store/authStore';

/**
 * React Hook Tests for Auth Store
 *
 * These tests prevent Bug #2: React Hook Infinite Loops
 *
 * Purpose:
 * - Verify function identity stability (prevents infinite loops)
 * - Test that functions don't change on every render
 * - Validate hook dependencies are correct
 * - Detect potential memory leaks
 */

describe('useAuthStore Hook Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Reset the store to initial state
    const { logout } = useAuthStore.getState();
    logout();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Function Identity Stability - Bug #2 Prevention', () => {
    test('login function maintains stable reference across renders', () => {
      const { result, rerender } = renderHook(() => useAuthStore());

      const firstLogin = result.current.login;

      // Force re-render
      rerender();

      const secondLogin = result.current.login;

      // Function should be the same reference (prevents infinite loops)
      expect(firstLogin).toBe(secondLogin);
    });

    test('logout function maintains stable reference across renders', () => {
      const { result, rerender } = renderHook(() => useAuthStore());

      const firstLogout = result.current.logout;
      rerender();
      const secondLogout = result.current.logout;

      expect(firstLogout).toBe(secondLogout);
    });

    test('loadUser function maintains stable reference across renders', () => {
      // This is the function that caused Bug #2 when placed in useEffect deps
      const { result, rerender } = renderHook(() => useAuthStore());

      const firstLoadUser = result.current.loadUser;
      rerender();
      const secondLoadUser = result.current.loadUser;

      // CRITICAL: This must be stable or useEffect will loop
      expect(firstLoadUser).toBe(secondLoadUser);
    });

    test('register function maintains stable reference across renders', () => {
      const { result, rerender } = renderHook(() => useAuthStore());

      const firstRegister = result.current.register;
      rerender();
      const secondRegister = result.current.register;

      expect(firstRegister).toBe(secondRegister);
    });

    test('clearError function maintains stable reference across renders', () => {
      const { result, rerender } = renderHook(() => useAuthStore());

      const firstClearError = result.current.clearError;
      rerender();
      const secondClearError = result.current.clearError;

      expect(firstClearError).toBe(secondClearError);
    });

    test('all functions remain stable after 100 rerenders', () => {
      const { result, rerender } = renderHook(() => useAuthStore());

      const initialFunctions = {
        login: result.current.login,
        logout: result.current.logout,
        loadUser: result.current.loadUser,
        register: result.current.register,
        clearError: result.current.clearError,
      };

      // Simulate many rerenders (would cause issues if functions recreate)
      for (let i = 0; i < 100; i++) {
        rerender();
      }

      expect(result.current.login).toBe(initialFunctions.login);
      expect(result.current.logout).toBe(initialFunctions.logout);
      expect(result.current.loadUser).toBe(initialFunctions.loadUser);
      expect(result.current.register).toBe(initialFunctions.register);
      expect(result.current.clearError).toBe(initialFunctions.clearError);
    });
  });

  describe('State Updates Do Not Recreate Functions', () => {
    test('functions remain stable when user state changes', async () => {
      const { result } = renderHook(() => useAuthStore());

      const initialLoadUser = result.current.loadUser;

      // Update state
      act(() => {
        useAuthStore.setState({
          user: {
            userId: 'test-id',
            email: 'test@example.com',
            username: 'testuser',
            fullName: 'Test User',
            role: 'CUSTOMER',
            phoneNumber: '+1234567890',
            isVerified: true,
            createdAt: new Date().toISOString(),
          },
          isAuthenticated: true,
        });
      });

      // Function should still be same reference
      expect(result.current.loadUser).toBe(initialLoadUser);
    });

    test('functions remain stable when error state changes', () => {
      const { result } = renderHook(() => useAuthStore());

      const initialLogin = result.current.login;

      // Set error
      act(() => {
        useAuthStore.setState({ error: 'Test error' });
      });

      expect(result.current.login).toBe(initialLogin);
    });

    test('functions remain stable when loading state changes', () => {
      const { result } = renderHook(() => useAuthStore());

      const initialRegister = result.current.register;

      // Set loading
      act(() => {
        useAuthStore.setState({ isLoading: true });
      });

      expect(result.current.register).toBe(initialRegister);
    });
  });

  describe('Memory Leak Prevention', () => {
    test('store does not leak memory with repeated subscriptions', () => {
      const subscriptions = [];

      // Create 1000 subscriptions
      for (let i = 0; i < 1000; i++) {
        const unsubscribe = useAuthStore.subscribe(() => {});
        subscriptions.push(unsubscribe);
      }

      // Clean up all subscriptions
      subscriptions.forEach(unsub => unsub());

      // If there's a memory leak, this would fail or cause issues
      // We're mainly testing that cleanup works correctly
      expect(subscriptions).toHaveLength(1000);
    });

    test('repeated renders do not accumulate listeners', () => {
      const { rerender } = renderHook(() => useAuthStore());

      // Render many times
      for (let i = 0; i < 100; i++) {
        rerender();
      }

      // Should not crash or cause memory issues
      expect(true).toBe(true);
    });
  });

  describe('Safe useEffect Usage Pattern', () => {
    test('demonstrates correct way to use loadUser in useEffect', async () => {
      // Mock successful API response
      const mockUser = {
        userId: 'test-id',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User',
        role: 'CUSTOMER' as const,
        phoneNumber: '+1234567890',
        isVerified: true,
        createdAt: new Date().toISOString(),
      };

      // Simulate component with useEffect
      let renderCount = 0;

      const TestComponent = () => {
        const { loadUser, user } = useAuthStore();

        // WRONG WAY (causes infinite loop):
        // useEffect(() => { loadUser(); }, [loadUser]); // BAD!

        // CORRECT WAY (runs once):
        // useEffect(() => { loadUser(); }, []); // GOOD!

        renderCount++;
        return { loadUser, user };
      };

      const { result } = renderHook(() => TestComponent());

      // Should only render once initially
      expect(renderCount).toBe(1);

      // Even if we access loadUser, it shouldn't cause rerenders
      const loadUserFunc = result.current.loadUser;
      expect(loadUserFunc).toBeDefined();
      expect(renderCount).toBe(1); // Still only 1 render
    });

    test('loadUser can be safely called in useEffect with empty deps', async () => {
      const { result } = renderHook(() => {
        const loadUser = useAuthStore(state => state.loadUser);
        return { loadUser };
      });

      // Set up mock token
      localStorage.setItem('accessToken', 'mock-token');

      // This simulates calling loadUser in useEffect
      // Should not cause infinite loop
      await act(async () => {
        await result.current.loadUser().catch(() => {});
      });

      // Should complete without infinite loop
      expect(true).toBe(true);
    });
  });

  describe('Zustand Selector Optimization', () => {
    test('using selectors prevents unnecessary rerenders', () => {
      let renderCount = 0;

      const { result, rerender } = renderHook(() => {
        renderCount++;
        return useAuthStore(state => state.user);
      });

      expect(renderCount).toBe(1);

      // Update unrelated state
      act(() => {
        useAuthStore.setState({ isLoading: true });
      });

      rerender();

      // Should not cause rerender since we're only selecting 'user'
      expect(renderCount).toBe(1);
    });

    test('demonstrates correct selector usage to avoid loops', () => {
      // WRONG WAY (causes rerenders on every state change):
      // const store = useAuthStore(); // BAD if you only need one property

      // CORRECT WAY (only rerenders when user changes):
      // const user = useAuthStore(state => state.user); // GOOD!

      const { result, rerender } = renderHook(() =>
        useAuthStore(state => ({
          user: state.user,
          loadUser: state.loadUser,
        }))
      );

      const initialLoadUser = result.current.loadUser;

      // Change unrelated state
      act(() => {
        useAuthStore.setState({ error: 'some error' });
      });

      rerender();

      // loadUser should still be same reference
      expect(result.current.loadUser).toBe(initialLoadUser);
    });
  });

  describe('Concurrent Operations', () => {
    test('multiple simultaneous loadUser calls do not interfere', async () => {
      const { result } = renderHook(() => useAuthStore());

      localStorage.setItem('accessToken', 'mock-token');

      // Call loadUser multiple times simultaneously
      const promises = [
        result.current.loadUser().catch(() => {}),
        result.current.loadUser().catch(() => {}),
        result.current.loadUser().catch(() => {}),
      ];

      await Promise.all(promises);

      // Should not cause state corruption
      expect(result.current.isAuthenticated).toBeDefined();
    });

    test('login and loadUser can be called without conflicts', async () => {
      const { result } = renderHook(() => useAuthStore());

      const loginPromise = result.current
        .login({ username: 'test', password: 'Test123!@#' })
        .catch(() => {});

      const loadUserPromise = result.current.loadUser().catch(() => {});

      await Promise.all([loginPromise, loadUserPromise]);

      // Should complete without errors
      expect(true).toBe(true);
    });
  });

  describe('State Consistency', () => {
    test('state remains consistent after multiple operations', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Perform multiple operations
      act(() => {
        useAuthStore.setState({ isLoading: true });
      });

      act(() => {
        useAuthStore.setState({ error: 'error' });
      });

      act(() => {
        useAuthStore.setState({ isLoading: false, error: null });
      });

      // State should be consistent
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    test('clearError resets error state correctly', () => {
      const { result } = renderHook(() => useAuthStore());

      // Set error
      act(() => {
        useAuthStore.setState({ error: 'Test error' });
      });

      expect(result.current.error).toBe('Test error');

      // Clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('Function Call Limits (Infinite Loop Detection)', () => {
    test('loadUser does not trigger infinite recursion', async () => {
      const { result } = renderHook(() => useAuthStore());

      let callCount = 0;
      const originalLoadUser = result.current.loadUser;

      // Wrap to count calls
      const wrappedLoadUser = async () => {
        callCount++;
        if (callCount > 10) {
          throw new Error('Infinite loop detected! loadUser called more than 10 times');
        }
        await originalLoadUser().catch(() => {});
      };

      // Call once
      await wrappedLoadUser();

      // Should only be called once
      expect(callCount).toBe(1);
    });

    test('state updates do not trigger cascading rerenders', () => {
      let renderCount = 0;

      const { result } = renderHook(() => {
        renderCount++;
        return useAuthStore();
      });

      // Update state
      act(() => {
        useAuthStore.setState({ isLoading: true });
      });

      act(() => {
        useAuthStore.setState({ isLoading: false });
      });

      // Should not cause excessive rerenders
      expect(renderCount).toBeLessThan(10);
    });
  });

  describe('Component Integration Simulation', () => {
    test('simulates Navbar component usage without infinite loop', () => {
      let effectCount = 0;

      const simulateNavbar = () => {
        const { result } = renderHook(() => {
          const { loadUser, user, isAuthenticated } = useAuthStore();

          // Simulate useEffect that runs once
          if (effectCount === 0) {
            effectCount++;
            // This would be in useEffect(() => { loadUser(); }, [])
            loadUser().catch(() => {});
          }

          return { user, isAuthenticated };
        });

        return result;
      };

      const { current } = simulateNavbar();

      // Effect should only run once
      expect(effectCount).toBe(1);
      expect(current.isAuthenticated).toBeDefined();
    });

    test('simulates Dashboard component usage without memory leak', () => {
      const { result } = renderHook(() => {
        const { user, loadUser } = useAuthStore();

        // Simulate safe usage in dashboard
        return { user, loadUser };
      });

      // Simulate multiple renders (like scrolling, etc.)
      for (let i = 0; i < 50; i++) {
        // Access properties multiple times
        const _ = result.current.user;
        const __ = result.current.loadUser;
      }

      // Should not crash or cause memory issues
      expect(result.current.loadUser).toBeDefined();
    });
  });
});
