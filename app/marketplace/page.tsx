"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Leaf,
  ArrowLeft,
  ArrowRight,
  Cpu,
  Layers,
  Wrench,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import { useBasket } from "../../context/AppContext";
import { LogoFull } from "../../components/Logo";
import Footer from "../../components/Footer";
import InteractiveGridBg from "../../components/InteractiveGridBg";
import SideMenu from "../../components/SideMenu";
import Marquee from "../../components/Marquee";
import { FadeUp } from "../../components/animations/FadeUp";
import { motion, AnimatePresence } from "framer-motion";

const products = [
  {
    title: "iPhone 14 Pro",
    type: "Refurbished",
    role: "B2C Seller",
    price: "$649",
    tagCls: "bg-green-400/10 border-green-400/20 text-green-400",
    specs: ["128GB Space Black", "90% Battery Health", "1 Year EcoLoop Warranty"],
    visual: (
      <div className="w-24 h-44 rounded-[2rem] border-[4px] border-white/20 bg-black/30 flex flex-col p-2 relative shadow-lg">
        <div className="w-10 h-3.5 bg-black/50 rounded-full mx-auto mb-1 border border-white/10" />
        <div className="flex-1 rounded-[1.5rem] bg-black/30 flex flex-col items-center justify-center p-3 relative overflow-hidden border border-white/10">
          <span className="text-[10px] font-bold text-white/50">IPHONE 14</span>
          <Cpu className="w-4 h-4 text-green-400 mt-2" />
          <span className="text-[9px] font-semibold text-green-400 mt-2 font-mono">GRADE A</span>
        </div>
      </div>
    ),
    radial: "rgba(74,222,128,0.1)",
    borderHover: "hover:border-green-400/50",
    btnColor: "bg-green-500 hover:bg-green-400 text-black",
  },
  {
    title: "Galaxy S23 Ultra",
    type: "Pre-Owned",
    role: "B2B Verified",
    price: "$580",
    tagCls: "bg-blue-400/10 border-blue-400/20 text-blue-400",
    specs: ["256GB Phantom Black", "Light cosmetic scuffs (Grade B)", "Fully Audited Diagnostics"],
    visual: (
      <div className="w-24 h-44 rounded-2xl border-[4px] border-white/20 bg-black/30 flex flex-col p-2 relative shadow-lg">
        <div className="w-8 h-1 bg-black/50 rounded-full mx-auto mb-1.5 border border-white/10" />
        <div className="flex-1 rounded-lg bg-black/30 flex flex-col items-center justify-center p-3 relative overflow-hidden border border-white/10">
          <span className="text-[9px] font-bold text-white/50">S23 ULTRA</span>
          <Layers className="w-4 h-4 text-blue-400 mt-2" />
          <span className="text-[9px] font-semibold text-blue-400 mt-2 font-mono">GRADE B</span>
        </div>
      </div>
    ),
    radial: "rgba(59,130,246,0.1)",
    borderHover: "hover:border-blue-400/50",
    btnColor: "bg-blue-500 hover:bg-blue-400 text-black",
  },
  {
    title: "MacBook Air M2 Screen",
    type: "Salvaged Parts",
    role: "B2B Certified",
    price: "$199",
    tagCls: "bg-yellow-400/10 border-yellow-400/20 text-yellow-400",
    specs: ["OEM Grade A+ Salvage", "Fully tested, no dead pixels", "6-Month Parts Warranty"],
    visual: (
      <div className="w-36 h-28 rounded-lg border-2 border-white/20 bg-black/30 flex flex-col p-1.5 relative shadow-lg">
        <div className="flex-1 rounded bg-black/30 flex flex-col items-center justify-center p-2 relative overflow-hidden border border-white/10">
          <span className="text-[9px] font-bold text-white/50">MACBOOK M2</span>
          <Wrench className="w-3.5 h-3.5 text-yellow-400 mt-1" />
          <span className="text-[8px] font-semibold text-yellow-400 mt-1 font-mono">RECLAIMED</span>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-b mt-1.5" />
      </div>
    ),
    radial: "rgba(250,204,21,0.08)",
    borderHover: "hover:border-yellow-400/50",
    btnColor: "bg-yellow-500 hover:bg-yellow-400 text-black",
  },
];

export default function MarketplacePage() {
  const { addItem, items } = useBasket();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSourceItem = (p: typeof products[0]) => {
    addItem({
      title: p.title,
      price: p.price,
      type: p.type,
      role: p.role
    });
    setToastMessage(`✦ Added "${p.title}" to Basket!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 font-sans relative overflow-x-hidden selection:bg-green-500 selection:text-slate-950">
      {/* Dynamic Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#161616] border border-green-500/30 text-green-400 px-6 py-3 rounded-full text-xs font-bold shadow-[0_0_30px_rgba(34,197,94,0.15)] flex items-center gap-2.5 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

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
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard?tab=basket"
              className="flex items-center gap-2 text-xs font-semibold text-green-400 hover:text-green-300 bg-green-500/10 border border-green-500/20 px-3.5 py-1.5 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Basket ({items.length})</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
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
                Verified circular trade
              </span>
              <span style={{ color: "rgba(255, 255, 255, 0.88)", display: "block" }}>
                your gateway to ✦ certified commerce
              </span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="mt-6 text-base text-white/50 max-w-2xl mx-auto font-body">
              Browse fully certified devices or source wholesale, harvested parts directly from our automated hubs with complete environmental transparency ledger.
            </p>
          </FadeUp>
        </div>

        {/* 3 Product visual cards catalog */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <FadeUp key={p.title} delay={0.1 + i * 0.08}>
              <div className={`bg-[#161616]/80 border border-white/10 rounded-2xl overflow-hidden ${p.borderHover} transition-all duration-300 flex flex-col h-full shadow-2xl`}>
                <div className="h-56 bg-black/20 flex flex-col items-center justify-center relative p-6 overflow-hidden">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${p.radial} 0%, transparent 60%)`,
                    }}
                  />
                  {p.visual}
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-bold ${p.tagCls}`}>
                        {p.type}
                      </span>
                      <span className="text-xs font-semibold text-white/40 font-mono">{p.role}</span>
                    </div>
                    <h4 className="font-ui text-xl font-bold text-white mt-4">{p.title}</h4>
                    <ul className="text-xs text-white/50 mt-4 space-y-2 leading-relaxed font-body">
                      {p.specs.map((spec, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-white">{p.price}</span>
                    <button
                      onClick={() => handleSourceItem(p)}
                      className={`inline-flex items-center justify-center rounded-lg ${p.btnColor} font-semibold text-xs py-2.5 px-4 transition-colors cursor-pointer`}
                    >
                      Source Item
                    </button>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
