"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Mail,
  Coins,
  Leaf,
  Cpu,
  ShoppingBag,
  Trash2,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Layers,
  Wrench,
  Camera,
  QrCode
} from "lucide-react";
import { useAuth, useBasket } from "../../context/AppContext";
import { LogoFull } from "../../components/Logo";
import InteractiveGridBg from "../../components/InteractiveGridBg";
import SideMenu from "../../components/SideMenu";
import Marquee from "../../components/Marquee";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "../../components/animations/FadeUp";
import Footer from "../../components/Footer";

function DashboardContent() {
  const { user, isAuthenticated, isLoading, logout, updateProfile } = useAuth();
  const { items, removeItem, clearBasket, totalPrice, checkout } = useBasket();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab State: "overview" | "basket" | "profile"
  const [activeTab, setActiveTab] = useState<"overview" | "basket" | "profile">("overview");

  // Profile Form States
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Checkout States
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Payout states
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Sync tab from URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "basket" || tabParam === "profile" || tabParam === "overview") {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  // Sync profile values when user loads
  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
    }
  }, [user]);

  // Handle Unauthenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
      </div>
    );
  }

  // Form Submission
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName || !profileEmail) return;
    setIsUpdating(true);
    setTimeout(() => {
      updateProfile(profileName, profileEmail);
      setIsUpdating(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    }, 1000);
  };

  // Claim Wallet balance
  const handleClaimPayout = () => {
    setIsClaiming(true);
    setTimeout(() => {
      setIsClaiming(false);
      setClaimSuccess(true);
      setTimeout(() => setClaimSuccess(false), 4000);
    }, 1500);
  };

  // Cart Checkout Action
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const success = await checkout();
      if (success) {
        setCheckoutSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 font-sans relative overflow-x-hidden selection:bg-green-500 selection:text-slate-950">
      <InteractiveGridBg />
      <SideMenu />
      <Marquee />

      {/* Dynamic Checkout Success Overlay */}
      <AnimatePresence>
        {checkoutSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#080808]/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111111] border border-green-500/20 max-w-md w-full rounded-[2.5rem] p-10 text-center relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-green-500/5 rounded-full blur-[80px]" />
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 mx-auto mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Transaction Certified</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6 font-body">
                Your circular sourcing transaction has been successfully recorded on the EcoLoop cryptographic ledger. Certified certificate will be routed to your email shortly.
              </p>
              <div className="bg-[#161616] border border-white/5 rounded-2xl p-4 mb-8 font-mono text-[10px] text-white/40 text-left space-y-1">
                <p>STATUS: SECURED_PAYMENT_SUCCESS</p>
                <p>BLOCK_ID: #8A72B-{Math.floor(1000 + Math.random() * 9000)}</p>
                <p>OUTCOME: REFURBISHED_COMMERCE_LOCKED</p>
              </div>
              <button
                onClick={() => {
                  setCheckoutSuccess(false);
                  setActiveTab("overview");
                }}
                className="w-full h-12 bg-green-600 hover:bg-green-500 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer"
              >
                Return to Overview
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Header */}
      <header className="absolute top-0 inset-x-0 z-40 bg-transparent py-6 border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/">
            <LogoFull />
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={logout}
              className="text-xs font-semibold text-white/40 hover:text-white/80 transition-colors border border-white/10 px-3.5 py-1.5 rounded-full cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Panel */}
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">

        {/* Profile Card Summary Banner */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-r from-[#0F172A] to-[#0A0A0A] border border-white/5 p-8 md:p-10 overflow-hidden shadow-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-[-30%] right-[-10%] w-[40%] h-[150%] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex items-center gap-6 z-10 flex-col sm:flex-row text-center sm:text-left">
            <div className="relative group">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
              <img
                src={user.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=ecoloop"}
                alt={user.name}
                className="w-20 h-20 rounded-full border-2 border-green-500/30 object-cover relative bg-slate-900"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-green-500 border-2 border-[#0F172A] flex items-center justify-center text-slate-950 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <h2 className="text-2xl font-black text-white">{user.name}</h2>
                <span className="bg-green-500/10 border border-green-500/20 text-green-400 font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full">
                  ESG LEVEL 3
                </span>
              </div>
              <p className="text-white/40 text-sm mt-1 font-body">{user.email}</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto z-10">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-center md:text-left min-w-[140px]">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1">CO2 AVERTED</span>
              <span className="font-mono text-xl font-black text-green-400">{user.carbonAverted} kg</span>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-center md:text-left min-w-[140px]">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1">DEVICES RUN</span>
              <span className="font-mono text-xl font-black text-white">{user.devicesAppraisedCount}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Circular Overview", icon: TrendingUp },
            { id: "basket", label: `Refurbished Basket (${items.length})`, icon: ShoppingBag },
            { id: "profile", label: "Profile Registry", icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-6 py-4 border-b-2 font-semibold text-sm transition-all whitespace-nowrap cursor-pointer ${isActive
                    ? "border-green-500 text-green-400 bg-green-500/5"
                    : "border-transparent text-slate-400 hover:text-white"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Bento: Earnings Widget */}
              <div className="lg:col-span-4 bg-[#111111]/85 border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between shadow-xl min-h-[300px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mb-6">
                    <Coins className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1.5">Wallet Payout Balance</span>
                  <h3 className="font-mono text-4xl font-black text-white">${user.payouts.toFixed(2)}</h3>
                  <p className="text-xs text-white/40 mt-3 font-body">Earned by recycling and trading salvaged hardware.</p>
                </div>

                <div className="mt-8">
                  {claimSuccess ? (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Funds Released to Wallet!</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleClaimPayout}
                      disabled={user.payouts <= 0 || isClaiming}
                      className="w-full h-11 bg-green-500 hover:bg-green-400 disabled:bg-white/5 disabled:text-white/20 disabled:border-white/5 disabled:cursor-not-allowed border border-transparent text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isClaiming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim Circular Payout"}
                    </button>
                  )}
                </div>
              </div>

              {/* Right Bento: Diagnostics Scans List */}
              <div className="lg:col-span-8 bg-[#111111]/85 border border-white/5 rounded-[2rem] p-8 shadow-xl flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-ui text-lg font-bold text-white">Appraised Electronics</h4>
                      <p className="text-xs text-white/40 mt-0.5 font-body">AI Scan outcomes from your circular portal</p>
                    </div>
                  </div>
                  <Link
                    href="/showcase"
                    className="text-xs font-bold text-green-400 hover:text-green-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Run AI Appraisal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex-1 overflow-x-auto">
                  {user.devicesList.length === 0 ? (
                    <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 rounded-2xl bg-black/25">
                      <QrCode className="w-8 h-8 text-white/20 mb-3" />
                      <p className="text-sm font-semibold text-white/50">No appraised hardware found</p>
                      <p className="text-xs text-white/30 mt-1 max-w-xs font-body">Scanned electronics diagnostics ledger items appear automatically.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5 min-w-[500px]">
                      {user.devicesList.map((device) => {
                        const isRefurb = device.status === "Refurbished";
                        const isHarvest = device.status === "Harvested";
                        const isRecycle = device.status === "Recycled";

                        return (
                          <div key={device.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0 group">
                            <div className="flex items-center gap-3.5">
                              <div className="w-11 h-11 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center relative overflow-hidden">
                                {isRefurb && <Layers className="w-5 h-5 text-green-400" />}
                                {isHarvest && <Wrench className="w-5 h-5 text-yellow-400" />}
                                {isRecycle && <Leaf className="w-5 h-5 text-blue-400" />}
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">{device.name}</h5>
                                <div className="flex gap-2 items-center mt-1">
                                  <span className="font-mono text-[9px] text-white/30 tracking-widest">{device.id}</span>
                                  <span className="w-1 h-1 rounded-full bg-white/25" />
                                  <span className="text-[10px] text-white/40">{device.date}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <span className={`inline-flex rounded px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest border uppercase ${isRefurb ? "bg-green-500/10 border-green-500/20 text-green-400" :
                                    isHarvest ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                                      "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                  }`}>
                                  {device.status}
                                </span>
                                <span className="block font-mono text-[10px] text-white/30 mt-1 font-bold">{device.grade}</span>
                              </div>

                              <div className="min-w-[70px] text-right font-mono font-bold text-sm text-white">
                                {device.payout > 0 ? `+$${device.payout.toFixed(2)}` : "Free Recycling"}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "basket" && (
            <motion.div
              key="basket"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Basket list */}
              <div className="lg:col-span-8 bg-[#111111]/85 border border-white/5 rounded-[2rem] p-8 shadow-xl flex flex-col justify-between min-h-[400px]">
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                    <h4 className="font-ui text-lg font-bold text-white flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-green-400" />
                      <span>Refurbished Products Basket</span>
                    </h4>
                    <span className="font-mono text-xs text-white/40">{items.length} unique items</span>
                  </div>

                  {items.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-4">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <p className="text-base font-semibold text-white/50">Your basket is empty</p>
                      <p className="text-xs text-white/30 mt-1.5 max-w-xs font-body leading-relaxed">
                        Sourced refurbished premium hardware and parts will appear here.
                      </p>
                      <Link
                        href="/marketplace"
                        className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-green-500 hover:bg-green-400 px-5 text-xs font-bold text-slate-950 transition-colors"
                      >
                        Explore Marketplace
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {items.map((item) => (
                        <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="inline-block bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[9px] font-bold text-white/60">
                                {item.type}
                              </span>
                              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{item.role}</span>
                            </div>
                            <h5 className="text-base font-bold text-white mt-2">{item.title}</h5>
                            <span className="text-xs text-white/40 mt-1 block">Qty: {item.quantity}</span>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right font-mono font-bold text-sm text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-9 h-9 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="mt-8 pt-4 border-t border-white/5 flex justify-end">
                    <button
                      onClick={clearBasket}
                      className="text-xs font-semibold text-red-400/80 hover:text-red-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Empty Basket</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Sourcing Summary panel */}
              <div className="lg:col-span-4 bg-[#111111]/85 border border-white/5 rounded-[2rem] p-8 shadow-xl flex flex-col justify-between relative overflow-hidden min-h-[350px]">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />

                <div>
                  <h4 className="font-ui text-base font-bold text-white mb-6">Circular Checkout Summary</h4>
                  <div className="space-y-3 font-body">
                    <div className="flex justify-between text-xs text-white/40">
                      <span>Sourced Items Subtotal</span>
                      <span className="font-mono text-white/60">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-white/40">
                      <span>Eco Taxes & Carbon Fees</span>
                      <span className="font-mono text-green-400">FREE (Eco-Exempt)</span>
                    </div>
                    <div className="flex justify-between text-xs text-white/40">
                      <span>Refurbished Product Warranties</span>
                      <span className="font-mono text-white/60">INCLUDED</span>
                    </div>
                    <div className="border-t border-white/5 pt-3 mt-3 flex justify-between text-sm font-bold">
                      <span className="text-white/60">Total Cost</span>
                      <span className="font-mono text-green-400">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <button
                    onClick={handleCheckout}
                    disabled={items.length === 0 || isCheckingOut}
                    className="w-full h-12 bg-green-500 hover:bg-green-400 disabled:bg-white/5 disabled:text-white/20 disabled:cursor-not-allowed border border-transparent text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isCheckingOut ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4.5 h-4.5" />
                        <span>Checkout Securely</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-white/30 text-center font-mono uppercase tracking-wider">
                    Secured by cryptographic ledger routing
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl bg-[#111111]/85 border border-white/5 rounded-[2rem] p-8 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[150%] bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />

              <div className="border-b border-white/5 pb-4 mb-6">
                <h4 className="font-ui text-lg font-bold text-white">Profile Registry Details</h4>
                <p className="text-xs text-white/40 mt-1 font-body">Manage account specifics and circular identity card parameters</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">
                    Display Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full h-11 pl-11 pr-4 bg-black/40 border border-white/10 focus:border-green-500 rounded-xl text-sm outline-none transition-all text-white font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full h-11 pl-11 pr-4 bg-black/40 border border-white/10 focus:border-green-500 rounded-xl text-sm outline-none transition-all text-white font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4 flex-col sm:flex-row">
                  {updateSuccess ? (
                    <span className="text-xs font-bold text-green-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4.5 h-4.5" />
                      <span>Profile successfully updated in database!</span>
                    </span>
                  ) : (
                    <span className="text-xs text-white/30 font-body">Changes will persist to local memory immediately.</span>
                  )}

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full sm:w-auto h-11 bg-green-500 hover:bg-green-400 disabled:bg-white/5 border border-transparent text-slate-950 font-bold px-8 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Save Profile Details</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
