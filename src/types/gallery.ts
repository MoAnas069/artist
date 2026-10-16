// ─── Gallery Configuration Types ─────────────────────────
export interface GallerySection {
  sectionId: string;
  title: string;
  subtitle: string;
  slug: string;
  wall: 'left' | 'right';
  sortOrder: number;
  visible: boolean;
  frameImage: string;
  frameType: 'portrait' | 'landscape' | 'square' | 'tall';
  destination: string;
  // Spatial configuration (optional overrides — defaults used if absent)
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  frameWidth?: number;
  frameHeight?: number;
}

export interface GalleryConfig {
  sections: GallerySection[];
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  wallColor: string;
  floorColor: string;
  ceilingColor: string;
  ambientIntensity: number;
}

// ─── Gallery State ───────────────────────────────────────
export type GalleryPhase =
  | 'intro'
  | 'intro-reveal'
  | 'gallery'
  | 'approaching'
  | 'focused'
  | 'transitioning'
  | 'page-active'
  | 'returning';

export interface CameraTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
}

export interface GalleryState {
  phase: GalleryPhase;
  hoveredBoard: string | null;
  selectedBoard: string | null;
  focusedFrame: string | null;
  cameraTarget: CameraTarget | null;
  lastGalleryCamera: CameraTarget | null;
  introComplete: boolean;
  transitionLocked: boolean;
}

// ─── Default Gallery Sections ────────────────────────────
export const DEFAULT_GALLERY_SECTIONS: GallerySection[] = [
  {
    sectionId: 'work',
    title: 'WORK',
    subtitle: 'SELECTED PIECES',
    slug: 'work',
    wall: 'left',
    sortOrder: 1,
    visible: true,
    frameImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    frameType: 'landscape',
    destination: '/work',
  },
  {
    sectionId: 'me',
    title: 'ME',
    subtitle: 'THE ARTIST',
    slug: 'me',
    wall: 'right',
    sortOrder: 2,
    visible: true,
    frameImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    frameType: 'portrait',
    destination: '/me',
  },
  {
    sectionId: 'journal',
    title: 'JOURNAL',
    subtitle: 'NOTES & THOUGHTS',
    slug: 'journal',
    wall: 'left',
    sortOrder: 3,
    visible: true,
    frameImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
    frameType: 'portrait',
    destination: '/journal',
  },
  {
    sectionId: 'shop',
    title: 'SHOP',
    subtitle: 'PRINTS & EDITIONS',
    slug: 'shop',
    wall: 'left',
    sortOrder: 4,
    visible: true,
    frameImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    frameType: 'square',
    destination: '/shop',
  },
  {
    sectionId: 'contact',
    title: 'CONTACT',
    subtitle: "LET'S TALK",
    slug: 'contact',
    wall: 'right',
    sortOrder: 5,
    visible: true,
    frameImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80',
    frameType: 'landscape',
    destination: '/contact',
  },
];

export const DEFAULT_GALLERY_CONFIG: GalleryConfig = {
  sections: DEFAULT_GALLERY_SECTIONS,
  roomLength: 20,
  roomWidth: 7,
  roomHeight: 4.8,
  wallColor: '#EDE8E1',
  floorColor: '#8B8279',
  ceilingColor: '#F0EBE5',
  ambientIntensity: 0.6,
};
