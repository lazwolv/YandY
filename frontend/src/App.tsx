import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import HeroNew from './components/HeroNew';
import ServicesNew from './components/ServicesNew';
import WhyChooseUs from './components/WhyChooseUs';
import GalleryNew from './components/GalleryNew';
import TeamPreview from './components/TeamPreview';
import Testimonials from './components/Testimonials';
import BookingCTA from './components/BookingCTA';
import Footer from './components/Footer';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BookingPage } from './pages/BookingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PhotoUploadPage } from './pages/PhotoUploadPage';
import { ProtectedRoute } from './components/ProtectedRoute';

// Home page component with all sections
const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <section id="home">
        <HeroNew />
      </section>

      {/* Services Section */}
      <section id="services">
        <ServicesNew />
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Gallery Section */}
      <section id="gallery">
        <GalleryNew />
      </section>

      {/* Team Section */}
      <section id="team">
        <TeamPreview />
      </section>

      {/* Testimonials Section */}
      <section id="testimonials">
        <Testimonials />
      </section>

      {/* Booking CTA Section */}
      <section id="contact">
        <BookingCTA />
      </section>
    </main>
  );
};

function App() {
  const location = useLocation();

  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Scroll to top on route change (instant, not smooth)
  useEffect(() => {
    // Temporarily disable smooth scrolling for route changes
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Re-enable smooth scrolling after a brief delay
    const timer = setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-photo"
            element={
              <ProtectedRoute>
                <PhotoUploadPage />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
