
import React, { useEffect } from 'react';

interface AlertProps {
  message: string | null;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Alert({ message, type = 'info', onClose, duration = 5000 }: AlertProps) {
  useEffect(() => {
    if (message && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgStyles = {
    success: 'bg-green-500/20 border-green-500/50 text-green-200',
    error: 'bg-red-500/20 border-red-500/50 text-red-200',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-200',
  };

  const icon = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm animate-in slide-in-from-top-4 duration-300`}>
      <div className={`mx-4 p-4 rounded-xl border-2 backdrop-blur-xl shadow-2xl flex items-start gap-3 ${bgStyles[type]}`}>
        <span className="text-xl leading-none">{icon[type]}</span>
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {message}
        </div>
        <button 
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
  );
}
