export type Vibe = 'chill_minimal' | 'funny_sarcastic' | 'deep_thoughtful' | 'bold_confident' | 'soft_aesthetic' | 'chaotic_unfiltered';
export type HumorLevel = 'none_serious' | 'light_clever' | 'sarcastic_witty' | 'unhinged_2am';
export type EmojiUsage = 'no_emojis' | 'one_two_max' | 'part_of_sentence' | 'caption_is_emojis';
export type CaptionLength = 'one_liner' | 'short_meaningful' | 'medium_storytelling' | 'long_pretend_read';
export type Persona = 'mysterious' | 'confident' | 'relatable' | 'funny' | 'calm' | 'unbothered';
export type PostGoal = 'just_vibes' | 'likes_engagement' | 'express_myself' | 'make_laugh' | 'flex';
export type CaptionPriority = 'relatable_thoughts' | 'pure_aesthetics' | 'mix_both';
export type OnlineLevel = 'not_at_all' | 'little_modern' | 'very_genz' | 'chronically_online';
export type PersonalLevel = 'not_personal' | 'slightly_personal' | 'very_personal' | 'main_character';
export type CaptionType = 'original_thoughts' | 'modified_quotes' | 'famous_quotes' | 'depends_mood';
export type HashtagStyle = 'never' | 'subtle_1_3' | 'aesthetic_set' | 'full_influencer';
export type Boldness = 'soft_subtle' | 'balanced' | 'confident' | 'fearless_unapologetic';
export type MoodVsImage = 'always_mood' | 'always_image' | 'let_ai_decide';
export type Platform = 'instagram' | 'snapchat' | 'linkedin' | 'multiple_platforms';

export interface PersonalityProfile {
  comfortZone?: string;
  socialApproach?: string;
  freeTime?: string;
  foodPreference?: string;
  favoritePlaces?: string;
  personalityType?: string;
  stressManagement?: string;
  routinePreference?: string;
  peopleConnection?: string;
  selfPerception?: string;
  
  // Metadata
  completedAt?: string;
  version: '1.0';
}

export interface QuestionOption {
  value: string;
  label: string;
  icon?: string;
  optionId: number;
}

export interface Question {
  id: string;
  question: string;
  options: QuestionOption[];
  field: keyof PersonalityProfile;
  numericId: number;
}

export interface PageData {
  pageNumber: number;
  helperText: string;
  questions: [Question, Question];
}
