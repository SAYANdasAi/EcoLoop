"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
import { WordReveal } from "../components/animations/WordReveal";
import { GlowText } from "../components/animations/GlowText";
import { FadeUp } from "../components/animations/FadeUp";
import { FloatCard } from "../components/animations/FloatCard";

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
    color: "from-emerald-500/20 to-emerald-500/5",
    textColor: "text-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.2)",
    iconVariants: { hover: { x: [0, 8, -4, 0], transition: { duration: 0.8, ease: "easeInOut" } } }
  },
  {
    number: 2,
    title: "AI Evaluation",
    desc: "AI scans component grades, battery health, and chassis marks.",
    icon: Cpu,
    color: "from-cyan-500/20 to-cyan-500/5",
    textColor: "text-cyan-400",
    glowColor: "rgba(6, 182, 212, 0.2)",
    iconVariants: { hover: { rotate: 180, scale: 1.1, transition: { duration: 0.8, ease: "easeInOut" } } }
  },
  {
    number: 3,
    title: "Route Decision",
    desc: "Automatic routing to refurbish, resale, parts, or recycling.",
    icon: Layers,
    color: "from-blue-500/20 to-blue-500/5",
    textColor: "text-blue-400",
    glowColor: "rgba(59, 130, 246, 0.2)",
    iconVariants: { hover: { y: [0, -6, 6, 0], scale: 1.05, transition: { duration: 0.8, ease: "easeInOut" } } }
  },
  {
    number: 4,
    title: "Marketplace Listing",
    desc: "Devices and salvaged parts are listed instantly to B2B/B2C hubs.",
    icon: ShoppingBag,
    color: "from-purple-500/20 to-purple-500/5",
    textColor: "text-purple-400",
    glowColor: "rgba(168, 85, 247, 0.2)",
    iconVariants: { hover: { rotate: [0, -15, 15, -10, 10, 0], transition: { duration: 1, ease: "easeInOut" } } }
  },
  {
    number: 5,
    title: "Reuse & Earn",
    desc: "Get cash back immediately while keeping rare earth minerals in use.",
    icon: Coins,
    color: "from-amber-500/20 to-amber-500/5",
    textColor: "text-amber-400",
    glowColor: "rgba(245, 158, 11, 0.2)",
    iconVariants: { hover: { y: [0, -8, 4, 0], rotate: [0, 10, -10, 0], transition: { duration: 0.9, ease: "easeInOut" } } }
  }
];

const featuresData = [
  {
    title: "Hybrid Marketplace",
    desc: "Seamless C2B device collection combined with lightning-fast B2C and bulk B2B component trade systems.",
    icon: Store,
    glowColor: "rgba(52, 211, 153, 0.14)", // Emerald
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-400/5 group-hover:bg-emerald-400/10",
    borderColor: "group-hover:border-emerald-400/30"
  },
  {
    title: "AI Multi-Outcome Engine",
    desc: "Smart neural networks automatically classify devices into 4 distinct routing outcomes, optimizing value salvage.",
    icon: BrainCircuit,
    glowColor: "rgba(59, 130, 246, 0.14)", // Blue
    iconColor: "text-blue-400",
    bgColor: "bg-blue-400/5 group-hover:bg-blue-400/10",
    borderColor: "group-hover:border-blue-400/30"
  },
  {
    title: "Component-Level Recovery",
    desc: "Surgical harvesting of perfectly intact modules (screens, OEM batteries, cameras) rather than basic crushing.",
    icon: Wrench,
    glowColor: "rgba(245, 158, 11, 0.14)", // Amber
    iconColor: "text-amber-400",
    bgColor: "bg-amber-400/5 group-hover:bg-amber-400/10",
    borderColor: "group-hover:border-amber-400/30"
  },
  {
    title: "Dynamic Pricing Models",
    desc: "Machine learning algorithms track global part scarcity and component demand to guarantee top-dollar payouts instantly.",
    icon: TrendingUp,
    glowColor: "rgba(6, 182, 212, 0.14)", // Cyan
    iconColor: "text-cyan-400",
    bgColor: "bg-cyan-400/5 group-hover:bg-cyan-400/10",
    borderColor: "group-hover:border-cyan-400/30"
  },
  {
    title: "Device Journey Tracking",
    desc: "A secure cryptographic ledger tracks every handoff, certification, and hardware outcome for total circular custody.",
    icon: Compass,
    glowColor: "rgba(168, 85, 247, 0.14)", // Purple
    iconColor: "text-purple-400",
    bgColor: "bg-purple-400/5 group-hover:bg-purple-400/10",
    borderColor: "group-hover:border-purple-400/30"
  },
  {
    title: "Eco Transparency",
    desc: "Get precise reports detailing exactly how much carbon emissions were averted and metals saved with every transaction.",
    icon: BarChart3,
    glowColor: "rgba(244, 63, 94, 0.14)", // Rose
    iconColor: "text-rose-400",
    bgColor: "bg-rose-400/5 group-hover:bg-rose-400/10",
    borderColor: "group-hover:border-rose-400/30"
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

function HolographicScanner({ device, scanStep }: HolographicScannerProps) {
  const isScanning = scanStep > 0 && scanStep < 8;
  const isFinished = scanStep >= 8;

  const screenGradeColor = !isFinished 
    ? (scanStep === 4 ? "text-yellow-400 animate-pulse pulse-target" : "text-slate-600") 
    : (device === "phone" ? "text-yellow-500" : "text-red-500");

  const batteryGradeColor = !isFinished 
    ? (scanStep === 5 ? "text-yellow-400 animate-pulse pulse-target" : "text-slate-600") 
    : (device === "phone" ? "text-yellow-500" : device === "laptop" ? "text-yellow-500" : "text-red-500");

  const cameraGradeColor = !isFinished 
    ? (scanStep === 6 ? "text-yellow-400 animate-pulse pulse-target" : "text-slate-600") 
    : "text-green-500";

  const chassisGradeColor = !isFinished 
    ? (scanStep === 7 ? "text-yellow-400 animate-pulse pulse-target" : "text-slate-600") 
    : (device === "phone" ? "text-yellow-500" : device === "laptop" ? "text-yellow-500" : "text-red-500");

  return (
    <div className="relative w-full max-w-[280px] aspect-[4/5] bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
      {/* Sci-fi tech border corners */}
      <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-green-500/50" />
      <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-green-500/50" />
      <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-green-500/50" />
      <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-green-500/50" />
      <span className="absolute top-3 left-6 font-mono text-[9px] text-white/30 uppercase select-none">Appraisal Blueprint v2.0</span>

      {/* Cyber grid texture */}
      <div className="absolute inset-0 tech-grid opacity-[0.15] pointer-events-none" />

      {/* Sweeping Laser Beam */}
      {isScanning && (
        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_10px_rgba(74,222,128,0.8)] z-20 laser-active pointer-events-none" />
      )}

      {/* Device Vector Silhouette and target dots */}
      <div className="relative w-full flex-1 flex items-center justify-center z-10 py-4">
        {device === "phone" && (
          <div className="relative w-36 h-64 border-4 border-slate-700/80 rounded-[2.2rem] bg-slate-900/40 p-2 shadow-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-slate-600">
            {/* Notch */}
            <div className="w-16 h-4 bg-slate-800 rounded-full mx-auto" />
            <div className="flex-1 rounded-[1.8rem] border border-slate-800 bg-slate-950/20 relative flex items-center justify-center overflow-hidden mt-1">
              {/* Screen target */}
              <div className={`absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${screenGradeColor}`} title="Screen check">
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
                <span className="absolute left-6 -top-1.5 font-mono text-[8px] whitespace-nowrap text-white/50">SCR: {isFinished ? "Grade B" : isScanning && scanStep === 4 ? "SCANNING..." : "WAITING"}</span>
              </div>

              {/* Battery target */}
              <div className={`absolute top-[60%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${batteryGradeColor}`} title="Battery health">
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
                <span className="absolute left-6 -top-1.5 font-mono text-[8px] whitespace-nowrap text-white/50">BAT: {isFinished ? "82% CAP" : isScanning && scanStep === 5 ? "ANALYZING..." : "WAITING"}</span>
              </div>

              {/* Camera target */}
              <div className={`absolute top-[18%] left-[24%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${cameraGradeColor}`} title="Camera sensor">
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
                <span className="absolute left-6 -top-1.5 font-mono text-[8px] whitespace-nowrap text-white/50">CAM: {isFinished ? "Grade A" : isScanning && scanStep === 6 ? "CHECKING..." : "WAITING"}</span>
              </div>

              {/* Chassis target */}
              <div className={`absolute top-[80%] left-[30%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${chassisGradeColor}`} title="Chassis condition">
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
                <span className="absolute left-6 -top-1.5 font-mono text-[8px] whitespace-nowrap text-white/50">CHA: {isFinished ? "Scuffed" : isScanning && scanStep === 7 ? "INSPECTING..." : "WAITING"}</span>
              </div>
            </div>
          </div>
        )}

        {device === "laptop" && (
          <div className="relative w-52 h-44 flex flex-col justify-end transition-all duration-300 hover:scale-[1.02]">
            {/* Screen lid */}
            <div className="w-[180px] h-[110px] border-4 border-slate-700/80 rounded-t-xl bg-slate-900/40 mx-auto relative p-1.5 flex items-center justify-center shadow-xl">
              <div className="flex-1 h-full rounded-t border border-slate-800 bg-slate-950/20 relative">
                {/* Screen target */}
                <div className={`absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${screenGradeColor}`} title="Screen check">
                  <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
                  <span className="absolute left-6 -top-1.5 font-mono text-[8px] whitespace-nowrap text-white/50">SCR: {isFinished ? "Grade C" : isScanning && scanStep === 4 ? "SCANNING..." : "WAITING"}</span>
                </div>
              </div>
            </div>
            {/* Lower deck */}
            <div className="w-full h-4 border-2 border-slate-700/80 bg-slate-800 rounded-t relative">
              <div className="w-20 h-1 bg-slate-950 rounded-b mx-auto" />
              
              {/* Battery target (inside deck) */}
              <div className={`absolute top-[-30px] left-[20%] cursor-pointer z-10 transition-colors duration-300 ${batteryGradeColor}`} title="Battery health">
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
                <span className="absolute left-6 -top-1.5 font-mono text-[8px] whitespace-nowrap text-white/50">BAT: {isFinished ? "76% CAP" : isScanning && scanStep === 5 ? "ANALYZING..." : "WAITING"}</span>
              </div>

              {/* Motherboard target */}
              <div className={`absolute top-[-30px] right-[20%] cursor-pointer z-10 transition-colors duration-300 ${chassisGradeColor}`} title="Logic board check">
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
                <span className="absolute left-6 -top-1.5 font-mono text-[8px] whitespace-nowrap text-white/50">MB: {isFinished ? "Func 100%" : isScanning && scanStep === 7 ? "INSPECTING..." : "WAITING"}</span>
              </div>
            </div>
          </div>
        )}

        {device === "tablet" && (
          <div className="relative w-44 h-56 border-4 border-slate-700/80 rounded-[1.5rem] bg-slate-900/40 p-2 shadow-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-slate-600">
            <div className="flex-1 rounded-[1.2rem] border border-slate-800 bg-slate-950/20 relative flex items-center justify-center overflow-hidden">
              {/* Screen target */}
              <div className={`absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${screenGradeColor}`} title="Screen check">
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
                <span className="absolute left-6 -top-1.5 font-mono text-[8px] whitespace-nowrap text-white/50">SCR: {isFinished ? "Grade D" : isScanning && scanStep === 4 ? "SCANNING..." : "WAITING"}</span>
              </div>

              {/* Battery target */}
              <div className={`absolute top-[75%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${batteryGradeColor}`} title="Battery health">
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
                <span className="absolute left-6 -top-1.5 font-mono text-[8px] whitespace-nowrap text-white/50">BAT: {isFinished ? "Swollen" : isScanning && scanStep === 5 ? "ANALYZING..." : "WAITING"}</span>
              </div>

              {/* Motherboard target */}
              <div className={`absolute top-[18%] left-[25%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors duration-300 ${chassisGradeColor}`} title="Chassis check">
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
                <span className="absolute left-6 -top-1.5 font-mono text-[8px] whitespace-nowrap text-white/50">CHA: {isFinished ? "Bent" : isScanning && scanStep === 7 ? "INSPECTING..." : "WAITING"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scan details text */}
      <div className="w-full mt-2 pt-2 border-t border-white/5 flex justify-between font-mono text-[9px] text-white/40">
        <span>STATUS: {isFinished ? "LOCKED" : isScanning ? "SCANNING" : "STANDBY"}</span>
        <span>SYS_TEMP: 34.2°C</span>
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
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-green-500 selection:text-slate-950 overflow-x-hidden">

      {/* ==========================================
          1. NAVBAR
          ========================================== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "border-b border-slate-800 bg-[#0F172A]/85 backdrop-blur-md py-4 shadow-lg shadow-black/20"
        : "border-b border-transparent bg-transparent py-6"
        }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center text-slate-950 transition-transform group-hover:scale-105">
              <Leaf className="w-5 h-5 fill-slate-950 stroke-slate-950" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-green-400 transition-colors">
              EcoLoop
            </span>
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
              href="/submit"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-green-600 px-5 text-sm font-semibold text-slate-950 hover:bg-green-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Start Recovery
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
              <ScrollLink
                href="#showcase"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-11 items-center justify-center rounded-lg bg-green-600 px-5 text-base font-semibold text-slate-950 hover:bg-green-500 transition-colors"
              >
                Start Recovery
              </ScrollLink>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ==========================================
          2. HERO SECTION
          ========================================== */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#080808] z-10" />
        <div className="relative z-20 flex flex-col items-center text-center px-6">
          <WordReveal
            className="text-5xl md:text-7xl font-bold"
            text="Turn Your E-Waste Into Opportunity"
            greenWords={["E-Waste"]}
          />

          <FadeUp delay={0.8}>
            <p className="mt-6 text-lg md:text-xl text-white/55 max-w-3xl font-body">
              EcoLoop uses AI to determine the best second life for your used
              electronics. Get paid for your old devices and contribute to a
              circular economy.
            </p>
          </FadeUp>

          <FadeUp delay={1.0}>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/submit"
                className="bg-green-400 text-black font-ui font-bold text-lg px-8 py-4 rounded-xl shadow-[0_0_40px_rgba(74,222,128,0.4)]"
              >
                Start AI Appraisal
              </Link>
              <Link
                href="#process"
                className="border border-white/10 font-ui font-medium px-8 py-4 rounded-xl"
              >
                Learn More <ArrowRight className="inline -mt-1" size={16} />
              </Link>
            </div>
          </FadeUp>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-96 z-20 pointer-events-none">
          <div className="relative w-full h-full">
            <FloatCard
              amplitude={10}
              duration={4}
              rotate={3}
              delay={0.5}
            >
              <div className="absolute bottom-20 left-[10%] w-48 h-24 bg-[#0f0f0f] border border-white/10 rounded-2xl p-4 flex items-center space-x-3">
                <Recycle size={32} className="text-green-400" />
                <div>
                  <h4 className="font-ui font-bold">Recycle</h4>
                  <p className="text-xs text-white/50 font-mono">
                    Safely extract raw materials.
                  </p>
                </div>
              </div>
            </FloatCard>
            <FloatCard
              amplitude={15}
              duration={5}
              rotate={-2}
              delay={1.0}
            >
              <div className="absolute bottom-40 left-[25%] w-52 h-24 bg-[#0f0f0f] border border-white/10 rounded-2xl p-4 flex items-center space-x-3">
                <Wrench size={32} className="text-blue-400" />
                <div>
                  <h4 className="font-ui font-bold">Refurbish</h4>
                  <p className="text-xs text-white/50 font-mono">
                    Repair and restore to mint condition.
                  </p>
                </div>
              </div>
            </FloatCard>
            <FloatCard
              amplitude={12}
              duration={4.5}
              rotate={4}
              delay={0.2}
            >
              <div className="absolute bottom-32 right-[22%] w-56 h-24 bg-[#0f0f0f] border border-white/10 rounded-2xl p-4 flex items-center space-x-3">
                <Package size={32} className="text-yellow-400" />
                <div>
                  <h4 className="font-ui font-bold">Parts Harvest</h4>
                  <p className="text-xs text-white/50 font-mono">
                    Salvage working components for resale.
                  </p>
                </div>
              </div>
            </FloatCard>
            <FloatCard
              amplitude={18}
              duration={6}
              rotate={-3}
              delay={0.8}
            >
              <div className="absolute bottom-10 right-[8%] w-52 h-24 bg-[#0f0f0f] border border-white/10 rounded-2xl p-4 flex items-center space-x-3">
                <ShoppingCart size={32} className="text-purple-400" />
                <div>
                  <h4 className="font-ui font-bold">Resell</h4>
                  <p className="text-xs text-white/50 font-mono">
                    List on marketplaces for direct resale.
                  </p>
                </div>
              </div>
            </FloatCard>
          </div>
        </div>
      </header>

      {/* ==========================================
          3. HOW IT WORKS
          ========================================== */}
      <section id="how-it-works" className="relative py-32 bg-[#080808] text-white overflow-hidden">
        {/* Subtle radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.06)_0%,transparent_75%)] opacity-40 z-0" />
        {/* Dynamic decorative tech grid overlay */}
        <div className="absolute inset-0 tech-grid tech-grid-glow pointer-events-none opacity-40 z-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <div className="text-center max-w-3xl mx-auto mb-24">
            <FadeUp delay={0.2}>
              <h2 className="font-mono text-xs sm:text-sm font-medium tracking-widest text-green-400 uppercase mb-2">Seamless Lifecycle</h2>
            </FadeUp>
            <FadeUp delay={0.4}>
              <h3 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 leading-tight">
                How the circular loop works.
              </h3>
            </FadeUp>
            <FadeUp delay={0.6}>
              <p className="mt-5 text-lg text-white/70 leading-relaxed font-body">
                We turn the linear model of &quot;buy, use, dump&quot; into a self-sustaining cycle in five steps.
              </p>
            </FadeUp>
          </div>

          {/* Steps Timeline Row */}
          <div className="relative">

            {/* Glowing flowing beam line for desktop (md and up) */}
            <div className="hidden md:block absolute top-[76px] left-[8%] right-[8%] h-[3px] bg-slate-800/80 pointer-events-none z-0 rounded-full overflow-hidden">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-green-400/80 to-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-6 relative z-10">
              {stepsData.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <FadeUp key={step.number} delay={0.2 + index * 0.15}>
                    <motion.div
                      whileHover="hover"
                      className="group relative flex flex-col items-center text-center p-6 bg-[#111111]/60 hover:bg-[#161616]/90 border border-white/5 hover:border-white/15 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-[rgba(74,222,128,0.05)] cursor-pointer"
                      style={{
                        boxShadow: `hover: 0 0 30px ${step.glowColor}`
                      }}
                      custom={index}
                    >
                      {/* Step Number Badge */}
                      <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 border border-white/10 text-white font-bold text-xs flex items-center justify-center shadow-lg group-hover:border-green-400/50 transition-colors">
                        {step.number}
                      </span>

                      {/* Icon with Hover Animation and Radial Glow */}
                      <div className="relative w-24 h-24 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center relative shadow-lg group-hover:scale-105 group-hover:border-white/20 transition-all duration-300 overflow-hidden">
                        {/* Interactive dynamic background radial mesh */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-40 group-hover:opacity-100 transition-opacity duration-300`} />
                        
                        {/* Icon */}
                        <motion.div
                          variants={step.iconVariants}
                          className={`${step.textColor} relative z-10`}
                        >
                          <IconComponent className="w-10 h-10" />
                        </motion.div>
                      </div>

                      {/* Step Info */}
                      <h4 className="font-ui text-lg font-bold text-white mt-6 group-hover:text-green-400 transition-colors">
                        {step.title}
                      </h4>
                      <p className="font-body text-sm text-white/60 mt-3 leading-relaxed">
                        {step.desc}
                      </p>
                    </motion.div>
                  </FadeUp>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          4. CORE FEATURES
          ========================================== */}
      <section id="features" className="relative py-32 bg-[#080808] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.03)_0%,transparent_70%)] opacity-35 z-0" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <div className="text-center max-w-3xl mx-auto mb-24">
            <FadeUp>
              <h2 className="font-mono text-xs sm:text-sm font-medium tracking-widest text-green-400 uppercase">Circular Architecture</h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <h3 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mt-3">
                Engineered for absolute recovery.
              </h3>
            </FadeUp>
            <FadeUp delay={0.4}>
              <p className="mt-5 text-lg text-white/70 leading-relaxed font-body">
                Our proprietary suite of technologies simplifies complex circular electronics pipelines.
              </p>
            </FadeUp>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuresData.map((feature, i) => {
              const IconComponent = feature.icon;
              return (
                <SpotlightCard
                  key={feature.title}
                  glowColor={feature.glowColor}
                >
                  {/* Styled Icon Pod */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center relative shadow-lg group-hover:scale-105 group-hover:border-white/20 transition-all duration-300 mb-6 overflow-hidden">
                    <div className={`absolute inset-0 ${feature.bgColor} transition-colors duration-300`} />
                    <motion.div
                      animate={{
                        y: [0, -4, 0],
                        transition: {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.4
                        }
                      }}
                      className={`${feature.iconColor} relative z-10`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </motion.div>
                  </div>

                  {/* Feature Title & Text */}
                  <h4 className="font-ui text-xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="font-body text-sm text-white/60 mt-3.5 leading-relaxed flex-grow">
                    {feature.desc}
                  </p>
                </SpotlightCard>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* ==========================================
          5. AI DECISION ENGINE SHOWCASE
          ========================================== */}
      <section id="showcase" ref={showcaseRef} className="relative py-32 bg-[#0f0f0f] text-white overflow-hidden">

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3341550c_1px,transparent_1px),linear-gradient(to_bottom,#3341550c_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute inset-0 tech-grid opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left Column: Context & Interactive Controls */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div>
                <FadeUp>
                  <span className="font-mono text-sm tracking-widest text-green-400 uppercase">
                    Live AI Classifier
                  </span>
                </FadeUp>
                <FadeUp delay={0.2}>
                  <h3 className="font-display text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white mt-3 leading-tight">
                    Watch the AI engine decide outcome priorities.
                  </h3>
                </FadeUp>
                <FadeUp delay={0.4}>
                  <p className="mt-4 text-base text-white/70 leading-relaxed font-body">
                    Choose a sample device below to trigger our scanning neural pipeline. The diagnostic array inspects component qualities and locks the most sustainable, high-value outcome.
                  </p>
                </FadeUp>
              </div>

              {/* Selector Tabs */}
              <FadeUp delay={0.5}>
                <div className="p-1.5 bg-[#161616] border border-white/10 rounded-xl flex gap-1 font-ui">
                  <button
                    onClick={() => setSelectedDevice("phone")}
                    className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 ${selectedDevice === "phone"
                      ? "bg-green-400 text-black shadow"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    iPhone 13 Pro
                  </button>
                  <button
                    onClick={() => setSelectedDevice("laptop")}
                    className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 ${selectedDevice === "laptop"
                      ? "bg-green-400 text-black shadow"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    MacBook Air
                  </button>
                  <button
                    onClick={() => setSelectedDevice("tablet")}
                    className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 ${selectedDevice === "tablet"
                      ? "bg-green-400 text-black shadow"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    iPad Pro
                  </button>
                </div>
              </FadeUp>

              {/* Active Pipeline Status List */}
              <FadeUp delay={0.6}>
                <div className="space-y-4 font-body border-t border-white/5 pt-4 mt-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${scanStep >= 2 ? 'bg-green-400/20 text-green-400' : 'bg-white/10 text-white/60 animate-pulse'}`}>
                      {scanStep >= 2 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : "1"}
                    </div>
                    <span className={`text-sm ${scanStep >= 2 ? 'text-white font-semibold' : 'text-white/60'}`}>Optical Scanner Assessment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${scanStep >= 4 ? 'bg-green-400/20 text-green-400' : 'bg-white/10 text-white/60 animate-pulse'}`}>
                      {scanStep >= 4 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : "2"}
                    </div>
                    <span className={`text-sm ${scanStep >= 4 ? 'text-white font-semibold' : 'text-white/60'}`}>State-of-Health Checks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${scanStep >= 7 ? 'bg-green-400/20 text-green-400' : 'bg-white/10 text-white/60 animate-pulse'}`}>
                      {scanStep >= 7 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : "3"}
                    </div>
                    <span className={`text-sm ${scanStep >= 7 ? 'text-white font-semibold' : 'text-white/60'}`}>Routing Outcome Locked</span>
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* Middle Column: Holographic SVG Blueprint Scanner */}
            <div className="lg:col-span-4 flex items-center justify-center my-6 lg:my-0">
              <FadeUp delay={0.4}>
                <HolographicScanner device={selectedDevice} scanStep={scanStep} />
              </FadeUp>
            </div>

            {/* Right Column: Code Output & Decision Graph Mockup */}
            <div className="lg:col-span-4">
              <FadeUp delay={0.5}>
                <div className="relative">

                  {/* Behind card subtle ambient glow */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-30 pointer-events-none" />

                  <div className="relative bg-[#111111]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

                    {/* Window header */}
                    <div className="bg-black/20 px-6 py-3 border-b border-white/10 flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <span className="text-xs font-semibold text-white/50 font-mono select-none">ecoloop-ai-scan.json</span>
                      <div className="w-12" /> {/* empty spacer */}
                    </div>

                    {/* Console contents split layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 min-h-[350px]">

                      {/* Left panel: Typewriter Logs */}
                      <div className="font-mono text-[10px] text-green-400 space-y-2 border-r border-white/10 pr-3 overflow-y-auto no-scrollbar max-h-[300px]">
                        <div className="text-white/40 border-b border-white/10 pb-1 mb-2 font-bold select-none">SYSTEM CONSOLE</div>
                        {typedLogs.map((log, i) => (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            key={i}
                            className={`leading-relaxed ${i === typedLogs.length - 1 ? 'font-bold text-white glow-green' : ''}`}
                          >
                            <span className="text-white/30 select-none">&gt;&nbsp;</span>
                            {log}
                          </motion.div>
                        ))}
                        {scanStep < 8 && (
                          <span className="inline-block w-1.5 h-3.5 bg-green-400 animate-pulse" />
                        )}
                      </div>

                      {/* Right panel: Graph Breakdowns & Decision Badge */}
                      <div className="flex flex-col justify-between pt-2 md:pt-0 pl-0 md:pl-2">

                        {/* Badge */}
                        <div className="mb-4">
                          <div className="font-mono text-[9px] font-semibold text-white/40 mb-1 select-none">CLASSIFICATION</div>
                          {scanStep >= 8 ? (
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-green-400/10 border border-green-400/30 px-2.5 py-1 text-xs font-bold text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.1)]"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              {deviceSpecs[selectedDevice].outcome}
                            </motion.div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-bold text-white/50 animate-pulse">
                              Analyzing...
                            </div>
                          )}
                        </div>

                        {/* Progress Bars */}
                        <div className="space-y-4 font-ui">
                          <div className="font-mono text-[9px] font-semibold text-white/40 border-b border-white/10 pb-1 select-none">PROBABILITIES</div>

                          {/* Refurbish Bar */}
                          <div>
                            <div className="flex justify-between text-[10px] font-semibold text-white/80 mb-1 font-body">
                              <span>Refurbish & Sell</span>
                              <span>{scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.refurbish}%` : '0%'}</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.refurbish}%` : 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                              />
                            </div>
                          </div>

                          {/* Peer Resale Bar */}
                          <div>
                            <div className="flex justify-between text-[10px] font-semibold text-white/80 mb-1 font-body">
                              <span>P2P Resale</span>
                              <span>{scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.resale}%` : '0%'}</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.resale}%` : 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                              />
                            </div>
                          </div>

                          {/* Parts Salvage Bar */}
                          <div>
                            <div className="flex justify-between text-[10px] font-semibold text-white/80 mb-1 font-body">
                              <span>Parts Harvest</span>
                              <span>{scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.salvage}%` : '0%'}</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.salvage}%` : 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400"
                              />
                            </div>
                          </div>

                          {/* Recycle Bar */}
                          <div>
                            <div className="flex justify-between text-[10px] font-semibold text-white/80 mb-1 font-body">
                              <span>Raw Recycling</span>
                              <span>{scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.recycle}%` : '0%'}</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.recycle}%` : 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-red-500 to-red-400"
                              />
                            </div>
                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              </FadeUp>
            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          6. MARKETPLACE PREVIEW
          ========================================== */}
      <section id="marketplace" className="relative py-28 bg-[#080808] text-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeUp>
              <h2 className="font-mono text-sm tracking-widest text-green-400 uppercase">Circular Commerce</h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <h3 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mt-3">
                Join the circular marketplace.
              </h3>
            </FadeUp>
            <FadeUp delay={0.4}>
              <p className="mt-4 text-lg text-white/70 leading-relaxed font-body">
                Browse fully certified devices or source wholesale, harvested parts directly from our automated hubs.
              </p>
            </FadeUp>
          </div>

          {/* 3 Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <FadeUp delay={0.5}>
              <div className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden hover:border-green-400/50 transition-all duration-300 flex flex-col h-full">
                {/* Product Visual */}
                <div className="h-56 bg-black/20 flex flex-col items-center justify-center relative p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.1)_0%,transparent_60%)] pointer-events-none" />
                  <div className="w-24 h-44 rounded-[2rem] border-[4px] border-white/20 bg-black/30 flex flex-col p-2 relative shadow-lg">
                    <div className="w-10 h-3.5 bg-black/50 rounded-full mx-auto mb-1 border border-white/10" />
                    <div className="flex-1 rounded-[1.5rem] bg-black/30 flex flex-col items-center justify-center p-3 relative overflow-hidden border border-white/10">
                      <span className="text-[10px] font-bold text-white/50">IPHONE 14 PRO</span>
                      <div className="w-9 h-9 rounded-full bg-green-400/10 flex items-center justify-center text-green-400 mt-2">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-semibold text-green-400 mt-2 font-mono">GRADE A Refurb</span>
                    </div>
                  </div>
                </div>
                {/* Product Info */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex rounded-md bg-green-400/10 border border-green-400/20 px-2 py-0.5 text-xs font-bold text-green-400">Refurbished</span>
                      <span className="text-xs font-semibold text-white/40 font-mono">B2C Seller</span>
                    </div>
                    <h4 className="font-ui text-lg font-bold text-white mt-3">iPhone 14 Pro</h4>
                    <ul className="text-xs text-white/60 mt-3 space-y-1.5 leading-relaxed font-body">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> 128GB Space Black</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> 90% Battery Health</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> 1 Year EcoLoop Warranty</li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-white">$649</span>
                    <button className="inline-flex items-center justify-center rounded-lg bg-green-400 hover:bg-green-300 text-black font-semibold text-xs py-2.5 px-4 transition-colors">
                      Buy Device
                    </button>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Card 2 */}
            <FadeUp delay={0.6}>
              <div className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-400/50 transition-all duration-300 flex flex-col h-full">
                {/* Product Visual */}
                <div className="h-56 bg-black/20 flex flex-col items-center justify-center relative p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_60%)] pointer-events-none" />
                  <div className="w-24 h-44 rounded-2xl border-[4px] border-white/20 bg-black/30 flex flex-col p-2 relative shadow-lg">
                    <div className="w-8 h-1 bg-black/50 rounded-full mx-auto mb-1.5 border border-white/10" />
                    <div className="flex-1 rounded-lg bg-black/30 flex flex-col items-center justify-center p-3 relative overflow-hidden border border-white/10">
                      <span className="text-[9px] font-bold text-white/50">GALAXY S23 ULTRA</span>
                      <div className="w-9 h-9 rounded-full bg-blue-400/10 flex items-center justify-center text-blue-400 mt-2">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-semibold text-blue-400 mt-2 font-mono">GRADE B Pre-Owned</span>
                    </div>
                  </div>
                </div>
                {/* Product Info */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex rounded-md bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 text-xs font-bold text-blue-400">Reuse</span>
                      <span className="text-xs font-semibold text-white/40 font-mono">B2B Verified</span>
                    </div>
                    <h4 className="font-ui text-lg font-bold text-white mt-3">Samsung Galaxy S23 Ultra</h4>
                    <ul className="text-xs text-white/60 mt-3 space-y-1.5 leading-relaxed font-body">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> 256GB Phantom Black</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> Minor bezel scuffs (Grade B)</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> Fully Inspected & Audited</li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-white">$580</span>
                    <button className="inline-flex items-center justify-center rounded-lg bg-blue-400 hover:bg-blue-300 text-black font-semibold text-xs py-2.5 px-4 transition-colors">
                      Buy Device
                    </button>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Card 3 */}
            <FadeUp delay={0.7}>
              <div className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-400/50 transition-all duration-300 flex flex-col h-full">
                {/* Product Visual */}
                <div className="h-56 bg-black/20 flex flex-col items-center justify-center relative p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08)_0%,transparent_60%)] pointer-events-none" />
                  <div className="w-36 h-28 rounded-lg border-2 border-white/20 bg-black/30 flex flex-col p-1.5 relative shadow-lg">
                    <div className="flex-1 rounded bg-black/30 flex flex-col items-center justify-center p-2 relative overflow-hidden border border-white/10">
                      <span className="text-[9px] font-bold text-white/50">MACBOOK AIR M2</span>
                      <div className="w-7 h-7 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400 mt-1">
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[8px] font-semibold text-yellow-400 mt-1 font-mono">SCREEN RECLAIMED</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-b mt-1.5" />
                  </div>
                </div>
                {/* Product Info */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex rounded-md bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 text-xs font-bold text-yellow-400">Parts</span>
                      <span className="text-xs font-semibold text-white/40 font-mono">B2B Certified</span>
                    </div>
                    <h4 className="font-ui text-lg font-bold text-white mt-3">MacBook Air M2 Screen</h4>
                    <ul className="text-xs text-white/60 mt-3 space-y-1.5 leading-relaxed font-body">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" /> OEM Grade A+ Salvage</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" /> Fully tested, no dead pixels</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" /> 6-month parts warranty</li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-white">$199</span>
                    <button className="inline-flex items-center justify-center rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs py-2.5 px-4 transition-colors">
                      Buy Part
                    </button>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Browse all CTA */}
          <FadeUp delay={0.8}>
            <div className="mt-16 text-center">
              <button className="inline-flex items-center gap-2 rounded-xl bg-[#161616] border border-white/10 hover:bg-white/10 text-white font-bold py-3.5 px-8 transition-all hover:scale-[1.01] active:scale-[0.99]">
                Browse All Listings
                <ArrowRight className="w-4 h-4 text-green-400" />
              </button>
            </div>
          </FadeUp>

        </div>
      </section>

      {/* ==========================================
          7. FOOTER
          ========================================== */}
      <footer className="bg-[#080808] text-white/70 border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

            {/* Column 1: Info & Tagline */}
            <div className="flex flex-col gap-4 font-body">
              <a href="#" className="flex items-center gap-2 group self-start">
                <div className="w-8 h-8 rounded-lg bg-green-400 flex items-center justify-center text-black">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="font-display text-lg font-bold text-white tracking-tight">EcoLoop</span>
              </a>
              <p className="text-sm text-white/60 leading-relaxed max-w-[280px]">
                Every device deserves a second chance. Empowering users with AI-driven circular commerce.
              </p>
            </div>

            {/* Column 2: Navigation links */}
            <div className="font-ui">
              <h5 className="font-mono text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Navigation</h5>
              <ul className="text-sm space-y-2">
                <li><ScrollLink href="#features" className="hover:text-green-400 transition-colors">Features</ScrollLink></li>
                <li><ScrollLink href="#how-it-works" className="hover:text-green-400 transition-colors">How It Works</ScrollLink></li>
                <li><ScrollLink href="#showcase" className="hover:text-green-400 transition-colors">AI Engine Diagnostics</ScrollLink></li>
                <li><ScrollLink href="#marketplace" className="hover:text-green-400 transition-colors">Marketplace Catalog</ScrollLink></li>
              </ul>
            </div>

            {/* Column 3: Legal & Standards */}
            <div className="font-ui">
              <h5 className="font-mono text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Legal</h5>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">E-Waste Compliance</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">B2B Audit Standard</a></li>
              </ul>
            </div>

            {/* Column 4: Social media & updates */}
            <div className="font-ui">
              <h5 className="font-mono text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Social Loop</h5>
              <div className="flex gap-4">
                <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors" aria-label="Twitter">
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors" aria-label="LinkedIn">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors" aria-label="Github">
                  <GithubIcon className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-white/40 mt-4 leading-relaxed font-body">
                EcoLoop Platform Inc. © {new Date().getFullYear()}.
              </p>
            </div>

          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 font-mono">
            <span>ISO 14001 Certified & EPA Compliant Processors.</span>
            <span className="mt-2 sm:mt-0">In partnership with Vercel and Linear.</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
