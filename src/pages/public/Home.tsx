import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Work from './Work';
import Me from './Me';
import Journal from './Journal';
import Shop from './Shop';
import Contact from './Contact';

export default function Home() {
  const { settings } = useSiteSettings();
  const navigate = useNavigate();

  const [pos, setPos] = useState<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
  });
  const [scrollY, setScrollY] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [isOverText, setIsOverText] = useState(false);
  const [isHoveringBtn, setIsHoveringBtn] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);

  const [isZooming, setIsZooming] = useState(false);
  const [zoomTarget, setZoomTarget] = useState<{
    path: string;
    label: string;
    component: React.ReactNode;
  } | null>(null);
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
  });

  const titleRef = useRef<HTMLHeadingElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetPos = useRef({ x: pos.x, y: pos.y });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkProximity = useCallback((x: number, y: number) => {
    if (!titleRef.current) return false;
    if (window.scrollY > window.innerHeight * 0.75) return false;

    const rect = titleRef.current.getBoundingClientRect();
    const paddingX = 80;
    const paddingY = 60;
    return (
      x >= rect.left - paddingX &&
      x <= rect.right + paddingX &&
      y >= rect.top - paddingY &&
      y <= rect.bottom + paddingY
    );
  }, []);

  useEffect(() => {
    if (isZooming) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!hasMoved) setHasMoved(true);

      const nearText = checkProximity(e.clientX, e.clientY);
      setIsOverText(nearText);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        targetPos.current = { x: touch.clientX, y: touch.clientY };
        if (!hasMoved) setHasMoved(true);

        const nearText = checkProximity(touch.clientX, touch.clientY);
        setIsOverText(nearText);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    let currentX = pos.x;
    let currentY = pos.y;

    const loop = () => {
      currentX += (targetPos.current.x - currentX) * 0.22;
      currentY += (targetPos.current.y - currentY) * 0.22;

      setPos({ x: Math.round(currentX * 10) / 10, y: Math.round(currentY * 10) / 10 });
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [checkProximity, hasMoved, isZooming, pos.x, pos.y]);

  useEffect(() => {
    if (window.location.hash === '#home-sections') {
      const timer = setTimeout(() => {
        document.getElementById('home-sections')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  const isSectionHovered = hoveredSection !== null;
  const isHeroActive = scrollY < (typeof window !== 'undefined' ? window.innerHeight * 0.8 : 700);
  const heroLensActive = isHeroActive && (isOverText || isHoveringBtn);

  const lensRadius = isHoveringBtn
    ? 205
    : heroLensActive
    ? 185
    : isSectionHovered
    ? 118
    : 16;

  const isEnlarged = isHoveringBtn || heroLensActive || isSectionHovered;

  const maxScreenDim = typeof window !== 'undefined'
    ? Math.max(window.innerWidth, window.innerHeight) * 1.6
    : 2800;

  const triggerPageZoom = useCallback(
    (path: string, label: string, component: React.ReactNode, originX?: number, originY?: number) => {
      if (isZooming) return;

      const clickX = originX ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
      const clickY = originY ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 400);

      setZoomOrigin({ x: clickX, y: clickY });
      setZoomTarget({ path, label, component });
      setIsZooming(true);

      setTimeout(() => {
        window.scrollTo(0, 0);
        navigate(path);
      }, 1350);
    },
    [isZooming, navigate]
  );

  const homeSections = [
    {
      label: 'Art',
      sublabel: settings.artSublabel || 'Selected Paintings, Drawings & Archive',
      path: '/work',
      component: <Work />,
      image: settings.artXrayImage || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&auto=format&fit=crop&q=85',
    },
    {
      label: 'Me',
      sublabel: settings.meSublabel || 'Biography, Philosophy & Studio Practice',
      path: '/me',
      component: <Me />,
      image: settings.meXrayImage || settings.artistPortrait || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1920&auto=format&fit=crop&q=85',
    },
    {
      label: 'Journal',
      sublabel: settings.journalSublabel || 'Studio Notes, Process & Literary Essays',
      path: '/journal',
      component: <Journal />,
      image: settings.journalXrayImage || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1920&auto=format&fit=crop&q=85',
    },
    {
      label: 'Shop',
      sublabel: settings.shopSublabel || 'Limited Edition Archival Prints & Objects',
      path: '/shop',
      component: <Shop />,
      image: settings.shopXrayImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1920&auto=format&fit=crop&q=85',
    },
    {
      label: 'Contact',
      sublabel: settings.contactSublabel || 'Commissions, Gallery Inquiries & Press',
      path: '/contact',
      component: <Contact />,
      image: settings.contactXrayImage || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1920&auto=format&fit=crop&q=85',
    },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--color-ivory)',
        color: 'var(--color-charcoal)',
        overflowX: 'hidden',
      }}
    >
      <style>{`
        * { cursor: none !important; }
      `}</style>

      {/* LAYER A: Clean White/Ivory Surface */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          backgroundColor: 'var(--color-ivory)',
          color: 'var(--color-charcoal)',
        }}
      >
        {/* Hero Section */}
        <section
          style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: 'var(--space-xl) var(--space-lg)',
            boxSizing: 'border-box',
          }}
        >
          <h1
            ref={titleRef}
            className="type-display-xl"
            style={{
              fontSize: 'clamp(3rem, 9vw, 7.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
              color: 'var(--color-charcoal)',
              maxWidth: 1100,
              margin: 0,
              transform: 'none',
            }}
          >
            {settings.artistName}
          </h1>
        </section>

        {/* Directory Sections (White Surface with Hidden Color) */}
        <div id="home-sections" style={{ width: '100%' }}>
          {homeSections.map((item, i) => (
            <div
              key={item.path}
              onClick={(e) => triggerPageZoom(item.path, item.label, item.component, e.clientX, e.clientY)}
              onMouseEnter={() => setHoveredSection(i)}
              onMouseLeave={() => setHoveredSection(null)}
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 'clamp(2.5rem, 5vh, 4rem) clamp(2rem, 6vw, 6rem)',
                minHeight: 'clamp(240px, 34vh, 380px)',
                boxSizing: 'border-box',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3.5rem, 7.5vw, 6.2rem)',
                  fontWeight: 400,
                  lineHeight: 1,
                  margin: 0,
                  color: 'var(--color-charcoal)',
                  letterSpacing: '-0.025em',
                }}
              >
                {item.label}
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)',
                  fontWeight: 400,
                  color: 'var(--color-stone)',
                  margin: '0.75rem 0 0 0',
                  letterSpacing: '0.01em',
                  maxWidth: 550,
                }}
              >
                {item.sublabel}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* LAYER B: Hidden Inner Colors & Dark Hero Layer (Clipped by the Circular X-Ray Aperture) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          pointerEvents: isEnlarged ? 'auto' : 'none',
          clipPath: `circle(${lensRadius}px at ${pos.x}px ${pos.y + scrollY}px)`,
          WebkitClipPath: `circle(${lensRadius}px at ${pos.x}px ${pos.y + scrollY}px)`,
          transition: 'clip-path 0.35s cubic-bezier(0.16, 1, 0.3, 1), -webkit-clip-path 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
        }}
      >
        {/* Hidden Hero: Dark Screen with Artist Bio & Portal */}
        <div
          style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            backgroundColor: '#070709',
            color: 'var(--color-ivory)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: 'clamp(2rem, 8vh, 6rem) clamp(1.5rem, 6vw, 6rem)',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              opacity: 0.4,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 3,
              maxWidth: 660,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.15rem, 2.2vw, 1.55rem)',
                fontWeight: 450,
                lineHeight: 1.5,
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              {settings.homepageStatement || 'Drawing the quiet spaces between memory and myth.'}
            </p>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: 'rgba(255, 255, 255, 0.72)',
                lineHeight: 1.7,
                maxWidth: 540,
                margin: '0 auto',
                fontSize: 'clamp(0.875rem, 1.3vw, 1rem)',
              }}
            >
              {settings.shortBio || 'Contemporary illustrator and visual storyteller exploring solitude, chiaroscuro, and atmosphere through traditional and digital mediums.'}
            </p>

            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color: 'rgba(255, 255, 255, 0.4)',
                letterSpacing: '0.15em',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
              }}
            >
              STUDIO ARCHIVE · LONDON & CORNWALL
            </span>

            <div style={{ marginTop: '0.75rem' }}>
              <button
                onClick={(e) => triggerPageZoom('/me', 'Me', <Me />, e.clientX, e.clientY)}
                onMouseEnter={() => setIsHoveringBtn(true)}
                onMouseLeave={() => setIsHoveringBtn(false)}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.8rem 2.25rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  backgroundColor: isHoveringBtn ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                  color: isHoveringBtn ? '#0a0a0a' : '#ffffff',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  boxShadow: isHoveringBtn ? '0 0 35px rgba(255, 255, 255, 0.45)' : '0 4px 20px rgba(0, 0, 0, 0.5)',
                }}
              >
                <span>ENTER ABOUT ME</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hidden Sections: Vivid Inner Colors Revealed Through the Circular Cursor */}
        <div style={{ width: '100%' }}>
          {homeSections.map((item, i) => (
            <div
              key={item.path}
              onClick={(e) => triggerPageZoom(item.path, item.label, item.component, e.clientX, e.clientY)}
              onMouseEnter={() => setHoveredSection(i)}
              onMouseLeave={() => setHoveredSection(null)}
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 'clamp(2.5rem, 5vh, 4rem) clamp(2rem, 6vw, 6rem)',
                minHeight: 'clamp(240px, 34vh, 380px)',
                boxSizing: 'border-box',
                cursor: 'pointer',
                backgroundImage: `linear-gradient(rgba(8, 8, 10, 0.45), rgba(8, 8, 10, 0.65)), url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#ffffff',
                border: 'none',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3.5rem, 7.5vw, 6.2rem)',
                  fontWeight: 400,
                  lineHeight: 1,
                  margin: 0,
                  color: '#ffffff',
                  letterSpacing: '-0.025em',
                  textShadow: '0 6px 30px rgba(0, 0, 0, 0.85)',
                }}
              >
                {item.label}
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)',
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.92)',
                  margin: '0.75rem 0 0 0',
                  letterSpacing: '0.01em',
                  maxWidth: 550,
                  textShadow: '0 2px 16px rgba(0, 0, 0, 0.8)',
                }}
              >
                {item.sublabel}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Persistent Single Circular Lens Reticle (Following Cursor Everywhere) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 900,
          transform: `translate3d(${pos.x - lensRadius}px, ${pos.y - lensRadius}px, 0)`,
          width: lensRadius * 2,
          height: lensRadius * 2,
          borderRadius: '50%',
          border: isEnlarged
            ? '1.8px solid rgba(255, 255, 255, 0.95)'
            : '1.2px solid rgba(26, 26, 26, 0.65)',
          boxShadow: isEnlarged
            ? '0 0 35px rgba(0, 0, 0, 0.35), inset 0 0 15px rgba(255, 255, 255, 0.2)'
            : '0 0 6px rgba(0, 0, 0, 0.08)',
          transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1), height 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: isZooming ? 0 : 1,
        }}
      >
        {!isEnlarged && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: 'rgba(26, 26, 26, 0.85)',
            }}
          />
        )}
      </div>

      {/* Destination Page Circular Aperture Expansion */}
      {isZooming && zoomTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'var(--color-ivory)',
            color: 'var(--color-charcoal)',
            animation: 'expandAperture 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            overflow: 'hidden',
          }}
        >
          <style>{`
            @keyframes expandAperture {
              from {
                clip-path: circle(100px at ${zoomOrigin.x}px ${zoomOrigin.y}px);
                -webkit-clip-path: circle(100px at ${zoomOrigin.x}px ${zoomOrigin.y}px);
              }
              to {
                clip-path: circle(${maxScreenDim}px at ${zoomOrigin.x}px ${zoomOrigin.y}px);
                -webkit-clip-path: circle(${maxScreenDim}px at ${zoomOrigin.x}px ${zoomOrigin.y}px);
              }
            }
          `}</style>
          <div
            style={{
              width: '100%',
              minHeight: '100vh',
              backgroundColor: 'var(--color-ivory)',
              color: 'var(--color-charcoal)',
            }}
          >
            {zoomTarget.component}
          </div>
        </div>
      )}
    </div>
  );
}
