import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const AdminLeadsPage = lazy(() => import('./pages/AdminLeadsPage'));
const AdminAIChatsPage = lazy(() => import('./pages/AdminAIChatsPage'));
const AdminAITrainingPage = lazy(() => import('./pages/AdminAITrainingPage'));
const AdminSystemPage = lazy(() => import('./pages/AdminSystemPage'));
const AdminActivityPage = lazy(() => import('./pages/AdminActivityPage'));
const AdminSecurityPage = lazy(() => import('./pages/AdminSecurityPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/AdminAnalyticsPage'));
const AdminSettingsPage = lazy(() => import('./pages/AdminSettingsPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const CompliancePolicyPage = lazy(() => import('./pages/CompliancePolicyPage'));
const DMCAPolicyPage = lazy(() => import('./pages/DMCAPolicyPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));

// Dashboard pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DashboardOverviewNew = lazy(() => import('./pages/dashboard/DashboardOverviewNew'));
const LeadsAppointmentsPage = lazy(() => import('./pages/dashboard/LeadsAppointmentsPage'));
const AIAssistantPage = lazy(() => import('./pages/dashboard/AIAssistantPage'));
const ListingsPage = lazy(() => import('./pages/ListingsPage'));
const ListingEditPage = lazy(() => import('./pages/ListingEditPage'));
const QRCodesPage = lazy(() => import('./pages/dashboard/QRCodesPage'));
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'));


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
                }>
                  <Route index element={<DashboardPage />} />
                  <Route path="leads-appointments" element={<LeadsAppointmentsPage />} />
                  <Route path="ai" element={<AIAssistantPage />} />
                  <Route path="listings" element={<ListingsPage />} />
                  <Route path="listings/edit/:id" element={<ListingEditPage />} />
                  <Route path="qr-codes" element={<QRCodesPage />} />
                  <Route path="analytics" element={<DashboardOverview />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="leads" element={<Navigate to="/dashboard/leads-appointments" replace />} />
                  <Route path="appointments" element={<Navigate to="/dashboard/leads-appointments" replace />} />
                  <Route path="communications" element={<Navigate to="/dashboard/ai" replace />} />
                  <Route path="knowledge-base" element={<Navigate to="/dashboard/ai" replace />} />
                </Route>
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
                <Route path="/admin" element={
                  <>
                    <Helmet>
                      <title>Admin Dashboard - HomeListingAI</title>
                      <meta name="description" content="Admin dashboard for managing HomeListingAI system and users." />
                    </Helmet>
                    <AdminDashboardPage />
                  </>
                } />
                <Route path="/admin/users" element={
                  <>
                    <Helmet>
                      <title>User Management - HomeListingAI</title>
                      <meta name="description" content="Manage users and permissions in HomeListingAI admin panel." />
                    </Helmet>
                    <AdminUsersPage />
                  </>
                } />
                <Route path="/admin/leads" element={
                  <>
                    <Helmet>
                      <title>Leads Management - HomeListingAI</title>
                      <meta name="description" content="Track and manage your sales pipeline with marketing automation." />
                    </Helmet>
                    <AdminLeadsPage />
                  </>
                } />
                <Route path="/admin/ai-chats" element={
                  <>
                    <Helmet>
                      <title>AI Chats Management - HomeListingAI</title>
                      <meta name="description" content="Monitor and manage AI-powered sales and support conversations." />
                    </Helmet>
                    <AdminAIChatsPage />
                  </>
                } />
                <Route path="/admin/ai" element={
                  <>
                    <Helmet>
                      <title>AI Training Center - HomeListingAI</title>
                      <meta name="description" content="Train your AI with documents, websites, and knowledge base content." />
                    </Helmet>
                    <AdminAITrainingPage />
                  </>
                } />
                <Route path="/admin/system" element={
                  <>
                    <Helmet>
                      <title>System Management - HomeListingAI</title>
                      <meta name="description" content="Monitor system performance, services, and infrastructure." />
                    </Helmet>
                    <AdminSystemPage />
                  </>
                } />
                <Route path="/admin/activity" element={
                  <>
                    <Helmet>
                      <title>Activity Monitor - HomeListingAI</title>
                      <meta name="description" content="Track system activity, user actions, and system events." />
                    </Helmet>
                    <AdminActivityPage />
                  </>
                } />
                <Route path="/admin/security" element={
                  <>
                    <Helmet>
                      <title>Security Center - HomeListingAI</title>
                      <meta name="description" content="Monitor security events, threats, and system protection." />
                    </Helmet>
                    <AdminSecurityPage />
                  </>
                } />
                <Route path="/admin/analytics" element={
                  <>
                    <Helmet>
                      <title>Analytics Dashboard - HomeListingAI</title>
                      <meta name="description" content="Comprehensive insights into system performance and user behavior." />
                    </Helmet>
                    <AdminAnalyticsPage />
                  </>
                } />
                <Route path="/admin/settings" element={
                  <>
                    <Helmet>
                      <title>System Settings - HomeListingAI</title>
                      <meta name="description" content="Configure system preferences, security, and user management." />
                    </Helmet>
                    <AdminSettingsPage />
                  </>
                } />
                <Route path="/login" element={
                  <>
                    <Helmet>
                      <title>Login - HomeListingAI</title>
                      <meta name="description" content="Sign in to your HomeListingAI account." />
                    </Helmet>
                    <AuthPage />
                  </>
                } />
                <Route path="/signup" element={
                  <>
                    <Helmet>
                      <title>Sign Up - HomeListingAI</title>
                      <meta name="description" content="Create your HomeListingAI account and start transforming your real estate listings." />
                    </Helmet>
                    <SignUpPage />
                  </>
                } />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/compliance" element={<CompliancePolicyPage />} />
                <Route path="/dmca" element={<DMCAPolicyPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
};

export default App;