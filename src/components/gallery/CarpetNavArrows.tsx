import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CarpetNavArrowsProps {
  currentStationZ: number;
  roomLength: number;
  canGoForward: boolean;
  canGoBackward: boolean;
  onForward: () => void;
  onBackward: () => void;
}

/**
 * CarpetNavArrows — Translucent Google Maps style navigation arrows
 * projected directly onto the red carpet floor in 3D.
 */
export default function CarpetNavArrows({
  currentStationZ,
  canGoForward,
  canGoBackward,
  onForward,
  onBackward,
}: CarpetNavArrowsProps) {
  const [hoverForward, setHoverForward] = useState(false);
  const [hoverBackward, setHoverBackward] = useState(false);
  const pulseRef = useRef(0);

  // Chevron texture / geometry
  const forwardArrowZ = currentStationZ - 2.8;
  const backwardArrowZ = currentStationZ + 2.8;

  useFrame((_, delta) => {
    pulseRef.current += delta * 2.5;
  });

  return (
    <group>
      {/* ─── Forward Navigation Arrow on Red Carpet ───── */}
      {canGoForward && (
        <group
          position={[0, 0.012, forwardArrowZ]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {/* Subtle Outer Glowing Disc */}
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onForward();
            }}
            onPointerEnter={(e) => {
              e.stopPropagation();
              setHoverForward(true);
              document.body.style.cursor = 'pointer';
            }}
            onPointerLeave={() => {
              setHoverForward(false);
              document.body.style.cursor = 'default';
            }}
          >
            <circleGeometry args={[0.55, 32]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={hoverForward ? 0.35 : 0.18}
              depthWrite={false}
            />
          </mesh>

          {/* Translucent Chevron Ring */}
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onForward();
            }}
          >
            <ringGeometry args={[0.42, 0.46, 32]} />
            <meshBasicMaterial
              color="#FFE8B0"
              transparent
              opacity={hoverForward ? 0.8 : 0.45}
              depthWrite={false}
            />
          </mesh>

          {/* Forward Arrow Pointer Geometry */}
          <mesh
            rotation={[0, 0, 0]}
            position={[0, 0.06, 0.001]}
            onClick={(e) => {
              e.stopPropagation();
              onForward();
            }}
          >
            <coneGeometry args={[0.2, 0.3, 3]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={hoverForward ? 0.95 : 0.75}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      {/* ─── Backward Navigation Arrow on Red Carpet ──── */}
      {canGoBackward && (
        <group
          position={[0, 0.012, backwardArrowZ]}
          rotation={[-Math.PI / 2, 0, Math.PI]}
        >
          {/* Outer Glowing Disc */}
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onBackward();
            }}
            onPointerEnter={(e) => {
              e.stopPropagation();
              setHoverBackward(true);
              document.body.style.cursor = 'pointer';
            }}
            onPointerLeave={() => {
              setHoverBackward(false);
              document.body.style.cursor = 'default';
            }}
          >
            <circleGeometry args={[0.55, 32]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={hoverBackward ? 0.35 : 0.18}
              depthWrite={false}
            />
          </mesh>

          {/* Translucent Ring */}
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onBackward();
            }}
          >
            <ringGeometry args={[0.42, 0.46, 32]} />
            <meshBasicMaterial
              color="#FFE8B0"
              transparent
              opacity={hoverBackward ? 0.8 : 0.45}
              depthWrite={false}
            />
          </mesh>

          {/* Backward Arrow Pointer */}
          <mesh
            rotation={[0, 0, 0]}
            position={[0, 0.06, 0.001]}
            onClick={(e) => {
              e.stopPropagation();
              onBackward();
            }}
          >
            <coneGeometry args={[0.2, 0.3, 3]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={hoverBackward ? 0.95 : 0.75}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
