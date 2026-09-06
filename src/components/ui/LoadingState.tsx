import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Loading' }: LoadingStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 'var(--space-lg)',
      }}
    >
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="type-meta"
        style={{ color: 'var(--color-muted)' }}
      >
        {message}
      </motion.div>
    </div>
  );
}
