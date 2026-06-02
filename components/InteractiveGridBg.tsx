"use client";

import React, { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
}

export default function InteractiveGridBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const ripplesRef = useRef<Ripple[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isAnimating = false;

    // Grid spacing configuration
    const spacing = 120;
    let nodes: Node[] = [];

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const count = 30;
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5,
          life: Math.random() * 0.5 + 0.5,
        });
      }
    };

    const initNodes = () => {
      nodes = [];
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * spacing;
          const y = r * spacing;
          nodes.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    initNodes();
    initParticles();

    // Start/resume render loop
    const startAnimating = () => {
      if (!isAnimating) {
        isAnimating = true;
        render();
      }
    };

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
      startAnimating();
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleWindowClick = (e: MouseEvent) => {
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.max(width, height) * 0.8,
        speed: 12,
        alpha: 1,
      });
      startAnimating();
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
      startAnimating();
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("click", handleWindowClick);
    window.addEventListener("resize", handleResize);

    // Frame render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Background base fill
      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const ripples = ripplesRef.current;
      const particles = particlesRef.current;
      let needsSubsequentFrame = true; // Particles always need animation

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Gravity towards mouse
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 400) {
            const force = (400 - dist) / 400;
            p.vx += (dx / dist) * force * 0.02;
            p.vy += (dy / dist) * force * 0.02;
          }
        }

        // Friction and bounds
        p.vx *= 0.99;
        p.vy *= 0.99;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 234, 100, ${p.alpha})`;
        ctx.fill();
      });

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha -= 0.015;
        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Update and displace nodes
      nodes.forEach((node) => {
        const dxBase = node.baseX - node.x;
        const dyBase = node.baseY - node.y;
        
        node.vx += dxBase * 0.04;
        node.vy += dyBase * 0.04;

        if (mouse.active) {
          const dxMouse = mouse.x - node.x;
          const dyMouse = mouse.y - node.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          
          if (distMouse < 250) {
            const force = (250 - distMouse) / 250;
            const angle = Math.atan2(dyMouse, dxMouse);
            const pullForce = force * 8;
            node.vx += Math.cos(angle) * pullForce;
            node.vy += Math.sin(angle) * pullForce;
          }
        }

        node.vx *= 0.85;
        node.vy *= 0.85;
        node.x += node.vx;
        node.y += node.vy;
      });

      // Draw Grid Lines
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      // Global Spotlight mask
      if (mouse.active) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 600);
        gradient.addColorStop(0, "rgba(0, 234, 100, 0.15)");
        gradient.addColorStop(0.5, "rgba(0, 234, 100, 0.05)");
        gradient.addColorStop(1, "rgba(0, 234, 100, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const idx = c * rows + r;
          if (idx >= nodes.length) continue;
          const node = nodes[idx];
          if (r === 0) ctx.moveTo(node.x, node.y);
          else ctx.lineTo(node.x, node.y);
        }
      }
      ctx.strokeStyle = "rgba(0, 234, 100, 0.05)";
      ctx.stroke();

      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = c * rows + r;
          if (idx >= nodes.length) continue;
          const node = nodes[idx];
          if (c === 0) ctx.moveTo(node.x, node.y);
          else ctx.lineTo(node.x, node.y);
        }
      }
      ctx.strokeStyle = "rgba(0, 234, 100, 0.05)";
      ctx.stroke();

      // Dynamic connection highlights
      nodes.forEach((node, idx) => {
        let highlightAlpha = 0;
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) highlightAlpha += (200 - dist) / 200 * 0.2;
        }

        ripples.forEach((rip) => {
          const dx = rip.x - node.x;
          const dy = rip.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ringWidth = 80;
          if (Math.abs(dist - rip.radius) < ringWidth) {
            highlightAlpha += (1 - Math.abs(dist - rip.radius) / ringWidth) * rip.alpha * 0.4;
          }
        });

        if (highlightAlpha > 0.01) {
          const c = Math.floor(idx / rows);
          const r = idx % rows;
          if (c < cols - 1) {
            const rightNode = nodes[(c + 1) * rows + r];
            if (rightNode) {
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(rightNode.x, rightNode.y);
              ctx.strokeStyle = `rgba(0, 234, 100, ${highlightAlpha})`;
              ctx.stroke();
            }
          }
          if (r < rows - 1) {
            const bottomNode = nodes[idx + 1];
            if (bottomNode) {
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(bottomNode.x, bottomNode.y);
              ctx.strokeStyle = `rgba(0, 234, 100, ${highlightAlpha})`;
              ctx.stroke();
            }
          }
        }
      });

      if (needsSubsequentFrame) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Draw the initial grid once on mount
    startAnimating();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleWindowClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
