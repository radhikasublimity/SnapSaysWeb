'use client';

import { useState, useEffect } from 'react';
import { PAGES } from './data/pages';
import { PersonalityProfile } from './types/types';
import { OptionCard, ProgressBar, NavigationButtons } from './components/UIComponents';
import './personality-portal.css';

export default function PersonalityPortal() {
  const [currentPage, setCurrentPage] = useState(0);
  const [profile, setProfile] = useState<PersonalityProfile>({
    version: '1.0',
  });
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const totalQuestions = PAGES.reduce((acc, page) => acc + page.questions.length, 0);
  const answeredQuestions = Object.keys(profile).filter(
    key => key !== 'version' && key !== 'completedAt'
  ).length;

  const currentPageData = PAGES[currentPage];
  const canGoNext = currentPageData?.questions.every(
    q => profile[q.field as keyof PersonalityProfile] !== undefined
  );

  const handleOptionSelect = (field: keyof PersonalityProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentPage < PAGES.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      // Complete the profile
      const completedProfile: PersonalityProfile = {
        ...profile,
        completedAt: new Date().toISOString(),
      };
      setProfile(completedProfile);
      setIsComplete(true);
      setShowConfetti(true);
      
      // Save to localStorage
      localStorage.setItem('personalityProfile', JSON.stringify(completedProfile));
      
      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setProfile({ version: '1.0' });
    setCurrentPage(0);
    setIsComplete(false);
    localStorage.removeItem('personalityProfile');
  };

  // Load saved profile on mount
  useEffect(() => {
    const saved = localStorage.getItem('personalityProfile');
    if (saved) {
      try {
        const savedProfile = JSON.parse(saved);
        setProfile(savedProfile);
        if (savedProfile.completedAt) {
          setIsComplete(true);
        }
      } catch (e) {
        console.error('Failed to load saved profile:', e);
      }
    }
  }, []);

  // Generate floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 6}s`,
  }));

  if (isComplete) {
    return (
      <div className="personality-portal-bg">
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 50 }, (_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'][
                    Math.floor(Math.random() * 5)
                  ],
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}
        
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full p-8 md:p-12 fade-in">
            <div className="text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                You're All Set!
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Your personality profile is complete. We'll use this to generate captions that truly sound like you.
              </p>
              
              <div className="bg-white/10 rounded-xl p-6 mb-8 text-left">
                <h2 className="text-2xl font-bold text-white mb-4">Your Vibe:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(profile)
                    .filter(([key]) => key !== 'version' && key !== 'completedAt')
                    .map(([key, value]) => (
                      <div key={key} className="bg-white/10 rounded-lg p-3">
                        <div className="text-white/70 text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-white font-medium">
                          {typeof value === 'string' 
                            ? value.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
                            : String(value)
                          }
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleRestart}
                  className="btn-secondary flex-1"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-primary flex-1"
                >
                  Start Creating →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="personality-portal-bg">
      {/* Floating Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="floating-particle"
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
          }}
        />
      ))}

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          {/* Progress Bar */}
          <ProgressBar current={answeredQuestions} total={totalQuestions} />

          {/* Main Card */}
          <div className="glass-card p-6 md:p-10 page-enter">
            {/* Helper Text */}
            <div className="helper-text fade-in">
              {currentPageData.helperText}
            </div>

            {/* Questions */}
            <div className="space-y-8">
              {currentPageData.questions.map((question, qIndex) => (
                <div key={question.id} className="fade-in" style={{ animationDelay: `${qIndex * 0.1}s` }}>
                  <h2 className="question-text">
                    {question.question}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.options.map((option) => (
                      <OptionCard
                        key={option.value}
                        label={option.label}
                        value={option.value}
                        selected={profile[question.field as keyof PersonalityProfile] === option.value}
                        onClick={() => handleOptionSelect(question.field as keyof PersonalityProfile, option.value)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <NavigationButtons
              onBack={currentPage > 0 ? handleBack : undefined}
              onNext={handleNext}
              canGoNext={canGoNext}
              isLastPage={currentPage === PAGES.length - 1}
            />
          </div>

          {/* Page Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {PAGES.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentPage
                    ? 'w-8 bg-white'
                    : index < currentPage
                    ? 'w-2 bg-white/70'
                    : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
