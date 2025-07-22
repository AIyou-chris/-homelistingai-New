import React from 'react';
import { 
  FigmaComponent, 
  FigmaButton, 
  FigmaCard, 
  FigmaImage, 
  FigmaSection,
  FigmaDesignSystem,
  FigmaAssets 
} from './FigmaDesignSystem';

// Example of how to use your Figma design system
export const ExampleFigmaHero: React.FC = () => {
  return (
    <FigmaComponent>
      <FigmaSection background="hero" className="relative overflow-hidden">
        {/* Your original Figma hero background */}
        <FigmaImage
          src={FigmaAssets.heroBackground}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Your original Figma hero content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            {/* Your exact Figma headline */}
            <h1 className={`${FigmaDesignSystem.typography.h1} mb-6`}>
              Transform Your Real Estate Business with AI
            </h1>
            
            {/* Your exact Figma subheadline */}
            <p className={`${FigmaDesignSystem.typography.bodyLarge} mb-8 opacity-90`}>
              Generate stunning property descriptions, manage listings, and close more deals with our AI-powered platform
            </p>
            
            {/* Your exact Figma CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <FigmaButton size="lg" variant="primary">
                Start Free Trial
              </FigmaButton>
              <FigmaButton size="lg" variant="outline">
                Watch Demo
              </FigmaButton>
            </div>
          </div>
        </div>
      </FigmaSection>
    </FigmaComponent>
  );
};

export const ExampleFigmaFeature: React.FC = () => {
  return (
    <FigmaComponent>
      <FigmaSection background="white">
        <div className="text-center mb-16">
          <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>
            Powerful Features
          </h2>
          <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600`}>
            Everything you need to succeed in real estate
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Your exact Figma feature cards */}
          <FigmaCard className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className={`${FigmaDesignSystem.typography.h3} mb-4`}>
              AI Description Generator
            </h3>
            <p className={`${FigmaDesignSystem.typography.body} text-gray-600`}>
              Generate compelling property descriptions in seconds with our advanced AI
            </p>
          </FigmaCard>
          
          <FigmaCard className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-teal-400 to-pink-400 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className={`${FigmaDesignSystem.typography.h3} mb-4`}>
              Listing Management
            </h3>
            <p className={`${FigmaDesignSystem.typography.body} text-gray-600`}>
              Organize and manage all your property listings in one place
            </p>
          </FigmaCard>
          
          <FigmaCard className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className={`${FigmaDesignSystem.typography.h3} mb-4`}>
              Lead Generation
            </h3>
            <p className={`${FigmaDesignSystem.typography.body} text-gray-600`}>
              Capture and nurture leads with our integrated CRM system
            </p>
          </FigmaCard>
        </div>
      </FigmaSection>
    </FigmaComponent>
  );
};

// Example of how to replace your current NewSalesPage with Figma components
export const FigmaNewSalesPage: React.FC = () => {
  return (
    <FigmaComponent>
      {/* Your exact Figma header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <FigmaImage
              src={FigmaAssets.logo}
              alt="HomeListingAI Logo"
              className="h-8"
            />
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className={`${FigmaDesignSystem.typography.body} text-gray-700 hover:text-blue-600`}>
                Features
              </a>
              <a href="#pricing" className={`${FigmaDesignSystem.typography.body} text-gray-700 hover:text-blue-600`}>
                Pricing
              </a>
              <a href="#about" className={`${FigmaDesignSystem.typography.body} text-gray-700 hover:text-blue-600`}>
                About
              </a>
              <a href="#contact" className={`${FigmaDesignSystem.typography.body} text-gray-700 hover:text-blue-600`}>
                Contact
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <FigmaButton variant="outline" size="sm">
                Sign In
              </FigmaButton>
              <FigmaButton variant="primary" size="sm">
                Get Started
              </FigmaButton>
            </div>
          </div>
        </div>
      </header>

      {/* Your exact Figma hero section */}
      <ExampleFigmaHero />

      {/* Your exact Figma features section */}
      <ExampleFigmaFeature />

      {/* Add all your other Figma sections here */}
      {/* Pricing, About, FAQ, Contact, etc. */}
    </FigmaComponent>
  );
};

export default FigmaNewSalesPage; 