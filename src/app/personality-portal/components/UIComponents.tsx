'use client';

import { PersonalityProfile } from '../types/types';

interface OptionCardProps {
  label: string;
  value: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionCard({ label, value, selected, onClick }: OptionCardProps) {
  return (
    <div
      className={`option-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <span className="text-lg font-medium">{label}</span>
    </div>
  );
}

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white text-sm font-medium">
          Question {current} of {total}
        </span>
        <span className="text-white text-sm font-medium">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  canGoNext: boolean;
  isLastPage: boolean;
}

export function NavigationButtons({ 
  onBack, 
  onNext, 
  canGoNext, 
  isLastPage 
}: NavigationButtonsProps) {
  return (
    <div className="flex gap-4 mt-8">
      {onBack && (
        <button
          onClick={onBack}
          className="btn-secondary flex-1"
        >
          ← Back
        </button>
      )}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`btn-primary flex-1 ${!onBack ? 'w-full' : ''} ${
          isLastPage && canGoNext ? 'pulse-glow' : ''
        }`}
      >
        {isLastPage ? 'Complete ✨' : 'Next →'}
      </button>
    </div>
  );
}
