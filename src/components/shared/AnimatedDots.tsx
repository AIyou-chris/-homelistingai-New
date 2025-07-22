import React from 'react';

interface AnimatedDotsProps {
  enabled?: boolean;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  animationSpeed?: 'slow' | 'normal' | 'fast';
}

const AnimatedDots: React.FC<AnimatedDotsProps> = ({
  enabled = true,
  count = 3,
  size = 'md',
  animationSpeed = 'normal'
}) => {
  if (!enabled) return null;

  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const speedClasses = {
    slow: 'animate-pulse',
    normal: 'animate-bounce',
    fast: 'animate-ping'
  };

  return (
    <div className="flex space-x-1">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-blue-500 rounded-full ${sizeClasses[size]} ${speedClasses[animationSpeed]}`}
          style={{
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedDots; 