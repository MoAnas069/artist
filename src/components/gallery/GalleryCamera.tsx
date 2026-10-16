import { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGallery } from '../../hooks/useGallery';
import type { GallerySection } from '../../types/gallery';

interface GalleryCameraProps {
  sections: GallerySection[];
  roomWidth: number;
  roomLength: number;
  roomHeight: number;
  onStationChange?: (stationZ: number, canForward: boolean, canBackward: boolean) => void;
}

// Google Maps style stations along the red carpet runner
const CORRIDOR_STATIONS = [7.0, 3.5, 0.0, -3.5, -6.5];

export default function GalleryCamera({
  sections,
  roomWidth,
  roomLength,
  onStationChange,
}: GalleryCameraProps) {
  const { camera, size, gl } = useThree();
  const { state, focusFrame, saveGalleryCamera } = useGallery();

  const isPortrait = size.width < size.height;
  const aspect = size.width / size.height;

  // Station index along the red carpet (0 = Entrance, 4 = Near back wall logo)
  const [stationIdx, setStationIdx] = useState(0);

  // Notify parent of station changes for ground arrows
  useEffect(() => {
    onStationChange?.(
      CORRIDOR_STATIONS[stationIdx],
      stationIdx < CORRIDOR_STATIONS.length - 1,
      stationIdx > 0
    );
  }, [stationIdx, onStationChange]);

  // Dynamically adapt FOV to keep artworks on both walls in view on mobile screens
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = isPortrait
        ? Math.min(84, Math.max(72, (55 / Math.max(aspect, 0.45)) * 0.72))
        : 55;
      if (Math.abs(camera.fov - targetFov) > 0.5) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }
    }
  }, [camera, isPortrait, aspect]);

  // ─── 360 View Control (Yaw & Pitch) ──────────────────────
  // yaw = 0 points down the corridor towards the logo wall (negative Z)
  const yaw = useRef(0);
  const pitch = useRef(0);
  const targetYaw = useRef(0);
  const targetPitch = useRef(0);

  const isDragging = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0 });

  // Camera 3D positions
  const currentPos = useRef(new THREE.Vector3(0, 1.65, CORRIDOR_STATIONS[0]));
  const targetPos = useRef(new THREE.Vector3(0, 1.65, CORRIDOR_STATIONS[0]));
  const lerpSpeed = useRef(0.05);

  // Setup initial camera
  useEffect(() => {
    camera.position.set(0, 1.65, CORRIDOR_STATIONS[0]);
    camera.lookAt(0, 1.65, -10);
  }, [camera]);

  // ─── Forward / Backward Navigation Listeners ─────────────
  const stepForward = useCallback(() => {
    setStationIdx((prev) => {
      const next = Math.min(CORRIDOR_STATIONS.length - 1, prev + 1);
      targetPos.current.set(0, 1.65, CORRIDOR_STATIONS[next]);
      lerpSpeed.current = 0.045;
      return next;
    });
  }, []);

  const stepBackward = useCallback(() => {
    setStationIdx((prev) => {
      const next = Math.max(0, prev - 1);
      targetPos.current.set(0, 1.65, CORRIDOR_STATIONS[next]);
      lerpSpeed.current = 0.045;
      return next;
    });
  }, []);

  // Listen for navigation events
  useEffect(() => {
    const handleForward = () => stepForward();
    const handleBackward = () => stepBackward();

    window.addEventListener('gallery_step_forward', handleForward);
    window.addEventListener('gallery_step_backward', handleBackward);

    // Keyboard navigation (W/Up for forward, S/Down for backward, A/D to rotate)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.phase !== 'gallery') return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        stepForward();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        stepBackward();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        targetYaw.current += 0.25;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        targetYaw.current -= 0.25;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('gallery_step_forward', handleForward);
      window.removeEventListener('gallery_step_backward', handleBackward);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [stepForward, stepBackward, state.phase]);

  // ─── 360-Degree Cursor / Touch Drag Rotation ─────────────
  useEffect(() => {
    const dom = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      // Allow 360 rotation in gallery and focused states
      isDragging.current = true;
      pointerStart.current = { x: e.clientX, y: e.clientY };
      dom.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;

      const deltaX = (e.clientX - pointerStart.current.x) / window.innerWidth;
      const deltaY = (e.clientY - pointerStart.current.y) / window.innerHeight;

      // Full 360 rotation sensitivity
      targetYaw.current -= deltaX * 3.8;
      // Pitch clamped between -60° and +60°
      targetPitch.current = Math.max(-0.95, Math.min(0.95, targetPitch.current + deltaY * 2.2));

      pointerStart.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging.current = false;
      dom.style.cursor = 'default';
    };

    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [gl]);

  // ─── Artwork Approach Viewing Calculation ────────────────
  const getWallCounts = useCallback(() => {
    const leftSections = sections.filter((s) => s.wall === 'left' && s.visible);
    const rightSections = sections.filter((s) => s.wall === 'right' && s.visible);
    return { left: leftSections, right: rightSections };
  }, [sections]);

  const getViewPosForSection = useCallback(
    (sectionId: string) => {
      const { left, right } = getWallCounts();
      const section = sections.find((s) => s.sectionId === sectionId);
      if (!section) return null;

      const wallSections = section.wall === 'left' ? left : right;
      const idxOnWall = wallSections.findIndex((s) => s.sectionId === sectionId);

      const halfW = roomWidth / 2;
      const halfL = roomLength / 2;
      const spacing = roomLength / (wallSections.length + 1);
      const zPos = -halfL + spacing * (idxOnWall + 1);
      const isLeft = section.wall === 'left';
      const xWall = isLeft ? -halfW + 0.05 : halfW - 0.05;
      const yPos = section.positionY ?? 2.2;

      // Stand across the corridor from the frame
      const viewDist = isPortrait ? 3.3 : 2.8;
      const cameraX = isLeft ? xWall + viewDist : xWall - viewDist;

      // Compute exact yaw angle to face the artwork
      const faceYaw = isLeft ? -Math.PI / 2 : Math.PI / 2;

      return {
        position: new THREE.Vector3(cameraX, isPortrait ? 1.85 : 1.65, zPos),
        lookAt: new THREE.Vector3(xWall, yPos, zPos),
        yaw: faceYaw,
        pitch: 0.05,
      };
    },
    [sections, getWallCounts, roomWidth, roomLength, isPortrait]
  );

  // Handle phase changes (approaching, returning)
  useEffect(() => {
    if (state.phase === 'approaching' && state.selectedBoard) {
      const viewPos = getViewPosForSection(state.selectedBoard);
      if (viewPos) {
        saveGalleryCamera({
          position: [currentPos.current.x, currentPos.current.y, currentPos.current.z],
          lookAt: [0, 1.65, currentPos.current.z - 5],
        });

        targetPos.current.copy(viewPos.position);
        targetYaw.current = viewPos.yaw;
        targetPitch.current = viewPos.pitch;
        lerpSpeed.current = 0.038;
      }
    }

    if (state.phase === 'returning') {
      // Return to red carpet center at the current station
      targetPos.current.set(0, 1.65, CORRIDOR_STATIONS[stationIdx]);
      targetYaw.current = 0; // Look towards the back logo wall
      targetPitch.current = 0;
      lerpSpeed.current = 0.04;
    }
  }, [
    state.phase,
    state.selectedBoard,
    stationIdx,
    getViewPosForSection,
    saveGalleryCamera,
  ]);

  // ─── Camera Frame Loop ───────────────────────────────────
  useFrame(() => {
    // Smoothly interpolate position
    currentPos.current.lerp(targetPos.current, lerpSpeed.current);

    // Smoothly interpolate rotation (360 yaw and pitch)
    yaw.current += (targetYaw.current - yaw.current) * 0.09;
    pitch.current += (targetPitch.current - pitch.current) * 0.09;

    // Compute look-at point from spherical angles
    const lookDist = 5.0;
    const lookX = currentPos.current.x + lookDist * Math.sin(yaw.current) * Math.cos(pitch.current);
    const lookY = currentPos.current.y + lookDist * Math.sin(pitch.current);
    const lookZ = currentPos.current.z - lookDist * Math.cos(yaw.current) * Math.cos(pitch.current);

    camera.position.copy(currentPos.current);
    camera.lookAt(lookX, lookY, lookZ);

    // Check if approach is complete
    if (state.phase === 'approaching' && state.selectedBoard) {
      const dist = currentPos.current.distanceTo(targetPos.current);
      if (dist < 0.2) {
        focusFrame(state.selectedBoard);
      }
    }
  });

  return null;
}
