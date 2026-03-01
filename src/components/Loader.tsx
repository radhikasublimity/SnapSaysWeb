
import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function Loader({ size = 'sm', text, className = '' }: LoaderProps) {
  // Size mappings
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const containerSize = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
      <div className={`relative ${containerSize[size]} flex-shrink-0`}
           style={{ 
             position: 'relative', 
             width: size === 'sm' ? '20px' : size === 'md' ? '32px' : '48px', 
             height: size === 'sm' ? '20px' : size === 'md' ? '32px' : '48px',
             flexShrink: 0
           }}>
        {/* Outer Ring */}
        <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-white border-r-white animate-spin`} 
             style={{ 
               position: 'absolute', 
               inset: 0, 
               borderRadius: '50%', 
               border: '2px solid transparent', 
               borderTopColor: 'white', 
               borderRightColor: 'white',
               animation: 'spin 1s linear infinite'
             }} />
        
        {/* Inner Pulse */}
        <div className={`absolute inset-[25%] rounded-full bg-white animate-pulse`} 
             style={{ 
               position: 'absolute', 
               inset: '25%', 
               borderRadius: '50%', 
               backgroundColor: 'white',
               boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
               animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
             }} />
             
        {/* Sparkle effects */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white" 
             style={{ 
               position: 'absolute', 
               inset: 0, 
               borderRadius: '50%', 
               backgroundColor: 'white', 
               opacity: 0.2,
               animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
             }} />
      </div>
      
      {text && (
        <span className="text-white font-medium tracking-wide animate-pulse" style={{ color: 'white', fontWeight: 500, letterSpacing: '0.025em' }}>
          {text}
        </span>
      )}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
