import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/shared/Navbar';
import Sidebar from './components/shared/Sidebar';
import Footer from './components/shared/Footer';
import LoadingSpinner from './components/shared/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import ChatBotWidget from './components/shared/ChatBotWidget';
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
const LeadsPage = lazy(() => import('./pages/dashboard/LeadsPage'));
const AppointmentsPage = lazy(() => import('./pages/dashboard/AppointmentsPage'));
const QRCodesPage = lazy(() => import('./pages/dashboard/QRCodesPage'));
const KnowledgeBasePage = lazy(() => import('./pages/dashboard/KnowledgeBasePage'));
const ContactPage = lazy(() => import('./pages/dashboard/ContactPage'));
const ListingsPage = lazy(() => import('./pages/ListingsPage'));
const ListingDetailPage = lazy(() => import('./pages/ListingDetailPage'));
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
const CardTrickPreviewPage = lazy(() => import('./pages/CardTrickPreviewPage'));
const SuperpowersRevealPage = lazy(() => import('./pages/SuperpowersRevealPage'));

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
  useEffect(() => {
    // Set initial mode from localStorage or system preference
    const isDark = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDark = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };
  return (
    <button
      onClick={toggleDark}
      className="ml-4 px-3 py-1 rounded bg-muted text-muted-foreground border border-border hover:bg-accent transition"
      title="Toggle dark mode"
    >
      🌓
    </button>
  );
}

function MainLayout() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted text-foreground">
      <Navbar />
      <div className="absolute top-4 right-4 z-50"><DarkModeToggle /></div>
      <div className="flex flex-1 pt-16">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${isAuthenticated ? 'md:ml-64' : ''}`}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
    <HashRouter>
      <ConditionalChatBot />
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <Routes>
            {/* Debug route */}
            <Route path="/debug" element={<div>Debug route works!</div>} />
            
            {/* Demo Dashboard Route - Uses its own clean layout */}
            <Route path="/demo-dashboard" element={<DemoDashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="listings" element={<ListingsPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="knowledge-base" element={<KnowledgeBasePage />} />
              <Route path="qr-codes" element={<QRCodesPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="test" element={<div>Test route works!</div>} />
            </Route>
            
            {/* Sales page - Full page layout */}
            <Route path="/" element={<NewSalesPage />} />
            <Route path="/sales" element={<NewSalesPage />} />
            
            {/* Anonymous Flow Routes */}
            <Route path="/anonymous-builder" element={<AnonymousBuilderPage />} />
            <Route path="/card-trick-preview" element={<CardTrickPreviewPage />} />
            <Route path="/superpowers-reveal" element={<SuperpowersRevealPage />} />
            
            {/* All other routes */}
            <Route path="/scrape" element={<ScrapingPage />} />
            <Route path="/demo" element={<MobileDemoApp />} />
            <Route path="/chat-demo" element={<ChatDemoPage />} />
            <Route path="/chat/:listingId" element={<PropertyChatPage />} />
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            } />
            <Route path="/demo-admin" element={<DemoAdminDashboardPage />} />
            <Route path="/new-signup" element={<NewSignUpPage />} />
            <Route path="/signup-paypal" element={<PayPalSignUpPage />} />
            <Route path="/upload" element={<UploadListingPage />} />
            <Route path="/app-review" element={<AppReviewPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/post-payment-auth" element={<PostPaymentAuthPage />} />
            <Route path="/auth" element={<AuthRedirectHandler />} />
            
            {/* Authenticated Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="leads" element={<LeadsPage />} />
                <Route path="listings" element={<ListingsPage />} />
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="knowledge-base" element={<KnowledgeBasePage />} />
                <Route path="qr-codes" element={<QRCodesPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
            
            <Route element={<MainLayout />}>
              <Route path="/login" element={<AuthPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/listings" element={<ListingsPage />} />
                <Route path="/listings/new" element={<UploadListingPage />} />
                <Route path="/listings/:id" element={<ListingDetailPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route
                path="*"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            </Route>
          </Routes>
        </Suspense>

      </ErrorBoundary>
    </HashRouter>
  );
};

export default App;