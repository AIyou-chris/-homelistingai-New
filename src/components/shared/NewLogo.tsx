import React from 'react';

interface NewLogoProps {
  size?: number;
  className?: string;
}

const NewLogo: React.FC<NewLogoProps> = ({ size = 24, className = "" }) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer orange house with dark blue border */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dark blue border */}
        <path
          d="M2 8L12 2L22 8V20H2V8Z"
          stroke="#1e3a8a"
          strokeWidth="0.5"
          fill="none"
        />
        
        {/* Orange house fill */}
        <path
          d="M2.5 8L12 2.5L21.5 8V19.5H2.5V8Z"
          fill="#f97316"
        />
        
        {/* Inner white house */}
        <path
          d="M6 12L12 8L18 12V18H6V12Z"
          fill="white"
        />
        
        {/* Dark blue AI letters */}
        <path
          d="M8 14L10 12L12 14L10 16L8 14Z"
          fill="#1e3a8a"
        />
        <path
          d="M12 14L14 12L16 14L14 16L12 14Z"
          fill="#1e3a8a"
        />
        <path
          d="M10 16L12 14L14 16L12 18L10 16Z"
          fill="#1e3a8a"
        />
      </svg>
    </div>
  );
};

export default NewLogo; 