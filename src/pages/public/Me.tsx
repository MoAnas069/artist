import { useSiteSettings } from '../../hooks/useSiteSettings';
import LoadingState from '../../components/ui/LoadingState';
import Footer from '../../components/layout/Footer';

export default function Me() {
  const { settings, loading } = useSiteSettings();

  if (loading) return <LoadingState />;

  return (
    <main style={{ backgroundColor: 'var(--color-ivory)', color: 'var(--color-charcoal)' }}>
      {/* Hero — Centered vertically and horizontally in viewport */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 'var(--space-xl) var(--space-lg)',
          textAlign: 'center',
        }}
      >
        <span
          className="type-meta"
          style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-xl)', display: 'block' }}
        >
          ME
        </span>
        <h1
          className="type-display-xl"
          style={{ maxWidth: 900, margin: '0 auto', lineHeight: 1.15 }}
        >
          {settings.homepageStatement || 'I draw things I think about.'}
        </h1>
      </section>

      {/* Short Bio */}
      <section style={{ padding: 'var(--space-2xl) var(--space-lg)' }}>
        <div style={{ maxWidth: 'var(--content-width)', margin: '0 auto', textAlign: 'center' }}>
          <p className="type-body-lg" style={{ color: 'var(--color-stone)', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)' }}>
            {settings.shortBio}
          </p>
        </div>
      </section>

      {/* Portrait */}
      {settings.artistPortrait && (
        <section style={{ padding: 'var(--space-xl) var(--space-lg) var(--space-2xl)' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div className="artwork-image-container" style={{ aspectRatio: '3/4', width: '100%' }}>
              <img
                src={settings.artistPortrait}
                alt={settings.artistName}
                className="artwork-image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Long Bio */}
      {settings.longBio && (
        <section style={{ padding: 'var(--space-2xl) var(--space-lg)' }}>
          <div style={{ maxWidth: 'var(--content-width)', margin: '0 auto' }}>
            <div className="rich-text" dangerouslySetInnerHTML={{ __html: settings.longBio }} />
          </div>
        </section>
      )}

      {/* About Sections */}
      {settings.aboutSections.length > 0 && (
        <section style={{ padding: '0 var(--space-lg) var(--space-3xl)' }}>
          <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
            {settings.aboutSections
              .sort((a, b) => a.order - b.order)
              .map((section, i) => (
                <div key={i} style={{
                  padding: 'var(--space-2xl) 0',
                  borderTop: '1px solid var(--color-border)',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(120px, 200px) 1fr',
                  gap: 'var(--space-xl)',
                  alignItems: 'start',
                }}>
                  <span className="type-meta" style={{ color: 'var(--color-muted)', paddingTop: '0.3em' }}>
                    {section.title.toUpperCase()}
                  </span>
                  <div className="type-body" style={{ color: 'var(--color-stone)' }}>
                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section
        style={{
          padding: 'var(--space-3xl) var(--space-lg)',
          textAlign: 'center',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <span className="type-meta" style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-lg)', display: 'block' }}>
          GET IN TOUCH
        </span>
        <a
          href={`mailto:${settings.email}`}
          className="type-display-md link-underline"
          data-cursor="Email"
          style={{ color: 'var(--color-charcoal)' }}
        >
          {settings.email || 'hello@artist.com'}
        </a>
      </section>

      <Footer />
    </main>
  );
}
