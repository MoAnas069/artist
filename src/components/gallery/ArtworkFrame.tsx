import { useRef, useMemo, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import type { GallerySection } from '../../types/gallery';
import { useGallery } from '../../hooks/useGallery';

interface ArtworkFrameProps {
  section: GallerySection;
  roomWidth: number;
  index: number;
  totalOnWall: number;
  roomLength: number;
}

// Frame dimension presets based on type
const FRAME_DIMENSIONS: Record<string, { w: number; h: number }> = {
  landscape: { w: 2.0, h: 1.4 },
  portrait: { w: 1.4, h: 2.0 },
  square: { w: 1.6, h: 1.6 },
  tall: { w: 1.2, h: 2.4 },
};

// Frame materials for museum variety
const FRAME_MATERIALS: { color: string; roughness: number; metalness: number }[] = [
  { color: '#2A2118', roughness: 0.7, metalness: 0.05 },
  { color: '#1A1A1A', roughness: 0.5, metalness: 0.1 },
  { color: '#5C4A3A', roughness: 0.75, metalness: 0.03 },
  { color: '#3A3530', roughness: 0.6, metalness: 0.15 },
  { color: '#4A3E34', roughness: 0.72, metalness: 0.04 },
];

export default function ArtworkFrame({
  section,
  roomWidth,
  index,
  totalOnWall,
  roomLength,
}: ArtworkFrameProps) {
  const groupRef = useRef<THREE.Group>(null);
  const highlightRef = useRef<THREE.Mesh>(null);
  const { state, hoverBoard, selectBoard, enterSection } = useGallery();
  const [textureError, setTextureError] = useState(false);

  // Load artwork texture
  const texture = useMemo(() => {
    if (!section.frameImage) return null;
    try {
      const loader = new THREE.TextureLoader();
      const tex = loader.load(
        section.frameImage,
        (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          t.minFilter = THREE.LinearMipmapLinearFilter;
          t.magFilter = THREE.LinearFilter;
          t.generateMipmaps = true;
        },
        undefined,
        () => setTextureError(true)
      );
      return tex;
    } catch {
      setTextureError(true);
      return null;
    }
  }, [section.frameImage]);

  // Dimensions
  const dims = FRAME_DIMENSIONS[section.frameType] || FRAME_DIMENSIONS.landscape;
  const fw = section.frameWidth || dims.w;
  const fh = section.frameHeight || dims.h;
  const frameDepth = 0.08;
  const halfW = roomWidth / 2;
  const halfL = roomLength / 2;

  // Distribute frames along the wall
  const spacing = roomLength / (totalOnWall + 1);
  const zPos = -halfL + spacing * (index + 1);

  const isLeft = section.wall === 'left';
  const xPos = isLeft ? -halfW + 0.05 : halfW - 0.05;
  const yPos = section.positionY ?? 2.2;
  const rotY = isLeft ? Math.PI / 2 : -Math.PI / 2;

  const frameMat = FRAME_MATERIALS[section.sortOrder % FRAME_MATERIALS.length];

  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: frameMat.color,
        roughness: frameMat.roughness,
        metalness: frameMat.metalness,
      }),
    [frameMat]
  );

  const isHovered = state.hoveredBoard === section.sectionId;
  const isFocused = state.focusedFrame === section.sectionId;

  // Highlight animation
  useFrame(() => {
    if (!highlightRef.current) return;
    const target = isHovered || isFocused ? 0.18 : 0;
    const mat = highlightRef.current.material as THREE.MeshBasicMaterial;
    if (mat) {
      mat.opacity += (target - mat.opacity) * 0.08;
    }
  });

  const matBorder = 0.08;
  const innerW = fw - matBorder * 2;
  const innerH = fh - matBorder * 2;

  // Board dimensions
  const boardW = 0.54;
  const boardH = 0.28;
  const boardDepth = 0.015;
  const rodRadius = 0.004;
  const rodLength = 0.35;

  const boardOffsetX = fw / 2 - boardW / 2 + 0.1;
  const boardOffsetY = -(fh / 2) - 0.38;

  // Direct page navigation
  const triggerNavigation = (e: ThreeEvent<any>) => {
    e.stopPropagation();
    enterSection(section.sectionId);
    window.dispatchEvent(
      new CustomEvent('gallery_navigate_direct', { detail: section.destination })
    );
  };

  // Clicking the plaque tag
  const handleBoardClick = (e: ThreeEvent<any>) => {
    e.stopPropagation();
    if (state.phase === 'focused' && state.focusedFrame === section.sectionId) {
      triggerNavigation(e);
    } else {
      selectBoard(section.sectionId);
    }
  };

  // Clicking the artwork frame
  const handleFrameClick = (e: ThreeEvent<any>) => {
    e.stopPropagation();
    if (state.phase === 'focused' && state.focusedFrame === section.sectionId) {
      triggerNavigation(e);
    } else {
      selectBoard(section.sectionId);
    }
  };

  const handleBoardHover = (e: ThreeEvent<any>) => {
    e.stopPropagation();
    hoverBoard(section.sectionId);
    document.body.style.cursor = 'pointer';
  };

  const handleBoardUnhover = () => {
    hoverBoard(null);
    document.body.style.cursor = 'default';
  };

  return (
    <group
      ref={groupRef}
      position={[xPos, yPos, zPos]}
      rotation={[0, rotY, 0]}
    >
      {/* ─── Frame Outer Border ─────────────────────── */}
      <mesh
        castShadow
        material={frameMaterial}
        onClick={handleFrameClick}
        onPointerEnter={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[fw, fh, frameDepth]} />
      </mesh>

      {/* ─── White Mat Inside Frame ─────────────────── */}
      <mesh position={[0, 0, frameDepth / 2 + 0.001]}>
        <planeGeometry args={[fw - 0.04, fh - 0.04]} />
        <meshStandardMaterial color="#FAF8F5" roughness={0.95} metalness={0} />
      </mesh>

      {/* ─── Artwork Surface (Clickable) ────────────── */}
      <mesh
        position={[0, 0, frameDepth / 2 + 0.002]}
        onClick={handleFrameClick}
      >
        <planeGeometry args={[innerW, innerH]} />
        {texture && !textureError ? (
          <meshStandardMaterial
            map={texture}
            roughness={0.85}
            metalness={0}
            toneMapped={true}
          />
        ) : (
          <meshStandardMaterial
            color="#E8E2DA"
            roughness={0.9}
            metalness={0}
          />
        )}
      </mesh>

      {/* ─── Highlight overlay ──────────────────────── */}
      <mesh ref={highlightRef} position={[0, 0, frameDepth / 2 + 0.003]}>
        <planeGeometry args={[fw + 0.06, fh + 0.06]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* ─── Shadow behind frame ────────────────────── */}
      <mesh position={[0, -0.03, -0.02]}>
        <planeGeometry args={[fw + 0.12, fh + 0.08]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>

      {/* ─── Title Board Plaque (Tag) Assembly ───────── */}
      <group
        position={[boardOffsetX, boardOffsetY, frameDepth / 2 + 0.01]}
        onPointerEnter={handleBoardHover}
        onPointerLeave={handleBoardUnhover}
        onClick={handleBoardClick}
      >
        {/* Mounting rod */}
        <mesh position={[0, rodLength / 2 + boardH / 2, -0.005]}>
          <cylinderGeometry args={[rodRadius, rodRadius, rodLength, 8]} />
          <meshStandardMaterial color="#8A8077" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Wall bracket */}
        <mesh position={[0, rodLength + boardH / 2, -0.01]}>
          <cylinderGeometry args={[0.012, 0.012, 0.02, 12]} />
          <meshStandardMaterial color="#7A746C" roughness={0.45} metalness={0.55} />
        </mesh>

        {/* Board plaque body */}
        <mesh castShadow>
          <boxGeometry args={[boardW, boardH, boardDepth]} />
          <meshStandardMaterial
            color={isHovered || isFocused ? '#FFFDFC' : '#F5EFE8'}
            roughness={0.88}
            metalness={0.02}
          />
        </mesh>

        {/* Outer Gold Accent Border */}
        <mesh position={[0, 0, -0.001]}>
          <planeGeometry args={[boardW + 0.015, boardH + 0.015]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Section title text */}
        <Text
          position={[0, 0.06, boardDepth / 2 + 0.002]}
          fontSize={0.048}
          color="#1E1B18"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.16}
        >
          {section.title}
        </Text>

        {/* Subtitle text */}
        <Text
          position={[0, 0.01, boardDepth / 2 + 0.002]}
          fontSize={0.022}
          color="#8A8077"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          {section.subtitle}
        </Text>

        {/* Interactive "ENTER EXHIBITION ➔" Button on Plaque */}
        <group
          position={[0, -0.065, boardDepth / 2 + 0.003]}
          onClick={triggerNavigation}
          onPointerEnter={() => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerLeave={() => {
            document.body.style.cursor = 'default';
          }}
        >
          <mesh>
            <planeGeometry args={[boardW * 0.82, 0.05]} />
            <meshStandardMaterial
              color={isFocused ? '#A8242E' : '#881B24'}
              roughness={0.5}
            />
          </mesh>
          <Text
            position={[0, 0, 0.002]}
            fontSize={0.022}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.14}
          >
            ENTER ➔
          </Text>
        </group>
      </group>

      {/* ─── Spotlight for this frame ───────────────── */}
      <spotLight
        position={[0, 2.5, 1.5]}
        angle={0.45}
        penumbra={0.7}
        intensity={isFocused ? 2.5 : isHovered ? 2.0 : 1.2}
        color="#FFF5E8"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.001}
        target-position={[0, 0, 0]}
      />
    </group>
  );
}
