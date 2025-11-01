import { useState, useEffect } from 'react';
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

  // Ensure page scrolls to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      // Convert phone number to username (last 10 digits)
      const username = formData.phoneNumber.replace(/\D/g, '').slice(-10);
      await login({ emailOrUsername: username, password: formData.password });
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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4 sm:px-6 lg:px-8 pt-24 overflow-hidden">
      {/* Animated gradient overlay with purple accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink/10 pointer-events-none" />

      {/* Sparkle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-pink rounded-full animate-pulse opacity-60" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-purple-light rounded-full animate-pulse opacity-60" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-10 w-1 h-1 bg-pink rounded-full animate-pulse opacity-40" style={{ animationDelay: '0.5s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
          <div>
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-purple to-purple-dark p-3 rounded-full">
                <LogIn className="w-8 h-8 text-pink-light" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-white/70">
              Sign in with your phone number
            </p>
            <p className="mt-1 text-center text-sm text-white/70">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-pink hover:text-pink-light transition-colors">
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
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-white/80 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-all text-white placeholder:text-white/40"
                  placeholder="555-123-4567"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-all text-white placeholder:text-white/40"
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
