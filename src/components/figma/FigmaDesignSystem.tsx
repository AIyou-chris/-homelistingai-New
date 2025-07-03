import React from 'react';
import { ImageWithFallback } from './ImageWithFallback';

// Figma Design System - Import your original design elements
export const FigmaDesignSystem = {
  // Colors from your Figma design
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#a8edea',
    accent2: '#fed6e3',
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    }
  },

  // Typography from your Figma design
  typography: {
    h1: 'text-4xl sm:text-5xl lg:text-6xl font-bold',
    h2: 'text-3xl sm:text-4xl font-bold',
    h3: 'text-2xl font-semibold',
    h4: 'text-xl font-semibold',
    body: 'text-base',
    bodyLarge: 'text-lg',
    bodySmall: 'text-sm',
    caption: 'text-xs'
  },

  // Spacing from your Figma design
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem'
  },

  // Gradients from your Figma design
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    accent: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    hero: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)'
  }
};

// Figma Assets - Import your original images and assets
export const FigmaAssets = {
  logo: '/new hlailogo.png',
  heroBackground: '/hero-bg.png',
  headshot: '/headshot (1).png',
  realtor: '/realtor.png',
  video: '/AZeOiTXIwINWEIAPZWVBnQ-AZeOiTXI_TwtewPX0KErIA.mp4'
};

// Figma Component Wrapper
export const FigmaComponent: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = '', style = {} }) => {
  return (
    <div 
      className={`${className}`}
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        ...style
      }}
    >
      {children}
    </div>
  );
};

// Figma Image Component
export const FigmaImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}> = ({ src, alt, className = '', fallbackSrc }) => {
  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      className={className}
      fallbackSrc={fallbackSrc}
    />
  );
};

// Figma Button Component
export const FigmaButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}> = ({ children, variant = 'primary', size = 'md', className = '', onClick }) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg',
    secondary: 'bg-gradient-to-r from-teal-400 to-pink-400 text-white hover:from-teal-500 hover:to-pink-500 shadow-lg',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Figma Card Component
export const FigmaCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass';
}> = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-white rounded-xl shadow-lg border border-gray-200',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-xl',
    glass: 'bg-white/10 backdrop-blur-md rounded-xl border border-white/20'
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

// Figma Section Component
export const FigmaSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'gradient' | 'hero';
  id?: string;
}> = ({ children, className = '', background = 'white', id }) => {
  const backgrounds = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-blue-50 to-purple-50',
    hero: 'bg-gradient-to-br from-blue-600 to-purple-700'
  };

  return (
    <section id={id} className={`py-20 ${backgrounds[background]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}; 