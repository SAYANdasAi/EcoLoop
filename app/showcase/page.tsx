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
import InteractiveGridBg from "../../components/InteractiveGridBg";
import SideMenu from "../../components/SideMenu";
import Marquee from "../../components/Marquee";
import { FadeUp } from "../../components/animations/FadeUp";

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
      ? "text-yellow-400 animate-pulse"
      : "text-slate-600"
    : device === "phone"
    ? "text-yellow-500"
    : "text-red-500";

  const batteryGradeColor = !isFinished
    ? scanStep === 5
      ? "text-yellow-400 animate-pulse"
      : "text-slate-600"
    : device === "phone"
    ? "text-yellow-500"
    : device === "laptop"
    ? "text-yellow-500"
    : "text-red-500";

  const cameraGradeColor = !isFinished
    ? scanStep === 6
      ? "text-yellow-400 animate-pulse"
      : "text-slate-600"
    : "text-green-500";

  const chassisGradeColor = !isFinished
    ? scanStep === 7
      ? "text-yellow-400 animate-pulse"
      : "text-slate-600"
    : device === "phone"
    ? "text-yellow-500"
    : device === "laptop"
    ? "text-yellow-500"
    : "text-red-500";

  return (
    <div className="relative w-full max-w-[280px] aspect-[4/5] bg-black/60 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
      {/* Sci-fi tech border corners */}
      <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-green-500/50" />
      <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-green-500/50" />
      <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-green-500/50" />
      <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-green-500/50" />
      <span className="absolute top-3 left-6 font-mono text-[9px] text-white/30 uppercase select-none">
        Appraisal Blueprint v2.0
      </span>

      {/* Sweeping Laser Beam */}
      {isScanning && (
        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_10px_rgba(74,222,128,0.8)] z-20 pointer-events-none animate-bounce" />
      )}

      {/* Device Vector Silhouette and target dots */}
      <div className="relative w-full flex-1 flex items-center justify-center z-10 py-4">
        {device === "phone" && (
          <div className="relative w-36 h-64 border-4 border-slate-700/80 rounded-[2.2rem] bg-slate-900/40 p-2 shadow-2xl flex flex-col justify-between transition-all">
            <div className="w-16 h-4 bg-slate-800 rounded-full mx-auto" />
            <div className="flex-1 rounded-[1.8rem] border border-slate-800 bg-slate-950/20 relative flex items-center justify-center overflow-hidden mt-1">
              <div className={`absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${screenGradeColor}`}>
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
              </div>
              <div className={`absolute top-[60%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${batteryGradeColor}`}>
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
              </div>
              <div className={`absolute top-[18%] left-[24%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${cameraGradeColor}`}>
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
              </div>
              <div className={`absolute top-[80%] left-[30%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${chassisGradeColor}`}>
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
              </div>
            </div>
          </div>
        )}

        {device === "laptop" && (
          <div className="relative w-52 h-44 flex flex-col justify-end">
            <div className="w-[180px] h-[110px] border-4 border-slate-700/80 rounded-t-xl bg-slate-900/40 mx-auto relative p-1.5 flex items-center justify-center shadow-xl">
              <div className="flex-1 h-full rounded-t border border-slate-800 bg-slate-950/20 relative">
                <div className={`absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${screenGradeColor}`}>
                  <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
                </div>
              </div>
            </div>
            <div className="w-full h-4 border-2 border-slate-700/80 bg-slate-800 rounded-t relative">
              <div className="w-20 h-1 bg-slate-950 rounded-b mx-auto" />
              <div className={`absolute top-[-30px] left-[20%] cursor-pointer z-10 transition-colors ${batteryGradeColor}`}>
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
              </div>
              <div className={`absolute top-[-30px] right-[20%] cursor-pointer z-10 transition-colors ${chassisGradeColor}`}>
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
              </div>
            </div>
          </div>
        )}

        {device === "tablet" && (
          <div className="relative w-44 h-56 border-4 border-slate-700/80 rounded-[1.5rem] bg-slate-900/40 p-2 shadow-2xl flex flex-col justify-between transition-all">
            <div className="flex-1 rounded-[1.2rem] border border-slate-800 bg-slate-950/20 relative flex items-center justify-center overflow-hidden">
              <div className={`absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${screenGradeColor}`}>
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
              </div>
              <div className={`absolute top-[75%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${batteryGradeColor}`}>
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
              </div>
              <div className={`absolute top-[18%] left-[25%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-colors ${chassisGradeColor}`}>
                <span className="block w-4 h-4 rounded-full border-2 border-current bg-black" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full mt-2 pt-2 border-t border-white/5 flex justify-between font-mono text-[9px] text-white/40">
        <span>STATUS: {isFinished ? "LOCKED" : isScanning ? "SCANNING" : "STANDBY"}</span>
        <span>SYS_TEMP: 34.2°C</span>
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

  useEffect(() => {
    // Reset simulator
    setScanStep(0);
    setTypedLogs([]);

    const logs = [
      "Initializing EcoLoop diagnostic engine...",
      `Scanning hardware profile for: ${deviceSpecs[selectedDevice].name}`,
      "Analyzing optical inputs & micro-cracks...",
      `Screen assessment: ${deviceSpecs[selectedDevice].diagnostics.screen}`,
      `Power state validation: ${deviceSpecs[selectedDevice].diagnostics.battery}`,
      `Component integrity logs parsed successfully.`,
      "Running multi-outcome neural classifier...",
      `Optimal outcome locked: ${deviceSpecs[selectedDevice].outcome}`,
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < logs.length) {
        setTypedLogs((prev) => [...prev, logs[logIndex]]);
        setScanStep(logIndex + 1);
        logIndex++;
      } else {
        clearInterval(interval);
      }
    }, 850);

    return () => clearInterval(interval);
  }, [selectedDevice]);

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
                      {scanStep >= 8 ? (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600/10 border border-green-600/30 px-2.5 py-1 text-xs font-bold text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.1)]"
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

                    <div className="space-y-3 font-ui mt-4">
                      {["refurbish", "resale", "salvage", "recycle"].map((type) => {
                        const pct = scanStep >= 8 ? deviceSpecs[selectedDevice].confidences[type as keyof typeof deviceSpecs[typeof selectedDevice]["confidences"]] : 0;
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
    </div>
  );
}
