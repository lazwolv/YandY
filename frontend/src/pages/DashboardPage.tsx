import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { CustomerDashboardPage } from './CustomerDashboardPage';
import { EmployeeDashboardPage } from './EmployeeDashboardPage';

export const DashboardPage = () => {
  const { user, isAuthenticated, loadUser } = useAuthStore();
  const navigate = useNavigate();

  // Ensure page scrolls to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadUser();
  }, [isAuthenticated, navigate, loadUser]);

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
