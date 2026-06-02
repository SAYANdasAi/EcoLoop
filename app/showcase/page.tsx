"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  ArrowLeft,
  Cpu,
  Layers,
  Wrench,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { LogoFull } from "../../components/Logo";
import InteractiveGridBg from "../../components/InteractiveGridBg";
import SideMenu from "../../components/SideMenu";
import Marquee from "../../components/Marquee";
import { FadeUp } from "../../components/animations/FadeUp";
import Footer from "../../components/Footer";

// Scanner sub-component (blueprint check)
interface HolographicScannerProps {
  device: "phone" | "laptop" | "tablet";
  scanStep: number;
}

function HolographicScanner({ device, scanStep }: HolographicScannerProps) {
  const isScanning = scanStep > 0 && scanStep < 8;
  const isFinished = scanStep >= 8;

  const screenGradeColor = !isFinished
    ? scanStep === 4
      ? "text-yellow-400 animate-pulse pulse-target"
      : "text-slate-600/80"
    : device === "phone"
    ? "text-green-400"
    : "text-red-500";

  const batteryGradeColor = !isFinished
    ? scanStep === 5
      ? "text-yellow-400 animate-pulse pulse-target"
      : "text-slate-600/80"
    : device === "phone"
    ? "text-green-400"
    : device === "laptop"
    ? "text-yellow-500"
    : "text-red-500";

  const cameraGradeColor = !isFinished
    ? scanStep === 6
      ? "text-yellow-400 animate-pulse pulse-target"
      : "text-slate-600/80"
    : "text-green-500";

  const chassisGradeColor = !isFinished
    ? scanStep === 7
      ? "text-yellow-400 animate-pulse pulse-target"
      : "text-slate-600/80"
    : device === "phone"
    ? "text-green-400"
    : device === "laptop"
    ? "text-yellow-500"
    : "text-red-500";

  return (
    <div className="relative w-full max-w-[280px] bg-[#09090b] border border-white/[0.07] rounded-[2rem] p-6 flex flex-col items-center justify-between overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      
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

      {/* Cyber Grid scanning texture overlay */}
      {isScanning && (
        <div className="absolute inset-0 opacity-15 tech-grid pointer-events-none z-0" />
      )}

      {/* Rotating sci-fi radar/target lines in the background */}
      {isScanning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          {/* Outer dashed spinning ring */}
          <div className="absolute w-56 h-56 rounded-full border border-mint-glow/15 border-dashed animate-[spin_25s_linear_infinite]" />
          {/* Mid solid reversing ring */}
          <div className="absolute w-44 h-44 rounded-full border border-ai-cyan/10 border-t-transparent border-b-transparent animate-[spin_15s_linear_infinite_reverse]" />
          {/* Inner expanding soft sonar wave */}
          <div className="absolute w-32 h-32 rounded-full bg-mint-glow/5 border border-primary-glow/20 animate-ping opacity-60" style={{ animationDuration: "3s" }} />
        </div>
      )}

      {/* Sweeping Laser Beam - Premium Glowing sweep bar */}
      {isScanning && (
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-glow to-transparent shadow-[0_0_15px_#00F5A0,0_0_30px_#00E676] z-20 pointer-events-none laser-active" />
      )}

      {/* Device Vector Silhouette and target dots */}
      <div className="relative w-full flex-1 flex items-center justify-center z-10 py-6">
        {device === "phone" && (
          <div className="relative w-32 h-56 border-2 border-white/10 rounded-[2rem] bg-black/45 p-1.5 shadow-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
            {/* Notch */}
            <div className="w-12 h-3.5 bg-slate-900 rounded-full mx-auto" />
            <div className="flex-1 rounded-[1.6rem] border border-white/[0.05] bg-black/35 relative flex items-center justify-center overflow-hidden mt-1">
              {/* Screen target */}
              <div className={`absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${screenGradeColor}`}>
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>
              {/* Battery target */}
              <div className={`absolute top-[60%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${batteryGradeColor}`}>
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>
              {/* Camera target */}
              <div className={`absolute top-[18%] left-[24%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${cameraGradeColor}`}>
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>
              {/* Chassis target */}
              <div className={`absolute top-[80%] left-[30%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${chassisGradeColor}`}>
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
                <div className={`absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${screenGradeColor}`}>
                  <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
                </div>
              </div>
            </div>
            {/* Lower deck */}
            <div className="w-full h-3 border-2 border-white/10 bg-slate-900/60 rounded-t relative">
              <div className="w-16 h-0.5 bg-black rounded-b mx-auto" />
              {/* Battery target */}
              <div className={`absolute top-[-26px] left-[20%] cursor-pointer z-10 transition-colors ${batteryGradeColor}`}>
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>
              {/* Motherboard target */}
              <div className={`absolute top-[-26px] right-[20%] cursor-pointer z-10 transition-colors ${chassisGradeColor}`}>
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>
            </div>
          </div>
        )}

        {device === "tablet" && (
          <div className="relative w-40 h-48 border-2 border-white/10 rounded-[1.2rem] bg-black/45 p-1.5 shadow-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
            <div className="flex-1 rounded-[0.9rem] border border-white/[0.05] bg-black/35 relative flex items-center justify-center overflow-hidden">
              {/* Screen target */}
              <div className={`absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${screenGradeColor}`}>
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>
              {/* Battery target */}
              <div className={`absolute top-[75%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${batteryGradeColor}`}>
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>
              {/* Motherboard target */}
              <div className={`absolute top-[18%] left-[25%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${chassisGradeColor}`}>
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-current bg-black" />
              </div>
            </div>
          </div>
        )}
      </div>

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
  },
  laptop: {
    name: "MacBook Air M1",
    grade: "Grade C (Heavy wear)",
    diagnostics: {
      screen: "Grade C - Severe screen delamination",
      battery: "76% Capacity - Replace needed",
      camera: "Grade A - Functional",
      chassis: "Grade B - 1 major dent",
    },
    outcome: "Component Harvest — 91% confidence",
    confidences: { refurbish: 30, resale: 15, salvage: 91, recycle: 54 },
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
  },
};

export default function ShowcasePage() {
  const [selectedDevice, setSelectedDevice] = useState<"phone" | "laptop" | "tablet">("phone");
  const [scanStep, setScanStep] = useState(0);
  const [typedLogs, setTypedLogs] = useState<string[]>([]);
  const [aiResult, setAiResult] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Trigger Gemini AI Diagnostics call when selectedDevice changes
  useEffect(() => {
    let active = true;
    setScanStep(0);
    setTypedLogs([
      "Initializing EcoLoop diagnostic engine...",
      "Contacting Gemini AI cognitive services... [PENDING]"
    ]);
    setAiResult(null);
    setIsAiLoading(true);

    const fetchDiagnostics = async () => {
      try {
        const res = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ device: selectedDevice })
        });
        const data = await res.json();
        if (active) {
          setAiResult(data);
          setIsAiLoading(false);
        }
      } catch (err) {
        console.error("Showcase Diagnostics fetch error:", err);
        if (active) {
          setIsAiLoading(false);
        }
      }
    };

    // Delay slightly to show standard high-tech connection handshake logs first
    const delayTimer = setTimeout(() => {
      fetchDiagnostics();
    }, 800);

    return () => {
      active = false;
      clearTimeout(delayTimer);
    };
  }, [selectedDevice]);

  // Typing simulator based on aiResult availability
  useEffect(() => {
    if (!aiResult) return;

    const logs = [
      "Initializing EcoLoop diagnostic engine...",
      "Cognitive diagnostics link: CONNECTED via Gemini AI [OK].",
      `Target hardware profile identified: ${aiResult.name}`,
      `Screen glass check: ${aiResult.diagnostics.screen}`,
      `Power state validation: ${aiResult.diagnostics.battery}`,
      `Camera sensor diagnostics: ${aiResult.diagnostics.camera}`,
      `Chassis structural check: ${aiResult.diagnostics.chassis}`,
      `Circular routing locked: [${aiResult.outcome.toUpperCase()}]`,
      `Diagnostics audit report successfully certified.`
    ];

    setTypedLogs([logs[0], logs[1]]);
    setScanStep(2);

    let logIndex = 2;
    const interval = setInterval(() => {
      if (logIndex < logs.length) {
        setTypedLogs((prev) => [...prev, logs[logIndex]]);
        setScanStep(logIndex + 1);
        logIndex++;
      } else {
        clearInterval(interval);
      }
    }, 950);

    return () => clearInterval(interval);
  }, [aiResult]);

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
          <Link href="/">
            <LogoFull />
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
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <FadeUp>
            <h1
              className="font-bold tracking-tighter"
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontSize: "clamp(36px, 6vw, 76px)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.22)", display: "block" }}>
                Machine learning-driven
              </span>
              <span style={{ color: "rgba(255, 255, 255, 0.88)", display: "block" }}>
                neural appraisal ✦ diagnostics
              </span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="mt-6 text-base text-white/50 max-w-2xl mx-auto font-body">
              Select one of our hardware profiles below to trigger our scanning pipeline. Watch the AI optical array lock the highest circular outcome instantly.
            </p>
          </FadeUp>
        </div>

        {/* Live Simulator Panel grid */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <FadeUp delay={0.4}>
              <div className="p-1.5 bg-[#161616]/80 border border-white/10 rounded-xl flex gap-1 font-ui">
                {(["phone", "laptop", "tablet"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDevice(d)}
                    className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-xs transition-all duration-200 ${
                      selectedDevice === d ? "bg-green-600 text-black shadow" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {deviceSpecs[d].name}
                  </button>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.5}>
              <div className="space-y-4 font-body border-t border-white/5 pt-6">
                {[
                  { n: 1, label: "Optical Scanner Assessment", step: 2 },
                  { n: 2, label: "State-of-Health Checks", step: 4 },
                  { n: 3, label: "Routing Outcome Locked", step: 7 },
                ].map((s) => (
                  <div key={s.n} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        scanStep >= s.step ? "bg-green-600/20 text-green-400" : "bg-white/10 text-white/60 animate-pulse"
                      }`}
                    >
                      {scanStep >= s.step ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : s.n}
                    </div>
                    <span className={`text-sm ${scanStep >= s.step ? "text-white font-semibold" : "text-white/40"}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Scanner Column */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <FadeUp delay={0.5}>
              <HolographicScanner device={selectedDevice} scanStep={scanStep} />
            </FadeUp>
          </div>

          {/* Console Column */}
          <div className="lg:col-span-4 relative">
            <FadeUp delay={0.6}>
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-30 pointer-events-none" />
              <div className="relative bg-[#111111]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-black/20 px-6 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs font-semibold text-white/40 font-mono select-none">ecoloop-ai-scan.json</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 min-h-[350px]">
                  <div className="font-mono text-[10px] text-green-400 space-y-2 border-r border-white/10 pr-3 overflow-y-auto no-scrollbar max-h-[300px]">
                    <div className="text-white/40 border-b border-white/10 pb-1 mb-2 font-bold select-none">
                      SYSTEM CONSOLE
                    </div>
                    {typedLogs.map((log, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i}
                        className={`leading-relaxed ${i === typedLogs.length - 1 ? "font-bold text-white" : ""}`}
                      >
                        <span className="text-white/30 select-none">&gt;&nbsp;</span>
                        {log}
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-col justify-between pl-2">
                    <div>
                      <div className="font-mono text-[9px] font-semibold text-white/40 mb-1">CLASSIFICATION</div>
                      {scanStep >= 8 && aiResult ? (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600/10 border border-green-600/30 px-2.5 py-1 text-xs font-bold text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.1)]"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {aiResult.outcome}
                        </motion.div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-bold text-white/50 animate-pulse">
                          Analyzing...
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 font-ui mt-4">
                      {["refurbish", "resale", "salvage", "recycle"].map((type) => {
                        const pct = (scanStep >= 8 && aiResult) ? (aiResult.confidences[type] || 0) : 0;
                        const labelMap = {
                          refurbish: "Refurbish",
                          resale: "P2P Resale",
                          salvage: "Parts Harvest",
                          recycle: "Recycling",
                        };
                        const colorMap = {
                          refurbish: "from-green-500 to-green-400",
                          resale: "from-blue-500 to-blue-400",
                          salvage: "from-yellow-500 to-yellow-400",
                          recycle: "from-red-500 to-red-400",
                        };

                        return (
                          <div key={type}>
                            <div className="flex justify-between text-[9px] font-semibold text-white/80 mb-1">
                              <span>{labelMap[type as keyof typeof labelMap]}</span>
                              <span>{pct}%</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                animate={{ width: `${pct}%` }}
                                className={`h-full bg-gradient-to-r ${colorMap[type as keyof typeof colorMap]}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
