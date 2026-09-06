import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-xl)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="type-meta" style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-xl)', display: 'block' }}>
          404
        </span>
        <h1
          className="type-display-lg"
          style={{ marginBottom: 'var(--space-xl)', maxWidth: 600 }}
        >
          You seem to have<br />wandered off the canvas.
        </h1>
        <Link
          to="/"
          className="type-meta link-underline"
          data-cursor="Home"
          style={{ color: 'var(--color-stone)' }}
        >
          ← RETURN HOME
        </Link>
      </motion.div>
    </main>
  );
}
