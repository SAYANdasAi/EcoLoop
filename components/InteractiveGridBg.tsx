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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isAnimating = false;

    // Grid spacing configuration - increased for better performance
    const spacing = 120;
    let nodes: Node[] = [];

    // ... (initNodes remains same)

    // Check if any node is still moving significantly
    const checkNodeStability = () => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const dxBase = node.baseX - node.x;
        const dyBase = node.baseY - node.y;
        if (
          Math.abs(node.vx) > 0.01 || 
          Math.abs(node.vy) > 0.01 || 
          Math.abs(dxBase) > 0.1 || 
          Math.abs(dyBase) > 0.1
        ) {
          return false;
        }
      }
      return true;
    };

    // Frame render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Background base fill
      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const ripples = ripplesRef.current;
      let needsSubsequentFrame = false;

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha -= 0.015;
        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        } else {
          needsSubsequentFrame = true;
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
          
          if (distMouse < 180) {
            const force = (180 - distMouse) / 180;
            const angle = Math.atan2(dyMouse, dxMouse);
            const pullForce = force * 6;
            node.vx += Math.cos(angle) * pullForce;
            node.vy += Math.sin(angle) * pullForce;
            // If mouse is active and close, we likely need another frame
            needsSubsequentFrame = true;
          }
        }

        node.vx *= 0.82;
        node.vy *= 0.82;
        node.x += node.vx;
        node.y += node.vy;
      });

      // If we haven't already decided to animate, check all nodes for stability
      if (!needsSubsequentFrame && !checkNodeStability()) {
        needsSubsequentFrame = true;
      }

      // Draw Grid Lines with dynamic alpha offsets near mouse/ripples
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      // Draw base vertical lines
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const idx = c * rows + r;
          if (idx >= nodes.length) continue;
          const node = nodes[idx];

          if (r === 0) {
            ctx.moveTo(node.x, node.y);
          } else {
            ctx.lineTo(node.x, node.y);
          }
        }
      }
      ctx.strokeStyle = "rgba(0, 234, 100, 0.075)"; // brand green base grid lines
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Draw base horizontal lines
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = c * rows + r;
          if (idx >= nodes.length) continue;
          const node = nodes[idx];

          if (c === 0) {
            ctx.moveTo(node.x, node.y);
          } else {
            ctx.lineTo(node.x, node.y);
          }
        }
      }
      ctx.strokeStyle = "rgba(0, 234, 100, 0.075)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Highlight line segments dynamically near mouse or ripples
      nodes.forEach((node, idx) => {
        let highlightAlpha = 0;

        // Proximity check
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            highlightAlpha += (180 - dist) / 180 * 0.15;
          }
        }

        // Ripple check
        ripples.forEach((rip) => {
          const dx = rip.x - node.x;
          const dy = rip.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ringWidth = 80;
          if (Math.abs(dist - rip.radius) < ringWidth) {
            const ringFactor = 1 - Math.abs(dist - rip.radius) / ringWidth;
            highlightAlpha += ringFactor * rip.alpha * 0.4;
          }
        });

        // Draw glowing line to right and bottom neighbors if alpha > 0
        if (highlightAlpha > 0.01) {
          const c = Math.floor(idx / rows);
          const r = idx % rows;

          // Draw right connection
          if (c < cols - 1) {
            const rightIdx = (c + 1) * rows + r;
            if (rightIdx < nodes.length) {
              const rightNode = nodes[rightIdx];
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(rightNode.x, rightNode.y);
              ctx.strokeStyle = `rgba(0, 234, 100, ${highlightAlpha})`;
              ctx.lineWidth = 1.0;
              ctx.stroke();
            }
          }

          // Draw bottom connection
          if (r < rows - 1) {
            const bottomIdx = c * rows + (r + 1);
            if (bottomIdx < nodes.length) {
              const bottomNode = nodes[bottomIdx];
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(bottomNode.x, bottomNode.y);
              ctx.strokeStyle = `rgba(0, 234, 100, ${highlightAlpha})`;
              ctx.lineWidth = 1.0;
              ctx.stroke();
            }
          }
        }
      });

      // Render glowing nodes (only draw when hovered or rippled for performance)
      nodes.forEach((node) => {
        let alpha = 0.01;
        let isGlow = false;

        // Proximity glow
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            alpha += (150 - dist) / 150 * 0.35;
            isGlow = true;
          }
        }

        // Ripple shockwave intersection glow
        ripples.forEach((rip) => {
          const dx = rip.x - node.x;
          const dy = rip.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Width of the pulse ring
          const ringWidth = 80;
          if (Math.abs(dist - rip.radius) < ringWidth) {
            const ringFactor = 1 - Math.abs(dist - rip.radius) / ringWidth;
            alpha += ringFactor * rip.alpha * 0.8;
            isGlow = true;
          }
        });

        if (isGlow && alpha > 0.01) {
          // Draw outer glow circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 234, 100, ${alpha})`;
          ctx.fill();

          // Draw small bright center core
          ctx.beginPath();
          ctx.arc(node.x, node.y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 1.8)})`;
          ctx.fill();
        }
      });

      if (needsSubsequentFrame) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        isAnimating = false;
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
