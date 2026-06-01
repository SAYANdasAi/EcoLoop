"use client";

import React from "react";
import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";
import InteractiveGridBg from "../../components/InteractiveGridBg";
import SideMenu from "../../components/SideMenu";
import StickyCards from "../../components/StickyCards";
import Marquee from "../../components/Marquee";
import { FadeUp } from "../../components/animations/FadeUp";

export default function HowItWorksPage() {
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
      <div className="pt-32">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
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
                Reclaiming rare minerals
              </span>
              <span style={{ color: "rgba(255, 255, 255, 0.88)", display: "block" }}>
                in ✦ five ✦ circular steps
              </span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="mt-6 text-base text-white/50 max-w-2xl mx-auto font-body">
              EcoLoop eliminates e-waste by converting linear consumption loops into highly profitable, carbon-negative recovery networks.
            </p>
          </FadeUp>
        </div>

        {/* Stack-on-scroll parallax section */}
        <StickyCards />
      </div>
    </div>
  );
}
