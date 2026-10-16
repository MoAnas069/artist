import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryProvider, useGallery } from '../../hooks/useGallery';
import { getGallerySections } from '../../services/galleryService';
import type { GallerySection } from '../../types/gallery';
import { DEFAULT_GALLERY_SECTIONS } from '../../types/gallery';
import GalleryScene from '../../components/gallery/GalleryScene';
import IntroSequence from '../../components/gallery/IntroSequence';
import GalleryHUD from '../../components/gallery/GalleryHUD';
import MobileGallery from '../../components/gallery/MobileGallery';

export default function Home() {
  return (
    <GalleryProvider>
      <HomeInner />
    </GalleryProvider>
  );
}

function HomeInner() {
  const navigate = useNavigate();
  const { state } = useGallery();
  const [sections, setSections] = useState<GallerySection[]>(DEFAULT_GALLERY_SECTIONS);
  const [webGLSupported, setWebGLSupported] = useState(true);

  // Load gallery config from Firebase / local cache in background
  useEffect(() => {
    getGallerySections()
      .then((s) => {
        if (s && s.length > 0) setSections(s);
      })
      .catch((err) => console.warn('Could not load sections from cloud:', err));
  }, []);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) setWebGLSupported(false);
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  // Handle navigation to section pages
  const handleNavigate = useCallback(
    (destination: string) => {
      navigate(destination);
    },
    [navigate]
  );

  // Listen for frame enter events from the 3D scene
  useEffect(() => {
    const handleFrameEnter = (e: Event) => {
      const sectionId = (e as CustomEvent).detail;
      const section = sections.find((s) => s.sectionId === sectionId);
      if (section) {
        setTimeout(() => navigate(section.destination), 800);
      }
    };

    window.addEventListener('gallery_enter_section', handleFrameEnter);

    const handleDirectNav = (e: Event) => {
      const dest = (e as CustomEvent).detail;
      if (dest) {
        navigate(dest);
      }
    };
    window.addEventListener('gallery_navigate_direct', handleDirectNav);

    return () => {
      window.removeEventListener('gallery_enter_section', handleFrameEnter);
      window.removeEventListener('gallery_navigate_direct', handleDirectNav);
    };
  }, [sections, navigate]);

  // Fallback to 2D card list only if WebGL is not supported
  if (!webGLSupported) {
    return <MobileGallery sections={sections} />;
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#F2EDE7',
      }}
    >
      {/* ─── 3D Gallery Canvas ─────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: state.phase === 'intro' ? 0.3 : 1,
          transition: 'opacity 1.5s ease',
        }}
      >
        <GalleryScene sections={sections} />
      </div>

      {/* ─── Intro Overlay ─────────────────────────── */}
      <IntroSequence />

      {/* ─── Gallery HUD ──────────────────────────── */}
      <GalleryHUD
        sections={sections}
        onNavigate={handleNavigate}
      />

      {/* ─── Section Transition Overlay ────────────── */}
      <AnimatePresence>
        {state.phase === 'transitioning' && (
          <motion.div
            key="transition-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'var(--color-ivory)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
