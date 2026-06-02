"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  span?: string;
}

export function BentoCard({ 
  children, 
  className = "", 
  glowColor = "rgba(34, 197, 94, 0.12)",
  span = "col-span-1" 
}: BentoCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Magnetic values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Spotlight coords
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    // Magnetic offset
    x.set((e.clientX - centerX) * 0.1);
    y.set((e.clientY - centerY) * 0.1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Parallax shift for content
  const contentShiftX = useTransform(mouseXSpring, (v) => v * 0.5);
  const contentShiftY = useTransform(mouseYSpring, (v) => v * 0.5);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      className={`relative overflow-hidden bg-[#0A0A0A] rounded-[2.5rem] p-10 border border-white/5 transition-all duration-700 hover:border-white/20 group flex flex-col h-full border-sweep ${span} ${className}`}
    >
      {/* Dynamic Ambient Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`
        }}
      />

      {/* Futuristic dotted grid backdrop visible inside spotlight */}
      <div
        className="absolute inset-0 tech-grid opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
        style={{
          maskImage: isHovered ? `radial-gradient(250px circle at ${coords.x}px ${coords.y}px, black 20%, transparent 80%)` : undefined,
          WebkitMaskImage: isHovered ? `radial-gradient(250px circle at ${coords.x}px ${coords.y}px, black 20%, transparent 80%)` : undefined,
        }}
      />

      {/* Content wrapper with Magnetic Parallax */}
      <motion.div 
        className="relative z-10 flex flex-col h-full"
        style={{ x: contentShiftX, y: contentShiftY }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function BentoGrid({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 ${className}`}>
      {children}
    </div>
  );
}
