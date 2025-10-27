import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { LogIn, Phone, Lock } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      // Convert phone number to username (last 10 digits)
      const username = formData.phoneNumber.replace(/\D/g, '').slice(-10);
      await login({ username, password: formData.password });
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the store
      console.error('Login error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-purple/5 via-pink-light/10 to-purple/5 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div>
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-purple to-purple-dark p-3 rounded-full">
                <LogIn className="w-8 h-8 text-pink-light" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-purple">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in with your phone number
            </p>
            <p className="mt-1 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-purple hover:text-purple-dark transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
                  placeholder="555-123-4567"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-purple to-purple-dark text-pink-light font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
