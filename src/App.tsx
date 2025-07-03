import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/shared/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';

// Import critical components directly (not lazy) to avoid loading issues
import NewSalesPage from './pages/NewSalesPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardLayout from './components/admin/AdminDashboardLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Lazy load non-critical components
const Navbar = lazy(() => import('./components/shared/Navbar'));
const Sidebar = lazy(() => import('./components/shared/Sidebar'));
const Footer = lazy(() => import('./components/shared/Footer'));
const ChatBotWidget = lazy(() => import('./components/shared/ChatBotWidget'));
const DevTools = lazy(() => import('./components/shared/DevTools'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const MobileDemoApp = lazy(() => import('./pages/MobileDemoApp'));
const MapSearchPage = lazy(() => import('./pages/MapSearchPage'));
const WalkScoreTest = lazy(() => import('./components/WalkScoreTest'));

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

function AdminProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Add debugging
  React.useEffect(() => {
    console.log('AdminProtectedRoute state:', {
      isAuthenticated,
      isLoading,
      userEmail: user?.email,
      user: user
    });
  }, [isAuthenticated, isLoading, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <LoadingSpinner size="lg" />
        <div className="text-white text-center mt-4">
          <p>Loading admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('AdminProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  // Check if user has admin role (in a real app, this would come from the user profile)
  // For now, we'll check if it's our admin email
  if (user?.email !== 'support@homelistingai.com') {
    console.log('AdminProtectedRoute: User is not admin, redirecting to login. User email:', user?.email);
    return <Navigate to="/admin/login" replace />;
  }

  console.log('AdminProtectedRoute: Admin access granted');
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
      <Suspense fallback={<div className="h-16 bg-slate-800" />}>
        <Navbar />
      </Suspense>
      <div className="absolute top-4 right-4 z-50"><DarkModeToggle /></div>
      <div className="flex flex-1 pt-16">
        {isAuthenticated && (
          <Suspense fallback={<div className="w-64 bg-slate-800" />}>
            <Sidebar />
          </Suspense>
        )}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${isAuthenticated ? 'md:ml-64' : ''}`}>
          <Outlet />
        </main>
      </div>
      <Suspense fallback={<div className="h-16 bg-slate-800" />}>
        <Footer />
      </Suspense>
    </div>
  );
}

function GlobalChatBotWidget() {
  const location = useLocation();
  return !['/demo', '/chat-demo'].includes(location.pathname) ? (
    <Suspense fallback={null}>
      <ChatBotWidget />
    </Suspense>
  ) : null;
}

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Reduced loading timeout for better UX
  const [showTimeoutMessage, setShowTimeoutMessage] = React.useState(false);
  
  React.useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowTimeoutMessage(true);
      }, 500); // Show message after 0.5 seconds
      
      return () => clearTimeout(timer);
    } else {
      setShowTimeoutMessage(false);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center text-white">
          <LoadingSpinner size="lg" />
          <p className="mt-4">Loading HomeListingAI...</p>
          {showTimeoutMessage && (
            <div className="mt-4">
              <p className="text-sm text-gray-400">Taking longer than expected...</p>
              <div className="space-x-2 mt-2">
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Refresh Page
                </button>
                <button 
                  onClick={() => window.location.href = '/#/admin/login'} 
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Go to Admin Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <ErrorBoundary>
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen bg-slate-900">
            <LoadingSpinner size="lg" />
          </div>
        }>
          <Routes>
            {/* Core routes loaded directly */}
            <Route path="/" element={<NewSalesPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
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
            <Route path="/sales" element={<NewSalesPage />} />
            
            {/* All other routes */}
            <Route path="/scrape" element={<ScrapingPage />} />
            <Route path="/demo" element={<MobileDemoApp />} />
            <Route path="/map-search" element={<MapSearchPage />} />
            <Route path="/chat-demo" element={<ChatDemoPage />} />
            <Route path="/walk-score-test" element={<WalkScoreTest />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminProtectedRoute />}>
              <Route element={<AdminDashboardLayout />}>
                <Route index element={<AdminDashboardPage />} />
              </Route>
            </Route>
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
        <Suspense fallback={null}>
          <DevTools />
        </Suspense>
      </ErrorBoundary>
    </HashRouter>
  );
};

export default App;