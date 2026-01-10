export const API_CONFIG = {
  // Provided by user
  LOGIN_URL: 'http://fapindetails.sublimitysoft.com/api/api//Common/FetchUser',

  // Existing local capture generation API
  CAPTION_GENERATOR_URL: 'http://192.168.1.56:5000/api/generate-caption',

  // Personality Portal (Internal)
  PERSONALITY_PORTAL_ROUTE: '/personality-portal',
  HOME_ROUTE: '/',

  // New SaveUser API
  SAVE_USER_URL: 'http://fapindetails.sublimitysoft.com/api/api//Common/SaveUser',
  // Remove Background API
  // REMOVE_BG_URL: DEPRECATED - now using Client-side Gemini SDK
};
