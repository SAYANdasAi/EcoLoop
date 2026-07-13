"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Leaf,
  ArrowRight,
  Menu,
  X,
  Truck,
  Cpu,
  Layers,
  ShoppingBag,
  Coins,
  Store,
  BrainCircuit,
  Wrench,
  TrendingUp,
  Compass,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Recycle,
  Package,
  ShoppingCart,
} from "lucide-react";
import { LogoIcon, LogoText, LogoFull, LogoTagline } from "../components/Logo";
import { WordReveal } from "../components/animations/WordReveal";
import { GlowText } from "../components/animations/GlowText";
import { FadeUp } from "../components/animations/FadeUp";
import { FloatCard } from "../components/animations/FloatCard";
import SideMenu from "../components/SideMenu";
import StickyCards from "../components/StickyCards";
import Marquee from "../components/Marquee";
import InteractiveGridBg from "../components/InteractiveGridBg";
import { BentoGrid, BentoCard } from "../components/BentoGrid";
import { useAuth } from "../context/AppContext";
import Footer from "../components/Footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const stepsData = [
  {
    number: 1,
    title: "Device Pickup",
    desc: "Schedule a home pickup or print a pre-paid shipping label.",
    icon: Truck,
    color: "from-eco-green/20 to-eco-green/5",
    textColor: "text-eco-green",
    glowColor: "rgba(34, 197, 94, 0.2)",
    iconVariants: { hover: { x: [0, 8, -4, 0], transition: { duration: 0.8, ease: "easeInOut" } } }
  },
  {
    number: 2,
    title: "AI Evaluation",
    desc: "AI scans component grades, battery health, and chassis marks.",
    icon: Cpu,
    color: "from-ai-cyan/20 to-ai-cyan/5",
    textColor: "text-ai-cyan",
    glowColor: "rgba(0, 255, 194, 0.2)",
    iconVariants: { hover: { rotate: 180, scale: 1.1, transition: { duration: 0.8, ease: "easeInOut" } } }
  },
  {
    number: 3,
    title: "Route Decision",
    desc: "Automatic routing to refurbish, resale, parts, or recycling.",
    icon: Layers,
    color: "from-mint-glow/20 to-mint-glow/5",
    textColor: "text-mint-glow",
    glowColor: "rgba(0, 230, 118, 0.2)",
    iconVariants: { hover: { y: [0, -6, 6, 0], scale: 1.05, transition: { duration: 0.8, ease: "easeInOut" } } }
  },
  {
    number: 4,
    title: "Marketplace Listing",
    desc: "Devices and salvaged parts are listed instantly to B2B/B2C hubs.",
    icon: ShoppingBag,
    color: "from-primary-glow/20 to-primary-glow/5",
    textColor: "text-primary-glow",
    glowColor: "rgba(0, 245, 160, 0.2)",
    iconVariants: { hover: { rotate: [0, -15, 15, -10, 10, 0], transition: { duration: 1, ease: "easeInOut" } } }
  },
  {
    number: 5,
    title: "Reuse & Earn",
    desc: "Get cash back immediately while keeping rare earth minerals in use.",
    icon: Coins,
    color: "from-eco-green/20 to-eco-green/5",
    textColor: "text-eco-green",
    glowColor: "rgba(34, 197, 94, 0.2)",
    iconVariants: { hover: { y: [0, -8, 4, 0], rotate: [0, 10, -10, 0], transition: { duration: 0.9, ease: "easeInOut" } } }
  }
];

const featuresData = [
  {
    title: "Hybrid Marketplace",
    desc: "Seamless C2B device collection combined with lightning-fast B2C and bulk B2B component trade systems.",
    icon: Store,
    glowColor: "rgba(34, 197, 94, 0.14)",
    iconColor: "text-eco-green",
    bgColor: "bg-eco-green/5 group-hover:bg-eco-green/10",
    borderColor: "group-hover:border-eco-green/30"
  },
  {
    title: "AI Multi-Outcome Engine",
    desc: "Smart neural networks automatically classify devices into 4 distinct routing outcomes, optimizing value salvage.",
    icon: BrainCircuit,
    glowColor: "rgba(0, 230, 118, 0.14)",
    iconColor: "text-mint-glow",
    bgColor: "bg-mint-glow/5 group-hover:bg-mint-glow/10",
    borderColor: "group-hover:border-mint-glow/30"
  },
  {
    title: "Component-Level Recovery",
    desc: "Surgical harvesting of perfectly intact modules (screens, OEM batteries, cameras) rather than basic crushing.",
    icon: Wrench,
    glowColor: "rgba(0, 255, 194, 0.14)",
    iconColor: "text-ai-cyan",
    bgColor: "bg-ai-cyan/5 group-hover:bg-ai-cyan/10",
    borderColor: "group-hover:border-ai-cyan/30"
  },
  {
    title: "Dynamic Pricing Models",
    desc: "Machine learning algorithms track global part scarcity and component demand to guarantee top-dollar payouts instantly.",
    icon: TrendingUp,
    glowColor: "rgba(0, 245, 160, 0.14)",
    iconColor: "text-primary-glow",
    bgColor: "bg-primary-glow/5 group-hover:bg-primary-glow/10",
    borderColor: "group-hover:border-primary-glow/30"
  },
  {
    title: "Device Journey Tracking",
    desc: "A secure cryptographic ledger tracks every handoff, certification, and hardware outcome for total circular custody.",
    icon: Compass,
    glowColor: "rgba(34, 197, 94, 0.14)",
    iconColor: "text-eco-green",
    bgColor: "bg-eco-green/5 group-hover:bg-eco-green/10",
    borderColor: "group-hover:border-eco-green/30"
  },
  {
    title: "Eco Transparency",
    desc: "Get precise reports detailing exactly how much carbon emissions were averted and metals saved with every transaction.",
    icon: BarChart3,
    glowColor: "rgba(0, 230, 118, 0.14)",
    iconColor: "text-mint-glow",
    bgColor: "bg-mint-glow/5 group-hover:bg-mint-glow/10",
    borderColor: "group-hover:border-mint-glow/30"
  }
];

// ==========================================
// 1. ANIMATION CONSTANTS & VARIANTS
// ==========================================

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ==========================================
// 2. HELPER COMPONENTS
// ==========================================

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

function SpotlightCard({ children, className = "", glowColor = "rgba(74, 222, 128, 0.12)" }: SpotlightCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <motion.div
      variants={fadeInUp}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden bg-[#111111]/80 rounded-2xl p-8 border border-white/5 transition-all duration-300 hover:border-white/15 group flex flex-col h-full ${className}`}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      {/* Spotlight overlay */}
      <div
        className="absolute inset-0 glow-spotlight pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`
        }}
      />

      {/* Futuristic dotted grid backdrop visible inside spotlight */}
      <div
        className="absolute inset-0 tech-grid opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
        style={{
          maskImage: isHovered ? `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, black 20%, transparent 80%)` : undefined,
          WebkitMaskImage: isHovered ? `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, black 20%, transparent 80%)` : undefined,
        }}
      />

      {/* Decorative radial corner glow */}
      <div className="absolute -top-12 -left-12 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl pointer-events-none transition-all duration-300" />

      {/* Content wrapper to ensure relative z-index */}
      <div className="relative z-10 flex flex-col h-full">
        {children}
      </div>
    </motion.div>
  );
}

interface HolographicScannerProps {
  device: "phone" | "laptop" | "tablet";
  scanStep: number;
}

function DataStream() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const characters = "0123456789ABCDEF";
  return (
    <div className="absolute inset-0 flex justify-around opacity-[0.05] md:opacity-[0.08] pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => ( // Reduced from 10 to 6
        <motion.div
          key={i}
          initial={{ y: -100 }}
          animate={{ y: 500 }}
          transition={{
            duration: Math.random() * 3 + 4,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
          className="text-[6px] md:text-[8px] font-mono text-green-500 flex flex-col"
        >
          {[...Array(20)].map((_, j) => (
            <span key={j}>{characters[Math.floor(Math.random() * characters.length)]}</span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

function HolographicScanner({ device, scanStep }: HolographicScannerProps) {
  const isScanning = scanStep > 0 && scanStep < 8;
  const isFinished = scanStep >= 8;

  const screenGradeColor = !isFinished
    ? (scanStep === 4 ? "text-yellow-400 animate-pulse pulse-target" : "text-slate-600/80")
    : (device === "phone" ? "text-green-400" : "text-red-500");

  const batteryGradeColor = !isFinished
    ? (scanStep === 5 ? "text-yellow-400 animate-pulse pulse-target" : "text-slate-600/80")
    : (device === "phone" ? "text-green-400" : device === "laptop" ? "text-yellow-500" : "text-red-500");

  const cameraGradeColor = !isFinished
    ? (scanStep === 6 ? "text-yellow-400 animate-pulse pulse-target" : "text-slate-600/80")
    : "text-green-500";

  const chassisGradeColor = !isFinished
    ? (scanStep === 7 ? "text-yellow-400 animate-pulse pulse-target" : "text-slate-600/80")
    : (device === "phone" ? "text-green-400" : device === "laptop" ? "text-yellow-500" : "text-red-500");

  return (
    <div className="relative w-full max-w-[320px] md:max-w-[340px] bg-[#09090b] border border-white/[0.07] rounded-[2rem] p-6 md:p-6 flex flex-col items-center justify-between overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] scale-100 md:scale-110 mb-8 md:mb-0">
      
      {/* Sci-fi tech border corners */}
      <span className="absolute top-3 left-3 w-3 h-3 border-t border-l border-mint-glow/40" />
      <span className="absolute top-3 right-3 w-3 h-3 border-t border-r border-mint-glow/40" />
      <span className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-mint-glow/40" />
      <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-mint-glow/40" />
      
      {/* Sleek top status header bar (Fixes overlap with notch) */}
      <div className="w-full flex items-center justify-between border-b border-white/[0.04] pb-2 z-10">
        <div className="flex gap-1.5 items-center">
          <div className={`w-1 h-1 rounded-full ${isScanning ? "bg-amber-400 animate-pulse" : "bg-green-500 animate-ping"}`} />
          <span className="font-mono text-[8px] text-white/30 uppercase tracking-[0.15em] select-none">AI_CORE_DIAG</span>
        </div>
        <span className="font-mono text-[8px] text-mint-glow font-bold uppercase tracking-wider select-none">
          {isFinished ? "SCAN COMPLETE" : isScanning ? "ANALYSIS IN PROGRESS" : "STANDBY"}
        </span>
      </div>

      <DataStream />

      {/* Cyber grid texture */}
      <div className="absolute inset-0 tech-grid opacity-[0.06] pointer-events-none" />

      {/* Sweeping Laser Beam - Premium Glowing sweep bar */}
      {isScanning && (
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-glow to-transparent shadow-[0_0_15px_#00F5A0,0_0_30px_#00E676] z-20 pointer-events-none laser-active" />
      )}

      {/* Neural Pulse Circles */}
      {isScanning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.3, opacity: 0.4 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 1.2,
                ease: "easeOut"
              }}
              className="absolute w-40 h-40 border border-mint-glow/15 rounded-full"
            />
          ))}
        </div>
      )}

      {/* Device Vector Silhouette and target dots */}
      <motion.div 
        animate={{ 
          scale: isScanning ? 1.02 : 1,
          rotateY: isScanning ? [0, 4, -4, 0] : 0 
        }}
        transition={{ duration: 5, repeat: isScanning ? Infinity : 0, ease: "easeInOut" }}
        className="relative w-full flex-1 flex items-center justify-center z-10 py-6"
      >
        {device === "phone" && (
          <div className="relative w-32 h-56 border-2 border-white/10 rounded-[2rem] bg-black/45 p-1.5 shadow-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
            {/* Notch */}
            <div className="w-12 h-3.5 bg-slate-900 rounded-full mx-auto" />
            <div className="flex-1 rounded-[1.6rem] border border-white/[0.05] bg-black/35 relative flex items-center justify-center overflow-hidden mt-1">
              {/* Screen target */}
              <div className={`absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${screenGradeColor}`} title="Screen check">
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>

              {/* Battery target */}
              <div className={`absolute top-[60%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${batteryGradeColor}`} title="Battery health">
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>

              {/* Camera target */}
              <div className={`absolute top-[18%] left-[24%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${cameraGradeColor}`} title="Camera sensor">
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>

              {/* Chassis target */}
              <div className={`absolute top-[80%] left-[30%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${chassisGradeColor}`} title="Chassis condition">
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>
            </div>
          </div>
        )}

        {device === "laptop" && (
          <div className="relative w-48 h-40 flex flex-col justify-end transition-all duration-300 hover:scale-[1.02]">
            {/* Screen lid */}
            <div className="w-[160px] h-[95px] border-2 border-white/10 rounded-t-lg bg-black/45 mx-auto relative p-1 flex items-center justify-center shadow-xl">
              <div className="flex-1 h-full rounded border border-white/[0.05] bg-black/35 relative">
                {/* Screen target */}
                <div className={`absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${screenGradeColor}`} title="Screen check">
                  <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
                </div>
              </div>
            </div>
            {/* Lower deck */}
            <div className="w-full h-3 border-2 border-white/10 bg-slate-900/60 rounded-t relative">
              <div className="w-16 h-0.5 bg-black rounded-b mx-auto" />

              {/* Battery target (inside deck) */}
              <div className={`absolute top-[-26px] left-[20%] cursor-pointer z-10 transition-colors duration-300 ${batteryGradeColor}`} title="Battery health">
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>

              {/* Motherboard target */}
              <div className={`absolute top-[-26px] right-[20%] cursor-pointer z-10 transition-colors duration-300 ${chassisGradeColor}`} title="Logic board check">
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>
            </div>
          </div>
        )}

        {device === "tablet" && (
          <div className="relative w-40 h-48 border-2 border-white/10 rounded-[1.2rem] bg-black/45 p-1.5 shadow-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
            <div className="flex-1 rounded-[0.9rem] border border-white/[0.05] bg-black/35 relative flex items-center justify-center overflow-hidden">
              {/* Screen target */}
              <div className={`absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${screenGradeColor}`} title="Screen check">
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>

              {/* Battery target */}
              <div className={`absolute top-[75%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${batteryGradeColor}`} title="Battery health">
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>

              {/* Motherboard target */}
              <div className={`absolute top-[18%] left-[25%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${chassisGradeColor}`} title="Chassis check">
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Structured Tactical HUD Status Grid (Prevents cramped overlap text) */}
      <div className="w-full mt-2 pt-3.5 border-t border-white/[0.05] grid grid-cols-2 gap-2 z-10 font-mono text-[9px]">
        {device === "phone" && (
          <>
            <div className={`p-1.5 rounded-lg border bg-[#050505]/40 flex flex-col transition-all ${scanStep >= 4 ? "border-mint-glow/20 text-white" : "border-white/[0.03] text-white/30"}`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${scanStep === 4 ? "bg-amber-400 animate-pulse" : scanStep > 4 ? "bg-mint-glow shadow-[0_0_6px_rgba(0,230,118,0.8)]" : "bg-slate-600"}`} />
                <span className="font-bold tracking-wider">SCR (Screen)</span>
              </div>
              <span className="mt-1 font-semibold text-[8px] truncate">
                {isFinished ? "Grade B (Scratched)" : isScanning && scanStep === 4 ? "SCANNING..." : "WAITING"}
              </span>
            </div>

            <div className={`p-1.5 rounded-lg border bg-[#050505]/40 flex flex-col transition-all ${scanStep >= 5 ? "border-mint-glow/20 text-white" : "border-white/[0.03] text-white/30"}`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${scanStep === 5 ? "bg-amber-400 animate-pulse" : scanStep > 5 ? "bg-mint-glow shadow-[0_0_6px_rgba(0,230,118,0.8)]" : "bg-slate-600"}`} />
                <span className="font-bold tracking-wider">BAT (Battery)</span>
              </div>
              <span className="mt-1 font-semibold text-[8px] truncate">
                {isFinished ? "82% Capacity" : isScanning && scanStep === 5 ? "ANALYZING..." : "WAITING"}
              </span>
            </div>

            <div className={`p-1.5 rounded-lg border bg-[#050505]/40 flex flex-col transition-all ${scanStep >= 6 ? "border-mint-glow/20 text-white" : "border-white/[0.03] text-white/30"}`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${scanStep === 6 ? "bg-amber-400 animate-pulse" : scanStep > 6 ? "bg-mint-glow shadow-[0_0_6px_rgba(0,230,118,0.8)]" : "bg-slate-600"}`} />
                <span className="font-bold tracking-wider">CAM (Camera)</span>
              </div>
              <span className="mt-1 font-semibold text-[8px] truncate">
                {isFinished ? "Grade A (Mint)" : isScanning && scanStep === 6 ? "CHECKING..." : "WAITING"}
              </span>
            </div>

            <div className={`p-1.5 rounded-lg border bg-[#050505]/40 flex flex-col transition-all ${scanStep >= 7 ? "border-mint-glow/20 text-white" : "border-white/[0.03] text-white/30"}`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${scanStep === 7 ? "bg-amber-400 animate-pulse" : scanStep > 7 ? "bg-mint-glow shadow-[0_0_6px_rgba(0,230,118,0.8)]" : "bg-slate-600"}`} />
                <span className="font-bold tracking-wider">CHA (Chassis)</span>
              </div>
              <span className="mt-1 font-semibold text-[8px] truncate">
                {isFinished ? "Grade B (Scuffed)" : isScanning && scanStep === 7 ? "INSPECTING..." : "WAITING"}
              </span>
            </div>
          </>
        )}

        {device === "laptop" && (
          <>
            <div className={`p-1.5 rounded-lg border bg-[#050505]/40 flex flex-col transition-all ${scanStep >= 4 ? "border-mint-glow/20 text-white" : "border-white/[0.03] text-white/30"}`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${scanStep === 4 ? "bg-amber-400 animate-pulse" : scanStep > 4 ? "bg-mint-glow shadow-[0_0_6px_rgba(0,230,118,0.8)]" : "bg-slate-600"}`} />
                <span className="font-bold tracking-wider">SCR (Screen)</span>
              </div>
              <span className="mt-1 font-semibold text-[8px] truncate">
                {isFinished ? "Grade C (Delam)" : isScanning && scanStep === 4 ? "SCANNING..." : "WAITING"}
              </span>
            </div>

            <div className={`p-1.5 rounded-lg border bg-[#050505]/40 flex flex-col transition-all ${scanStep >= 5 ? "border-mint-glow/20 text-white" : "border-white/[0.03] text-white/30"}`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${scanStep === 5 ? "bg-amber-400 animate-pulse" : scanStep > 5 ? "bg-mint-glow shadow-[0_0_6px_rgba(0,230,118,0.8)]" : "bg-slate-600"}`} />
                <span className="font-bold tracking-wider">BAT (Battery)</span>
              </div>
              <span className="mt-1 font-semibold text-[8px] truncate">
                {isFinished ? "76% Capacity" : isScanning && scanStep === 5 ? "ANALYZING..." : "WAITING"}
              </span>
            </div>

            <div className={`p-1.5 rounded-lg border bg-[#050505]/40 col-span-2 flex flex-col transition-all ${scanStep >= 7 ? "border-mint-glow/20 text-white" : "border-white/[0.03] text-white/30"}`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${scanStep === 7 ? "bg-amber-400 animate-pulse" : scanStep > 7 ? "bg-mint-glow shadow-[0_0_6px_rgba(0,230,118,0.8)]" : "bg-slate-600"}`} />
                <span className="font-bold tracking-wider">MB (Motherboard)</span>
              </div>
              <span className="mt-1 font-semibold text-[8px] truncate">
                {isFinished ? "Func 100% (Passed)" : isScanning && scanStep === 7 ? "INSPECTING..." : "WAITING"}
              </span>
            </div>
          </>
        )}

        {device === "tablet" && (
          <>
            <div className={`p-1.5 rounded-lg border bg-[#050505]/40 flex flex-col transition-all ${scanStep >= 4 ? "border-mint-glow/20 text-white" : "border-white/[0.03] text-white/30"}`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${scanStep === 4 ? "bg-amber-400 animate-pulse" : scanStep > 4 ? "bg-mint-glow shadow-[0_0_6px_rgba(0,230,118,0.8)]" : "bg-slate-600"}`} />
                <span className="font-bold tracking-wider">SCR (Screen)</span>
              </div>
              <span className="mt-1 font-semibold text-[8px] truncate">
                {isFinished ? "Grade D (Shattered)" : isScanning && scanStep === 4 ? "SCANNING..." : "WAITING"}
              </span>
            </div>

            <div className={`p-1.5 rounded-lg border bg-[#050505]/40 flex flex-col transition-all ${scanStep >= 5 ? "border-mint-glow/20 text-white" : "border-white/[0.03] text-white/30"}`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${scanStep === 5 ? "bg-amber-400 animate-pulse" : scanStep > 5 ? "bg-mint-glow shadow-[0_0_6px_rgba(0,230,118,0.8)]" : "bg-slate-600"}`} />
                <span className="font-bold tracking-wider">BAT (Battery)</span>
              </div>
              <span className="mt-1 font-semibold text-[8px] truncate">
                {isFinished ? "Swollen (Critical)" : isScanning && scanStep === 5 ? "ANALYZING..." : "WAITING"}
              </span>
            </div>

            <div className={`p-1.5 rounded-lg border bg-[#050505]/40 col-span-2 flex flex-col transition-all ${scanStep >= 7 ? "border-mint-glow/20 text-white" : "border-white/[0.03] text-white/30"}`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${scanStep === 7 ? "bg-amber-400 animate-pulse" : scanStep > 7 ? "bg-mint-glow shadow-[0_0_6px_rgba(0,230,118,0.8)]" : "bg-slate-600"}`} />
                <span className="font-bold tracking-wider">CHA (Chassis)</span>
              </div>
              <span className="mt-1 font-semibold text-[8px] truncate">
                {isFinished ? "Grade D (Bent Frame)" : isScanning && scanStep === 7 ? "INSPECTING..." : "WAITING"}
              </span>
            </div>
          </>
        )}
      </div>

    </div>
  );
}

// Smooth scroll counter component
interface CounterProps {
  value: number;
  duration?: number;
}

function Counter({ value, duration = 1.5 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return <span ref={ref} className="font-bold tabular-nums">{count}</span>;
}

// Interactive custom scroll link
interface ScrollLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function ScrollLink({ href, children, className = "", onClick }: ScrollLinkProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.5);
    y.set((e.clientY - centerY) * 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    if (elem) {
      const offset = 80; // height of sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elemRect = elem.getBoundingClientRect().top;
      const elemPosition = elemRect - bodyRect;
      const offsetPosition = elemPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      if (onClick) onClick();
    }
  };

  return (
    <motion.a 
      href={href} 
      onClick={handleClick} 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      className={`${className} inline-block`}
    >
      {children}
    </motion.a>
  );
}

  // ==========================================
  // 2.5 LIVE OPERATIONS LEDGER
  // ==========================================
  function LiveLedger() {
    const logTemplates = [
      {
        type: "ROUTING",
        text: "iPhone 13 Pro routed to Refurbish",
        value: "98% conf",
        icon: Cpu,
        iconColor: "text-green-400",
        badgeBg: "bg-green-500/10 border-green-500/20 text-green-400",
      },
      {
        type: "PAYOUT",
        text: "Payout issued to sayan@ecoloop.ai",
        value: "₹32,500",
        icon: Coins,
        iconColor: "text-emerald-400",
        badgeBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      },
      {
        type: "HARVEST",
        text: "Reclaimed M1 Air screen assembly",
        value: "OEM Cert",
        icon: Wrench,
        iconColor: "text-amber-400",
        badgeBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      },
      {
        type: "SAVED",
        text: "Mineral salvage carbon offset",
        value: "-42.5 kg CO2",
        icon: Leaf,
        iconColor: "text-teal-400",
        badgeBg: "bg-teal-500/10 border-teal-500/20 text-teal-400",
      },
      {
        type: "B2B",
        text: "4x modules traded to Hub Bangalore",
        value: "Traded",
        icon: Package,
        iconColor: "text-blue-400",
        badgeBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      },
      {
        type: "RECYCLE",
        text: "Chassis routed to raw extraction",
        value: "Chemical",
        icon: Recycle,
        iconColor: "text-red-400",
        badgeBg: "bg-red-500/10 border-red-500/20 text-red-400",
      },
      {
        type: "ROUTING",
        text: "MacBook Pro -> Parts Harvest",
        value: "92% conf",
        icon: Cpu,
        iconColor: "text-green-400",
        badgeBg: "bg-green-500/10 border-green-500/20 text-green-400",
      },
      {
        type: "PAYOUT",
        text: "Payout issued to preet@gmail.com",
        value: "₹18,400",
        icon: Coins,
        iconColor: "text-emerald-400",
        badgeBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      },
      {
        type: "SAVED",
        text: "Modular device rescue carbon offset",
        value: "-110 kg CO2",
        icon: Leaf,
        iconColor: "text-teal-400",
        badgeBg: "bg-teal-500/10 border-teal-500/20 text-teal-400",
      },
      {
        type: "B2B",
        text: "Restocked 12x OEM batteries (Mumbai)",
        value: "In Stock",
        icon: Package,
        iconColor: "text-blue-400",
        badgeBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      }
    ];

    const [logs, setLogs] = useState<{ id: number; item: typeof logTemplates[0]; age: number }[]>([]);

    useEffect(() => {
      // Seed initial items with varying ages
      setLogs([
        { id: 1, item: logTemplates[0], age: 8 },
        { id: 2, item: logTemplates[1], age: 5 },
        { id: 3, item: logTemplates[2], age: 2 },
        { id: 4, item: logTemplates[3], age: 0 }
      ]);

      let counter = 5;
      
      // Timer to increment ages of current logs
      const ageInterval = setInterval(() => {
        setLogs((prev) => prev.map(log => ({ ...log, age: log.age + 1 })));
      }, 1000);

      // Timer to append new logs and pop the oldest
      const appendInterval = setInterval(() => {
        const randomTemplate = logTemplates[Math.floor(Math.random() * logTemplates.length)];
        setLogs((prev) => {
          const next = [...prev.slice(1), { id: counter++, item: randomTemplate, age: 0 }];
          return next;
        });
      }, 3500);

      return () => {
        clearInterval(ageInterval);
        clearInterval(appendInterval);
      };
    }, []);

    return (
      <div className="w-full flex-1 mt-6 bg-[#080808]/80 border border-white/[0.05] rounded-3xl p-5 font-sans text-xs flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[300px]">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between text-[9px] text-white/40 border-b border-white/[0.05] pb-3 mb-3 select-none font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
            <span className="font-bold tracking-widest text-green-400 uppercase">ACTIVE LEDGER STREAM</span>
          </div>
          <span className="text-white/20">AI CORE: 9ms</span>
        </div>
        
        <div className="flex-1 flex flex-col justify-around overflow-hidden gap-3.5 relative">
          <AnimatePresence initial={false}>
            {logs.map((log) => {
              const IconComp = log.item.icon;
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 25, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -25, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Icon Container */}
                    <div className={`w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${log.item.iconColor} group-hover:scale-105 transition-transform`}>
                      <IconComp size={15} />
                    </div>
                    {/* Text and Age */}
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-white/90 truncate text-[11px] leading-tight">
                        {log.item.text}
                      </span>
                      <span className="text-[9px] text-white/30 font-mono mt-0.5 select-none">
                        {log.age === 0 ? "Just now" : `${log.age}s ago`}
                      </span>
                    </div>
                  </div>

                  {/* High Tech Value Badge */}
                  <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[9px] font-mono font-bold whitespace-nowrap shadow-sm ${log.item.badgeBg}`}>
                    {log.item.value}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. MAIN PAGE COMPONENT
  // ==========================================

  export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  // 3D Perspective Tilt State
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Advanced Parallax Layers
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -800]);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleHeroMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Orbital scroll-linked rotation
  const orbitalRotate = useTransform(scrollYProgress, [0, 1], [0, 720]);

  // Hero scroll-linked animations - Adjusted ranges for better visibility
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -20]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.1, 0.3], ["blur(0px)", "blur(0px)", "blur(12px)"]);

  // Marketplace horizontal scroll logic - GSAP
  const marketplaceContainer = useRef<HTMLDivElement>(null);
  const marketplaceContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marketplaceContainer.current || !marketplaceContent.current) return;

    const contentWidth = marketplaceContent.current.scrollWidth;
    const windowWidth = window.innerWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: marketplaceContainer.current,
        start: "top top",
        end: () => `+=${contentWidth}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      }
    });

    tl.to(marketplaceContent.current, {
      x: () => -(contentWidth - windowWidth * 0.8),
      ease: "none",
    });

    tl.to("#marketplace-progress", {
      scaleX: 1,
      ease: "none",
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // AI Decision Engine Simulator State

  const [selectedDevice, setSelectedDevice] = useState<"phone" | "laptop" | "tablet">("phone");
  const [scanStep, setScanStep] = useState(0);
  const [typedLogs, setTypedLogs] = useState<string[]>([]);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const isShowcaseInView = useInView(showcaseRef, { once: true, margin: "-100px" });

  // Handle navbar sticky styling on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simulator specifications
  const deviceSpecs = {
    phone: {
      name: "iPhone 13 Pro",
      grade: "Grade B (Moderate wear)",
      diagnostics: {
        screen: "Grade B - Minor scratches detected",
        battery: "82% Capacity - Service recommended",
        camera: "Grade A - Fully functional",
        chassis: "Grade B - Minor scuffs",
      },
      outcome: "Refurbish — 87% confidence",
      confidences: { refurbish: 87, resale: 65, salvage: 42, recycle: 12 },
      json: `{
  "device": "iPhone 13 Pro",
  "status": "classified",
  "diagnostics": {
    "screen": "Grade B (Minor Scratches)",
    "battery": "82% Capacity",
    "camera": "100% Functional",
    "chassis": "Scuffed"
  },
  "optimal_route": "Refurbish"
}`
    },
    laptop: {
      name: "MacBook Air M1",
      grade: "Grade C (Heavy wear / Liquid check)",
      diagnostics: {
        screen: "Grade C - Severe screen delamination",
        battery: "76% Capacity - Replace needed",
        camera: "Grade A - Functional",
        chassis: "Grade B - 1 major dent",
      },
      outcome: "Component Harvest — 91% confidence",
      confidences: { refurbish: 30, resale: 15, salvage: 91, recycle: 54 },
      json: `{
  "device": "MacBook Air M1",
  "status": "classified",
  "diagnostics": {
    "screen": "Delaminated (Replace)",
    "battery": "76% Capacity",
    "logic_board": "100% Functional",
    "keyboard": "Grade B"
  },
  "optimal_route": "Parts Recovery"
}`
    },
    tablet: {
      name: "iPad Pro 11-inch",
      grade: "Grade D (Catastrophic screen fail)",
      diagnostics: {
        screen: "Grade D - Broken glass & dead pixels",
        battery: "48% Capacity - Swollen cell alert",
        camera: "Grade C - Scratched lens",
        chassis: "Grade D - Bent chassis",
      },
      outcome: "Raw Recycling — 95% confidence",
      confidences: { refurbish: 5, resale: 0, salvage: 22, recycle: 95 },
      json: `{
  "device": "iPad Pro 11-inch",
  "status": "classified",
  "diagnostics": {
    "screen": "Shattered (Failed)",
    "battery": "Swollen (Critical Danger)",
    "motherboard": "Short circuited",
    "chassis": "Bent > 15 degrees"
  },
  "optimal_route": "Recycle"
}`
    }
  };

  // Run the typing simulator when section is in view or selectedDevice changes
  useEffect(() => {
    if (!isShowcaseInView) return;

    // Reset simulator state
    const resetTimer = setTimeout(() => {
      setScanStep(0);
      setTypedLogs([]);
    }, 0);

    const logs = [
      "Initializing EcoLoop diagnostic engine...",
      `Scanning hardware profile for: ${deviceSpecs[selectedDevice].name}`,
      "Analyzing optical inputs & micro-cracks...",
      `Screen assessment: ${deviceSpecs[selectedDevice].diagnostics.screen}`,
      `Power state validation: ${deviceSpecs[selectedDevice].diagnostics.battery}`,
      `Component integrity logs parsed successfully.`,
      "Running multi-outcome neural classifier...",
      `Optimal outcome locked: ${deviceSpecs[selectedDevice].outcome}`
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < logs.length) {
        setTypedLogs(prev => [...prev, logs[logIndex]]);
        setScanStep(logIndex + 1);
        logIndex++;
      } else {
        clearInterval(interval);
      }
    }, 900);

    return () => {
      clearTimeout(resetTimer);
      clearInterval(interval);
    };
  }, [isShowcaseInView, selectedDevice]);

  return (
    <div className="min-h-screen bg-transparent text-slate-100 font-sans selection:bg-green-500 selection:text-slate-950 overflow-x-hidden relative">
      <InteractiveGridBg />
      <SideMenu />
      <Marquee />

      {/* ==========================================
          1. NAVBAR
          ========================================== */}
      <nav className="absolute top-0 left-0 right-0 z-40 bg-transparent py-6 border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#">
            <LogoFull />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <ScrollLink href="#features" className="text-sm font-medium text-slate-300 hover:text-green-400 transition-colors">Features</ScrollLink>
            <ScrollLink href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-green-400 transition-colors">How It Works</ScrollLink>
            <ScrollLink href="#showcase" className="text-sm font-medium text-slate-300 hover:text-green-400 transition-colors">AI Diagnostics</ScrollLink>
            <ScrollLink href="#marketplace" className="text-sm font-medium text-slate-300 hover:text-green-400 transition-colors">Marketplace</ScrollLink>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href={isAuthenticated ? "/dashboard" : "/auth/login"}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-green-600 px-5 text-sm font-semibold text-slate-950 hover:bg-green-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {isAuthenticated ? "Go to Dashboard" : "Sign In"}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-slate-800 bg-[#0F172A] px-6 py-6 flex flex-col gap-5"
            >
              <ScrollLink href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-300 hover:text-green-400 py-1 transition-colors">Features</ScrollLink>
              <ScrollLink href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-300 hover:text-green-400 py-1 transition-colors">How It Works</ScrollLink>
              <ScrollLink href="#showcase" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-300 hover:text-green-400 py-1 transition-colors">AI Diagnostics</ScrollLink>
              <ScrollLink href="#marketplace" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-300 hover:text-green-400 py-1 transition-colors">Marketplace</ScrollLink>
              <Link
                href={isAuthenticated ? "/dashboard" : "/auth/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-11 items-center justify-center rounded-lg bg-green-600 px-5 text-base font-semibold text-slate-950 hover:bg-green-500 transition-colors"
              >
                {isAuthenticated ? "Go to Dashboard" : "Sign In"}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ==========================================
          2. HERO SECTION (Bento Style)
          ========================================== */}
      <header 
        className="relative pt-32 pb-20 px-6 overflow-hidden"
      >
        <motion.div 
          style={{ 
            scale: heroScale, 
            opacity: heroOpacity, 
            y: heroY, 
            filter: heroBlur,
          }}
          className="max-w-7xl mx-auto relative z-10"
        >
          {/* Hero Background Orbital Glows */}
          <div className="orbital-glow top-0 left-0" />
          <div className="orbital-glow bottom-0 right-0 opacity-20" />
          
          <BentoGrid>
            {/* Main Headline Cell */}
            <BentoCard span="md:col-span-8 md:row-span-2" className="flex flex-col justify-center min-h-[400px]">
              <FadeUp>
                <LogoTagline className="mb-6" />
              </FadeUp>
              <FadeUp delay={0.2}>
                <h1 className="font-display font-extrabold tracking-tighter" style={{ fontSize: 'clamp(48px, 6vw, 96px)' }}>
                  <span className="text-white/30 block">The future of</span>
                  <span className="text-white/30 block flex items-center gap-4">
                    e-waste is not
                    <svg width="0.6em" height="0.6em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-green-500/40">
                      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="5" strokeDasharray="2 2"/>
                    </svg>
                  </span>
                  <span className="text-white/30 block">disposal — it's</span>
                  <span className="text-shimmer block">
                    value + 
                    <span className="text-green-400 inline-flex items-center ml-2">
                      AI 
                      <svg width="0.8em" height="0.8em" viewBox="0 0 32 32" className="ml-3">
                        <defs>
                          <filter id="svg-glow">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>
                        <path d="M16 2C16 11 21 16 30 16C21 16 16 21 16 30C16 21 11 16 2 16C11 16 16 11 16 2Z" fill="currentColor" filter="url(#svg-glow)" />
                        <circle cx="16" cy="16" r="2" fill="white" />
                      </svg>
                    </span>
                  </span>
                </h1>
              </FadeUp>
              <FadeUp delay={0.4}>
                <p className="mt-8 text-xl text-white/50 max-w-xl font-body leading-relaxed">
                  EcoLoop leverages proprietary AI to orchestrate the global second-life electronics market. 
                  High-fidelity recovery, automated.
                </p>
              </FadeUp>
              <FadeUp delay={0.6}>
                <div className="mt-10 flex gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="magnetic-wrap"
                  >
                    <Link
                      href="/submit"
                      className="h-14 flex items-center justify-center rounded-2xl bg-green-500 px-10 text-lg font-bold text-black hover:bg-green-400 transition-all shadow-[0_0_40px_rgba(34,197,94,0.3)]"
                    >
                      Start AI Appraisal
                    </Link>
                  </motion.div>
                  <button className="h-14 px-8 rounded-2xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors">
                    View Marketplace
                  </button>
                </div>
              </FadeUp>
            </BentoCard>

            {/* Interactive Loop Cell */}
            <BentoCard span="md:col-span-4 md:row-span-2" className="flex flex-col items-center justify-between bg-green-500/5 overflow-hidden h-full">
              <div className="relative w-full aspect-square flex items-center justify-center max-w-[260px] mx-auto">
                {/* Visual representation of the loop */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 25,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                  className="w-56 h-56 border-[3px] border-dashed border-green-500/20 rounded-full flex items-center justify-center relative"
                >
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                  >
                    <Recycle size={18} className="text-black" />
                  </motion.div>
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-4 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  >
                    <Wrench size={18} className="text-black" />
                  </motion.div>
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.5)]"
                  >
                    <Cpu size={18} className="text-black" />
                  </motion.div>
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                  >
                    <ShoppingCart size={18} className="text-black" />
                  </motion.div>
                </motion.div>
                
                {/* Central Node - Placed OUTSIDE the rotating div so it stays upright and clean */}
                <div className="absolute w-28 h-28 rounded-3xl bg-black border border-white/10 flex items-center justify-center shadow-2xl z-10">
                  <LogoIcon className="w-14 h-14 text-green-400" />
                  <div className="absolute inset-0 bg-green-400/5 animate-pulse rounded-3xl" />
                </div>
                
                {/* Floating data bits around the central node */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -20, 0],
                      x: [0, Math.sin(i) * 30, 0],
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                     }}
                    className="absolute w-1.5 h-1.5 bg-green-400 rounded-full"
                    style={{
                      left: `${30 + (i * 7) % 41}%`,
                      top: `${30 + (i * 13) % 41}%`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-4 text-center px-4">
                <span className="font-mono text-[10px] text-green-400/60 uppercase tracking-widest font-bold">Autonomous Lifecycle Management</span>
                <p className="text-xs text-white/30 mt-2">Connecting global demand to verified supply.</p>
              </div>

              {/* Dynamic Operations Ledger Stream */}
              <LiveLedger />
            </BentoCard>

            {/* Sub-features Bento Row */}
            <BentoCard span="md:col-span-3" className="flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-ui font-bold text-white">Trust Layer</h4>
              <p className="text-sm text-white/40 leading-relaxed">Cryptographic proof of circularity for every serial number.</p>
            </BentoCard>
            
            <BentoCard span="md:col-span-3" className="flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <TrendingUp size={20} />
              </div>
              <h4 className="font-ui font-bold text-white">Yield Optimization</h4>
              <p className="text-sm text-white/40 leading-relaxed">Dynamic pricing models based on global part scarcity.</p>
            </BentoCard>

            <BentoCard span="md:col-span-6" className="flex items-center justify-between bg-white/5">
              <div className="flex flex-col gap-2">
                <h4 className="font-ui font-bold text-white">Eco Compliance Dashboard</h4>
                <p className="text-sm text-white/40 max-w-xs">Real-time carbon offset monitoring for enterprise ESG reporting.</p>
              </div>
              <div className="flex -space-x-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#111] bg-slate-800 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-green-400/20 to-transparent" />
                  </div>
                ))}
              </div>
            </BentoCard>
          </BentoGrid>
        </motion.div>
      </header>


      {/* ==========================================
          4. STATS SECTION
          ========================================== */}
      <section id="stats" className="relative py-48 bg-transparent border-y border-white/5 z-20 overflow-hidden">
        <motion.div style={{ y: y3 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 orbital-glow opacity-20" />
        {/* Dark solid overlay that dims background visuals/blender for readability */}
        <div className="absolute inset-0 bg-[#080808]/90 backdrop-blur-3xl z-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: "Devices Restored", value: 18420, suffix: "+" },
              { label: "Carbon Offset", value: 1420, suffix: " Tons" },
              { label: "Payouts Issued", value: 18, prefix: "₹", suffix: "M+" },
              { label: "Mineral Recovery", value: 98, suffix: "%", highlight: true }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center flex flex-col items-center"
              >
                <h3 className={`text-3xl md:text-5xl font-black text-white font-display tracking-tighter ${stat.highlight ? "animate-stat-highlight" : ""}`}>
                  {stat.prefix}<Counter value={stat.value} />{stat.suffix}
                </h3>
                <p className="mt-4 text-[9px] font-mono text-green-400/60 uppercase tracking-[0.2em] font-bold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. HOW IT WORKS (Sticky Stacking Parallax Cards)
          ========================================== */}
      <section id="how-it-works" className="relative bg-transparent text-white">
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-8 relative z-10 text-center">
          <FadeUp delay={0.2}>
            <h2 className="font-mono text-xs sm:text-sm font-medium tracking-widest text-green-400 uppercase mb-2">Seamless Lifecycle</h2>
          </FadeUp>
          <FadeUp delay={0.4}>
            <h3 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 leading-tight">
              How the circular loop works.
            </h3>
          </FadeUp>
          <FadeUp delay={0.6}>
            <p className="mt-5 text-lg text-white/70 leading-relaxed font-body max-w-3xl mx-auto">
              We turn the linear model of &quot;buy, use, dump&quot; into a self-sustaining cycle in five interactive steps.
            </p>
          </FadeUp>
        </div>

        <StickyCards />
      </section>

      {/* ==========================================
          4. CORE FEATURES (Bento Grid)
          ========================================== */}
      <section id="features" className="relative py-40 overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute top-0 left-0 orbital-glow opacity-30" />
        <motion.div style={{ y: y2 }} className="absolute bottom-0 right-0 orbital-glow opacity-10" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeUp>
              <h2 className="font-mono text-xs tracking-widest text-green-400 uppercase">Circular Architecture</h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <h3 className="font-display text-4xl sm:text-6xl font-extrabold text-white mt-4">
                Engineered for absolute recovery.
              </h3>
            </FadeUp>
          </div>

          <BentoGrid>
            <BentoCard span="md:col-span-8" className="min-h-[320px] bg-eco-green/5">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-eco-green/10 flex items-center justify-center text-eco-green mb-6">
                    <BrainCircuit size={24} />
                  </div>
                  <h4 className="text-2xl font-bold text-white">AI Multi-Outcome Engine</h4>
                  <p className="mt-4 text-white/50 max-w-md leading-relaxed">
                    Our proprietary neural networks classify devices into four distinct routing outcomes,
                    optimizing value salvage with 99.2% accuracy.
                  </p>
                </div>
                <div className="flex gap-2 mt-8">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/40">NEURAL_NET_V4</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/40">REAL_TIME_ROUTING</span>
                </div>
              </div>
            </BentoCard>

            <BentoCard span="md:col-span-4" className="bg-ai-cyan/5">
              <div className="w-12 h-12 rounded-2xl bg-ai-cyan/10 flex items-center justify-center text-ai-cyan mb-6">
                <Wrench size={24} />
              </div>
              <h4 className="text-xl font-bold text-white">Component Recovery</h4>
              <p className="mt-4 text-white/50 text-sm leading-relaxed">
                Surgical harvesting of OEM modules—screens, batteries, and sensors—rather than basic material crushing.
              </p>
            </BentoCard>

            <BentoCard span="md:col-span-4" className="bg-primary-glow/5">
              <div className="w-12 h-12 rounded-2xl bg-primary-glow/10 flex items-center justify-center text-primary-glow mb-6">
                <Store size={24} />
              </div>
              <h4 className="text-xl font-bold text-white">Hybrid Marketplace</h4>
              <p className="mt-4 text-white/50 text-sm leading-relaxed">
                Lightning-fast B2B and B2C component trade systems integrated directly into the recovery pipeline.
              </p>
            </BentoCard>

            <BentoCard span="md:col-span-8" className="bg-mint-glow/5">
              <div className="flex items-center justify-between h-full">
                <div className="max-w-sm">
                  <div className="w-12 h-12 rounded-2xl bg-mint-glow/10 flex items-center justify-center text-mint-glow mb-6">
                    <BarChart3 size={24} />
                  </div>
                  <h4 className="text-2xl font-bold text-white">Eco Transparency</h4>
                  <p className="mt-4 text-white/50 leading-relaxed">
                    Precise auditing of carbon emissions averted and rare-earth metals salvaged with every single transaction.
                  </p>
                </div>
                <div className="hidden lg:block w-48 h-32 bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative">
                   {/* Animated chart mockup */}
                   <motion.div 
                    animate={{ height: ["20%", "60%", "40%", "80%", "50%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-0 left-4 w-4 bg-green-500/40 rounded-t-lg" 
                   />
                   <motion.div 
                    animate={{ height: ["40%", "20%", "70%", "30%", "60%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute bottom-0 left-12 w-4 bg-green-500/40 rounded-t-lg" 
                   />
                   <motion.div 
                    animate={{ height: ["60%", "80%", "30%", "50%", "20%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-0 left-20 w-4 bg-green-500/40 rounded-t-lg" 
                   />
                </div>
              </div>
            </BentoCard>
          </BentoGrid>
        </div>
      </section>

      {/* ==========================================
          5. AI DECISION ENGINE SHOWCASE (Command Center)
          ========================================== */}
      <section id="showcase" ref={showcaseRef} className="relative py-60 overflow-hidden bg-[#050505]">
        <motion.div style={{ y: y2 }} className="absolute top-0 right-0 orbital-glow opacity-30" />
        <motion.div style={{ y: y1 }} className="absolute bottom-0 left-0 orbital-glow opacity-20" />
        {/* Immersive Background Visuals */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,234,100,0.05),transparent_70%)]" />
        <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <FadeUp>
              <span className="font-mono text-xs tracking-[0.3em] text-green-400 uppercase mb-4 block">Neural Interface v4.0</span>
            </FadeUp>
            <FadeUp delay={0.2}>
              <h3 className="font-display text-5xl md:text-7xl font-extrabold text-white tracking-tight">
                The Decision <span className="text-shimmer">Engine.</span>
              </h3>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            {/* Left: Interactive Console Controls */}
            <div className="lg:col-span-4 space-y-10">
              <BentoCard className="bg-white/[0.02] border-white/5 p-8 md:p-6">
                <h4 className="font-ui text-sm font-bold text-white/40 uppercase tracking-widest mb-8">Select Input Stream</h4>
                <div className="grid grid-cols-1 gap-3">
                  {(["phone", "laptop", "tablet"] as const).map((id) => (
                    <button
                      key={id}
                      onClick={() => setSelectedDevice(id)}
                      className={`group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                        selectedDevice === id 
                        ? "bg-green-500 text-black shadow-[0_0_30px_rgba(34,197,94,0.3)]" 
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedDevice === id ? "bg-black/20" : "bg-white/5"}`}>
                        {id === "phone" && <Cpu size={20} />}
                        {id === "laptop" && <Layers size={20} />}
                        {id === "tablet" && <Package size={20} />}
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold uppercase tracking-wider">{deviceSpecs[id].name}</div>
                        <div className={`text-[10px] ${selectedDevice === id ? "text-black/60" : "text-white/30"}`}>System Input {id.toUpperCase()}_01</div>
                      </div>
                      {selectedDevice === id && (
                        <motion.div layoutId="active-pill" className="absolute right-4 w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </BentoCard>

              <div className="space-y-4">
                {[
                  { label: "Neural Confidence", value: scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.refurbish}%` : "CALIBRATING..." },
                  { label: "Hardware Latency", value: "1.2ms" },
                  { label: "Carbon Entropy", value: "0.003% Delta" }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="font-mono text-[10px] text-white/30 uppercase">{stat.label}</span>
                    <span className="font-mono text-[10px] text-green-400 font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle: Immersive Scanner */}
            <div className="lg:col-span-4 flex justify-center py-10 lg:py-0">
              <div className="relative group">
                <div className="absolute -inset-20 bg-green-500/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <HolographicScanner device={selectedDevice} scanStep={scanStep} />
              </div>
            </div>

            {/* Right: Real-time Analysis Logs */}
            <div className="lg:col-span-4 h-full">
              <div className="bg-[#0D0D0D] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col h-[500px] shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                  </div>
                  <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Diagnostic_Matrix_Feed</span>
                </div>
                
                <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto no-scrollbar space-y-3">
                  {typedLogs.map((log, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i}
                      className="flex gap-3"
                    >
                      <span className="text-white/20">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}]</span>
                      <span className={i === typedLogs.length - 1 ? "text-green-400 font-bold" : "text-white/60"}>
                        {log}
                      </span>
                    </motion.div>
                  ))}
                  {scanStep < 8 && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-400 animate-pulse">EXECUTING_NEURAL_ROUTING...</span>
                    </div>
                  )}
                </div>

                {/* Classification Result Footer */}
                <AnimatePresence>
                  {scanStep >= 8 && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="p-6 bg-green-500 text-black"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Optimal Outcome Locked</div>
                      <div className="text-2xl font-black uppercase tracking-tight flex items-center justify-between">
                        {deviceSpecs[selectedDevice].outcome.split(" — ")[0]}
                        <ArrowRight size={24} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. MARKETPLACE PREVIEW (GSAP Sticky Horizontal Scroll)
          ========================================== */}
      <section ref={marketplaceContainer} id="marketplace" className="relative bg-transparent">
        <motion.div style={{ y: y3 }} className="absolute top-0 left-0 orbital-glow opacity-40" />
        <div className="h-screen flex flex-col justify-center overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 w-full relative z-10">
            <div className="max-w-2xl">
              <FadeUp>
                <span className="font-mono text-xs tracking-[0.3em] text-green-400 uppercase mb-4 block">Circular Commerce</span>
              </FadeUp>
              <FadeUp delay={0.2}>
                <h3 className="font-display text-5xl md:text-7xl font-extrabold text-white tracking-tight">
                  Verified <span className="text-shimmer">Hardware.</span>
                </h3>
              </FadeUp>
            </div>
            <FadeUp delay={0.4}>
              <p className="text-white/40 max-w-sm font-body text-sm leading-relaxed">
                Browse fully certified devices directly from our automated hubs. 
                Keep scrolling vertically to explore.
              </p>
            </FadeUp>
          </div>

          {/* Horizontal Scroll Content */}
          <div className="relative z-10">
            <div 
              ref={marketplaceContent}
              className="flex gap-8 px-[calc((100vw-min(1280px,calc(100vw-48px)))/2)] pb-10"
            >
              {[
                { 
                  name: "iPhone 14 Pro", 
                  type: "Refurbished", 
                  price: "$649", 
                  grade: "GRADE A Refurb", 
                  color: "bg-green-500",
                  features: ["128GB Space Black", "90% Battery Health", "1 Year Warranty"]
                },
                { 
                  name: "Galaxy S23 Ultra", 
                  type: "Reuse", 
                  price: "$580", 
                  grade: "GRADE B Pre-Owned", 
                  color: "bg-blue-500",
                  features: ["256GB Phantom Black", "Minor bezel scuffs", "Fully Audited"]
                },
                { 
                  name: "MacBook Air M2 Screen", 
                  type: "Parts", 
                  price: "$199", 
                  grade: "SCREEN RECLAIMED", 
                  color: "bg-yellow-500",
                  features: ["OEM Grade A+ Salvage", "Tested, no dead pixels", "6-month warranty"]
                },
                { 
                  name: "iPad Pro 11-inch M1", 
                  type: "Refurbished", 
                  price: "$499", 
                  grade: "GRADE A- Refurb", 
                  color: "bg-purple-500",
                  features: ["128GB Space Gray", "New Battery Cell", "Certified Logic Board"]
                },
                { 
                  name: "Pixel 7 Pro", 
                  type: "Reuse", 
                  price: "$399", 
                  grade: "GRADE B+ Pre-Owned", 
                  color: "bg-orange-500",
                  features: ["128GB Obsidian", "Light screen wear", "Unlocked"]
                },
                { 
                  name: "ThinkPad X1 Carbon", 
                  type: "Reuse", 
                  price: "$720", 
                  grade: "GRADE A- Business", 
                  color: "bg-red-500",
                  features: ["16GB RAM / 512GB SSD", "Legendary Durability", "Enterprise Ready"]
                }
              ].map((product, i) => (
                <div key={i} className="flex-shrink-0 w-[400px]">
                  <BentoCard className="!p-0 h-[500px] bg-white/[0.03] border-white/5 group/card">
                    <div className="h-60 bg-white/[0.02] flex items-center justify-center relative overflow-hidden">
                      <div className={`absolute inset-0 opacity-10 ${product.color} blur-[80px] group-hover/card:opacity-20 transition-opacity duration-500`} />
                      
                      {/* Floating Device Mockup */}
                      <motion.div 
                        whileHover={{ y: -10, rotate: 5 }}
                        className="relative z-10 w-28 h-44 rounded-3xl border-4 border-white/10 bg-black/40 p-2 shadow-2xl"
                      >
                        <div className="w-full h-full rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center p-4">
                          <div className={`w-8 h-8 rounded-full ${product.color}/20 flex items-center justify-center ${product.color.replace('bg-', 'text-')}`}>
                            <Package size={16} />
                          </div>
                          <div className="mt-4 w-10 h-1 bg-white/5 rounded-full" />
                          <div className="mt-2 w-6 h-1 bg-white/5 rounded-full" />
                        </div>
                      </motion.div>
                    </div>

                    <div className="p-8 flex flex-col h-[260px] justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${product.color.replace('bg-', 'text-')} ${product.color.replace('bg-', 'border-').replace('500', '500/30')} ${product.color.replace('bg-', 'bg-').replace('500', '500/10')}`}>
                            {product.type}
                          </span>
                          <span className="font-mono text-[10px] text-white/20">#{1000 + i}</span>
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-2">{product.name}</h4>
                        <ul className="space-y-1.5">
                          {product.features.map((f, j) => (
                            <li key={j} className="flex items-center gap-2 text-[11px] text-white/40">
                              <CheckCircle2 size={10} className={product.color.replace('bg-', 'text-')} />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-white/20 uppercase">Unit Price</span>
                          <span className="text-xl font-bold text-white">{product.price}</span>
                        </div>
                        <button className={`h-11 px-5 rounded-xl font-bold text-black transition-all hover:scale-[1.05] active:scale-[0.95] ${product.color}`}>
                          Reserve
                        </button>
                      </div>
                    </div>
                  </BentoCard>
                </div>
              ))}
            </div>

            {/* Custom Scroll Indicator */}
            <div className="max-w-7xl mx-auto px-6 mt-8 flex items-center gap-4">
              <div className="w-full h-px bg-white/5 rounded-full overflow-hidden flex-1">
                <div 
                  id="marketplace-progress"
                  className="h-full bg-green-500 origin-left scale-x-0"
                />
              </div>
              <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Scroll_to_explore</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. FOOTER
          ========================================== */}
      <Footer />

      <style>{`
        .hover-cta-glow:hover {
          border-color: rgba(0, 234, 100, 0.45) !important;
          box-shadow: 0 8px 36px rgba(0, 234, 100, 0.30) !important;
          background: rgba(0, 234, 100, 0.06) !important;
        }
      `}</style>

    </div>
  );
}
