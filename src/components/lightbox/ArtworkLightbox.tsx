import { useEffect, useState, useRef } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import type { Artwork } from '../../types';

interface ArtworkLightboxProps {
  artworks: Artwork[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (idx: number) => void;
}

export default function ArtworkLightbox({
  artworks,
  currentIndex,
  isOpen,
  onClose,
  onSelectIndex,
}: ArtworkLightboxProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const currentArtwork = artworks[currentIndex];

  useEffect(() => {
    // Reset zoom on artwork change or close
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex, isOpen]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < artworks.length - 1) onSelectIndex(currentIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) onSelectIndex(currentIndex - 1);
      } else if (e.key === '+' || e.key === '=') {
        setScale((s) => Math.min(s + 0.5, 3.5));
      } else if (e.key === '-' || e.key === '_') {
        setScale((s) => Math.max(s - 0.5, 1));
      } else if (e.key === '0') {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, artworks.length, onClose, onSelectIndex]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !currentArtwork) return null;

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.5, 3.5));
  const handleZoomOut = () => {
    setScale((s) => {
      const next = Math.max(s - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handlePointerUp = () => setIsDragging(false);

  return (
    <div
      className="dusk-lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Detailed view of ${currentArtwork.title}`}
    >
      {/* Top Bar */}
      <div className="dusk-lightbox-topbar">
        <div className="dusk-lightbox-meta">
          <span className="dusk-lightbox-index">
            {String(currentIndex + 1).padStart(2, '0')} / {String(artworks.length).padStart(2, '0')}
          </span>
          <h2 className="dusk-lightbox-title">{currentArtwork.title}</h2>
          <span className="dusk-lightbox-year">{currentArtwork.year}</span>
        </div>

        <div className="dusk-lightbox-controls">
          <button
            type="button"
            onClick={handleZoomIn}
            className="dusk-lightbox-btn"
            title="Zoom In (+)"
            aria-label="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="dusk-lightbox-btn"
            disabled={scale <= 1}
            title="Zoom Out (-)"
            aria-label="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          {scale > 1 && (
            <button
              type="button"
              onClick={handleResetZoom}
              className="dusk-lightbox-btn"
              title="Reset Zoom (0)"
              aria-label="Reset Zoom"
            >
              <RotateCcw size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="dusk-lightbox-btn dusk-lightbox-close"
            title="Close Lightbox (Esc)"
            aria-label="Close Lightbox"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="dusk-lightbox-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="dusk-lightbox-img-wrap"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (scale === 1) handleZoomIn();
          }}
        >
          <img
            src={currentArtwork.coverImage || (currentArtwork.images && currentArtwork.images[0])}
            alt={currentArtwork.title}
            className="dusk-lightbox-img"
            draggable={false}
          />
        </div>

        {/* Prev / Next Chevrons */}
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectIndex(currentIndex - 1);
            }}
            className="dusk-lightbox-nav prev"
            aria-label="Previous artwork"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {currentIndex < artworks.length - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectIndex(currentIndex + 1);
            }}
            className="dusk-lightbox-nav next"
            aria-label="Next artwork"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Bottom Bar: Artwork Details */}
      <div className="dusk-lightbox-bottombar">
        <div className="dusk-lightbox-specs">
          {currentArtwork.medium && <span>{currentArtwork.medium}</span>}
          {currentArtwork.dimensions && <span className="spec-dot">•</span>}
          {currentArtwork.dimensions && <span>{currentArtwork.dimensions}</span>}
          {currentArtwork.credits && <span className="spec-dot">•</span>}
          {currentArtwork.credits && <span>{currentArtwork.credits}</span>}
        </div>
      </div>
    </div>
  );
}
