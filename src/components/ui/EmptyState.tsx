interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
}

export default function EmptyState({
  title = 'Nothing here yet',
  message = 'Content will appear here once it has been added.',
  icon = '○',
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        textAlign: 'center',
        padding: 'var(--space-xl)',
      }}
    >
      <span
        style={{
          fontSize: '2rem',
          color: 'var(--color-muted)',
          marginBottom: 'var(--space-lg)',
          opacity: 0.5,
        }}
      >
        {icon}
      </span>
      <h3
        className="type-display-sm"
        style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-stone)' }}
      >
        {title}
      </h3>
      <p className="type-body-sm" style={{ color: 'var(--color-muted)', maxWidth: 400 }}>
        {message}
      </p>
    </div>
  );
}
