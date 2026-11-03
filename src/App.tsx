import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './components/ui/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import LoadingState from './components/ui/LoadingState';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import LanternCursor from './components/lantern/LanternCursor';
import CartDrawer from './components/cart/CartDrawer';

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

// Public pages — lazy loaded
const Home = lazy(() => import('./pages/public/Home'));
const Work = lazy(() => import('./pages/public/Work'));
const WorkDetail = lazy(() => import('./pages/public/WorkDetail'));
const SeriesDetail = lazy(() => import('./pages/public/SeriesDetail'));
const About = lazy(() => import('./pages/public/About'));
const Journal = lazy(() => import('./pages/public/Journal'));
const JournalPost = lazy(() => import('./pages/public/JournalPost'));
const Editions = lazy(() => import('./pages/public/Editions'));
const EditionDetail = lazy(() => import('./pages/public/EditionDetail'));
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
        <ThemeProvider>
          <CartProvider>
            <AuthProvider>
              <ToastProvider>
                <BrowserRouter>
                  <LanternCursor />
                  <CartDrawer />
                  <AdminShortcutListener />
                  <Suspense fallback={<LoadingState />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/works" element={<Work />} />
                      <Route path="/work" element={<Work />} />
                      <Route path="/works/:series" element={<SeriesDetail />} />
                      <Route path="/works/:series/:slug" element={<WorkDetail />} />
                      <Route path="/work/:slug" element={<WorkDetail />} />
                      <Route path="/prints" element={<Editions />} />
                      <Route path="/prints/:slug" element={<EditionDetail />} />
                      <Route path="/editions" element={<Editions />} />
                      <Route path="/editions/:slug" element={<EditionDetail />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/exhibitions" element={<About />} />
                      <Route path="/journal" element={<Journal />} />
                      <Route path="/journal/:slug" element={<JournalPost />} />
                      <Route path="/contact" element={<Contact />} />

                      {/* Legacy redirects */}
                      <Route path="/me" element={<About />} />
                      <Route path="/shop" element={<Editions />} />
                      <Route path="/shop/:slug" element={<EditionDetail />} />

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
                  </Suspense>
                </BrowserRouter>
              </ToastProvider>
            </AuthProvider>
          </CartProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
