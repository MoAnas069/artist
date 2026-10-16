import { createContext, useContext, useCallback, useRef, useState, type ReactNode } from 'react';
import type { GalleryState, GalleryPhase, CameraTarget } from '../types/gallery';

const INITIAL_STATE: GalleryState = {
  phase: 'intro',
  hoveredBoard: null,
  selectedBoard: null,
  focusedFrame: null,
  cameraTarget: null,
  lastGalleryCamera: null,
  introComplete: false,
  transitionLocked: false,
};

interface GalleryContextType {
  state: GalleryState;
  setPhase: (phase: GalleryPhase) => void;
  hoverBoard: (id: string | null) => void;
  selectBoard: (id: string) => void;
  focusFrame: (id: string) => void;
  enterSection: (id: string) => void;
  returnToGallery: () => void;
  completeIntro: () => void;
  setCameraTarget: (target: CameraTarget | null) => void;
  saveGalleryCamera: (target: CameraTarget) => void;
  isTransitionLocked: () => boolean;
}

const GalleryContext = createContext<GalleryContextType | null>(null);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GalleryState>(INITIAL_STATE);
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lockTransition = useCallback((durationMs: number = 2000) => {
    setState((s) => ({ ...s, transitionLocked: true }));
    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    lockTimeoutRef.current = setTimeout(() => {
      setState((s) => ({ ...s, transitionLocked: false }));
    }, durationMs);
  }, []);

  const isTransitionLocked = useCallback(() => state.transitionLocked, [state.transitionLocked]);

  const setPhase = useCallback((phase: GalleryPhase) => {
    setState((s) => ({ ...s, phase }));
  }, []);

  const hoverBoard = useCallback((id: string | null) => {
    setState((s) => {
      if (s.transitionLocked || s.phase === 'approaching' || s.phase === 'transitioning') return s;
      return { ...s, hoveredBoard: id };
    });
  }, []);

  const selectBoard = useCallback((id: string) => {
    setState((s) => {
      if (s.transitionLocked || s.phase !== 'gallery') return s;
      return {
        ...s,
        selectedBoard: id,
        phase: 'approaching',
        hoveredBoard: null,
      };
    });
    lockTransition(2000);
  }, [lockTransition]);

  const focusFrame = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      focusedFrame: id,
      phase: 'focused',
      transitionLocked: false,
    }));
  }, []);

  const enterSection = useCallback((id: string) => {
    setState((s) => {
      if (s.transitionLocked || s.phase !== 'focused') return s;
      return {
        ...s,
        phase: 'transitioning',
        focusedFrame: id,
      };
    });
    lockTransition(1500);
  }, [lockTransition]);

  const returnToGallery = useCallback(() => {
    setState((s) => ({
      ...s,
      phase: 'returning',
      selectedBoard: null,
      focusedFrame: null,
    }));
    lockTransition(1800);
    setTimeout(() => {
      setState((s) => ({
        ...s,
        phase: 'gallery',
        transitionLocked: false,
      }));
    }, 1200);
  }, [lockTransition]);

  const completeIntro = useCallback(() => {
    setState((s) => ({
      ...s,
      phase: 'gallery',
      introComplete: true,
    }));
    // Store in sessionStorage so intro doesn't replay
    try {
      sessionStorage.setItem('chintwo_intro_complete', '1');
    } catch {}
  }, []);

  const setCameraTarget = useCallback((target: CameraTarget | null) => {
    setState((s) => ({ ...s, cameraTarget: target }));
  }, []);

  const saveGalleryCamera = useCallback((target: CameraTarget) => {
    setState((s) => ({ ...s, lastGalleryCamera: target }));
  }, []);

  return (
    <GalleryContext.Provider
      value={{
        state,
        setPhase,
        hoverBoard,
        selectBoard,
        focusFrame,
        enterSection,
        returnToGallery,
        completeIntro,
        setCameraTarget,
        saveGalleryCamera,
        isTransitionLocked,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const ctx = useContext(GalleryContext);
  if (!ctx) throw new Error('useGallery must be used within GalleryProvider');
  return ctx;
}
