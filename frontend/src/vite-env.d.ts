/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_BUSINESS_PHONE?: string;
  readonly VITE_BUSINESS_PHONE_DISPLAY?: string;
  readonly VITE_BUSINESS_EMAIL?: string;
  readonly VITE_BUSINESS_ADDRESS_LINE1?: string;
  readonly VITE_BUSINESS_ADDRESS_CITY?: string;
  readonly VITE_BUSINESS_ADDRESS_STATE?: string;
  readonly VITE_BUSINESS_ADDRESS_ZIP?: string;
  readonly VITE_BUSINESS_ADDRESS_FULL?: string;
  readonly VITE_BUSINESS_LATITUDE?: string;
  readonly VITE_BUSINESS_LONGITUDE?: string;
  readonly VITE_GOOGLE_MAPS_URL?: string;
  readonly VITE_SOCIAL_INSTAGRAM?: string;
  readonly VITE_SOCIAL_FACEBOOK?: string;
  readonly VITE_HOURS_WEEKDAY?: string;
  readonly VITE_HOURS_SATURDAY?: string;
  readonly VITE_HOURS_SUNDAY?: string;
  readonly VITE_FEATURE_BOOKING?: string;
  readonly VITE_FEATURE_NEWSLETTER?: string;
  readonly VITE_FEATURE_GALLERY_VOTING?: string;
  readonly VITE_MAINTENANCE_MODE?: string;
  readonly VITE_SHOW_BETA_BADGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
