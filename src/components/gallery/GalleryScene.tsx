import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo, useState, useCallback } from 'react';
import * as THREE from 'three';
import GalleryRoom from './GalleryRoom';
import ArtworkFrame from './ArtworkFrame';
import GalleryCamera from './GalleryCamera';
import GalleryLighting from './GalleryLighting';
import CarpetNavArrows from './CarpetNavArrows';
import type { GallerySection, GalleryConfig } from '../../types/gallery';
import { DEFAULT_GALLERY_CONFIG } from '../../types/gallery';

interface GallerySceneProps {
  config?: GalleryConfig;
  sections?: GallerySection[];
}

function SceneBackground() {
  return <color attach="background" args={['#EDE8E1']} />;
}

export default function GalleryScene({
  config = DEFAULT_GALLERY_CONFIG,
  sections: overrideSections,
}: GallerySceneProps) {
  const sections = overrideSections || config.sections;
  const visibleSections = useMemo(
    () => sections.filter((s) => s.visible).sort((a, b) => a.sortOrder - b.sortOrder),
    [sections]
  );

  const leftSections = useMemo(
    () => visibleSections.filter((s) => s.wall === 'left'),
    [visibleSections]
  );
  const rightSections = useMemo(
    () => visibleSections.filter((s) => s.wall === 'right'),
    [visibleSections]
  );

  const [navState, setNavState] = useState({
    stationZ: 7.0,
    canForward: true,
    canBackward: false,
  });

  const handleStationChange = useCallback(
    (stationZ: number, canForward: boolean, canBackward: boolean) => {
      setNavState({ stationZ, canForward, canBackward });
    },
    []
  );

  const handleForward = useCallback(() => {
    window.dispatchEvent(new CustomEvent('gallery_step_forward'));
  }, []);

  const handleBackward = useCallback(() => {
    window.dispatchEvent(new CustomEvent('gallery_step_backward'));
  }, []);

  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2);

  return (
    <Canvas
      shadows
      dpr={dpr}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.5,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={{
        fov: 55,
        near: 0.1,
        far: 100,
        position: [0, 1.65, 7.0],
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <SceneBackground />
      <fog attach="fog" args={['#EDE8E1', 25, 60]} />

      <Suspense fallback={null}>
        <GalleryLighting ambientIntensity={config.ambientIntensity} />

        <GalleryRoom
          length={config.roomLength}
          width={config.roomWidth}
          height={config.roomHeight}
          wallColor={config.wallColor}
          floorColor={config.floorColor}
          ceilingColor={config.ceilingColor}
        />

        {/* Translucent Google Maps style navigation arrows directly on the red carpet */}
        <CarpetNavArrows
          currentStationZ={navState.stationZ}
          roomLength={config.roomLength}
          canGoForward={navState.canForward}
          canGoBackward={navState.canBackward}
          onForward={handleForward}
          onBackward={handleBackward}
        />

        {/* Artwork frames — left wall */}
        {leftSections.map((section, index) => (
          <ArtworkFrame
            key={section.sectionId}
            section={section}
            roomWidth={config.roomWidth}
            roomLength={config.roomLength}
            index={index}
            totalOnWall={leftSections.length}
          />
        ))}

        {/* Artwork frames — right wall */}
        {rightSections.map((section, index) => (
          <ArtworkFrame
            key={section.sectionId}
            section={section}
            roomWidth={config.roomWidth}
            roomLength={config.roomLength}
            index={index}
            totalOnWall={rightSections.length}
          />
        ))}

        {/* 360-degree Camera with Corridor Navigation */}
        <GalleryCamera
          sections={visibleSections}
          roomWidth={config.roomWidth}
          roomLength={config.roomLength}
          roomHeight={config.roomHeight}
          onStationChange={handleStationChange}
        />
      </Suspense>
    </Canvas>
  );
}
