import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import LoadingSpinner from './components/shared/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';

// Lazy load pages
const NewSalesPage = lazy(() => import('./pages/NewSalesPage'));
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'));
const DemoDashboardLayout = lazy(() => import('./components/dashboard/DemoDashboardLayout'));
const CommunicationsPage = lazy(() => import('./pages/dashboard/CommunicationsPage'));
const BuildAIListingPage = lazy(() => import('./pages/BuildAIListingPage'));
const DemoAppPage = lazy(() => import('./pages/DemoAppPage'));

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              <Routes>
                <Route path="/" element={
                  <>
                    <Helmet>
                      <title>HomeListingAI - AI-Powered Real Estate Listings</title>
                      <meta name="description" content="Transform your real estate listings with AI. Create stunning property descriptions, generate QR codes, and manage leads with HomeListingAI." />
                    </Helmet>
                    <NewSalesPage />
                  </>
                } />
                <Route path="/sales" element={
                  <>
                    <Helmet>
                      <title>HomeListingAI - AI-Powered Real Estate Listings</title>
                      <meta name="description" content="Transform your real estate listings with AI. Create stunning property descriptions, generate QR codes, and manage leads with HomeListingAI." />
                    </Helmet>
                    <NewSalesPage />
                  </>
                } />
                <Route path="/dashboard/*" element={
                  <>
                    <Helmet>
                      <title>Dashboard - HomeListingAI</title>
                      <meta name="description" content="Manage your real estate listings, leads, and AI tools with HomeListingAI dashboard." />
                    </Helmet>
                    <DashboardLayout />
                  </>
                } />
                <Route path="/demo-dashboard/*" element={
                  <>
                    <Helmet>
                      <title>Demo Dashboard - HomeListingAI</title>
                      <meta name="description" content="Experience the HomeListingAI dashboard with demo data and features." />
                    </Helmet>
                    <DemoDashboardLayout />
                  </>
                } />
                <Route path="/demo" element={
                  <>
                    <Helmet>
                      <title>Demo App - HomeListingAI</title>
                      <meta name="description" content="Try the HomeListingAI mobile app demo with AI-powered property features." />
                    </Helmet>
                    <DemoAppPage />
                  </>
                } />
                <Route path="/build-ai-listing" element={
                  <>
                    <Helmet>
                      <title>Build AI Listing - HomeListingAI</title>
                      <meta name="description" content="Create stunning AI-powered property listings with HomeListingAI." />
                    </Helmet>
                    <BuildAIListingPage />
                  </>
                } />
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
};

export default App;