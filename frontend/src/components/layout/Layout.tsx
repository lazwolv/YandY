import { Globe, LogOut, Sparkles, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 text-primary-600">
              <Sparkles className="w-8 h-8" />
              <span className="text-xl font-bold">Y&Y Beauty Salon</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
                {t('nav.home')}
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-primary-600 transition">
                {t('nav.services')}
              </Link>
              <Link to="/team" className="text-gray-700 hover:text-primary-600 transition">
                {t('nav.team')}
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                    {t('nav.dashboard')}
                  </Link>
                  <div className="flex items-center space-x-4">
                    <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                      <User className="w-4 h-4" />
                      <span>{user?.fullName}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-primary-600 transition">
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    {t('nav.register')}
                  </Link>
                </>
              )}

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                title={i18n.language === 'es' ? 'Español' : 'English'}
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase text-sm font-medium">{i18n.language}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6" />
                <span className="text-lg font-bold">Y&Y Beauty Salon</span>
              </div>
              <p className="text-gray-400">
                {t('home.heroSubtitle')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('common.services')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>{t('services.manicure')}</li>
                <li>{t('services.pedicure')}</li>
                <li>{t('services.facial')}</li>
                <li>{t('services.waxing')}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('common.contact')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>+1 (702) 234-5489</li>
                <li>beautysalonyy2019@gmail.com</li>
                <li>1820 S Rainbow Blvd</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2025 Y&Y Beauty Salon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
