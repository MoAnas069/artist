import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useIsMobile } from '../../hooks/useMediaQuery';
import LoadingState from '../../components/ui/LoadingState';
import Footer from '../../components/layout/Footer';
import BackToHome from '../../components/layout/BackToHome';
import MobileHeader from '../../components/layout/MobileHeader';

export default function Me() {
  const { settings, loading } = useSiteSettings();
  const isMobile = useIsMobile();

  if (loading) return <LoadingState />;

  if (isMobile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-ivory)',
          color: 'var(--color-charcoal)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <MobileHeader />

        <main
          style={{
            width: '100%',
            maxWidth: '460px',
            padding: '1rem clamp(1.25rem, 5vw, 2.5rem) 4rem',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Portrait in Rectangular Gallery Frame */}
          {settings.artistPortrait && (
            <div className="gallery-section-unit" style={{ width: '100%' }}>
              <div
                className="gallery-art-rectangle"
                style={{ aspectRatio: '4 / 5' }}
              >
                <img
                  src={settings.artistPortrait}
                  alt={settings.artistName}
                  loading="lazy"
                />
              </div>
              <span className="gallery-category-title">
                Biography
              </span>
            </div>
          )}

          {/* Statement */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vh, 4rem)', width: '100%' }}>
            <h1
              className="type-display-md"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: 'clamp(1.5rem, 5.5vw, 2rem)',
                lineHeight: 1.3,
                margin: '0 0 1.25rem 0',
                color: 'var(--color-charcoal)',
              }}
            >
              {settings.homepageStatement || 'Contemporary Illustration & Visual Storytelling'}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--color-stone)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {settings.shortBio}
            </p>
          </div>

          {/* Long Bio */}
          {settings.longBio && (
            <div
              style={{
                width: '100%',
                marginBottom: 'clamp(2.5rem, 6vh, 4rem)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.92rem',
                color: 'var(--color-charcoal)',
                lineHeight: 1.75,
              }}
              dangerouslySetInnerHTML={{ __html: settings.longBio }}
            />
          )}

          {/* About Sections / Accolades */}
          {settings.aboutSections && settings.aboutSections.length > 0 && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {settings.aboutSections.map((sec, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: 'var(--color-charcoal)',
                      display: 'block',
                      marginBottom: '0.6rem',
                    }}
                  >
                    {sec.title}
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      color: 'var(--color-stone)',
                      lineHeight: 1.6,
                      margin: 0,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>

        <footer
          style={{
            textAlign: 'center',
            padding: '1.5rem 1.5rem 4rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: 'var(--color-stone)',
            letterSpacing: '0.05em',
            marginTop: 'auto',
          }}
        >
          All artwork © {settings.artistName}
        </footer>
      </div>
    );
  }

  return (
    <main style={{ backgroundColor: 'var(--color-ivory)', color: 'var(--color-charcoal)' }}>
      <BackToHome />
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
