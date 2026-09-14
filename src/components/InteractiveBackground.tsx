"use client";

import React, { useEffect, useRef, useState } from "react";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // High DPI scaling (capped at 2 for 60fps performance)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Mouse tracking with smooth linear interpolation (lerp)
    let mouseX = width / 2;
    let mouseY = height * 0.3;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let isMouseActive = false;
    let idleTime = 0;

    // Detect touch / coarse pointer devices
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Setup particle count based on screen width
    const particleCount = width < 768 ? 22 : 48;
    const particles: Particle[] = [];

    const palette = [
      "rgba(56, 189, 248,", // cyan
      "rgba(99, 102, 241,", // indigo
      "rgba(129, 140, 248,", // soft violet
      "rgba(45, 212, 191,", // teal
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.2 + 0.9,
        baseAlpha: Math.random() * 0.35 + 0.15,
        color: palette[Math.floor(Math.random() * palette.length)],
      });
    }

    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      isMouseActive = true;
      idleTime = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMouseX = e.touches[0].clientX;
        targetMouseY = e.touches[0].clientY;
        isMouseActive = true;
        idleTime = 0;
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);

    // Frame render loop
    let lastTime = performance.now();

    const render = (now: number) => {
      // Pause loop if tab is hidden to ensure zero background CPU usage
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Handle idle / autonomous floating drift for touch devices or inactive mouse
      if (!isMouseActive || isTouchDevice) {
        idleTime += delta * 0.5;
        // Lissajous smooth curve
        targetMouseX = width * 0.5 + Math.cos(idleTime * 0.7) * (width * 0.28);
        targetMouseY = height * 0.35 + Math.sin(idleTime * 1.1) * (height * 0.18);
      }

      // Smooth lerp towards target mouse position
      const lerpSpeed = 0.08;
      mouseX += (targetMouseX - mouseX) * lerpSpeed;
      mouseY += (targetMouseY - mouseY) * lerpSpeed;

      // Update CSS variables on container for mouse-reactive radial gradient spotlight & grid
      container.style.setProperty("--cursor-x", `${mouseX.toFixed(1)}px`);
      container.style.setProperty("--cursor-y", `${mouseY.toFixed(1)}px`);

      ctx.clearRect(0, 0, width, height);

      if (!prefersReducedMotion) {
        const mouseRadius = 140;
        const mouseRadiusSq = mouseRadius * mouseRadius;
        const connectionDist = 95;
        const connectionDistSq = connectionDist * connectionDist;

        // Draw particle constellation connections
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];

          // Particle update
          p1.x += p1.vx;
          p1.y += p1.vy;

          // Wrap around edges smoothly
          if (p1.x < -10) p1.x = width + 10;
          else if (p1.x > width + 10) p1.x = -10;
          if (p1.y < -10) p1.y = height + 10;
          else if (p1.y > height + 10) p1.y = -10;

          // Distance from mouse
          const dxMouse = p1.x - mouseX;
          const dyMouse = p1.y - mouseY;
          const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

          // Interactive mouse repulsion & tether
          let extraAlpha = 0;
          if (distMouseSq < mouseRadiusSq && !isTouchDevice) {
            const distMouse = Math.sqrt(distMouseSq);
            const force = (1 - distMouse / mouseRadius) * 0.8;
            p1.x += (dxMouse / distMouse) * force * 1.5;
            p1.y += (dyMouse / distMouse) * force * 1.5;
            extraAlpha = (1 - distMouse / mouseRadius) * 0.4;

            // Draw line from cursor to particle
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(p1.x, p1.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - distMouse / mouseRadius) * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }

          // Draw inter-particle lines
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < connectionDistSq) {
              const alpha = (1 - distSq / connectionDistSq) * 0.12;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }

          // Render particle dot
          const finalAlpha = Math.min(1, p1.baseAlpha + extraAlpha);
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${p1.color}${finalAlpha.toFixed(2)})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={
        {
          "--cursor-x": "50vw",
          "--cursor-y": "30vh",
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      {/* 1. Deep Obsidian Base Tone with ambient gradient mesh */}
      <div className="absolute inset-0 bg-[#080b14]" />

      {/* 2. Sleek static radial ambient lights for rich color depth */}
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full opacity-35 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(56, 189, 248, 0.12) 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-20 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[500px] rounded-full opacity-20 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, transparent 70%)",
        }}
      />

      {/* 3. Subtle dot texture matrix across the entire background */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(148, 163, 184, 0.7) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* 4. Mouse-Illuminated Grid Spotlight: dynamically reveals and highlights the grid near cursor */}
      <div
        className="absolute inset-0 transition-opacity duration-300 opacity-70"
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
        className="absolute inset-0 transition-opacity duration-500 opacity-65"
        style={{
          background:
            "radial-gradient(550px circle at var(--cursor-x) var(--cursor-y), rgba(56, 189, 248, 0.09) 0%, rgba(99, 102, 241, 0.06) 40%, transparent 80%)",
        }}
      />

      {/* 6. Interactive Constellation & Dynamic Floating Nodes Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
