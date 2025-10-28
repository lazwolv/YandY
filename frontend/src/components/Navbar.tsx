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

  useEffect(() => {
    loadUser();
  }, [loadUser]);

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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-gradient-to-br from-purple via-purple-dark to-purple-dark z-50 lg:hidden shadow-2xl"
            >
              <div className="p-8">
                {/* Close button */}
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-pink-light hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Logo */}
                <div className="mb-12">
                  <img
                    src="/images/LOGO-DEF.png"
                    alt="Y&Y Beauty Salon"
                    className="h-16 w-auto mb-3"
                  />
                  <h2 className="text-2xl font-bold text-pink-light">Y&Y Beauty Salon</h2>
                  <p className="text-pink-light">Luxury Nail Care</p>
                </div>

                {/* Preferences */}
                <div className="mb-8">
                  {/* Language Switcher */}
                  <button
                    onClick={toggleLanguage}
                    className="w-full flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-pink-light font-semibold py-3 px-4 rounded-full hover:bg-white/20 transition-all"
                  >
                    <Globe className="w-5 h-5" />
                    <span>{language}</span>
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-4 mb-12">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 10 }}
                      className="block text-pink-light hover:text-pink text-xl font-semibold transition-colors py-2"
                    >
                      {t(link.labelKey)}
                    </motion.a>
                  ))}
                </nav>

                {/* CTA Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={handleBooking}
                    className="w-full bg-gradient-to-r from-pink to-pink-light text-purple-dark font-bold py-4 px-6 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    {t('hero.bookAppointment')}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
