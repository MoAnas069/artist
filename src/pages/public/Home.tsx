import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useIsMobile } from '../../hooks/useMediaQuery';
import Work from './Work';
import Me from './Me';
import Journal from './Journal';
import Shop from './Shop';
import Contact from './Contact';

export default function Home() {
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  const [activeSections, setActiveSections] = useState<Record<number, boolean>>({});
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetPos = useRef({ x: pos.x, y: pos.y });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      if (isMobile) {
        const vHeight = window.innerHeight;
        const newActive: Record<number, boolean> = {};

        sectionRefs.current.forEach((el, idx) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          // Active when the section overlaps the central zone of the mobile screen
          const isInCenterZone = rect.top < vHeight * 0.72 && rect.bottom > vHeight * 0.28;
          newActive[idx] = isInCenterZone;
        });

        setActiveSections(newActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    if (isMobile) {
      setTimeout(handleScroll, 100);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

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
      slides: [
        settings.artXrayImage || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1920&auto=format&fit=crop&q=85',
      ],
      driftAnim: 'kenBurnsDrift1',
    },
    {
      label: 'Me',
      sublabel: settings.meSublabel || 'Biography, Philosophy & Studio Practice',
      path: '/me',
      component: <Me />,
      slides: [
        settings.meXrayImage || settings.artistPortrait || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1920&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1920&auto=format&fit=crop&q=85',
      ],
      driftAnim: 'kenBurnsDrift2',
    },
    {
      label: 'Journal',
      sublabel: settings.journalSublabel || 'Studio Notes, Process & Literary Essays',
      path: '/journal',
      component: <Journal />,
      slides: [
        settings.journalXrayImage || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1920&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920&auto=format&fit=crop&q=85',
      ],
      driftAnim: 'kenBurnsDrift3',
    },
    {
      label: 'Shop',
      sublabel: settings.shopSublabel || 'Limited Edition Archival Prints & Objects',
      path: '/shop',
      component: <Shop />,
      slides: [
        settings.shopXrayImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1920&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1920&auto=format&fit=crop&q=85',
      ],
      driftAnim: 'kenBurnsDrift1',
    },
    {
      label: 'Contact',
      sublabel: settings.contactSublabel || 'Commissions, Gallery Inquiries & Press',
      path: '/contact',
      component: <Contact />,
      slides: [
        settings.contactXrayImage || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1920&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=85',
      ],
      driftAnim: 'kenBurnsDrift2',
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
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
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

        {/* Directory Sections (Scroll-Transformed on Mobile | Cursor X-Ray on Desktop) */}
        <div id="home-sections" style={{ width: '100%' }}>
          {homeSections.map((item, i) => {
            const isTransformed = isMobile && !!activeSections[i];

            return (
              <div
                key={item.path}
                ref={(el) => { sectionRefs.current[i] = el; }}
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
                  overflow: 'hidden',
                }}
              >
                {/* Surface White Typography */}
                <h2
                  style={{
                    position: 'relative',
                    zIndex: 1,
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
                    position: 'relative',
                    zIndex: 1,
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

                {/* Mobile Scroll-Driven Transformation: Circular aperture expands as you scroll to each section */}
                {isMobile && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 2,
                      clipPath: isTransformed
                        ? 'circle(125% at 50% 50%)'
                        : 'circle(0% at 50% 50%)',
                      WebkitClipPath: isTransformed
                        ? 'circle(125% at 50% 50%)'
                        : 'circle(0% at 50% 50%)',
                      transition: 'clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1), -webkit-clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      padding: 'clamp(2.5rem, 5vh, 4rem) clamp(2rem, 6vw, 6rem)',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                      pointerEvents: 'none',
                    }}
                  >
                    {/* Animated living artwork background */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: '-14%',
                        width: '128%',
                        height: '128%',
                        backgroundImage: `linear-gradient(rgba(10, 10, 14, 0.42), rgba(10, 10, 14, 0.7)), url(${item.slides[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        animation: `${item.driftAnim} 20s ease-in-out infinite alternate`,
                      }}
                    />

                    {/* Floating golden studio dust particles */}
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                      {[15, 38, 62, 85].map((leftPct, pIdx) => (
                        <span
                          key={pIdx}
                          style={{
                            position: 'absolute',
                            left: `${leftPct}%`,
                            bottom: '-10px',
                            width: `${3 + (pIdx % 2)}px`,
                            height: `${3 + (pIdx % 2)}px`,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 230, 180, 0.75)',
                            boxShadow: '0 0 8px rgba(255, 220, 150, 0.8)',
                            animation: `floatingMote ${7 + pIdx * 2}s ease-in-out infinite`,
                            animationDelay: `${pIdx * 1.2}s`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Shimmer light sweep */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: '-100%',
                        background: 'linear-gradient(115deg, transparent 40%, rgba(255, 255, 255, 0.15) 50%, transparent 60%)',
                        pointerEvents: 'none',
                        animation: `shimmerSweep ${10 + i * 2}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                        animationDelay: `${i * 1.8}s`,
                      }}
                    />

                    {/* Transformed Title & Subtitle */}
                    <h2
                      style={{
                        position: 'relative',
                        zIndex: 3,
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(3.5rem, 7.5vw, 6.2rem)',
                        fontWeight: 400,
                        lineHeight: 1,
                        margin: 0,
                        color: '#ffffff',
                        letterSpacing: '-0.025em',
                        textShadow: '0 4px 20px rgba(0, 0, 0, 0.9)',
                      }}
                    >
                      {item.label}
                    </h2>

                    <p
                      style={{
                        position: 'relative',
                        zIndex: 3,
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)',
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.92)',
                        margin: '0.75rem 0 0 0',
                        letterSpacing: '0.01em',
                        maxWidth: 550,
                        textShadow: '0 2px 14px rgba(0, 0, 0, 0.85)',
                      }}
                    >
                      {item.sublabel}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* LAYER B: Hidden Inner Colors & Dark Hero Layer (Clipped by the Circular X-Ray Aperture on Desktop) */}
      {!isMobile && (
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

          {/* Ambient Glowing Aura */}
          <div
            style={{
              position: 'absolute',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(160, 130, 240, 0.18) 0%, rgba(220, 175, 110, 0.1) 45%, transparent 70%)',
              filter: 'blur(60px)',
              animation: 'auraBreath 9s ease-in-out infinite alternate',
              pointerEvents: 'none',
            }}
          />

          {/* Floating Stardust Motes */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {[18, 36, 52, 70, 84].map((leftPct, pIdx) => (
              <span
                key={pIdx}
                style={{
                  position: 'absolute',
                  left: `${leftPct}%`,
                  bottom: '-10px',
                  width: `${3 + (pIdx % 3)}px`,
                  height: `${3 + (pIdx % 3)}px`,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                  animation: `floatingMote ${8 + (pIdx % 3) * 2}s ease-in-out infinite`,
                  animationDelay: `${pIdx * 1.6}s`,
                }}
              />
            ))}
          </div>

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
                color: '#ffffff',
                border: 'none',
                overflow: 'hidden',
              }}
            >
              {/* Dynamic Living Artwork Background: Continuous Ken Burns Motion & Parallax */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-14%',
                  width: '128%',
                  height: '128%',
                  pointerEvents: 'none',
                  transform: `translate3d(${((pos.x / (typeof window !== 'undefined' ? window.innerWidth : 1000)) - 0.5) * -30}px, ${((pos.y / (typeof window !== 'undefined' ? window.innerHeight : 800)) - 0.5) * -20}px, 0)`,
                  transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform',
                }}
              >
                {/* Primary animated artwork with slow cinematic pan & zoom */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `linear-gradient(rgba(10, 10, 14, 0.42), rgba(10, 10, 14, 0.68)), url(${item.slides[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    animation: `${item.driftAnim} 20s ease-in-out infinite alternate`,
                  }}
                />

                {/* Secondary cross-fading animated artwork layer */}
                {item.slides[1] && item.slides[1] !== item.slides[0] && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `linear-gradient(rgba(10, 10, 14, 0.42), rgba(10, 10, 14, 0.68)), url(${item.slides[1]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      animation: `artworkCrossfade 12s ease-in-out infinite alternate, ${item.driftAnim === 'kenBurnsDrift1' ? 'kenBurnsDrift2' : 'kenBurnsDrift3'} 24s ease-in-out infinite alternate`,
                    }}
                  />
                )}
              </div>

              {/* Shimmering editorial light sweep */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-100%',
                  background: 'linear-gradient(115deg, transparent 42%, rgba(255, 255, 255, 0.14) 50%, transparent 58%)',
                  pointerEvents: 'none',
                  animation: `shimmerSweep ${9 + i * 2.5}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                  animationDelay: `${i * 1.5}s`,
                }}
              />

              {/* Ethereal Floating Studio Dust Motes */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  overflow: 'hidden',
                }}
              >
                {[12, 28, 48, 68, 85].map((leftPct, pIdx) => (
                  <span
                    key={pIdx}
                    style={{
                      position: 'absolute',
                      left: `${leftPct}%`,
                      bottom: '-15px',
                      width: `${3 + (pIdx % 3)}px`,
                      height: `${3 + (pIdx % 3)}px`,
                      borderRadius: '50%',
                      backgroundColor: pIdx % 2 === 0 ? 'rgba(255, 230, 180, 0.75)' : 'rgba(255, 255, 255, 0.65)',
                      boxShadow: '0 0 10px rgba(255, 220, 150, 0.9)',
                      animation: `floatingMote ${7 + (pIdx % 3) * 2.5}s ease-in-out infinite`,
                      animationDelay: `${pIdx * 1.4}s`,
                    }}
                  />
                ))}
              </div>

              {/* Title with refined depth */}
              <h2
                style={{
                  position: 'relative',
                  zIndex: 2,
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3.5rem, 7.5vw, 6.2rem)',
                  fontWeight: 400,
                  lineHeight: 1,
                  margin: 0,
                  color: '#ffffff',
                  letterSpacing: '-0.025em',
                  textShadow: '0 6px 30px rgba(0, 0, 0, 0.9)',
                  transform: hoveredSection === i ? 'scale(1.025)' : 'scale(1)',
                  transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {item.label}
              </h2>

              <p
                style={{
                  position: 'relative',
                  zIndex: 2,
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)',
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.92)',
                  margin: '0.75rem 0 0 0',
                  letterSpacing: '0.01em',
                  maxWidth: 550,
                  textShadow: '0 2px 16px rgba(0, 0, 0, 0.85)',
                  transform: hoveredSection === i ? 'translateY(-2px)' : 'none',
                  transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {item.sublabel}
              </p>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Persistent Single Circular Lens Reticle (Following Cursor Everywhere on Desktop) */}
      {!isMobile && (
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
      )}

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
