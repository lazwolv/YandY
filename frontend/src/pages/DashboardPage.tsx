import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { CustomerDashboardPage } from './CustomerDashboardPage';
import { EmployeeDashboardPage } from './EmployeeDashboardPage';

export const DashboardPage = () => {
  const { user } = useAuthStore();

  // Ensure page scrolls to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // ProtectedRoute handles authentication and loading user data
  // If we don't have user yet, ProtectedRoute is still loading
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on role
  switch (user.role) {
    case 'EMPLOYEE':
    case 'ADMIN':
      return <EmployeeDashboardPage />;
    case 'CUSTOMER':
    default:
      return <CustomerDashboardPage />;
  }
};
