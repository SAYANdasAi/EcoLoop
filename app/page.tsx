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
      <section id="how-it-works" className="relative py-28 bg-[#080808] text-white overflow-hidden">
        {/* Subtle radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.05)_0%,transparent_75%)] opacity-30 z-0" />
        {/* Dynamic decorative grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeUp delay={0.2}>
              <h2 className="font-mono text-xs sm:text-sm font-medium tracking-widest text-green-400 uppercase mb-2">Seamless Lifecycle</h2>
            </FadeUp>
            <FadeUp delay={0.4}>
              <h3 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-3">
                How the circular loop works.
              </h3>
            </FadeUp>
            <FadeUp delay={0.6}>
              <p className="mt-4 text-lg text-white/70 leading-relaxed font-body">
                We turn the linear model of &quot;buy, use, dump&quot; into a self-sustaining cycle in five steps.
              </p>
            </FadeUp>
          </div>

          {/* Steps Timeline Row */}
          <div className="relative">

            {/* Horizontal Line for Desktop (md and up) */}
            <div className="hidden md:block absolute top-12 left-12 right-12 h-0.5 bg-slate-700 pointer-events-none z-0">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-green-500/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">

              {/* Step 1 */}
              <FadeUp delay={0.7}>
                <div className="flex flex-col items-center text-center px-4">
                  <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-green-500/30 flex items-center justify-center text-green-400 relative shadow-lg">
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm flex items-center justify-center border-2 border-[#080808]">1</span>
                    <Truck className="w-9 h-9" />
                  </div>
                  <h4 className="font-ui text-lg font-bold text-white mt-6">Device Pickup</h4>
                  <p className="font-body text-sm text-white/70 mt-2 leading-relaxed max-w-[200px]">
                    Schedule a home pickup or print a pre-paid shipping label.
                  </p>
                </div>
              </FadeUp>

              {/* Step 2 */}
              <FadeUp delay={0.8}>
                <div className="flex flex-col items-center text-center px-4">
                  <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-green-500/30 flex items-center justify-center text-green-400 relative shadow-lg">
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm flex items-center justify-center border-2 border-[#080808]">2</span>
                    <Cpu className="w-9 h-9" />
                  </div>
                  <h4 className="font-ui text-lg font-bold text-white mt-6">AI Evaluation</h4>
                  <p className="font-body text-sm text-white/70 mt-2 leading-relaxed max-w-[200px]">
                    AI scans component grades, battery health, and chassis marks.
                  </p>
                </div>
              </FadeUp>

              {/* Step 3 */}
              <FadeUp delay={0.9}>
                <div className="flex flex-col items-center text-center px-4">
                  <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-green-500/30 flex items-center justify-center text-green-400 relative shadow-lg">
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm flex items-center justify-center border-2 border-[#080808]">3</span>
                    <Layers className="w-9 h-9" />
                  </div>
                  <h4 className="font-ui text-lg font-bold text-white mt-6">Route Decision</h4>
                  <p className="font-body text-sm text-white/70 mt-2 leading-relaxed max-w-[200px]">
                    Automatic routing to refurbish, resale, parts, or recycling.
                  </p>
                </div>
              </FadeUp>

              {/* Step 4 */}
              <FadeUp delay={1.0}>
                <div className="flex flex-col items-center text-center px-4">
                  <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-green-500/30 flex items-center justify-center text-green-400 relative shadow-lg">
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm flex items-center justify-center border-2 border-[#080808]">4</span>
                    <ShoppingBag className="w-9 h-9" />
                  </div>
                  <h4 className="font-ui text-lg font-bold text-white mt-6">Marketplace Listing</h4>
                  <p className="font-body text-sm text-white/70 mt-2 leading-relaxed max-w-[200px]">
                    Devices and salvaged parts are listed instantly to B2B/B2C hubs.
                  </p>
                </div>
              </FadeUp>

              {/* Step 5 */}
              <FadeUp delay={1.1}>
                <div className="flex flex-col items-center text-center px-4">
                  <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-green-500/30 flex items-center justify-center text-green-400 relative shadow-lg">
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm flex items-center justify-center border-2 border-[#080808]">5</span>
                    <Coins className="w-9 h-9" />
                  </div>
                  <h4 className="font-ui text-lg font-bold text-white mt-6">Reuse & Earn</h4>
                  <p className="font-body text-sm text-white/70 mt-2 leading-relaxed max-w-[200px]">
                    Get cash back immediately while keeping rare earth minerals in use.
                  </p>
                </div>
              </FadeUp>

            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          4. CORE FEATURES
          ========================================== */}
      <section id="features" className="relative py-28 bg-slate-50 text-slate-900">
        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-base font-semibold tracking-wider text-green-600 uppercase">Circular Architecture</h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mt-3">
              Engineered for absolute recovery.
            </h3>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              Our proprietary suite of technologies simplifies complex circular electronics pipelines.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(22,163,74,0.1)] transition-all duration-300 group flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Hybrid Marketplace</h4>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed flex-grow">
                Seamless C2B device collection combined with lightning-fast B2C and bulk B2B component trade systems.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(22,163,74,0.1)] transition-all duration-300 group flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">AI Multi-Outcome Engine</h4>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed flex-grow">
                Smart neural networks automatically classify devices into 4 distinct routing outcomes, optimizing value salvage.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(22,163,74,0.1)] transition-all duration-300 group flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Component-Level Recovery</h4>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed flex-grow">
                Surgical harvesting of perfectly intact modules (screens, OEM batteries, cameras) rather than basic crushing.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(22,163,74,0.1)] transition-all duration-300 group flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Dynamic Pricing Models</h4>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed flex-grow">
                Machine learning algorithms track global part scarcity and component demand to guarantee top-dollar payouts instantly.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(22,163,74,0.1)] transition-all duration-300 group flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Device Journey Tracking</h4>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed flex-grow">
                A secure cryptographic ledger tracks every handoff, certification, and hardware outcome for total circular custody.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(22,163,74,0.1)] transition-all duration-300 group flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Eco Transparency</h4>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed flex-grow">
                Get precise reports detailing exactly how much carbon emissions were averted and metals saved with every transaction.
              </p>
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* ==========================================
          5. AI DECISION ENGINE SHOWCASE
          ========================================== */}
      <section id="showcase" ref={showcaseRef} className="relative py-28 bg-[#0F172A] text-white overflow-hidden">

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3341551a_1px,transparent_1px),linear-gradient(to_bottom,#3341551a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Column: Context & Interactive Controls */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide text-green-400 backdrop-blur-sm">
                <BrainCircuit className="w-4 h-4" />
                Live AI Classifier Simulator
              </span>
              <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-6 leading-tight">
                Watch the AI engine decide outcome priorities.
              </h3>
              <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
                Choose a sample device below to trigger our scanning neural pipeline. The diagnostic array inspects component qualities and locks the most sustainable, high-value outcome.
              </p>

              {/* Selector Tabs */}
              <div className="mt-8 p-1.5 bg-slate-900 border border-slate-800 rounded-xl flex gap-1">
                <button
                  onClick={() => setSelectedDevice("phone")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-205 ${selectedDevice === "phone"
                    ? "bg-green-600 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                    }`}
                >
                  iPhone 13 Pro
                </button>
                <button
                  onClick={() => setSelectedDevice("laptop")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-205 ${selectedDevice === "laptop"
                    ? "bg-green-600 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                    }`}
                >
                  MacBook Air
                </button>
                <button
                  onClick={() => setSelectedDevice("tablet")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-205 ${selectedDevice === "tablet"
                    ? "bg-green-600 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                    }`}
                >
                  iPad Pro
                </button>
              </div>

              {/* Active Pipeline Status List */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${scanStep >= 2 ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500 animate-pulse'}`}>
                    {scanStep >= 2 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : "1"}
                  </div>
                  <span className={`text-sm ${scanStep >= 2 ? 'text-slate-200 font-semibold' : 'text-slate-500'}`}>Optical Scanner Assessment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${scanStep >= 4 ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                    {scanStep >= 4 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : "2"}
                  </div>
                  <span className={`text-sm ${scanStep >= 4 ? 'text-slate-200 font-semibold' : 'text-slate-500'}`}>State-of-Health Diagnostic Checks</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${scanStep >= 7 ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                    {scanStep >= 7 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : "3"}
                  </div>
                  <span className={`text-sm ${scanStep >= 7 ? 'text-slate-200 font-semibold' : 'text-slate-500'}`}>Outcome Routing Decisions Locked</span>
                </div>
              </div>
            </div>

            {/* Right Column: Code Output & Decision Graph Mockup */}
            <div className="relative">

              {/* Behind card subtle ambient glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-30 pointer-events-none" />

              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">

                {/* Window header */}
                <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 font-mono select-none">ecoloop-ai-scan.json</span>
                  <div className="w-12" /> {/* empty spacer */}
                </div>

                {/* Console contents split layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 min-h-[350px]">

                  {/* Left panel: Typewriter Logs */}
                  <div className="font-mono text-xs text-green-400 space-y-2 border-r border-slate-800/60 pr-4 overflow-y-auto no-scrollbar max-h-[300px]">
                    <div className="text-slate-500 border-b border-slate-800/40 pb-2 mb-2">SYSTEM CONSOLE LOGS</div>
                    {typedLogs.map((log, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        key={i}
                        className={`leading-relaxed ${i === typedLogs.length - 1 ? 'font-bold text-white' : ''}`}
                      >
                        <span className="text-slate-600 select-none">&gt;&nbsp;</span>
                        {log}
                      </motion.div>
                    ))}
                    {scanStep < 8 && (
                      <span className="inline-block w-1.5 h-4 bg-green-400 animate-pulse" />
                    )}
                  </div>

                  {/* Right panel: Graph Breakdowns & Decision Badge */}
                  <div className="flex flex-col justify-between pt-2 md:pt-0 pl-0 md:pl-2">

                    {/* Badge */}
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-slate-500 mb-1">CLASSIFICATION STATUS</div>
                      {scanStep >= 8 ? (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/10 border border-green-500/30 px-3 py-1.5 text-sm font-bold text-green-400"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          {deviceSpecs[selectedDevice].outcome}
                        </motion.div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-sm font-bold text-slate-400 animate-pulse">
                          Analyzing components...
                        </div>
                      )}
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-4">
                      <div className="text-xs font-semibold text-slate-500 border-b border-slate-800/40 pb-1">CIRCULAR OUTCOME PROBABILITIES</div>

                      {/* Refurbish Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                          <span>Refurbish & Sell</span>
                          <span>{scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.refurbish}%` : '0%'}</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.refurbish}%` : 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-green-500"
                          />
                        </div>
                      </div>

                      {/* Peer Resale Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                          <span>Peer-to-Peer Resale</span>
                          <span>{scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.resale}%` : '0%'}</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.resale}%` : 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-blue-500"
                          />
                        </div>
                      </div>

                      {/* Parts Salvage Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                          <span>Component Harvesting</span>
                          <span>{scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.salvage}%` : '0%'}</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.salvage}%` : 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-yellow-500"
                          />
                        </div>
                      </div>

                      {/* Recycle Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                          <span>Green Scrap Recycling</span>
                          <span>{scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.recycle}%` : '0%'}</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: scanStep >= 8 ? `${deviceSpecs[selectedDevice].confidences.recycle}%` : 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-red-500"
                          />
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          6. MARKETPLACE PREVIEW
          ========================================== */}
      <section id="marketplace" className="relative py-28 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-base font-semibold tracking-wider text-green-600 uppercase">Circular Commerce</h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mt-3">
              Join the circular marketplace.
            </h3>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              Browse fully certified devices or source wholesale, harvested parts directly from our automated hubs.
            </p>
          </div>

          {/* 3 Product Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Card 1 */}
            <motion.div
              variants={fadeInUp}
              className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col"
            >
              {/* Product Visual Representation (Sleek custom CSS UI instead of generic image placeholder) */}
              <div className="h-56 bg-slate-950 flex flex-col items-center justify-center relative p-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.06)_0%,transparent_60%)] pointer-events-none" />
                <div className="w-24 h-44 rounded-[2rem] border-[4px] border-slate-700 bg-slate-900 flex flex-col p-2 relative shadow-lg">
                  <div className="w-10 h-3.5 bg-slate-950 rounded-full mx-auto mb-1 border border-slate-800" /> {/* Speaker bar */}
                  <div className="flex-1 rounded-[1.5rem] bg-slate-950 flex flex-col items-center justify-center p-3 relative overflow-hidden border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500">IPHONE 14 PRO</span>
                    <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mt-2">
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
                    <span className="inline-flex rounded-md bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-xs font-bold text-green-600">Refurbished</span>
                    <span className="text-xs font-semibold text-slate-400 font-mono">B2C Seller</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mt-3">iPhone 14 Pro</h4>
                  <ul className="text-xs text-slate-500 mt-3 space-y-1.5 leading-relaxed">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> 128GB Space Black</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> 90% Battery Health</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> 1 Year EcoLoop Warranty</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900">$649</span>
                  <button className="inline-flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-4 transition-colors">
                    Buy Device
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={fadeInUp}
              className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col"
            >
              {/* Product Visual */}
              <div className="h-56 bg-slate-950 flex flex-col items-center justify-center relative p-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_0%,transparent_60%)] pointer-events-none" />
                <div className="w-24 h-44 rounded-2xl border-[4px] border-slate-700 bg-slate-900 flex flex-col p-2 relative shadow-lg">
                  <div className="w-8 h-1 bg-slate-950 rounded-full mx-auto mb-1.5 border border-slate-800" /> {/* Speaker bar */}
                  <div className="flex-1 rounded-lg bg-slate-950 flex flex-col items-center justify-center p-3 relative overflow-hidden border border-slate-800">
                    <span className="text-[9px] font-bold text-slate-500">GALAXY S23 ULTRA</span>
                    <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mt-2">
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
                    <span className="inline-flex rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-600">Reuse</span>
                    <span className="text-xs font-semibold text-slate-400 font-mono">B2B Verified</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mt-3">Samsung Galaxy S23 Ultra</h4>
                  <ul className="text-xs text-slate-500 mt-3 space-y-1.5 leading-relaxed">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> 256GB Phantom Black</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> Minor bezel scuffs (Grade B)</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> Fully Inspected & Audited</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900">$580</span>
                  <button className="inline-flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-4 transition-colors">
                    Buy Device
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={fadeInUp}
              className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col"
            >
              {/* Product Visual */}
              <div className="h-56 bg-slate-950 flex flex-col items-center justify-center relative p-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.06)_0%,transparent_60%)] pointer-events-none" />
                <div className="w-36 h-28 rounded-lg border-2 border-slate-700 bg-slate-900 flex flex-col p-1.5 relative shadow-lg">
                  <div className="flex-1 rounded bg-slate-950 flex flex-col items-center justify-center p-2 relative overflow-hidden border border-slate-850">
                    <span className="text-[9px] font-bold text-slate-500">MACBOOK AIR M2</span>
                    <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mt-1">
                      <Wrench className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[8px] font-semibold text-green-400 mt-1 font-mono">SCREEN RECLAIMED</span>
                  </div>
                  <div className="w-full h-1 bg-slate-750 rounded-b mt-1.5" /> {/* Keypad base */}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex rounded-md bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-xs font-bold text-green-600">Refurbished</span>
                    <span className="text-xs font-semibold text-slate-400 font-mono">B2C Certified</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mt-3">MacBook Air M2</h4>
                  <ul className="text-xs text-slate-500 mt-3 space-y-1.5 leading-relaxed">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> 8GB RAM / 256GB SSD</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> Reclaimed logic board / Brand new cell</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> Certified component salvage</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900">$799</span>
                  <button className="inline-flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-4 transition-colors">
                    Buy Device
                  </button>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* Browse all CTA */}
          <div className="mt-16 text-center">
            <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 transition-all hover:scale-[1.01] active:scale-[0.99]">
              Browse All Listings
              <ArrowRight className="w-4 h-4 text-green-400" />
            </button>
          </div>

        </div>
      </section>

      {/* ==========================================
          7. FOOTER
          ========================================== */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

            {/* Column 1: Info & Tagline */}
            <div className="flex flex-col gap-4">
              <a href="#" className="flex items-center gap-2 group self-start">
                <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-slate-950">
                  <Leaf className="w-4 h-4 fill-slate-950 stroke-slate-950" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">EcoLoop</span>
              </a>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[280px]">
                Every device deserves a second chance. Empowering users with AI-driven circular commerce.
              </p>
            </div>

            {/* Column 2: Navigation links */}
            <div>
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Navigation</h5>
              <ul className="text-xs sm:text-sm space-y-2">
                <li><ScrollLink href="#features" className="hover:text-green-400 transition-colors">Features</ScrollLink></li>
                <li><ScrollLink href="#how-it-works" className="hover:text-green-400 transition-colors">How It Works</ScrollLink></li>
                <li><ScrollLink href="#showcase" className="hover:text-green-400 transition-colors">AI Engine Diagnostics</ScrollLink></li>
                <li><ScrollLink href="#marketplace" className="hover:text-green-400 transition-colors">Marketplace Catalog</ScrollLink></li>
              </ul>
            </div>

            {/* Column 3: Legal & Standards */}
            <div>
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Legal</h5>
              <ul className="text-xs sm:text-sm space-y-2">
                <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">E-Waste Disposal Compliance</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">B2B Audit Standard</a></li>
              </ul>
            </div>

            {/* Column 4: Social media & updates */}
            <div>
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Social Loop</h5>
              <div className="flex gap-4">
                <a href="#" className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors" aria-label="Twitter">
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors" aria-label="LinkedIn">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors" aria-label="Github">
                  <GithubIcon className="w-4 h-4" />
                </a>
              </div>
              <p className="text-[11px] text-slate-600 mt-4 leading-relaxed">
                EcoLoop Platform Inc. © {new Date().getFullYear()}. Certified e-waste operator.
              </p>
            </div>

          </div>

          <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600">
            <span>ISO 14001 Certified & EPA Compliant Processors.</span>
            <span className="mt-2 sm:mt-0">Designed in partnership with Vercel and Linear standards.</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
