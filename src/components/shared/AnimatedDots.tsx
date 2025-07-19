import React from 'react';

interface AnimatedDotsProps {
  enabled?: boolean;
  count?: number;
  colors?: string[];
  size?: 'sm' | 'md' | 'lg';
  animationSpeed?: 'slow' | 'normal' | 'fast';
}

const AnimatedDots: React.FC<AnimatedDotsProps> = ({
  enabled = true,
  count = 8,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#f97316'],
  size = 'md',
  animationSpeed = 'normal'
}) => {
  if (!enabled) return null;
  
  // Debug: log that component is rendering
  console.log('🎨 AnimatedDots rendering:', { enabled, count, size, animationSpeed });

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const speedClasses = {
    slow: 'animate-ping',
    normal: 'animate-ping',
    fast: 'animate-ping'
  };

  const speedDelays = {
    slow: 2000,
    normal: 1500,
    fast: 1000
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Test dot - always visible */}
      <div 
        className="absolute top-10 left-10 w-8 h-8 bg-red-500 rounded-full animate-ping"
        style={{ zIndex: 9999 }}
      />
      
      {Array.from({ length: count }).map((_, index) => {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomDelay = Math.random() * speedDelays[animationSpeed];
        const color = colors[index % colors.length];
        
        return (
          <div
            key={index}
            className={`absolute rounded-full ${sizeClasses[size]} ${speedClasses[animationSpeed]}`}
            style={{
              left: `${randomX}%`,
              top: `${randomY}%`,
              backgroundColor: color,
              animationDelay: `${randomDelay}ms`,
              animationDuration: `${speedDelays[animationSpeed]}ms`
            }}
          />
        );
      })}
    </div>
  );
};

export default AnimatedDots; 