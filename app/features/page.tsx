"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Leaf,
  ArrowLeft,
  Store,
  BrainCircuit,
  Wrench,
  TrendingUp,
  Compass,
  BarChart3,
} from "lucide-react";
import InteractiveGridBg from "../../components/InteractiveGridBg";
import SideMenu from "../../components/SideMenu";
import Marquee from "../../components/Marquee";
import { FadeUp } from "../../components/animations/FadeUp";

interface SpotlightCardProps {
  children: React.ReactNode;
  glowColor?: string;
}

function SpotlightCard({ children, glowColor = "rgba(74, 222, 128, 0.12)" }: SpotlightCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden bg-[#111111]/80 rounded-2xl p-8 border border-white/5 transition-all duration-300 hover:border-white/15 group flex flex-col h-full"
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      {/* Spotlight overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
        }}
      />
      <div className="relative z-10 flex flex-col h-full">{children}</div>
    </motion.div>
  );
}

const featuresData = [
  {
    title: "Hybrid Marketplace",
    desc: "Seamless C2B device collection combined with lightning-fast B2C and bulk B2B component trade systems.",
    icon: Store,
    glowColor: "rgba(52, 211, 153, 0.14)",
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-400/5 group-hover:bg-emerald-400/10",
  },
  {
    title: "AI Multi-Outcome Engine",
    desc: "Smart neural networks classify devices into 4 distinct outcomes instantly, maximizing value salvage.",
    icon: BrainCircuit,
    glowColor: "rgba(59, 130, 246, 0.14)",
    iconColor: "text-blue-400",
    bgColor: "bg-blue-400/5 group-hover:bg-blue-400/10",
  },
  {
    title: "Component Recovery",
    desc: "Surgical harvesting of perfectly intact modules (screens, OEM batteries, cameras) rather than basic crushing.",
    icon: Wrench,
    glowColor: "rgba(245, 158, 11, 0.14)",
    iconColor: "text-amber-400",
    bgColor: "bg-amber-400/5 group-hover:bg-amber-400/10",
  },
  {
    title: "Dynamic Pricing",
    desc: "Machine learning algorithms track global part scarcity and component demand to guarantee top-dollar payouts.",
    icon: TrendingUp,
    glowColor: "rgba(6, 182, 212, 0.14)",
    iconColor: "text-cyan-400",
    bgColor: "bg-cyan-400/5 group-hover:bg-cyan-400/10",
  },
  {
    title: "Circular Ledger",
    desc: "A secure cryptographic ledger tracks every handoff, certification, and hardware outcome for total circular custody.",
    icon: Compass,
    glowColor: "rgba(168, 85, 247, 0.14)",
    iconColor: "text-purple-400",
    bgColor: "bg-purple-400/5 group-hover:bg-purple-400/10",
  },
  {
    title: "Eco Transparency",
    desc: "Get precise reports detailing exactly how much carbon emissions were averted and metals saved with every transaction.",
    icon: BarChart3,
    glowColor: "rgba(244, 63, 94, 0.14)",
    iconColor: "text-rose-400",
    bgColor: "bg-rose-400/5 group-hover:bg-rose-400/10",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100 font-sans relative overflow-x-hidden selection:bg-green-500 selection:text-slate-950">
      {/* Interactive Background */}
      <InteractiveGridBg />

      {/* Floating Side Drawer Menu */}
      <SideMenu />

      {/* Background Marquee */}
      <Marquee />

      {/* Minimal Header */}
      <header className="absolute top-0 inset-x-0 z-40 bg-transparent py-6 border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center text-slate-950 transition-transform group-hover:scale-105">
              <Leaf className="w-5 h-5 fill-slate-950 stroke-slate-950" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-green-400 transition-colors">
              EcoLoop
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Content wrapper */}
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <FadeUp>
            <h1
              className="font-bold tracking-tighter"
              style={{
                fontFamily: "var(--font-sans), Inter, system-ui, sans-serif",
                fontSize: "clamp(36px, 6vw, 76px)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.22)", display: "block" }}>
                Circular architecture
              </span>
              <span style={{ color: "rgba(255, 255, 255, 0.88)", display: "block" }}>
                engineered for absolute ✦ recovery
              </span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="mt-6 text-base text-white/50 max-w-2xl mx-auto font-body">
              EcoLoop leverages modern neural processing, cryptographic tracking, and dynamic pricing networks to salvage every gram of raw value from electronics.
            </p>
          </FadeUp>
        </div>

        {/* Features grid */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, i) => {
            const IconComponent = feature.icon;
            return (
              <FadeUp key={feature.title} delay={0.1 + i * 0.08}>
                <SpotlightCard glowColor={feature.glowColor}>
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center relative shadow-lg group-hover:scale-105 transition-transform mb-6 overflow-hidden">
                    <div className={`absolute inset-0 ${feature.bgColor} transition-colors`} />
                    <IconComponent className={`w-5 h-5 ${feature.iconColor} relative z-10`} />
                  </div>
                  <h4 className="font-ui text-lg font-bold text-white group-hover:text-green-400 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="font-body text-sm text-white/50 mt-3 leading-relaxed flex-grow">
                    {feature.desc}
                  </p>
                </SpotlightCard>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </div>
  );
}
