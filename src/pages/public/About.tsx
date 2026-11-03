import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import inventoryData from '../../../content/inventory.json';

export default function About() {
  const { settings } = useSiteSettings();
  const artist = inventoryData.artist;

  return (
    <div className="dusk-page">
      <Helmet>
        <title>{`About & Studio Practice — ${settings.artistName || 'Chintwo'}`}</title>
        <meta
          name="description"
          content="Biography, studio philosophy, selected clients, and exhibition history of visual artist Chintwo."
        />
      </Helmet>

      <Navbar />

      <main id="main-content" className="dusk-about-page">
        {/* Header */}
        <section className="dusk-about-hero">
          <div className="dusk-section-index-badge">
            <span className="badge-num">03</span>
            <span className="badge-text">BIOGRAPHY & STUDIO</span>
          </div>
          <h1 className="dusk-about-title">The Artist Behind the Dusk</h1>
          <p className="dusk-about-lead">
            {artist.descriptor ||
              'Visual artist and illustrator exploring atmospheric worlds, memory, and myth through textured brushwork and quiet light.'}
          </p>
        </section>

        {/* 2-Column Split: Studio Portrait & Biography */}
        <section className="dusk-about-layout" aria-label="Artist Biography">
          <div className="dusk-about-portrait-wrap breathing-artwork">
            <img
              src={settings.artistPortrait || artist.portrait}
              alt="Chintwo in the studio"
              className="dusk-about-portrait"
            />
            <div className="dusk-about-portrait-caption">
              <span>CHINTWO STUDIO • LONDON</span>
              <span className="dot">•</span>
              <span>TRADITIONAL INKS & GRAPHITE STUDIES</span>
            </div>
          </div>

          <div className="dusk-about-content">
            <div className="dusk-about-block">
              <h2 className="dusk-about-subtitle">Artistic Philosophy</h2>
              <div
                className="dusk-about-text"
                dangerouslySetInnerHTML={{
                  __html:
                    settings.longBio ||
                    `<p>${artist.longBio.join('</p><p>')}</p>`,
                }}
              />
            </div>

            <div className="dusk-about-block">
              <h2 className="dusk-about-subtitle">Studio Practice & Mark-Making</h2>
              <p className="dusk-about-text">
                {artist.studioPractice}
              </p>
            </div>

            {/* Selected Clients */}
            <div className="dusk-about-block">
              <h2 className="dusk-about-subtitle">Selected Clients & Editorial Houses</h2>
              <ul className="dusk-client-tags">
                {artist.selectedClients.map((client) => (
                  <li key={client} className="dusk-client-tag">
                    {client}
                  </li>
                ))}
              </ul>
            </div>

            {/* Exhibitions & Accolades CV */}
            <div className="dusk-about-block">
              <h2 className="dusk-about-subtitle">Exhibitions & Accolades</h2>
              <div className="dusk-cv-list">
                {artist.exhibitions.map((ex, i) => (
                  <div key={i} className="dusk-cv-item">
                    <span className="dusk-cv-year">{ex.year}</span>
                    <div className="dusk-cv-details">
                      <strong className="dusk-cv-title">{ex.title}</strong>
                      <span className="dusk-cv-loc">{ex.location}</span>
                    </div>
                    <span className="dusk-cv-type">{ex.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiries Callout */}
            <div className="dusk-about-cta">
              <Link to="/contact" className="btn-dusk btn-dusk--primary">
                <Mail size={15} />
                <span>COMMISSION AN ARTWORK</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
