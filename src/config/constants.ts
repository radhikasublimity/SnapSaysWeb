export const API_CONFIG = {
  // Provided by user
  LOGIN_URL: 'http://fapindetails.sublimitysoft.com/api/api//Common/FetchUser',

  // Existing local capture generation API
  CAPTION_GENERATOR_URL: 'http://192.168.0.123:5000/api/generate-caption',

  // Personality Portal (Internal)
  PERSONALITY_PORTAL_ROUTE: '/personality-portal',
  HOME_ROUTE: '/',

  // New SaveUser API
  SAVE_USER_URL: 'http://fapindetails.sublimitysoft.com/api/api//Common/SaveUser',
  // Background Replacement API (Clipdrop)
  CLIPDROP_CONFIG: {
    URL: 'https://clipdrop-api.co/replace-background/v1',
    API_KEY: '89cd99bb4eeb3fcfe1b6eecab18674036e0be7979222c09072f3642d7c6d2b6e41a157bf7eb9e07fe02161186a5381b7', // TODO: Replace with actual Clipdrop API Key
  },
};
