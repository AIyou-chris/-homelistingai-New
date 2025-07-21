import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Navbar from './components/shared/Navbar';
import Sidebar from './components/shared/Sidebar';
import Footer from './components/shared/Footer';
import LoadingSpinner from './components/shared/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import ChatBotWidget from './components/shared/ChatBotWidget';
import { ToastContainer } from './components/shared/ToastContainer';
import NewSignUpPage from './pages/NewSignUpPage';
import CheckoutPage from './pages/CheckoutPage';
import NewSalesPage from './pages/NewSalesPage';
import PayPalSignUpPage from './pages/PayPalSignUpPage';
import AuthRedirectHandler from './pages/AuthRedirectHandler';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const AppReviewPage = lazy(() => import('./pages/AppReviewPage'));
const PostPaymentAuthPage = lazy(() => import('./pages/PostPaymentAuthPage'));
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'));
const DemoDashboardLayout = lazy(() => import('./components/dashboard/DemoDashboardLayout'));
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview'));
const DemoDashboardOverview = lazy(() => import('./pages/dashboard/DemoDashboardOverview'));
const AgentDashboardPage = lazy(() => import('./pages/dashboard/agent'));
const LeadsPage = lazy(() => import('./pages/dashboard/LeadsPage'));
const AppointmentsPage = lazy(() => import('./pages/dashboard/AppointmentsPage'));
const DemoAppointmentsPage = lazy(() => import('./pages/dashboard/DemoAppointmentsPage'));
const QRCodesPage = lazy(() => import('./pages/dashboard/QRCodesPage'));
const KnowledgeBasePage = lazy(() => import('./pages/dashboard/KnowledgeBasePage'));
const ContactPage = lazy(() => import('./pages/dashboard/ContactPage'));
const AIControlCenter = lazy(() => import('./pages/dashboard/AIControlCenter'));
const CommunicationsPage = lazy(() => import('./pages/dashboard/CommunicationsPage'));
const AdminCommunicationsPage = lazy(() => import('./pages/AdminCommunicationsPage'));
const ListingsPage = lazy(() => import('./pages/ListingsPage'));
const ListingDetailPage = lazy(() => import('./pages/ListingDetailPage'));
const ListingEditPage = lazy(() => import('./components/listings/ListingEditPage'));
const PropertyAppEditPage = lazy(() => import('./pages/PropertyAppEditPage'));
const PropertyAppViewPage = lazy(() => import('./pages/PropertyAppViewPage'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'));
const UploadListingPage = lazy(() => import('./pages/UploadListingPage'));
const SalesPage = lazy(() => import('./pages/SalesPage'));
const ScrapingPage = lazy(() => import('./pages/ScrapingPage'));
const MobileDemoApp = lazy(() => import('./pages/MobileDemoApp'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const DemoAdminDashboardPage = lazy(() => import('./pages/DemoAdminDashboardPage'));
const ChatDemoPage = lazy(() => import('./pages/ChatDemoPage'));
const PropertyChatPage = lazy(() => import('./pages/PropertyChatPage'));
const AnonymousBuilderPage = lazy(() => import('./pages/AnonymousBuilderPage'));
const BuildAIListingPage = lazy(() => import('./pages/BuildAIListingPage'));
const CardTrickPreviewPage = lazy(() => import('./pages/CardTrickPreviewPage'));
const SuperpowersRevealPage = lazy(() => import('./pages/SuperpowersRevealPage'));
const VoiceTestPage = lazy(() => import('./pages/VoiceTestPage'));
const ListingDemoPage = lazy(() => import('./pages/ListingDemoPage'));
const ApifyTestPage = lazy(() => import('./pages/ApifyTestPage'));

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="ml-4 px-3 py-1 rounded bg-muted text-muted-foreground border border-border hover:bg-accent transition"
      title="Toggle dark mode"
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
}

function AppNavbarAndFooter() {
  const location = useLocation();
  const hideToggle = ['/login', '/new-signup', '/signup-paypal'].some(path => location.pathname.startsWith(path));
  const showSalesFooter = hideToggle;
  return (
    <>
      <Navbar />
      {!hideToggle && <div className="absolute top-4 right-4 z-50"><DarkModeToggle /></div>}
      {showSalesFooter && <Footer />}
    </>
  );
}

function MainLayout() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted text-foreground">
      <AppNavbarAndFooter />
      <div className="flex flex-1 pt-16">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${isAuthenticated ? 'md:ml-64' : ''}`}>
          <Outlet />
        </main>
      </div>
      {!['/login', '/new-signup', '/signup-paypal'].includes(window.location.hash.replace('#', '')) && <Footer />}
    </div>
  );
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const ConditionalChatBot: React.FC = () => {
    const location = useLocation();
    
    console.log('Current location:', location.pathname);
    
    // Don't show chat bot on demo or sales pages
    if (location.pathname === '/demo' || location.pathname === '/' || location.pathname === '/sales') {
      return null;
    }
    
    return <ChatBotWidget />;
  };

  return (
    <ThemeProvider>
      <ToastContainer>
        <HashRouter>
          {/* Only show ChatBotWidget if not on front page */}
          <ConditionalChatBot />
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Routes>
              {/* Debug routes */}
              <Route path="/debug" element={<div>Debug route works!</div>} />
              <Route path="/test-admin" element={<div style={{padding: '20px', textAlign: 'center'}}><h1>Test Admin Route</h1><p>This should work!</p></div>} />
              
              {/* Public routes */}
              <Route path="/login" element={<AuthPage />} />
              <Route path="/new-signup" element={<NewSignUpPage />} />
              <Route path="/signup-paypal" element={<PayPalSignUpPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/auth" element={<AuthRedirectHandler />} />
              <Route path="/" element={<NewSalesPage />} />
              <Route path="/sales" element={<NewSalesPage />} />
              {/* Anonymous builder/demo routes are public */}
              <Route path="/anonymous-builder" element={<AnonymousBuilderPage />} />
              <Route path="/build-ai-listing" element={<BuildAIListingPage />} />
              <Route path="/card-trick-preview" element={<CardTrickPreviewPage />} />
              <Route path="/superpowers-reveal" element={<SuperpowersRevealPage />} />
              {/* Make demo routes public */}
              <Route path="/demo" element={<MobileDemoApp />} />
              <Route path="/demo-dashboard" element={<DemoDashboardLayout />}>
                <Route index element={<DemoDashboardOverview />} />
                <Route path="agent" element={<AgentDashboardPage />} />
                <Route path="leads" element={<LeadsPage />} />
                <Route path="communications" element={<CommunicationsPage />} />
                <Route path="listings" element={<ListingsPage />} />
                <Route path="appointments" element={<DemoAppointmentsPage />} />
                <Route path="knowledge-base" element={<KnowledgeBasePage />} />
                <Route path="qr-codes" element={<QRCodesPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="test" element={<div>Test route works!</div>} />
              </Route>
              {/* All other routes require authentication */}
              <Route element={<ProtectedRoute />}>
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminProtectedRoute><AdminDashboardPage /></AdminProtectedRoute>} />
                <Route path="/admin/communications" element={<AdminProtectedRoute><AdminCommunicationsPage /></AdminProtectedRoute>} />
                <Route path="/admin-test" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Admin Test Route Works!</h1><p>This route is accessible without authentication.</p></div>} />
                <Route path="/demo-admin" element={<DemoAdminDashboardPage />} />
                {/* All other authenticated dashboard routes */}
                <Route path="/scrape" element={<ScrapingPage />} />
                <Route path="/apify-test" element={<ApifyTestPage />} />
                <Route path="/chat-demo" element={<ChatDemoPage />} />
                <Route path="/chat/:listingId" element={<PropertyChatPage />} />
                <Route path="/voice-test" element={<VoiceTestPage />} />
                <Route path="/upload" element={<UploadListingPage />} />
                <Route path="/app-review" element={<AppReviewPage />} />
                <Route path="/post-payment-auth" element={<PostPaymentAuthPage />} />
                {/* Authenticated Dashboard Routes */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardOverview />} />
                  <Route path="agent" element={<AgentDashboardPage />} />
                  <Route path="leads" element={<LeadsPage />} />
                  <Route path="communications" element={<CommunicationsPage />} />
                  <Route path="listings" element={<ListingsPage />} />
                  <Route path="appointments" element={<AppointmentsPage />} />
                  <Route path="knowledge-base" element={<KnowledgeBasePage />} />
                  <Route path="qr-codes" element={<QRCodesPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
                <Route path="/listings" element={<ListingsPage />} />
                <Route path="/listings/new" element={<UploadListingPage />} />
                <Route path="/listings/:id" element={<ListingDetailPage />} />
                <Route path="/listings/edit/:id" element={<ListingEditPage />} />
                <Route path="/listings/app-edit/:id" element={<PropertyAppEditPage />} />
                <Route path="/listings/app/:id" element={<PropertyAppViewPage />} />
                <Route path="/listings/:id/demo" element={<ListingDemoPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </Suspense>

        </ErrorBoundary>
      </HashRouter>
      </ToastContainer>
    </ThemeProvider>
  );
};

export default App;