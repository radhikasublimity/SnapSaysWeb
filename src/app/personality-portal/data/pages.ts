import { PageData } from '../types/types';

export const PAGES: PageData[] = [
  {
    pageNumber: 1,
    helperText: "Let's get to know you ✨",
    questions: [
      {
        id: 'vibe',
        question: 'Which vibe feels most like you?',
        field: 'vibe',
        options: [
          { value: 'chill_minimal', label: 'Chill & minimal' },
          { value: 'funny_sarcastic', label: 'Funny / sarcastic' },
          { value: 'deep_thoughtful', label: 'Deep & thoughtful' },
          { value: 'bold_confident', label: 'Bold & confident' },
          { value: 'soft_aesthetic', label: 'Soft & aesthetic' },
          { value: 'chaotic_unfiltered', label: 'Chaotic / unfiltered' },
        ],
      },
      {
        id: 'humorLevel',
        question: 'How much humor do you want in your captions?',
        field: 'humorLevel',
        options: [
          { value: 'none_serious', label: 'None — keep it serious' },
          { value: 'light_clever', label: 'Light and clever' },
          { value: 'sarcastic_witty', label: 'Sarcastic / witty' },
          { value: 'unhinged_2am', label: 'Unhinged (I post at 2 AM)' },
        ],
      },
    ],
  },
  {
    pageNumber: 2,
    helperText: 'How do you express yourself? 💭',
    questions: [
      {
        id: 'emojiUsage',
        question: 'How do you feel about emojis in captions?',
        field: 'emojiUsage',
        options: [
          { value: 'no_emojis', label: 'No emojis at all' },
          { value: 'one_two_max', label: 'One or two, max' },
          { value: 'part_of_sentence', label: 'Emojis are part of the sentence' },
          { value: 'caption_is_emojis', label: 'The caption is emojis' },
        ],
      },
      {
        id: 'captionLength',
        question: 'What kind of captions do you usually post?',
        field: 'captionLength',
        options: [
          { value: 'one_liner', label: 'One-liner' },
          { value: 'short_meaningful', label: 'Short but meaningful (1–2 lines)' },
          { value: 'medium_storytelling', label: 'Medium storytelling' },
          { value: 'long_pretend_read', label: 'Long captions people pretend to read' },
        ],
      },
    ],
  },
  {
    pageNumber: 3,
    helperText: "What's your posting personality? 🎭",
    questions: [
      {
        id: 'persona',
        question: 'Your captions usually make you look…',
        field: 'persona',
        options: [
          { value: 'mysterious', label: 'Mysterious' },
          { value: 'confident', label: 'Confident' },
          { value: 'relatable', label: 'Relatable' },
          { value: 'funny', label: 'Funny' },
          { value: 'calm', label: 'Calm' },
          { value: 'unbothered', label: 'Unbothered™' },
        ],
      },
      {
        id: 'postGoal',
        question: 'What do you usually want from a post?',
        field: 'postGoal',
        options: [
          { value: 'just_vibes', label: 'Just vibes' },
          { value: 'likes_engagement', label: 'Likes & engagement' },
          { value: 'express_myself', label: 'Express myself' },
          { value: 'make_laugh', label: 'Make people laugh' },
          { value: 'flex', label: 'Flex (politely or not)' },
        ],
      },
    ],
  },
  {
    pageNumber: 4,
    helperText: "Let's dial in your tone 🎚️",
    questions: [
      {
        id: 'captionPriority',
        question: 'Which matters more in a caption?',
        field: 'captionPriority',
        options: [
          { value: 'relatable_thoughts', label: 'Relatable thoughts' },
          { value: 'pure_aesthetics', label: 'Pure aesthetics' },
          { value: 'mix_both', label: 'A mix of both' },
        ],
      },
      {
        id: 'onlineLevel',
        question: "How 'online' should your captions feel?",
        field: 'onlineLevel',
        options: [
          { value: 'not_at_all', label: 'Not at all' },
          { value: 'little_modern', label: 'A little modern' },
          { value: 'very_genz', label: 'Very Gen-Z' },
          { value: 'chronically_online', label: 'Chronically online' },
        ],
      },
    ],
  },
  {
    pageNumber: 5,
    helperText: 'How real do you get? 💯',
    questions: [
      {
        id: 'personalLevel',
        question: 'How personal should your captions be?',
        field: 'personalLevel',
        options: [
          { value: 'not_personal', label: 'Not personal' },
          { value: 'slightly_personal', label: 'Slightly personal' },
          { value: 'very_personal', label: 'Very personal' },
          { value: 'main_character', label: 'Main-character energy' },
        ],
      },
      {
        id: 'captionType',
        question: 'What kind of captions do you prefer?',
        field: 'captionType',
        options: [
          { value: 'original_thoughts', label: 'Original thoughts' },
          { value: 'modified_quotes', label: 'Modified quotes' },
          { value: 'famous_quotes', label: 'Famous quotes' },
          { value: 'depends_mood', label: 'Depends on mood' },
        ],
      },
    ],
  },
  {
    pageNumber: 6,
    helperText: 'The finishing touches ✨',
    questions: [
      {
        id: 'hashtagStyle',
        question: 'How do you feel about hashtags?',
        field: 'hashtagStyle',
        options: [
          { value: 'never', label: 'Never' },
          { value: 'subtle_1_3', label: '1–3 subtle ones' },
          { value: 'aesthetic_set', label: 'Aesthetic hashtag set' },
          { value: 'full_influencer', label: 'Full influencer mode' },
        ],
      },
      {
        id: 'boldness',
        question: 'How bold should your captions sound?',
        field: 'boldness',
        options: [
          { value: 'soft_subtle', label: 'Soft & subtle' },
          { value: 'balanced', label: 'Balanced' },
          { value: 'confident', label: 'Confident' },
          { value: 'fearless_unapologetic', label: 'Fearless / unapologetic' },
        ],
      },
    ],
  },
  {
    pageNumber: 7,
    helperText: 'Almost there! 🎉',
    questions: [
      {
        id: 'moodVsImage',
        question: 'Should captions always match your mood, or the image?',
        field: 'moodVsImage',
        options: [
          { value: 'always_mood', label: 'Always my mood' },
          { value: 'always_image', label: 'Always the image' },
          { value: 'let_ai_decide', label: 'Let the AI decide' },
        ],
      },
      {
        id: 'platform',
        question: 'Where do you mostly post?',
        field: 'platform',
        options: [
          { value: 'instagram', label: 'Instagram' },
          { value: 'snapchat', label: 'Snapchat' },
          { value: 'linkedin', label: 'LinkedIn (brave soul)' },
          { value: 'multiple_platforms', label: 'Multiple platforms' },
        ],
      },
    ],
  },
];
