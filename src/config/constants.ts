export const API_CONFIG = {
  // Provided by user
  LOGIN_URL: 'http://snapsaysdotnet.sublimitysoft.com/api/Common/FetchUser',

  // Existing local capture generation API
  CAPTION_GENERATOR_URL: 'http://Snapsaystest.Sublimitysoft.Com/api/generate-caption',

  // Personality Portal (Internal)
  PERSONALITY_PORTAL_ROUTE: '/personality-portal',
  HOME_ROUTE: '/home',

  // New SaveUser API
  SAVE_USER_URL: 'http://snapsaysdotnet.sublimitysoft.com/api/Common/SaveUserDetails',
  // Background Replacement API (Clipdrop)
  CLIPDROP_CONFIG: {
    URL: 'https://clipdrop-api.co/replace-background/v1',
    API_KEY: '89cd99bb4eeb3fcfe1b6eecab18674036e0be7979222c09072f3642d7c6d2b6e41a157bf7eb9e07fe02161186a5381b7', // TODO: Replace with actual Clipdrop API Key
  },
  SUMMARIZE_PERSONALITY_URL: 'http://Snapsaystest.Sublimitysoft.Com/api/summarize-personality',
};
