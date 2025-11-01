import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar, Globe, LogOut, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, loadUser } = useAuthStore();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'ES' : 'EN');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load user data on app initialization if we have a token but no user
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !user) {
      loadUser();
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { labelKey: 'nav.home', href: '#home' },
    { labelKey: 'nav.services', href: '#services' },
    { labelKey: 'nav.gallery', href: '#gallery' },
    { labelKey: 'nav.team', href: '#team' },
    { labelKey: 'nav.testimonials', href: '#testimonials' },
    { labelKey: 'nav.contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);

    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation, then scroll
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleBooking = () => {
    setIsMobileMenuOpen(false);
    navigate('/booking');
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-gray-900/95 backdrop-blur-lg shadow-xl'
            : 'bg-gray-900/90 backdrop-blur-sm'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => scrollToSection('#home')}
            >
              <img
                src="/images/LOGO-DEF.png"
                alt="Y&Y Beauty Salon"
                className="h-12 md:h-14 w-auto transition-opacity duration-300"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  Y&Y Beauty Salon
                </h1>
                <p className="text-xs text-white/70">Luxury Nail Care</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="text-white hover:text-pink-light font-semibold transition-colors relative group"
                >
                  {t(link.labelKey)}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-light to-pink group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            {/* CTA Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBooking}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20 hover:border-white/30 font-semibold py-2.5 px-6 xl:py-3 xl:px-8 rounded-full flex items-center gap-2 transition-all"
              >
                <Calendar className="w-4 h-4 xl:w-5 xl:h-5" />
                <span className="hidden xl:inline">{t('nav.bookNow')}</span>
                <span className="xl:hidden">{t('nav.book')}</span>
              </motion.button>

              {/* User Menu */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(191, 160, 208, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-light to-pink-light text-white font-bold py-2.5 px-3 xl:px-4 rounded-full shadow-lg transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm border-2 border-white/50 text-white flex items-center justify-center font-bold text-sm">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden xl:inline">{user.fullName.split(' ')[0]}</span>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-white/20 overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-white/20">
                          <p className="font-semibold text-white">{user.fullName}</p>
                          <p className="text-sm text-white/70">{user.phoneNumber}</p>
                        </div>
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              navigate('/dashboard');
                            }}
                            className="w-full px-4 py-2 text-left flex items-center gap-2 text-white hover:bg-white/10 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            My Dashboard
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-left flex items-center gap-2 text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 text-white hover:text-pink-light font-semibold transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  {t('nav.login')}
                </motion.button>
              )}

              {/* Language Switcher */}
              {/* Only show language toggle if user is not logged in or doesn't have a preference set */}
              {(!isAuthenticated || !user?.languagePreference) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-full px-3 py-2 text-sm text-white hover:bg-white/20 hover:border-white/30 transition-all font-semibold"
                  title="Switch language"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language}</span>
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Button - Enhanced Animation */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all overflow-hidden relative"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.div>
              {/* Pulse effect when closed */}
              {!isMobileMenuOpen && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-white"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Menu Panel - Full Screen */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black z-50 lg:hidden overflow-y-auto"
            >
              <div className="min-h-screen flex flex-col p-6">
                {/* Close button */}
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  >
                    <X className="w-7 h-7" />
                  </button>
                </div>

                {/* Logo */}
                <div className="mb-10">
                  <img
                    src="/images/LOGO-DEF.png"
                    alt="Y&Y Beauty Salon"
                    className="h-16 w-auto mb-3"
                  />
                  <h2 className="text-xl font-bold text-white">Y&Y Beauty Salon</h2>
                  <p className="text-white/70 text-sm">{t('common.luxuryNailCare')}</p>
                </div>

                {/* Language Switcher - Only show for guest users (not logged in) */}
                {!isAuthenticated && (
                  <div className="mb-8">
                    <button
                      onClick={toggleLanguage}
                      className="flex items-center gap-3 text-white/80 hover:text-white font-medium transition-colors text-lg"
                    >
                      <Globe className="w-5 h-5" />
                      <span>{language}</span>
                    </button>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 space-y-0.5">
                  {/* Authenticated User Options - Show at TOP */}
                  {isAuthenticated && user && (
                    <>
                      <motion.button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/dashboard');
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0 }}
                        className="block text-white hover:text-white/70 text-xl font-normal transition-colors py-2.5 w-full text-left"
                      >
                        {t('nav.myProfile')}
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 }}
                        className="block text-white hover:text-white/70 text-xl font-normal transition-colors py-2.5 w-full text-left"
                      >
                        {t('nav.logout')}
                      </motion.button>
                    </>
                  )}

                  {/* Regular Navigation Links */}
                  {navLinks.map((link, index) => {
                    // Calculate delay based on whether user is authenticated
                    const delayOffset = isAuthenticated ? 2 : 0;
                    return (
                      <motion.a
                        key={index}
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(link.href);
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index + delayOffset) * 0.05 }}
                        className="block text-white hover:text-white/70 text-xl font-normal transition-colors py-2.5"
                      >
                        {t(link.labelKey)}
                      </motion.a>
                    );
                  })}

                  {/* Login Link for Non-Authenticated Users */}
                  {!isAuthenticated && (
                    <motion.button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/login');
                      }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navLinks.length * 0.05 }}
                      className="block text-white hover:text-white/70 text-xl font-normal transition-colors py-2.5 w-full text-left"
                    >
                      {t('nav.login')}
                    </motion.button>
                  )}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
