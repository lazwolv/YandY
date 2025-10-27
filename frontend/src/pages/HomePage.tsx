import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Award, Clock, Sparkles } from 'lucide-react';

export const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">{t('home.heroTitle')}</h1>
            <p className="text-xl mb-8 text-primary-50">{t('home.heroSubtitle')}</p>
            <div className="flex space-x-4">
              <Link to="/book" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
                {t('home.bookNow')}
              </Link>
              <Link to="/services" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg">
                {t('home.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.whyChooseUs')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary-100 p-4 rounded-full">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.feature1Title')}</h3>
              <p className="text-gray-600">{t('home.feature1Desc')}</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary-100 p-4 rounded-full">
                  <Award className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.feature2Title')}</h3>
              <p className="text-gray-600">{t('home.feature2Desc')}</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary-100 p-4 rounded-full">
                  <Sparkles className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.feature3Title')}</h3>
              <p className="text-gray-600">{t('home.feature3Desc')}</p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary-100 p-4 rounded-full">
                  <Clock className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.feature4Title')}</h3>
              <p className="text-gray-600">{t('home.feature4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">{t('home.heroTitle')}</h2>
          <p className="text-xl text-gray-600 mb-8">{t('home.heroSubtitle')}</p>
          <Link to="/register" className="btn btn-primary px-8 py-3 text-lg">
            {t('nav.register')}
          </Link>
        </div>
      </section>
    </div>
  );
};
