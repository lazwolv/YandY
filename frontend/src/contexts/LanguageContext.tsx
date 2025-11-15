import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'EN' | 'ES';

interface Translations {
  [key: string]: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  changeLanguage: (lang: string) => void; // Accepts lowercase 'en' or 'es'
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
    'nav.logout': 'Logout',
    'nav.dashboard': 'Dashboard',
    'nav.myProfile': 'My Profile',

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

    // Services
    'services.badge': 'Our Services',
    'services.title': 'Luxury Beauty Treatments',
    'services.subtitle': 'From classic elegance to bold statements, our expert team delivers perfection in every detail',
    'services.luxuryManicure': 'Luxury Manicure',
    'services.luxuryManicure.desc': 'Premium nail care with gel polish, nail art, and hand massage',
    'services.deluxePedicure': 'Deluxe Pedicure',
    'services.deluxePedicure.desc': 'Rejuvenating foot treatment with exfoliation and massage',
    'services.nailArt': 'Nail Art Design',
    'services.nailArt.desc': 'Custom designs from elegant to bold, crafted by expert artists',
    'services.acrylicGel': 'Acrylic & Gel',
    'services.acrylicGel.desc': 'Long-lasting extensions with natural look and strength',
    'services.waxing': 'Waxing Services',
    'services.waxing.desc': 'Professional hair removal for smooth, beautiful skin',
    'services.spaPackages': 'Spa Packages',
    'services.spaPackages.desc': 'Complete beauty experience with combined treatments',
    'services.from': 'From',
    'services.gelPolish': 'Gel Polish',
    'services.nailArtFeature': 'Nail Art',
    'services.handMassage': 'Hand Massage',
    'services.footSoak': 'Foot Soak',
    'services.exfoliation': 'Exfoliation',
    'services.massage': 'Massage',
    'services.customDesigns': 'Custom Designs',
    'services.3dArt': '3D Art',
    'services.ombre': 'Ombre',
    'services.extensions': 'Extensions',
    'services.refills': 'Refills',
    'services.sculpting': 'Sculpting',
    'services.bodyWax': 'Body Wax',
    'services.facialWax': 'Facial Wax',
    'services.gentleCare': 'Gentle Care',
    'services.fullService': 'Full Service',
    'services.relaxation': 'Relaxation',
    'services.vipTreatment': 'VIP Treatment',
    'services.learnMore': 'Learn More',
    'services.walkInsWelcome': 'Walk-ins welcome • Appointments recommended',
    'services.viewFullMenu': 'View Full Service Menu',

    // Gallery
    'gallery.badge': 'Our Work',
    'gallery.title': 'Stunning Results',
    'gallery.subtitle': 'Browse our collection of beautiful nail art and happy clients',
    'gallery.filter.all': 'All',
    'gallery.filter.allWork': 'All Work',
    'gallery.filter.nailArt': 'Nail Art',
    'gallery.filter.ourSalon': 'Our Salon',
    'gallery.filter.classic': 'Classic',
    'gallery.filter.artistic': 'Artistic',
    'gallery.filter.luxury': 'Luxury',
    'gallery.viewMore': 'View More',
    'gallery.viewInstagram': 'View Full Portfolio on Instagram',
    'gallery.portfolio': 'Portfolio',
    'gallery.beautifulWork': 'Our Beautiful Work',
    'gallery.subtitle2': 'Discover stunning nail art and our luxurious salon environment',

    // Team
    'team.badge': 'Meet Our Team',
    'team.title': 'Expert Beauty Artists',
    'team.subtitle': 'Our talented team of certified professionals is dedicated to bringing your vision to life',
    'team.yearsExp': 'Years Experience',
    'team.bookWith': 'Book with',

    // Why Choose Us
    'why.title': 'Why Choose Y&Y Beauty Salon?',
    'why.expertTechnicians': 'Expert Technicians',
    'why.expertTechnicians.desc': 'Certified professionals with years of experience',
    'why.premiumProducts': 'Premium Products',
    'why.premiumProducts.desc': 'Only the highest quality brands and materials',
    'why.hygiene': 'Impeccable Hygiene',
    'why.hygiene.desc': 'Sterilized tools and sanitized stations every time',
    'why.customDesigns': 'Custom Designs',
    'why.customDesigns.desc': 'Unique nail art tailored to your style',
    'why.relaxing': 'Relaxing Atmosphere',
    'why.relaxing.desc': 'Modern, luxurious space for your comfort',
    'why.flexible': 'Flexible Hours',
    'why.flexible.desc': 'Open 7 days a week to fit your schedule',

    // Testimonials
    'testimonials.badge': 'Testimonials',
    'testimonials.title': 'What Our Clients Say',
    'testimonials.subtitle': 'Join hundreds of satisfied clients who trust us with their beauty needs',

    // Booking CTA
    'bookingCTA.ready': 'Ready to Transform Your Look?',
    'bookingCTA.desc': 'Book your appointment today and experience the luxury you deserve',
    'bookingCTA.button': 'Book Your Appointment',
    'bookingCTA.or': 'or',
    'bookingCTA.callUs': 'Call Us',

    // Footer
    'footer.about': 'About Y&Y Salon',
    'footer.aboutDesc': 'Premium nail salon offering luxury manicures, pedicures, nail art, and spa services in Las Vegas',
    'footer.quickLinks': 'Quick Links',
    'footer.ourServices': 'Our Services',
    'footer.bookAppointment': 'Book Appointment',
    'footer.viewGallery': 'View Gallery',
    'footer.contactUs': 'Contact Us',
    'footer.followUs': 'Follow Us',
    'footer.hours': 'Opening Hours',
    'footer.monday': 'Monday',
    'footer.tuesday': 'Tuesday',
    'footer.wednesday': 'Wednesday',
    'footer.thursday': 'Thursday',
    'footer.friday': 'Friday',
    'footer.saturday': 'Saturday',
    'footer.sunday': 'Sunday',
    'footer.closed': 'Closed',
    'footer.rights': 'All rights reserved',

    // Booking Page - Authentication
    'booking.pleaseLogin': 'Please Login',
    'booking.loginRequired': 'You need to be logged in to book an appointment',
    'booking.goToLogin': 'Go to Login',

    // Booking Page - Header
    'booking.title': 'Book Your Appointment',
    'booking.hiUser': 'Hi {name}, let\'s find the perfect time for you',

    // Booking Page - Progress Steps
    'booking.step.employee': 'Nail tech',
    'booking.step.services': 'Services',
    'booking.step.time': 'Time',

    // Booking Page - Step 1 (Team Member)
    'booking.step1.title': 'Step 1: Choose Your Nail Technician',
    'booking.loadingTeamMembers': 'Loading team members...',
    'booking.noTeamMembers': 'No team members available at this time. Please try again later.',

    // Booking Page - Step 2 (Services)
    'booking.step2.title': 'Step 2: Select Services',
    'booking.servicesSelected': '({count} selected)',
    'booking.loadingServices': 'Loading services...',
    'booking.noServices': 'No services available at this time. Please try again later.',
    'booking.minutes': 'minutes',
    'booking.min': 'min',

    // Booking Page - Step 3 (Time Slots)
    'booking.step3.title': 'Step 3: Select Time Slot',
    'booking.lookingForSlots': 'Looking for {duration}-minute slots',
    'booking.withEmployee': 'with {name}',
    'booking.onDate': 'on {date}',
    'booking.filterByDate': 'Filter by Date (optional)',
    'booking.showAllDates': 'Show All Dates',
    'booking.showingAllSlots': 'Showing all available slots for the next 7 days',
    'booking.findingSlots': 'Finding available slots...',
    'booking.checkingDate': 'Checking this date',
    'booking.checkingDays': 'Checking the next 7 days',
    'booking.noSlotsAvailable': 'No slots available',
    'booking.noSlotsOnDay': 'No {duration}-minute slots available on this day. Try selecting a different date.',
    'booking.noSlotsNext7Days': 'No {duration}-minute slots available in the next 7 days. Try selecting different services or check back later.',
    'booking.slotCount': '({count} slot)',
    'booking.slotCountPlural': '({count} slots)',
    'booking.to': 'to',

    // Booking Page - Date Formatting
    'booking.date.today': 'Today',
    'booking.date.tomorrow': 'Tomorrow',

    // Booking Page - Additional Notes
    'booking.additionalNotes': 'Additional Notes (optional)',

    // Booking Page - Submit
    'booking.creatingAppointment': 'Creating Appointment...',
    'booking.bookServices': 'Book {count} Service with {name}',
    'booking.bookServicesPlural': 'Book {count} Services with {name}',
    'booking.smsConfirmation': '* You\'ll receive an SMS confirmation once your appointment is confirmed',

    // Booking Page - Errors
    'booking.error.selectTeamMember': 'Please select a team member',
    'booking.error.selectService': 'Please select at least one service',
    'booking.error.selectTimeSlot': 'Please select a time slot',
    'booking.error.mustBeLoggedIn': 'You must be logged in to book an appointment',

    // Booking Page - Legacy (kept for compatibility)
    'booking.selectService': 'Select Service(s)',
    'booking.selectMultiple': 'Select one or more services',
    'booking.selectDate': 'Select Date',
    'booking.selectTime': 'Select Time',
    'booking.chooseTime': 'Choose your preferred time slot',
    'booking.notes': 'Special Notes',
    'booking.notesPlaceholder': 'Any special requests or preferences...',
    'booking.totalDuration': 'Total Duration',
    'booking.totalPrice': 'Total Price',
    'booking.confirmBooking': 'Confirm Booking',
    'booking.bookingSuccess': 'Booking confirmed successfully!',
    'booking.bookingError': 'Failed to create booking. Please try again.',

    // Auth
    'auth.login': 'Login',
    'auth.register': 'Create Account',
    'auth.phone': 'Phone Number',
    'auth.phonePlaceholder': '(555) 555-5555',
    'auth.password': 'Password',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.fullNamePlaceholder': 'John Doe',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.noAccount': "Don't have an account?",
    'auth.haveAccount': 'Already have an account?',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember Me',

    // Dashboard
    'dashboard.welcomeBack': 'Welcome back',
    'dashboard.customer.subtitle': 'Manage your appointments, photos, and rewards',
    'dashboard.employee.title': 'Employee Dashboard',
    'dashboard.employee.subtitle': 'Welcome',
    'dashboard.upcomingAppointments': 'Upcoming Appointments',
    'dashboard.pastAppointments': 'Past Appointments',
    'dashboard.noAppointments': 'No appointments found',
    'dashboard.bookNow': 'Book Now',
    'dashboard.viewDetails': 'View Details',
    'dashboard.cancel': 'Cancel',
    'dashboard.reschedule': 'Reschedule',

    // Common
    'common.phone': '(702) 234-5489',
    'common.luxuryNailCare': 'Luxury Nail Care',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.submit': 'Submit',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.error': 'Error',
    'common.success': 'Success',
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
    'nav.logout': 'Cerrar Sesión',
    'nav.dashboard': 'Panel',
    'nav.myProfile': 'Mi Perfil',

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

    // Services
    'services.badge': 'Nuestros Servicios',
    'services.title': 'Tratamientos de Belleza de Lujo',
    'services.subtitle': 'Desde la elegancia clásica hasta declaraciones audaces, nuestro equipo experto ofrece perfección en cada detalle',
    'services.luxuryManicure': 'Manicura de Lujo',
    'services.luxuryManicure.desc': 'Cuidado de uñas premium con esmalte en gel, nail art y masaje de manos',
    'services.deluxePedicure': 'Pedicura de Lujo',
    'services.deluxePedicure.desc': 'Tratamiento rejuvenecedor de pies con exfoliación y masaje',
    'services.nailArt': 'Diseño de Uñas',
    'services.nailArt.desc': 'Diseños personalizados desde elegantes hasta audaces, creados por artistas expertos',
    'services.acrylicGel': 'Acrílico y Gel',
    'services.acrylicGel.desc': 'Extensiones duraderas con apariencia natural y fuerza',
    'services.waxing': 'Servicios de Depilación',
    'services.waxing.desc': 'Depilación profesional para una piel suave y hermosa',
    'services.spaPackages': 'Paquetes de Spa',
    'services.spaPackages.desc': 'Experiencia de belleza completa con tratamientos combinados',
    'services.from': 'Desde',
    'services.gelPolish': 'Esmalte en Gel',
    'services.nailArtFeature': 'Arte de Uñas',
    'services.handMassage': 'Masaje de Manos',
    'services.footSoak': 'Baño de Pies',
    'services.exfoliation': 'Exfoliación',
    'services.massage': 'Masaje',
    'services.customDesigns': 'Diseños Personalizados',
    'services.3dArt': 'Arte 3D',
    'services.ombre': 'Ombre',
    'services.extensions': 'Extensiones',
    'services.refills': 'Rellenos',
    'services.sculpting': 'Esculpido',
    'services.bodyWax': 'Depilación Corporal',
    'services.facialWax': 'Depilación Facial',
    'services.gentleCare': 'Cuidado Suave',
    'services.fullService': 'Servicio Completo',
    'services.relaxation': 'Relajación',
    'services.vipTreatment': 'Tratamiento VIP',
    'services.learnMore': 'Saber Más',
    'services.walkInsWelcome': 'Sin cita previa bienvenidos • Citas recomendadas',
    'services.viewFullMenu': 'Ver Menú Completo de Servicios',

    // Gallery
    'gallery.badge': 'Nuestro Trabajo',
    'gallery.title': 'Resultados Impresionantes',
    'gallery.subtitle': 'Explora nuestra colección de arte de uñas hermoso y clientes felices',
    'gallery.filter.all': 'Todos',
    'gallery.filter.allWork': 'Todo el Trabajo',
    'gallery.filter.nailArt': 'Arte de Uñas',
    'gallery.filter.ourSalon': 'Nuestro Salón',
    'gallery.filter.classic': 'Clásico',
    'gallery.filter.artistic': 'Artístico',
    'gallery.filter.luxury': 'Lujo',
    'gallery.viewMore': 'Ver Más',
    'gallery.viewInstagram': 'Ver Portafolio Completo en Instagram',
    'gallery.portfolio': 'Portafolio',
    'gallery.beautifulWork': 'Nuestro Hermoso Trabajo',
    'gallery.subtitle2': 'Descubre arte de uñas impresionante y nuestro lujoso ambiente de salón',

    // Team
    'team.badge': 'Conoce a Nuestro Equipo',
    'team.title': 'Artistas de Belleza Expertos',
    'team.subtitle': 'Nuestro talentoso equipo de profesionales certificados se dedica a dar vida a tu visión',
    'team.yearsExp': 'Años de Experiencia',
    'team.bookWith': 'Reservar con',

    // Why Choose Us
    'why.title': '¿Por Qué Elegir Y&Y Beauty Salon?',
    'why.expertTechnicians': 'Técnicos Expertos',
    'why.expertTechnicians.desc': 'Profesionales certificados con años de experiencia',
    'why.premiumProducts': 'Productos Premium',
    'why.premiumProducts.desc': 'Solo las marcas y materiales de la más alta calidad',
    'why.hygiene': 'Higiene Impecable',
    'why.hygiene.desc': 'Herramientas esterilizadas y estaciones sanitizadas siempre',
    'why.customDesigns': 'Diseños Personalizados',
    'why.customDesigns.desc': 'Arte de uñas único adaptado a tu estilo',
    'why.relaxing': 'Ambiente Relajante',
    'why.relaxing.desc': 'Espacio moderno y lujoso para tu comodidad',
    'why.flexible': 'Horario Flexible',
    'why.flexible.desc': 'Abierto 7 días a la semana para adaptarnos a tu horario',

    // Testimonials
    'testimonials.badge': 'Testimonios',
    'testimonials.title': 'Lo Que Dicen Nuestros Clientes',
    'testimonials.subtitle': 'Únete a cientos de clientes satisfechos que confían en nosotros para sus necesidades de belleza',

    // Booking CTA
    'bookingCTA.ready': '¿Lista para Transformar tu Apariencia?',
    'bookingCTA.desc': 'Reserva tu cita hoy y experimenta el lujo que mereces',
    'bookingCTA.button': 'Reserva tu Cita',
    'bookingCTA.or': 'o',
    'bookingCTA.callUs': 'Llámanos',

    // Footer
    'footer.about': 'Acerca de Y&Y Salon',
    'footer.aboutDesc': 'Salón de uñas premium que ofrece manicuras de lujo, pedicuras, arte de uñas y servicios de spa en Las Vegas',
    'footer.quickLinks': 'Enlaces Rápidos',
    'footer.ourServices': 'Nuestros Servicios',
    'footer.bookAppointment': 'Reservar Cita',
    'footer.viewGallery': 'Ver Galería',
    'footer.contactUs': 'Contáctanos',
    'footer.followUs': 'Síguenos',
    'footer.hours': 'Horario de Apertura',
    'footer.monday': 'Lunes',
    'footer.tuesday': 'Martes',
    'footer.wednesday': 'Miércoles',
    'footer.thursday': 'Jueves',
    'footer.friday': 'Viernes',
    'footer.saturday': 'Sábado',
    'footer.sunday': 'Domingo',
    'footer.closed': 'Cerrado',
    'footer.rights': 'Todos los derechos reservados',

    // Booking Page - Authentication
    'booking.pleaseLogin': 'Por favor, ingrese a su cuenta',
    'booking.loginRequired': 'Necesita entrar a su cuenta para sacar una cita',
    'booking.goToLogin': 'Ir a mi perfil',

    // Booking Page - Header
    'booking.title': 'Reserva tu Cita',
    'booking.hiUser': 'Hola {name}, busquemos el tiempo perfecto para ti',

    // Booking Page - Progress Steps
    'booking.step.employee': 'Técnica de uñas',
    'booking.step.services': 'Servicios',
    'booking.step.time': 'Tiempo',

    // Booking Page - Step 1 (Team Member)
    'booking.step1.title': 'Paso 1: Elija su técnica de uñas',
    'booking.loadingTeamMembers': 'Cargando miembros del equipo...',
    'booking.noTeamMembers': 'No hay miembros del equipo disponibles en este momento. Por favor, intente de nuevo más tarde.',

    // Booking Page - Step 2 (Services)
    'booking.step2.title': 'Paso 2: Seleccione Servicios',
    'booking.servicesSelected': '({count} seleccionados)',
    'booking.loadingServices': 'Cargando servicios...',
    'booking.noServices': 'No hay servicios disponibles en este momento. Por favor, intente de nuevo más tarde.',
    'booking.minutes': 'minutos',
    'booking.min': 'min',

    // Booking Page - Step 3 (Time Slots)
    'booking.step3.title': 'Paso 3: Seleccione Hora',
    'booking.lookingForSlots': 'Buscando espacios de {duration}-minutos',
    'booking.withEmployee': 'con {name}',
    'booking.onDate': 'el {date}',
    'booking.filterByDate': 'Filtrar por fecha (optional)',
    'booking.showAllDates': 'Mostrar Todas las Fechas',
    'booking.showingAllSlots': 'Mostrando todas las fechas disponibles por los próximos 7 días.',
    'booking.findingSlots': 'Buscando espacios disponibles...',
    'booking.checkingDate': 'Chequeando esta fecha',
    'booking.checkingDays': 'Chequeando los próximos 7 días',
    'booking.noSlotsAvailable': 'No hay espacios disponibles',
    'booking.noSlotsOnDay': 'No hay espacios de {duration}-minutos disponibles este día. Intente una fecha diferente.',
    'booking.noSlotsNext7Days': 'No hay espacios de {duration}-minutos disponibles por los próximos 7 días. Inténtelo de nuevo más tarde.',
    'booking.slotCount': '({count} espacio)',
    'booking.slotCountPlural': '({count} espacios)',
    'booking.to': 'a',

    // Booking Page - Date Formatting
    'booking.date.today': 'Hoy',
    'booking.date.tomorrow': 'Mañana',

    // Booking Page - Additional Notes
    'booking.additionalNotes': 'Notas adicionales (opcional)',

    // Booking Page - Submit
    'booking.creatingAppointment': 'Creando Cita...',
    'booking.bookServices': 'Reservar {count} Servicio con {name}',
    'booking.bookServicesPlural': 'Reservar {count} Servicios con {name}',
    'booking.smsConfirmation': '* Recibirá una confirmacion via texto una vez su cita sea confirmada',

    // Booking Page - Errors
    'booking.error.selectTeamMember': 'Por favor seleccione un miembro del equipo',
    'booking.error.selectService': 'Por favor seleccione al menos un servicio',
    'booking.error.selectTimeSlot': 'Por favor seleccione un horario',
    'booking.error.mustBeLoggedIn': 'Necesita ingresar a su cuenta para reservar una cita',


    // Booking Page - Legacy (kept for compatibility)
    'booking.selectService': 'Seleccionar Servicio(s)',
    'booking.selectMultiple': 'Selecciona uno o más servicios',
    'booking.selectDate': 'Seleccionar Fecha',
    'booking.selectTime': 'Seleccionar Hora',
    'booking.chooseTime': 'Elige tu hora preferida',
    'booking.notes': 'Notas Especiales',
    'booking.notesPlaceholder': '¿Alguna solicitud especial o preferencia?',
    'booking.totalDuration': 'Duración Total',
    'booking.totalPrice': 'Precio Total',
    'booking.confirmBooking': 'Confirmar Reserva',
    'booking.bookingSuccess': '¡Reserva confirmada exitosamente!',
    'booking.bookingError': 'Error al crear la reserva. Por favor intenta nuevamente.',

    // Auth
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Crear Cuenta',
    'auth.phone': 'Número de Teléfono',
    'auth.phonePlaceholder': '(555) 555-5555',
    'auth.password': 'Contraseña',
    'auth.passwordPlaceholder': 'Ingresa tu contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.fullName': 'Nombre Completo',
    'auth.fullNamePlaceholder': 'Juan Pérez',
    'auth.signIn': 'Iniciar Sesión',
    'auth.signUp': 'Registrarse',
    'auth.noAccount': '¿No tienes una cuenta?',
    'auth.haveAccount': '¿Ya tienes una cuenta?',
    'auth.forgotPassword': '¿Olvidaste tu Contraseña?',
    'auth.rememberMe': 'Recuérdame',

    // Dashboard
    'dashboard.welcomeBack': 'Bienvenido de nuevo',
    'dashboard.customer.subtitle': 'Gestiona tus citas, fotos y recompensas',
    'dashboard.employee.title': 'Panel de Empleado',
    'dashboard.employee.subtitle': 'Bienvenido',
    'dashboard.upcomingAppointments': 'Próximas Citas',
    'dashboard.pastAppointments': 'Citas Pasadas',
    'dashboard.noAppointments': 'No se encontraron citas',
    'dashboard.bookNow': 'Reservar Ahora',
    'dashboard.viewDetails': 'Ver Detalles',
    'dashboard.cancel': 'Cancelar',
    'dashboard.reschedule': 'Reprogramar',

    // Common
    'common.phone': '(702) 234-5489',
    'common.luxuryNailCare': 'Cuidado de Uñas de Lujo',
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.close': 'Cerrar',
    'common.submit': 'Enviar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.error': 'Error',
    'common.success': 'Éxito',
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

  // Helper to convert lowercase API format to uppercase internal format
  const changeLanguage = (lang: string) => {
    const upperLang = lang.toUpperCase() as Language;
    if (upperLang === 'EN' || upperLang === 'ES') {
      setLanguage(upperLang);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, changeLanguage, t }}>
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
