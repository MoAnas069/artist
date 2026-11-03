import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function About() {
  const { settings } = useSiteSettings();

  const portraitUrl =
    settings.artistPortrait ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80';

  const studioUrl =
    settings.meXrayImage ||
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className="page-wrap">
      <Helmet>
        <title>{`The Person — Biography & Studio Practice | ${settings.artistName || 'CHINTWO'}`}</title>
        <meta
          name="description"
          content={`Biography, studio philosophy, and creative practice of ${settings.artistName || 'CHINTWO'}, contemporary visual artist and storyteller.`}
        />
      </Helmet>

      <Navbar />

      <main id="main-content" className="page-content">
        {/* Editorial Top Index Bar */}
        <div style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '1rem 0',
              }}
            >
              <span className="type-meta">02 / THE PERSON</span>
              <span className="type-meta">MONOGRAPH &amp; STUDIO PRACTICE</span>
            </div>
          </div>
        </div>

        {/* ─── 01 Introduction (Expressive Typography) ─── */}
        <section className="section" style={{ paddingBottom: 'clamp(3rem, 6vh, 5rem)' }}>
          <div className="container">
            <div className="page-header-grid">
              <div className="page-header-grid__title">
                <span className="type-meta" style={{ display: 'block', marginBottom: '1.25rem' }}>
                  THE ARTIST &amp; PRACTICE
                </span>
                <motion.h1
                  className="type-display-hero"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{ lineHeight: 0.95 }}
                >
                  {settings.artistName || 'CHINTWO'}
                </motion.h1>
              </div>

              <div className="page-header-grid__desc" style={{ textAlign: 'right' }}>
                <span className="type-hand" style={{ fontSize: '1.5rem', display: 'block' }}>
                  “Stories held in ink”
                </span>
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--color-border)',
                marginTop: 'clamp(2.5rem, 5vw, 4rem)',
                paddingTop: 'clamp(2rem, 4vw, 3rem)',
              }}
            >
              <p
                className="type-editorial-lg"
                style={{
                  maxWidth: '880px',
                  color: 'var(--color-charcoal)',
                  lineHeight: 1.6,
                }}
              >
                {settings.shortBio ||
                  'Visual artist and illustrator exploring atmospheric worlds, memory, and myth through textured brushwork and quiet light.'}
              </p>
            </div>
          </div>
        </section>

        {/* ─── 02 The Artist (Portrait + Written Bio) ─── */}
        <section
          className="section"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="container">
            <div className="editorial-split-5-7">
              {/* Portrait */}
              <div className="editorial-split-5-7__side">
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-alt)',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
                    position: 'relative',
                  }}
                >
                  <img
                    src={portraitUrl}
                    alt={settings.artistName || 'CHINTWO'}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  <div
                    style={{
                      padding: '1rem',
                      borderTop: '1px solid var(--color-border-light)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span className="type-meta-sm">STUDIO PORTRAIT</span>
                    <span className="type-meta-sm">{settings.artistName}</span>
                  </div>
                </div>
              </div>

              {/* Biography Text */}
              <div className="editorial-split-5-7__main">
                <span className="section-label" style={{ marginBottom: '1.5rem' }}>
                  02 / BIOGRAPHY
                </span>
                <h2 className="type-display-md" style={{ marginBottom: '1.75rem' }}>
                  The Journey Through Light &amp; Shadow
                </h2>

                <div
                  className="rich-text"
                  dangerouslySetInnerHTML={{
                    __html:
                      settings.longBio ||
                      `<p>Chintwo is a contemporary artist and visual storyteller specializing in atmospheric illustration, textured mark-making, and narrative image creation.</p>
                      <p>Working across traditional inks, graphite, and expressive digital refinement, Chintwo builds evocative imagery centered on quiet reflection, chiaroscuro lighting, and poetic human narratives.</p>
                      <p>The practice is deeply rooted in personal memories, literary allegories, and the contemplative moods of natural and architectural spaces.</p>`,
                  }}
                />

                <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <Link to="/work" className="btn-editorial btn-editorial--filled">
                    View Catalogue of Works
                  </Link>
                  <Link to="/contact" className="btn-editorial">
                    Direct Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 03 Creative Perspective & Philosophy ─── */}
        <section className="section">
          <div className="container">
            <div className="editorial-split-5-7">
              <div className="editorial-split-5-7__side">
                <span className="section-label" style={{ marginBottom: '1.25rem' }}>
                  03 / PHILOSOPHY
                </span>
                <h2 className="type-display-lg" style={{ lineHeight: 1.1 }}>
                  Creative Perspective
                </h2>
              </div>

              <div className="editorial-split-5-7__main">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 'clamp(1.5rem, 3vw, 3rem)' }}>
                  <div>
                    <h3 className="type-display-sm" style={{ marginBottom: '0.75rem' }}>
                      Atmosphere as Narrative
                    </h3>
                    <p className="type-body" style={{ color: 'var(--color-stone)' }}>
                      Every composition begins with the emotional weight of atmospheric lighting. The mood of a scene is established before the subject takes distinct shape, ensuring that visual space carries psychological presence.
                    </p>
                  </div>

                  <div>
                    <h3 className="type-display-sm" style={{ marginBottom: '0.75rem' }}>
                      Tactile Materiality
                    </h3>
                    <p className="type-body" style={{ color: 'var(--color-stone)' }}>
                      Whether working on heavy archival watercolor cotton or through digital pens, the tactile quality of mark-making—paper tooth, raw pigment granules, and graphite dust—remains paramount to the finished experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 04 Behind the Work (Studio Practice) ─── */}
        <section
          className="section"
          style={{
            backgroundColor: 'var(--color-bg-alt)',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: 'clamp(2rem, 4vw, 3.5rem)',
              }}
            >
              <div>
                <span className="section-label" style={{ marginBottom: '0.75rem' }}>
                  04 / PROCESS
                </span>
                <h2 className="type-display-xl">Behind the Work</h2>
              </div>
              <span className="type-hand" style={{ fontSize: '1.35rem' }}>
                “Where the ink touches the paper”
              </span>
            </div>

            <div className="editorial-split-7-5" style={{ alignItems: 'center' }}>
              <div className="editorial-split-7-5__main">
                <div style={{ backgroundColor: 'var(--color-surface)', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
                  <img
                    src={studioUrl}
                    alt="CHINTWO Studio Atmosphere"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid var(--color-border-light)' }}>
                    <span className="type-meta-sm">STUDIO ARCHIVE • MATERIAL STUDIES &amp; NOTEBOOKS</span>
                  </div>
                </div>
              </div>

              <div className="editorial-split-7-5__side">
                <h3 className="type-display-md" style={{ marginBottom: '1rem' }}>
                  From Sketchbook to Finished Canvas
                </h3>
                <p className="type-editorial" style={{ color: 'var(--color-charcoal)', marginBottom: '1.5rem' }}>
                  All finished pieces originate in handheld, cloth-bound sketchbooks. Loose graphite washes and rapid pen gestures capture fleeting ideas before they are methodically refined onto museum-grade archival grounds.
                </p>
                <div style={{ borderLeft: '2px solid var(--color-charcoal)', paddingLeft: '1.25rem' }}>
                  <p className="type-body-sm" style={{ fontStyle: 'italic', color: 'var(--color-stone)' }}>
                    “The imperfections in the raw wash are where the soul of the drawing lives. Digital tools only enhance what traditional pigment discovered first.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 05 Selected Information (Exhibitions, Clients, Accolades) ─── */}
        {settings.aboutSections && settings.aboutSections.length > 0 && (
          <section className="section">
            <div className="container">
              <span className="section-label" style={{ marginBottom: 'clamp(2rem, 4vw, 3.5rem)' }}>
                05 / SELECTED INFORMATION
              </span>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 'clamp(2rem, 4vw, 4rem)',
                }}
              >
                {settings.aboutSections.map((sec, i) => (
                  <div key={i} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                    <h3 className="type-meta" style={{ color: 'var(--color-charcoal)', marginBottom: '1rem' }}>
                      {sec.title}
                    </h3>
                    <div
                      className="type-body"
                      style={{ color: 'var(--color-stone)', whiteSpace: 'pre-line', lineHeight: 1.7 }}
                    >
                      {sec.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── 06 Closing Statement ─── */}
        <section
          className="section-lg"
          style={{
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            textAlign: 'center',
          }}
        >
          <div className="container-narrow">
            <span className="section-label" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
              06 / DIALOGUE
            </span>
            <h2 className="type-display-lg" style={{ marginBottom: '1.5rem' }}>
              Collaborate with the Artist
            </h2>
            <p
              className="type-editorial"
              style={{
                color: 'var(--color-stone)',
                marginBottom: '2.5rem',
                maxWidth: '560px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Interested in commissioning custom visual artwork, gallery exhibition loans, or creative collaboration?
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-editorial btn-editorial--filled">
                Get in Touch
              </Link>
              <Link to="/journal" className="btn-editorial">
                Read Field Notes
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
