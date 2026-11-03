import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
}

export default function LanternCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check touch capability
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(touch);

    // Reduced motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates with smooth lerp
    let mouseX = width * 0.5;
    let mouseY = height * 0.35;
    let targetX = mouseX;
    let targetY = mouseY;
    let hasMoved = false;

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      hasMoved = true;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Gyroscope tilt support for touch devices
    let tiltX = 0;
    let tiltY = 0;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        tiltX = (e.gamma / 45) * 80;
        tiltY = ((e.beta - 45) / 45) * 80;
      }
    };
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }

    // Atmospheric dust motes / gold embers
    const particles: Particle[] = [];
    const maxParticles = prefersReducedMotion ? 0 : 36;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.15 - Math.random() * 0.35,
        radius: 0.6 + Math.random() * 1.4,
        alpha: 0,
        maxAlpha: 0.25 + Math.random() * 0.45,
        life: Math.random() * 200,
        maxLife: 200 + Math.random() * 300,
      });
    }

    let animationFrameId: number;
    let autoTime = 0;
    let isTabVisible = true;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      autoTime += 0.008;

      if (!hasMoved || touch) {
        // Organic Lissajous drift for touch or before initial move
        const driftX = Math.sin(autoTime * 0.7) * (width * 0.28) + Math.cos(autoTime * 0.3) * (width * 0.1);
        const driftY = Math.cos(autoTime * 0.5) * (height * 0.2) + Math.sin(autoTime * 0.4) * (height * 0.08);
        targetX = width * 0.5 + driftX + tiltX;
        targetY = height * 0.45 + driftY + tiltY;
      }

      // Smooth spring lerp
      const lerpSpeed = prefersReducedMotion ? 1 : 0.09;
      mouseX += (targetX - mouseX) * lerpSpeed;
      mouseY += (targetY - mouseY) * lerpSpeed;

      // Update global CSS variables for artwork surface & relief reveal
      document.documentElement.style.setProperty('--lantern-x', `${mouseX.toFixed(1)}px`);
      document.documentElement.style.setProperty('--lantern-y', `${mouseY.toFixed(1)}px`);

      ctx.clearRect(0, 0, width, height);

      if (!prefersReducedMotion) {
        // Draw primary soft lantern beam
        const lanternRadius = Math.min(width, height) * 0.45;
        const beamGrad = ctx.createRadialGradient(
          mouseX,
          mouseY,
          0,
          mouseX,
          mouseY,
          lanternRadius
        );

        beamGrad.addColorStop(0, 'rgba(235, 175, 105, 0.16)');
        beamGrad.addColorStop(0.25, 'rgba(223, 155, 82, 0.08)');
        beamGrad.addColorStop(0.6, 'rgba(180, 120, 60, 0.025)');
        beamGrad.addColorStop(1, 'rgba(11, 10, 9, 0)');

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, lanternRadius, 0, Math.PI * 2);
        ctx.fill();

        // Secondary subtle warm core
        const coreGrad = ctx.createRadialGradient(
          mouseX,
          mouseY,
          0,
          mouseX,
          mouseY,
          90
        );
        coreGrad.addColorStop(0, 'rgba(255, 230, 190, 0.18)');
        coreGrad.addColorStop(1, 'rgba(223, 155, 82, 0)');

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 90, 0, Math.PI * 2);
        ctx.fill();

        // Render floating dust motes
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life++;

          if (p.life < p.maxLife * 0.25) {
            p.alpha = (p.life / (p.maxLife * 0.25)) * p.maxAlpha;
          } else if (p.life > p.maxLife * 0.75) {
            p.alpha = ((p.maxLife - p.life) / (p.maxLife * 0.25)) * p.maxAlpha;
          }

          if (p.life >= p.maxLife || p.y < -10 || p.x < -10 || p.x > width + 10) {
            p.x = mouseX + (Math.random() - 0.5) * (lanternRadius * 1.2);
            p.y = mouseY + (Math.random() - 0.5) * (lanternRadius * 1.2);
            p.life = 0;
            p.alpha = 0;
          }

          // Distance to lantern center boosts mote luminosity
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximityGlow = Math.max(0, 1 - dist / lanternRadius);

          if (proximityGlow > 0.05 && p.alpha > 0.01) {
            ctx.fillStyle = `rgba(240, 200, 140, ${(p.alpha * proximityGlow).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="dusk-lantern-canvas"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 4,
          opacity: 0.95,
          mixBlendMode: 'screen',
        }}
      />
      {!isTouchDevice && (
        <div
          className="dusk-lantern-reticle"
          aria-hidden="true"
          style={{
            transform: 'translate3d(calc(var(--lantern-x, -100px) - 50%), calc(var(--lantern-y, -100px) - 50%), 0)',
          }}
        />
      )}
    </>
  );
}
