import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/shared/Navbar';
import Sidebar from './components/shared/Sidebar';
import Footer from './components/shared/Footer';
import LoadingSpinner from './components/shared/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import ChatBotWidget from './components/shared/ChatBotWidget';
import SignUpPage from './pages/SignUpPage';
import CheckoutPage from './pages/CheckoutPage';
import NewSalesPage from './pages/NewSalesPage';
import MobileDemoApp from './pages/MobileDemoApp';
import MapSearchPage from './pages/MapSearchPage';
import WalkScoreTest from './components/WalkScoreTest';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'));
const DemoDashboardLayout = lazy(() => import('./components/dashboard/DemoDashboardLayout'));
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview'));
const LeadsPage = lazy(() => import('./pages/dashboard/LeadsPage'));
const AppointmentsPage = lazy(() => import('./pages/dashboard/AppointmentsPage'));
const QRCodesPage = lazy(() => import('./pages/dashboard/QRCodesPage'));
const KnowledgeBasePage = lazy(() => import('./pages/dashboard/KnowledgeBasePage'));
const ListingsPage = lazy(() => import('./pages/ListingsPage'));
const ListingDetailPage = lazy(() => import('./pages/ListingDetailPage'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'));
const UploadListingPage = lazy(() => import('./pages/UploadListingPage'));
const SalesPage = lazy(() => import('./pages/SalesPage'));
const ScrapingPage = lazy(() => import('./pages/ScrapingPage'));
const DemoAppPage = lazy(() => import('./pages/DemoAppPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const DemoAdminDashboardPage = lazy(() => import('./pages/DemoAdminDashboardPage'));
const ChatDemoPage = lazy(() => import('./pages/ChatDemoPage'));

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

function GlobalChatBotWidget() {
  const location = useLocation();
  return !['/demo', '/chat-demo'].includes(location.pathname) ? <ChatBotWidget /> : null;
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

  return (
    <HashRouter>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <Routes>
            {/* Demo Dashboard Route - Uses its own clean layout */}
            <Route path="/demo-dashboard" element={<DemoDashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="listings" element={<ListingsPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="knowledge-base" element={<KnowledgeBasePage />} />
              <Route path="qr-codes" element={<QRCodesPage />} />
              <Route path="analytics" element={<div>Analytics Page (Coming Soon)</div>} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            {/* Sales page - Full page layout */}
            <Route path="/" element={<NewSalesPage />} />
            <Route path="/sales" element={<NewSalesPage />} />
            
            {/* All other routes */}
            <Route path="/scrape" element={<ScrapingPage />} />
            <Route path="/demo" element={<MobileDemoApp />} />
            <Route path="/map-search" element={<MapSearchPage />} />
            <Route path="/chat-demo" element={<ChatDemoPage />} />
            <Route path="/walk-score-test" element={<WalkScoreTest />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/demo-admin" element={<DemoAdminDashboardPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/upload" element={<UploadListingPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            
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
            
            {/* Authenticated Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="leads" element={<LeadsPage />} />
                <Route path="listings" element={<ListingsPage />} />
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="knowledge-base" element={<KnowledgeBasePage />} />
                <Route path="qr-codes" element={<QRCodesPage />} />
                <Route path="analytics" element={<div>Analytics Page (Coming Soon)</div>} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
        <GlobalChatBotWidget />
      </ErrorBoundary>
    </HashRouter>
  );
};

export default App;