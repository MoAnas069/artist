import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

function AdminShortcutListener() {
  const navigate = useNavigate();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
  return null;
}
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ui/ErrorBoundary';
import PageTransition from './components/layout/PageTransition';
import CustomCursor from './components/cursor/CustomCursor';
import LoadingState from './components/ui/LoadingState';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Public pages — lazy loaded
const Home = lazy(() => import('./pages/public/Home'));
const Work = lazy(() => import('./pages/public/Work'));
const WorkDetail = lazy(() => import('./pages/public/WorkDetail'));
const Me = lazy(() => import('./pages/public/Me'));
const Journal = lazy(() => import('./pages/public/Journal'));
const JournalPost = lazy(() => import('./pages/public/JournalPost'));
const Shop = lazy(() => import('./pages/public/Shop'));
const ShopProduct = lazy(() => import('./pages/public/ShopProduct'));
const Contact = lazy(() => import('./pages/public/Contact'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

// Admin pages — lazy loaded
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ArtworksCMS = lazy(() => import('./pages/admin/ArtworksCMS'));
const ArtworkForm = lazy(() => import('./pages/admin/ArtworkForm'));
const JournalCMS = lazy(() => import('./pages/admin/JournalCMS'));
const JournalForm = lazy(() => import('./pages/admin/JournalForm'));
const ShopCMS = lazy(() => import('./pages/admin/ShopCMS'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm'));
const Messages = lazy(() => import('./pages/admin/Messages'));
const Settings = lazy(() => import('./pages/admin/Settings'));

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <AdminShortcutListener />
              <CustomCursor />
              <Suspense fallback={<LoadingState />}>
                <PageTransition>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/work" element={<Work />} />
                    <Route path="/work/:slug" element={<WorkDetail />} />
                    <Route path="/me" element={<Me />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/journal/:slug" element={<JournalPost />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/:slug" element={<ShopProduct />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<Login />} />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute>
                          <AdminLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Dashboard />} />
                      <Route path="artworks" element={<ArtworksCMS />} />
                      <Route path="artworks/new" element={<ArtworkForm />} />
                      <Route path="artworks/:id" element={<ArtworkForm />} />
                      <Route path="journal" element={<JournalCMS />} />
                      <Route path="journal/new" element={<JournalForm />} />
                      <Route path="journal/:id" element={<JournalForm />} />
                      <Route path="shop" element={<ShopCMS />} />
                      <Route path="shop/new" element={<ProductForm />} />
                      <Route path="shop/:id" element={<ProductForm />} />
                      <Route path="messages" element={<Messages />} />
                      <Route path="settings" element={<Settings />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PageTransition>
              </Suspense>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
