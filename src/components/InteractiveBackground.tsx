"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  color: string;
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number = 0;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // High DPI scaling (capped at 2 for 60fps performance and minimal fill-rate overhead)
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Dynamic coordinates & motion state
    let mouseX = width / 2;
    let mouseY = height * 0.35;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let isUserInteracting = false;
    let idleTime = 0;

    // Reduced motion accessibility query
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = motionQuery.matches;

    const onMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = 0;
        }
        ctx.clearRect(0, 0, width, height);
      } else {
        lastTime = performance.now();
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(render);
        }
      }
    };
    motionQuery.addEventListener("change", onMotionChange);

    // Particle setup
    const isMobile = width < 768;
    const particleCount = isMobile ? 20 : 42;
    const particles: Particle[] = [];

    const palette = [
      "rgba(56, 189, 248,", // luminous cyan
      "rgba(99, 102, 241,", // indigo
      "rgba(129, 140, 248,", // soft violet
      "rgba(45, 212, 191,", // teal
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        radius: Math.random() * 1.1 + 0.9,
        baseAlpha: Math.random() * 0.3 + 0.15,
        color: palette[Math.floor(Math.random() * palette.length)],
      });
    }

    const resetInactivityTimer = (timeoutMs = 2500) => {
      isUserInteracting = true;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isUserInteracting = false;
      }, timeoutMs);
    };

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      resetInactivityTimer(2500);
    };

    const handlePointerLeave = () => {
      // Smoothly transition back to autonomous drift when pointer exits window
      if (idleTimer) clearTimeout(idleTimer);
      isUserInteracting = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMouseX = e.touches[0].clientX;
        targetMouseY = e.touches[0].clientY;
        resetInactivityTimer(2000);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMouseX = e.touches[0].clientX;
        targetMouseY = e.touches[0].clientY;
        resetInactivityTimer(2000);
      }
    };

    const handleTouchEnd = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isUserInteracting = false;
      }, 1500);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = 0;
        }
      } else if (!prefersReducedMotion) {
        lastTime = performance.now();
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(render);
        }
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initialize CSS variables
    container.style.setProperty("--cursor-x", `${mouseX.toFixed(1)}px`);
    container.style.setProperty("--cursor-y", `${mouseY.toFixed(1)}px`);

    let lastTime = performance.now();

    const render = (now: number) => {
      if (document.hidden || prefersReducedMotion) {
        animationFrameId = 0;
        return;
      }

      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // When user is not actively interacting (idle or touch released), smoothly drift along Lissajous curve
      if (!isUserInteracting) {
        idleTime += delta * 0.45;
        targetMouseX = width * 0.5 + Math.cos(idleTime * 0.65) * (width * 0.26);
        targetMouseY = height * 0.35 + Math.sin(idleTime * 0.95) * (height * 0.16);
      }

      // Frame-rate independent linear interpolation for consistent 60fps/120fps feel
      const lerpFactor = 1 - Math.exp(-7 * delta);
      mouseX += (targetMouseX - mouseX) * lerpFactor;
      mouseY += (targetMouseY - mouseY) * lerpFactor;

      // Update CSS variables for radial spotlight and ambient aura
      container.style.setProperty("--cursor-x", `${mouseX.toFixed(1)}px`);
      container.style.setProperty("--cursor-y", `${mouseY.toFixed(1)}px`);

      ctx.clearRect(0, 0, width, height);

      const mouseRadius = 140;
      const mouseRadiusSq = mouseRadius * mouseRadius;
      const connectionDist = 90;
      const connectionDistSq = connectionDist * connectionDist;

      // Arrays for batched drawing to eliminate draw-call overhead
      const filamentTargets: { x: number; y: number; alpha: number }[] = [];
      const particlePairs: { x1: number; y1: number; x2: number; y2: number; alpha: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Move particle
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Smooth wrap-around boundaries
        if (p1.x < -12) p1.x = width + 12;
        else if (p1.x > width + 12) p1.x = -12;
        if (p1.y < -12) p1.y = height + 12;
        else if (p1.y > height + 12) p1.y = -12;

        // Mouse distance
        const dxMouse = p1.x - mouseX;
        const dyMouse = p1.y - mouseY;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

        let extraAlpha = 0;
        if (distMouseSq < mouseRadiusSq) {
          const distMouse = Math.sqrt(distMouseSq);
          if (distMouse > 1) {
            // Guard against division by zero
            const force = (1 - distMouse / mouseRadius) * 0.75;
            p1.x += (dxMouse / distMouse) * force * 1.5;
            p1.y += (dyMouse / distMouse) * force * 1.5;
            extraAlpha = (1 - distMouse / mouseRadius) * 0.4;
          }

          // Subtle filament tether toward cursor when interacting
          if (isUserInteracting) {
            filamentTargets.push({
              x: p1.x,
              y: p1.y,
              alpha: (1 - distMouse / mouseRadius) * 0.22,
            });
          }
        }

        // Inter-particle links
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistSq) {
            const alpha = (1 - distSq / connectionDistSq) * 0.12;
            particlePairs.push({
              x1: p1.x,
              y1: p1.y,
              x2: p2.x,
              y2: p2.y,
              alpha,
            });
          }
        }

        // Render particle dot
        const finalAlpha = Math.min(1, p1.baseAlpha + extraAlpha);
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p1.color}${finalAlpha.toFixed(2)})`;
        ctx.fill();
      }

      // Batched draw: Inter-particle constellation lines
      if (particlePairs.length > 0) {
        ctx.beginPath();
        for (let k = 0; k < particlePairs.length; k++) {
          const pair = particlePairs[k];
          ctx.moveTo(pair.x1, pair.y1);
          ctx.lineTo(pair.x2, pair.y2);
        }
        ctx.strokeStyle = "rgba(99, 102, 241, 0.09)";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Batched draw: Cursor filament lines
      if (filamentTargets.length > 0) {
        ctx.beginPath();
        for (let k = 0; k < filamentTargets.length; k++) {
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(filamentTargets[k].x, filamentTargets[k].y);
        }
        ctx.strokeStyle = "rgba(56, 189, 248, 0.18)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (idleTimer) clearTimeout(idleTimer);
      motionQuery.removeEventListener("change", onMotionChange);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={
        {
          "--cursor-x": "50vw",
          "--cursor-y": "35vh",
          transform: "translateZ(0)",
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      {/* 1. Deep Obsidian Base Tone */}
      <div className="absolute inset-0 bg-[#080b14]" />

      {/* 2. Sleek static radial ambient lights for rich color depth */}
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full opacity-35 blur-[120px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(56, 189, 248, 0.12) 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-20 blur-[140px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[500px] rounded-full opacity-20 blur-[130px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, transparent 70%)",
        }}
      />

      {/* 3. Subtle dot texture matrix across the entire background */}
      <div
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(148, 163, 184, 0.7) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* 4. Mouse-Illuminated Grid Spotlight: dynamically reveals and highlights the grid near cursor */}
      <div
        className="absolute inset-0 transition-opacity duration-300 opacity-70 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(56, 189, 248, 0.45) 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(360px circle at var(--cursor-x) var(--cursor-y), black 0%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(360px circle at var(--cursor-x) var(--cursor-y), black 0%, transparent 85%)",
        }}
      />

      {/* 5. Smooth Mouse-following Ambient Radiant Aura (GPU accelerated) */}
      <div
        className="absolute inset-0 transition-opacity duration-500 opacity-65 pointer-events-none"
        style={{
          background:
            "radial-gradient(550px circle at var(--cursor-x) var(--cursor-y), rgba(56, 189, 248, 0.09) 0%, rgba(99, 102, 241, 0.06) 40%, transparent 80%)",
        }}
      />

      {/* 6. Interactive Constellation & Dynamic Floating Nodes Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
