import { PageData } from '../types/types';

export const PAGES: PageData[] = [
  {
    pageNumber: 1,
    helperText: "Let's start with your social style ✨",
    questions: [
      {
        id: 'comfortZone',
        question: 'When do you feel most comfortable?',
        field: 'comfortZone',
        options: [
          { value: 'alone', label: 'Being alone' },
          { value: 'small_group', label: 'With a small group' },
          { value: 'large_groups', label: 'In large groups or crowds' },
          { value: 'depends', label: 'Depends on the situation' },
        ],
      },
      {
        id: 'socialApproach',
        question: 'When you meet new people or visit a new place, you usually:',
        field: 'socialApproach',
        options: [
          { value: 'observe', label: 'Observe first' },
          { value: 'take_time', label: 'Take time to open up' },
          { value: 'start_conversations', label: 'Start conversations easily' },
          { value: 'depends_mood', label: 'It depends on my mood' },
        ],
      },
    ],
  },
  {
    pageNumber: 2,
    helperText: 'Tell us about your preferences 🍕',
    questions: [
      {
        id: 'freeTime',
        question: 'How do you prefer to spend your free time? (Multi-select)',
        field: 'freeTime',
        multiple: true,
        options: [
          { value: 'relaxing', label: 'Relaxing at home' },
          { value: 'traveling', label: 'Going out / traveling' },
          { value: 'friends', label: 'Spending time with friends' },
          { value: 'movies', label: 'Watching movies or series' },
          { value: 'learning', label: 'Learning something new' },
        ],
      },
      {
        id: 'foodPreference',
        question: 'What type of food do you usually enjoy the most?',
        field: 'foodPreference',
        options: [
          { value: 'home_style', label: 'Home-style / traditional food' },
          { value: 'street_food', label: 'Street food' },
          { value: 'healthy', label: 'Healthy / diet food' },
          { value: 'fast_food', label: 'Fast food' },
          { value: 'all_kinds', label: 'I enjoy all kinds of food' },
        ],
      },
    ],
  },
  {
    pageNumber: 3,
    helperText: 'Your vibe and travel style 🏔️',
    questions: [
      {
        id: 'favoritePlaces',
        question: 'What kind of places do you enjoy visiting the most? (Multi-select)',
        field: 'favoritePlaces',
        multiple: true,
        options: [
          { value: 'beaches', label: 'Beaches / seaside places' },
          { value: 'mountains', label: 'Mountains / hill stations' },
          { value: 'nightlife', label: 'Cities & nightlife' },
          { value: 'historical', label: 'Historical or cultural places' },
          { value: 'nature', label: 'Nature & peaceful locations' },
          { value: 'no_travel', label: 'I’m not much into traveling' },
        ],
      },
      {
        id: 'personalityType',
        question: 'How would you describe your personality?',
        field: 'personalityType',
        options: [
          { value: 'calm', label: 'Calm and peaceful' },
          { value: 'fun_loving', label: 'Fun-loving and energetic' },
          { value: 'serious', label: 'Serious and focused' },
          { value: 'emotional', label: 'Emotional and sensitive' },
          { value: 'mix', label: 'A mix of everything' },
        ],
      },
    ],
  },
  {
    pageNumber: 4,
    helperText: 'Handling life and routines 🧘',
    questions: [
      {
        id: 'stressManagement',
        question: 'When you feel stressed, what do you usually do?',
        field: 'stressManagement',
        options: [
          { value: 'alone', label: 'Spend time alone' },
          { value: 'talk', label: 'Talk to someone' },
          { value: 'music_movies', label: 'Listen to music / watch something' },
          { value: 'exercise', label: 'Exercise or go for a walk' },
          { value: 'ignore', label: 'Ignore it and move on' },
        ],
      },
      {
        id: 'routinePreference',
        question: 'How do you feel about routines?',
        field: 'routinePreference',
        options: [
          { value: 'fixed', label: 'I prefer a fixed routine' },
          { value: 'balance', label: 'I like a balance of routine and freedom' },
          { value: 'dislike', label: 'I dislike routines' },
          { value: 'mood', label: 'Depends on my mood' },
        ],
      },
    ],
  },
  {
    pageNumber: 5,
    helperText: 'Deep dive into you 🔍',
    questions: [
      {
        id: 'peopleConnection',
        question: 'What kind of people do you connect with most?',
        field: 'peopleConnection',
        options: [
          { value: 'mature', label: 'Calm and mature' },
          { value: 'energetic', label: 'Fun and energetic' },
          { value: 'thinkers', label: 'Intelligent and deep thinkers' },
          { value: 'simple', label: 'Honest and simple' },
          { value: 'adjust', label: 'I can adjust with anyone' },
        ],
      },
      {
        id: 'selfPerception',
        question: 'How do you see yourself?',
        field: 'selfPerception',
        options: [
          { value: 'introvert', label: 'Introvert' },
          { value: 'extrovert', label: 'Extrovert' },
          { value: 'ambivert', label: 'Ambivert' },
          { value: 'unknown', label: 'I’ve never really thought about it' },
        ],
      },
    ],
  },
];
