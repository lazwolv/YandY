import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'EN' | 'ES';

interface Translations {
  [key: string]: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
  EN: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.gallery': 'Gallery',
    'nav.team': 'Team',
    'nav.testimonials': 'Testimonials',
    'nav.contact': 'Contact',
    'nav.bookNow': 'Book Now',
    'nav.book': 'Book',
    'nav.login': 'Login',

    // Hero
    'hero.badge': 'Luxury Beauty Experience',
    'hero.title1': 'Your Beauty,',
    'hero.title2': 'Elevated',
    'hero.subtitle': 'Indulge in premium nail care, stunning artistry, and luxurious treatments designed to make you feel absolutely radiant',
    'hero.bookAppointment': 'Book Your Appointment',
    'hero.viewServices': 'View Services',
    'hero.happyClients': '500+ Happy Clients',
    'hero.premiumProducts': 'Premium Products',
    'hero.fiveStarRated': '5-Star Rated',

    // Dashboard
    'dashboard.welcomeBack': 'Welcome back',
    'dashboard.customer.subtitle': 'Manage your appointments, photos, and rewards',
    'dashboard.employee.title': 'Employee Dashboard',
    'dashboard.employee.subtitle': 'Welcome',

    // Common
    'common.phone': '(555) 123-4567',
    'common.luxuryNailCare': 'Luxury Nail Care',
  },
  ES: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.services': 'Servicios',
    'nav.gallery': 'Galería',
    'nav.team': 'Equipo',
    'nav.testimonials': 'Testimonios',
    'nav.contact': 'Contacto',
    'nav.bookNow': 'Reservar',
    'nav.book': 'Reservar',
    'nav.login': 'Ingresar',

    // Hero
    'hero.badge': 'Experiencia de Belleza de Lujo',
    'hero.title1': 'Tu Belleza,',
    'hero.title2': 'Elevada',
    'hero.subtitle': 'Disfruta del cuidado de uñas premium, arte impresionante y tratamientos lujosos diseñados para hacerte sentir absolutamente radiante',
    'hero.bookAppointment': 'Reserva tu Cita',
    'hero.viewServices': 'Ver Servicios',
    'hero.happyClients': 'Más de 500 Clientes Felices',
    'hero.premiumProducts': 'Productos Premium',
    'hero.fiveStarRated': 'Calificación 5 Estrellas',

    // Dashboard
    'dashboard.welcomeBack': 'Bienvenido de nuevo',
    'dashboard.customer.subtitle': 'Gestiona tus citas, fotos y recompensas',
    'dashboard.employee.title': 'Panel de Empleado',
    'dashboard.employee.subtitle': 'Bienvenido',

    // Common
    'common.phone': '(555) 123-4567',
    'common.luxuryNailCare': 'Cuidado de Uñas de Lujo',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('EN');

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang === 'EN' || savedLang === 'ES') {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
