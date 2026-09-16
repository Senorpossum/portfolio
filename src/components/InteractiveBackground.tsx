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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number = 0;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Optimized DPR: capped at 1.5 to maintain crisp rendering on Retina while saving 44% fill-rate overhead
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);

    // Dynamic coordinates and motion state
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

    // Optimized particle count: 22 on desktop and 10 on mobile for 60-120 FPS performance
    const isMobile = width < 768;
    const particleCount = isMobile ? 10 : 22;
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
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
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
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
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

    let lastTime = performance.now();
    const mouseRadius = 135;
    const mouseRadiusSq = mouseRadius * mouseRadius;
    const connectionDist = 85;
    const connectionDistSq = connectionDist * connectionDist;

    const render = (now: number) => {
      if (document.hidden || prefersReducedMotion) {
        animationFrameId = 0;
        return;
      }

      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // When user is not actively interacting, smoothly drift along Lissajous curve
      if (!isUserInteracting) {
        idleTime += delta * 0.4;
        targetMouseX = width * 0.5 + Math.cos(idleTime * 0.65) * (width * 0.25);
        targetMouseY = height * 0.35 + Math.sin(idleTime * 0.95) * (height * 0.15);
      }

      // Frame-rate independent linear interpolation
      const lerpFactor = 1 - Math.exp(-7 * delta);
      mouseX += (targetMouseX - mouseX) * lerpFactor;
      mouseY += (targetMouseY - mouseY) * lerpFactor;

      ctx.clearRect(0, 0, width, height);

      // 1. Hardware-accelerated radial cursor aura on canvas (zero DOM/CSS mask recalculations)
      const cursorGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 360);
      cursorGlow.addColorStop(0, "rgba(56, 189, 248, 0.08)");
      cursorGlow.addColorStop(0.45, "rgba(99, 102, 241, 0.035)");
      cursorGlow.addColorStop(1, "rgba(8, 11, 20, 0)");
      ctx.fillStyle = cursorGlow;
      ctx.fillRect(0, 0, width, height);

      // Update particle positions and compute mouse deflection
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq < mouseRadiusSq && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / mouseRadius) * 0.6;
          p.x += (dx / dist) * force * 1.2;
          p.y += (dy / dist) * force * 1.2;
        }
      }

      // 2. Inter-particle constellation lines (zero heap allocations, single stroke pass)
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          if (dx * dx + dy * dy < connectionDistSq) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.strokeStyle = "rgba(99, 102, 241, 0.11)";
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // 3. Filament tethers toward cursor when user is interacting
      if (isUserInteracting) {
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          if (dx * dx + dy * dy < mouseRadiusSq) {
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.strokeStyle = "rgba(56, 189, 248, 0.18)";
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      // 4. Render particle dots
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distSq = dx * dx + dy * dy;
        const extraAlpha = distSq < mouseRadiusSq ? (1 - Math.sqrt(distSq) / mouseRadius) * 0.35 : 0;
        const finalAlpha = Math.min(1, p.baseAlpha + extraAlpha);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${finalAlpha.toFixed(2)})`;
        ctx.fill();
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
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu will-change-transform"
      style={{ transform: "translate3d(0, 0, 0)" }}
      aria-hidden="true"
    >
      {/* 1. Deep Obsidian Base Tone */}
      <div className="absolute inset-0 bg-[#080b14]" />

      {/* 2. Static multi-stop radial ambient glows (hardware composited with zero expensive blur filters) */}
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(circle at center, rgba(99, 102, 241, 0.18) 0%, rgba(56, 189, 248, 0.08) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[40%] right-[-8%] w-[550px] h-[550px] rounded-full pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(circle at center, rgba(14, 165, 233, 0.16) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[450px] rounded-full pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* 3. Static dot texture matrix */}
      <div
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(148, 163, 184, 0.6) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* 4. GPU-Accelerated Interactive Canvas (renders cursor aura, constellation and particles) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
