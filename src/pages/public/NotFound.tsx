import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function NotFound() {
  return (
    <div className="page-wrap">
      <Helmet>
        <title>404 — Page Not Found | CHINTWO</title>
      </Helmet>

      <Navbar />

      <main
        id="main-content"
        className="page-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'var(--space-4xl) var(--page-gutter)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '600px' }}
        >
          <span className="type-meta" style={{ display: 'block', marginBottom: '1.5rem' }}>
            ERROR 404 • UNCHARTED TERRITORY
          </span>
          <h1 className="type-display-lg" style={{ marginBottom: '1.5rem', lineHeight: 1.1 }}>
            You seem to have wandered off the canvas.
          </h1>
          <p className="type-editorial" style={{ color: 'var(--color-stone)', marginBottom: '2.5rem' }}>
            The page or artwork archive entry you are seeking does not exist or has been relocated within the visual universe.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/" className="btn-editorial btn-editorial--filled">
              Return to Gallery Index
            </Link>
            <Link to="/work" className="btn-editorial">
              Browse Artworks
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
