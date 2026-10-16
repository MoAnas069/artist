import { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface GalleryRoomProps {
  length: number;
  width: number;
  height: number;
  wallColor?: string;
  floorColor?: string;
  ceilingColor?: string;
}

export default function GalleryRoom({
  length,
  width,
  height,
  wallColor = '#EDE8E1',
  floorColor = '#8A8177',
  ceilingColor = '#F2EDE7',
}: GalleryRoomProps) {
  const halfW = width / 2;
  const halfL = length / 2;

  // Wall Material
  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: wallColor,
        roughness: 0.94,
        metalness: 0.0,
        side: THREE.DoubleSide,
      }),
    [wallColor]
  );

  // Parquet / Base Floor Material (showing on sides of red carpet)
  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: floorColor,
        roughness: 0.65,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
    [floorColor]
  );

  // Red Velvet Gallery Carpet Runner Material
  const redCarpetMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#8C1D24', // Rich museum crimson red runner
        roughness: 0.88,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Border Trim for the Carpet Runner
  const carpetTrimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D4AF37', // Refined museum brass / gold border
        roughness: 0.35,
        metalness: 0.55,
      }),
    []
  );

  // Ceiling Material
  const ceilingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: ceilingColor,
        roughness: 0.95,
        metalness: 0.0,
        side: THREE.DoubleSide,
      }),
    [ceilingColor]
  );

  // Baseboard trim
  const baseboardMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#5C544B',
        roughness: 0.65,
        metalness: 0.1,
      }),
    []
  );

  // Crown molding
  const crownMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#B5ADA2',
        roughness: 0.6,
        metalness: 0.08,
      }),
    []
  );

  // Logo Texture on Back Wall
  const logoTexture = useMemo(() => {
    try {
      const loader = new THREE.TextureLoader();
      const tex = loader.load('/chintwo-logo-dark.svg');
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    } catch {
      return null;
    }
  }, []);

  const emblemTexture = useMemo(() => {
    try {
      const loader = new THREE.TextureLoader();
      const tex = loader.load('/chintwo-emblem-dark.svg');
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    } catch {
      return null;
    }
  }, []);

  const baseboardHeight = 0.18;
  const baseboardDepth = 0.04;
  const crownHeight = 0.14;
  const crownDepth = 0.04;
  const carpetWidth = 2.4; // Width of red carpet down center

  return (
    <group>
      {/* ─── Base Parquet Floor ──────────────────────────── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        material={floorMaterial}
      >
        <planeGeometry args={[width, length]} />
      </mesh>

      {/* ─── Red Carpet Runner ───────────────────────────── */}
      {/* Red Carpet Body */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
        receiveShadow
        material={redCarpetMaterial}
      >
        <planeGeometry args={[carpetWidth, length]} />
      </mesh>

      {/* Left Gold Border Strip */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-carpetWidth / 2 + 0.02, 0.007, 0]}
        material={carpetTrimMaterial}
      >
        <planeGeometry args={[0.04, length]} />
      </mesh>

      {/* Right Gold Border Strip */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[carpetWidth / 2 - 0.02, 0.007, 0]}
        material={carpetTrimMaterial}
      >
        <planeGeometry args={[0.04, length]} />
      </mesh>

      {/* ─── Ceiling ─────────────────────────────────────── */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, height, 0]}
        material={ceilingMaterial}
      >
        <planeGeometry args={[width, length]} />
      </mesh>

      {/* ─── Left Wall ───────────────────────────────────── */}
      <mesh
        position={[-halfW, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
        material={wallMaterial}
      >
        <planeGeometry args={[length, height]} />
      </mesh>

      {/* ─── Right Wall ──────────────────────────────────── */}
      <mesh
        position={[halfW, height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
        material={wallMaterial}
      >
        <planeGeometry args={[length, height]} />
      </mesh>

      {/* ─── Back Wall (Far end facing user, negative Z) ──── */}
      <mesh
        position={[0, height / 2, -halfL]}
        receiveShadow
        material={wallMaterial}
      >
        <planeGeometry args={[width, height]} />
      </mesh>

      {/* ─── Back Wall Logo Installation ─────────────────── */}
      <group position={[0, 2.35, -halfL + 0.03]}>
        {/* Gallery Feature Plaque Backdrop */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[3.2, 1.85]} />
          <meshStandardMaterial
            color="#FAF7F2"
            roughness={0.92}
            metalness={0.0}
          />
        </mesh>

        {/* Gold Frame for Feature Plaque */}
        <mesh position={[0, 0, -0.002]}>
          <planeGeometry args={[3.3, 1.95]} />
          <meshStandardMaterial
            color="#D4AF37"
            roughness={0.35}
            metalness={0.65}
          />
        </mesh>

        {/* Emblem Graphic */}
        {emblemTexture && (
          <mesh position={[0, 0.42, 0.006]}>
            <planeGeometry args={[0.55, 0.55]} />
            <meshBasicMaterial map={emblemTexture} transparent opacity={0.95} />
          </mesh>
        )}

        {/* Wordmark Graphic */}
        {logoTexture && (
          <mesh position={[0, -0.05, 0.006]}>
            <planeGeometry args={[2.2, 0.55]} />
            <meshBasicMaterial map={logoTexture} transparent opacity={0.95} />
          </mesh>
        )}

        {/* Museum Exhibition Tag */}
        <Text
          position={[0, -0.55, 0.006]}
          fontSize={0.05}
          color="#736A60"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
        >
          CONTEMPORARY EXHIBITION ARCHIVE
        </Text>

        {/* Spotlight shining directly onto back wall logo */}
        <spotLight
          position={[0, 2.2, 3.2]}
          target-position={[0, 0, 0]}
          intensity={2.5}
          angle={0.65}
          penumbra={0.7}
          color="#FFF8EE"
        />
      </group>

      {/* ─── Front Wall (Behind camera start, positive Z) ─── */}
      <mesh
        position={[0, height / 2, halfL]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
        material={wallMaterial}
      >
        <planeGeometry args={[width, height]} />
      </mesh>

      {/* ─── Entrance Doors on Front Wall ────────────────── */}
      <group position={[0, 1.8, halfL - 0.02]}>
        {/* Door frame */}
        <mesh>
          <planeGeometry args={[2.2, 3.2]} />
          <meshStandardMaterial color="#1E1B18" roughness={0.7} metalness={0.2} />
        </mesh>
        {/* Door panels */}
        <mesh position={[-0.52, 0, 0.005]}>
          <planeGeometry args={[0.95, 3.0]} />
          <meshStandardMaterial color="#2B2622" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0.52, 0, 0.005]}>
          <planeGeometry args={[0.95, 3.0]} />
          <meshStandardMaterial color="#2B2622" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Brass handles */}
        <mesh position={[-0.1, 0, 0.03]}>
          <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0.1, 0, 0.03]}>
          <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* ─── Baseboards ──────────────────────────────────── */}
      {/* Left wall baseboard */}
      <mesh
        position={[-halfW + baseboardDepth / 2, baseboardHeight / 2, 0]}
        material={baseboardMaterial}
      >
        <boxGeometry args={[baseboardDepth, baseboardHeight, length]} />
      </mesh>

      {/* Right wall baseboard */}
      <mesh
        position={[halfW - baseboardDepth / 2, baseboardHeight / 2, 0]}
        material={baseboardMaterial}
      >
        <boxGeometry args={[baseboardDepth, baseboardHeight, length]} />
      </mesh>

      {/* Back wall baseboard */}
      <mesh
        position={[0, baseboardHeight / 2, -halfL + baseboardDepth / 2]}
        material={baseboardMaterial}
      >
        <boxGeometry args={[width, baseboardHeight, baseboardDepth]} />
      </mesh>

      {/* Front wall baseboard */}
      <mesh
        position={[0, baseboardHeight / 2, halfL - baseboardDepth / 2]}
        material={baseboardMaterial}
      >
        <boxGeometry args={[width, baseboardHeight, baseboardDepth]} />
      </mesh>

      {/* ─── Crown Molding ───────────────────────────────── */}
      <mesh
        position={[-halfW + crownDepth / 2, height - crownHeight / 2, 0]}
        material={crownMaterial}
      >
        <boxGeometry args={[crownDepth, crownHeight, length]} />
      </mesh>
      <mesh
        position={[halfW - crownDepth / 2, height - crownHeight / 2, 0]}
        material={crownMaterial}
      >
        <boxGeometry args={[crownDepth, crownHeight, length]} />
      </mesh>
      <mesh
        position={[0, height - crownHeight / 2, -halfL + crownDepth / 2]}
        material={crownMaterial}
      >
        <boxGeometry args={[width, crownHeight, crownDepth]} />
      </mesh>
    </group>
  );
}
