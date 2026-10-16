/**
 * Gallery Lighting — Warm, museum-quality lighting setup.
 * Uses a combination of ambient, directional, and point lights
 * to create a well-lit exhibition space visible from any angle.
 */
export default function GalleryLighting({ ambientIntensity = 0.6 }: { ambientIntensity?: number }) {
  return (
    <>
      {/* Ambient — ensures minimum visibility everywhere */}
      <ambientLight intensity={ambientIntensity} color="#FFF8F0" />

      {/* Hemisphere light — natural sky/ground separation */}
      <hemisphereLight
        color="#FFF5E6"
        groundColor="#8B8279"
        intensity={0.6}
      />

      {/* Main directional "skylight" from above-front */}
      <directionalLight
        position={[2, 8, 6]}
        intensity={1.2}
        color="#FFF5E6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
      />

      {/* Secondary fill from opposite side */}
      <directionalLight
        position={[-3, 6, -5]}
        intensity={0.5}
        color="#F0EBE4"
      />

      {/* Overhead gallery track lights — warm focused pools along corridor */}
      <pointLight position={[0, 4.8, 10]} intensity={1.2} color="#FFF0DD" distance={18} decay={2} />
      <pointLight position={[0, 4.8, 5]} intensity={1.4} color="#FFF0DD" distance={18} decay={2} />
      <pointLight position={[0, 4.8, 0]} intensity={1.4} color="#FFF0DD" distance={18} decay={2} />
      <pointLight position={[0, 4.8, -5]} intensity={1.2} color="#FFF0DD" distance={18} decay={2} />
      <pointLight position={[0, 4.8, -10]} intensity={1.0} color="#FFF0DD" distance={18} decay={2} />

      {/* Left wall wash lights — illuminate artwork frames */}
      <pointLight position={[-2.5, 4.2, 8]} intensity={0.9} color="#FFF5E8" distance={14} decay={2} />
      <pointLight position={[-2.5, 4.2, 3]} intensity={0.9} color="#FFF5E8" distance={14} decay={2} />
      <pointLight position={[-2.5, 4.2, -2]} intensity={0.8} color="#FFF5E8" distance={14} decay={2} />
      <pointLight position={[-2.5, 4.2, -7]} intensity={0.7} color="#FFF5E8" distance={14} decay={2} />

      {/* Right wall wash lights */}
      <pointLight position={[2.5, 4.2, 6]} intensity={0.9} color="#FFF5E8" distance={14} decay={2} />
      <pointLight position={[2.5, 4.2, 1]} intensity={0.8} color="#FFF5E8" distance={14} decay={2} />
      <pointLight position={[2.5, 4.2, -4]} intensity={0.7} color="#FFF5E8" distance={14} decay={2} />
      <pointLight position={[2.5, 4.2, -9]} intensity={0.7} color="#FFF5E8" distance={14} decay={2} />
    </>
  );
}
