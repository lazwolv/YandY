/**
 * Environment Configuration
 * Centralized access to environment variables
 */

export const env = {
  // API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',

  // Business Info
  business: {
    phone: import.meta.env.VITE_BUSINESS_PHONE || '+17022345489',
    phoneDisplay: import.meta.env.VITE_BUSINESS_PHONE_DISPLAY || '(702) 234-5489',
    email: import.meta.env.VITE_BUSINESS_EMAIL || 'beautysalonyy2019@gmail.com',
    address: {
      line1: import.meta.env.VITE_BUSINESS_ADDRESS_LINE1 || '1820 S Rainbow Blvd',
      city: import.meta.env.VITE_BUSINESS_ADDRESS_CITY || 'Las Vegas',
      state: import.meta.env.VITE_BUSINESS_ADDRESS_STATE || 'NV',
      zip: import.meta.env.VITE_BUSINESS_ADDRESS_ZIP || '89146',
      full: import.meta.env.VITE_BUSINESS_ADDRESS_FULL || '1820 S Rainbow Blvd, Las Vegas, NV 89146',
    },
    location: {
      latitude: parseFloat(import.meta.env.VITE_BUSINESS_LATITUDE || '36.1523'),
      longitude: parseFloat(import.meta.env.VITE_BUSINESS_LONGITUDE || '-115.2437'),
    },
    // Legacy - kept for backwards compatibility
    googleMapsUrl: import.meta.env.VITE_GOOGLE_MAPS_URL || 'https://www.google.com/maps/place/1820+S+Rainbow+Blvd,+Las+Vegas,+NV+89146',
  },

  // Social Media
  social: {
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM || 'https://www.instagram.com/y_ybeautysalon',
    facebook: import.meta.env.VITE_SOCIAL_FACEBOOK || 'https://www.facebook.com/yybeautysalon2019',
  },

  // Business Hours
  hours: {
    weekday: import.meta.env.VITE_HOURS_WEEKDAY || '10:00 AM - 7:00 PM',
    saturday: import.meta.env.VITE_HOURS_SATURDAY || '10:00 AM - 6:00 PM',
    sunday: import.meta.env.VITE_HOURS_SUNDAY || 'Closed',
  },

  // Feature Flags
  features: {
    booking: import.meta.env.VITE_FEATURE_BOOKING === 'true' || true,
    newsletter: import.meta.env.VITE_FEATURE_NEWSLETTER === 'true' || false,
    galleryVoting: import.meta.env.VITE_FEATURE_GALLERY_VOTING === 'true' || false,
  },

  // Maintenance
  maintenanceMode: import.meta.env.VITE_MAINTENANCE_MODE === 'true' || false,
  showBetaBadge: import.meta.env.VITE_SHOW_BETA_BADGE === 'true' || false,
} as const;
