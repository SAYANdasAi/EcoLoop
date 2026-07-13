"use client";

import React, { useState, useEffect } from "react";
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
  Heart,
  MessageSquare,
  Lock,
  Eye,
  Sparkles,
  X,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { useAuth, useBasket } from "../../context/AppContext";
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
  const [customProducts, setCustomProducts] = useState<any[]>([]);
  const { user, toggleWishlist, sendMessage, upgradePlan, chatMessages } = useAuth();
  const { addItem, items } = useBasket();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const plan = user?.plan || "free";
  const role = user?.role || "buyer";

  // Modal States
  const [showUpgradeModal, setShowUpgradeModal] = useState<string | null>(null);
  const [activeChatPartner, setActiveChatPartner] = useState<string | null>(null);
  const [activeChatPartnerName, setActiveChatPartnerName] = useState<string>("");
  const [chatText, setChatText] = useState("");
  const [aiSuggestionProduct, setAiSuggestionProduct] = useState<any | null>(null);
  const [razorpayProduct, setRazorpayProduct] = useState<any | null>(null);
  const [razorpayStep, setRazorpayStep] = useState<"payment_method" | "processing" | "success" | null>(null);
  const [razorpayMethod, setRazorpayMethod] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.products) {
          setCustomProducts(data.products);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  const allProducts = [
    ...products.map(p => ({
      ...p,
      id: p.title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      sellerName: "Circular Automated Hub",
      sellerEmail: "hub@ecoloop.ai",
      specs: p.specs
    })),
    ...customProducts
  ];

  const handleToggleWishlist = (p: any) => {
    if (!user) {
      setToastMessage("✦ Please sign in to wishlist items");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    const pid = p.id || p.title.toLowerCase().replace(/[^a-z0-9]/g, "-");
    toggleWishlist(pid);
    const inWishlist = user.wishlist?.includes(pid);
    setToastMessage(!inWishlist ? `✦ Added "${p.title}" to Wishlist!` : `✦ Removed "${p.title}" from Wishlist`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSourceItem = (p: any) => {
    if (user?.role === "seller") {
      setToastMessage("✦ Sellers cannot source/buy items!");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setRazorpayProduct(p);
    setRazorpayStep("payment_method");
  };

  const handleViewSellerDetails = (p: any) => {
    if (!user) {
      setToastMessage("✦ Please log in to view seller details");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    if (user.plan === "free") {
      setShowUpgradeModal("pro");
    } else {
      setToastMessage(`✦ Seller Details: ${p.sellerName} (${p.sellerEmail})`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleChatSeller = (p: any) => {
    if (!user) {
      setToastMessage("✦ Please log in to chat with sellers");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    if (user.plan === "free") {
      setShowUpgradeModal("pro");
    } else {
      setActiveChatPartner(p.sellerEmail);
      setActiveChatPartnerName(p.sellerName);
    }
  };

  const handleRequestAiSuggestion = (p: any) => {
    if (!user) {
      setToastMessage("✦ Please log in to request AI suggestions");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    if (user.plan !== "smart") {
      setShowUpgradeModal("smart");
    } else {
      setAiSuggestionProduct(p);
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !activeChatPartner || !user) return;
    sendMessage(user.email, activeChatPartner, chatText.trim());
    setChatText("");
  };

  const handleSelectRazorpayMethod = (method: string) => {
    setRazorpayMethod(method);
    setRazorpayStep("processing");
    setTimeout(() => {
      setRazorpayStep("success");
    }, 2000);
  };

  const handleCompleteRazorpayPayment = () => {
    addItem({
      title: razorpayProduct.title,
      price: razorpayProduct.price,
      type: razorpayProduct.type,
      role: razorpayProduct.role
    });
    setRazorpayStep(null);
    setRazorpayProduct(null);
    setToastMessage("✦ Sourcing complete! Added to Basket.");
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

        {/* Product visual cards catalog */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
          {allProducts.map((p, i) => {
            const pid = p.id || p.title.toLowerCase().replace(/[^a-z0-9]/g, "-");
            const inWishlist = user?.wishlist?.includes(pid) || false;
            const hasAccessToSeller = plan === "pro" || plan === "smart";
            const hasAiSuggestions = plan === "smart";

            return (
              <FadeUp key={`${p.title}-${i}`} delay={0.1 + i * 0.05}>
                <div className={`bg-[#161616]/80 border border-white/10 rounded-2xl overflow-hidden hover:border-green-500/40 transition-all duration-300 flex flex-col h-full shadow-2xl relative group`}>
                  
                  {/* Floating Heart / Wishlist icon */}
                  <button
                    onClick={() => handleToggleWishlist(p)}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/50 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
                  </button>

                  <div className="h-56 bg-black/20 flex flex-col items-center justify-center relative p-6 overflow-hidden">
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${p.radial || "rgba(34,197,94,0.06)"} 0%, transparent 60%)`,
                      }}
                    />
                    {p.visual || (
                      <img src={p.image} alt={p.title} className="w-24 h-44 rounded-2xl object-cover border-2 border-white/20 bg-black/30 shadow-lg" />
                    )}
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${p.tagCls || "bg-green-400/10 border-green-400/20 text-green-400"}`}>
                          {p.type}
                        </span>
                        <span className="text-xs font-semibold text-white/40 font-mono">{p.role}</span>
                      </div>

                      <Link href={`/marketplace/${pid}`} className="hover:underline">
                        <h4 className="font-ui text-xl font-bold text-white mt-4 hover:text-green-400 transition-colors">{p.title}</h4>
                      </Link>
                      
                      <ul className="text-xs text-white/50 mt-4 space-y-2 leading-relaxed font-body">
                        {p.specs.map((spec: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Seller Details section */}
                      <div className="mt-5 p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-white/30 uppercase font-mono tracking-wider text-[9px]">Seller Details</span>
                          {!hasAccessToSeller && (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-yellow-500 uppercase">
                              <Lock className="w-3 h-3" /> Locked
                            </span>
                          )}
                        </div>
                        {hasAccessToSeller ? (
                          <div className="text-white/70 font-semibold font-body mt-1">
                            <p>{p.sellerName}</p>
                            <p className="text-[10px] text-white/40 font-mono mt-0.5">{p.sellerEmail}</p>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleViewSellerDetails(p)}
                            className="mt-1 text-green-400 hover:text-green-300 font-bold transition-colors cursor-pointer text-left block text-[10px] uppercase tracking-wider"
                          >
                            Upgrade to reveal details &rarr;
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/5 flex flex-col gap-3">
                      
                      {/* Premium AI suggestions button */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleChatSeller(p)}
                          className="flex-1 h-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-white/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Chat Seller
                        </button>

                        <button
                          onClick={() => handleRequestAiSuggestion(p)}
                          className={`flex-1 h-9 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans ${
                            hasAiSuggestions
                              ? "bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400"
                              : "bg-white/5 hover:bg-white/10 border border-white/10 text-white/40"
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          {!hasAiSuggestions && <Lock className="w-3 h-3" />}
                          AI suggestion
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono text-2xl font-bold text-white">{p.price}</span>
                        {role === "seller" ? (
                          <Link
                            href="/dashboard?tab=my-listings"
                            className="inline-flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:border-green-400/50 hover:bg-green-500/5 text-slate-400 hover:text-green-400 font-bold text-xs py-2.5 px-4 transition-all"
                          >
                            Supplier Hub
                          </Link>
                        ) : (
                          <Link
                            href={`/marketplace/${pid}`}
                            className="inline-flex items-center justify-center rounded-lg bg-green-500 hover:bg-green-400 text-slate-950 font-bold text-xs py-2.5 px-5 transition-colors cursor-pointer font-sans"
                          >
                            Source Item
                          </Link>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              </FadeUp>
            );
          })}
        </div>

      </div>

      {/* ==========================================
          MODALS & OVERLAYS
      ========================================== */}
      <AnimatePresence>
        
        {/* Upgrade Plan Modal */}
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#080808]/90 backdrop-blur-xl flex items-center justify-center p-6 font-sans"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111111] border border-yellow-500/20 max-w-md w-full rounded-[2rem] p-8 relative overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setShowUpgradeModal(null)}
                className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="absolute top-[-25%] left-[-20%] w-[60%] h-[60%] bg-yellow-500/5 rounded-full blur-[80px]" />
              
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 mb-6">
                <ShieldAlert className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">Subscription Required</h3>
              <p className="text-xs text-white/50 leading-relaxed mb-6 font-body">
                The feature you are trying to access requires upgrading your circular profile subscription. Choose a plan to unlock details, messaging, and AI capabilities.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    upgradePlan("pro");
                    setShowUpgradeModal(null);
                    setToastMessage("✦ Account successfully upgraded to PRO plan!");
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-between px-4 cursor-pointer"
                >
                  <span>Pro Plan (Access supplier & message chat)</span>
                  <span className="font-mono text-green-400 font-extrabold">$19/mo</span>
                </button>
                <button
                  onClick={() => {
                    upgradePlan("smart");
                    setShowUpgradeModal(null);
                    setToastMessage("✦ Account successfully upgraded to SMART plan!");
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="w-full h-12 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded-xl font-bold text-xs transition-all flex items-center justify-between px-4 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Smart Plan (Unlocks AI suggestions)</span>
                  <span className="font-mono text-green-400 font-extrabold">$49/mo</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Live messaging modal */}
        {activeChatPartner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#080808]/90 backdrop-blur-xl flex items-center justify-center p-6 font-sans"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111111] border border-white/5 max-w-lg w-full rounded-[2rem] p-6 shadow-2xl flex flex-col justify-between h-[480px] relative overflow-hidden"
            >
              <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[100%] bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />

              <div className="border-b border-white/5 pb-3 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white">Chat with {activeChatPartnerName}</h4>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">{activeChatPartner}</p>
                </div>
                <button
                  onClick={() => setActiveChatPartner(null)}
                  className="text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-grow overflow-y-auto space-y-3 py-4 pr-1 flex flex-col no-scrollbar">
                {(() => {
                  const chatId = [user?.email, activeChatPartner].sort().join("_");
                  const msgs = chatMessages[chatId] || [];
                  if (msgs.length === 0) {
                    return (
                      <div className="flex-grow flex items-center justify-center text-center text-xs text-white/30 font-body">
                        No messages yet. Send a message to coordinate diagnostics verification!
                      </div>
                    );
                  }
                  return msgs.map((m: any) => {
                    const isMe = m.sender === user?.email;
                    return (
                      <div key={m.id} className={`flex flex-col max-w-[80%] ${isMe ? "self-end items-end" : "self-start items-start"}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed font-body ${
                          isMe
                            ? "bg-green-600 text-slate-950 rounded-tr-none font-semibold"
                            : "bg-white/10 text-white/95 rounded-tl-none"
                        }`}>
                          {m.text}
                        </div>
                        <span className="text-[9px] text-white/30 font-mono mt-1 px-1">{m.timestamp}</span>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendChatMessage} className="flex gap-2 border-t border-white/5 pt-3">
                <input
                  type="text"
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  placeholder="Type your secure message..."
                  className="flex-grow h-11 px-4 bg-black/40 border border-white/10 focus:border-green-500 rounded-xl text-xs outline-none text-white transition-all font-body"
                />
                <button
                  type="submit"
                  className="h-11 bg-green-500 hover:bg-green-400 text-slate-950 font-bold px-5 rounded-xl text-xs transition-colors cursor-pointer font-sans"
                >
                  Send
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* AI Valuation Suggestion Modal */}
        {aiSuggestionProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#080808]/90 backdrop-blur-xl flex items-center justify-center p-6 font-sans"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111111] border border-blue-500/20 max-w-md w-full rounded-[2rem] p-8 relative overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setAiSuggestionProduct(null)}
                className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute top-[-25%] left-[-20%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[80px]" />

              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>

              <h3 className="text-xl font-black text-white mb-2 tracking-wide font-ui">EcoLoop AI Deal Advice</h3>
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-mono mb-6">{aiSuggestionProduct.title}</p>

              <div className="space-y-4 text-xs font-body leading-relaxed text-white/70">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <p className="font-semibold text-white mb-1.5">✦ Sourcing Recommendation:</p>
                  <p>This item is currently listed at <span className="font-mono text-white font-bold">{aiSuggestionProduct.price}</span>. AI historical scans place the median value of comparable Grade A components at <span className="font-mono text-green-400">$685</span>. Sourcing this listing generates a potential <span className="text-green-400 font-bold">8.4% cost savings margin</span>.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#161616] border border-white/5 space-y-2 font-mono text-[10px] text-white/50">
                  <p>AI_CONFIDENCE_SCORE: 96/100</p>
                  <p>LEDGER_TRUST_INDEX: EXCELLENT (99.2%)</p>
                  <p>CIRCULAR_CARBON_AVERTED: ~14.6 KG CO2e</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setAiSuggestionProduct(null);
                  handleSourceItem(aiSuggestionProduct);
                }}
                className="w-full h-12 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl text-xs mt-6 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans"
              >
                <ShoppingBag className="w-4 h-4" />
                Source this deal now
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Razorpay Checkout Modal */}
        {razorpayProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#080808]/90 backdrop-blur-xl flex items-center justify-center p-6 font-sans text-slate-100"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111111] border border-white/5 max-w-sm w-full rounded-[2rem] overflow-hidden shadow-2xl relative"
            >
              
              {/* Razorpay brand header */}
              <div className="bg-[#1C2434] p-6 text-center border-b border-white/5">
                <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase font-mono">Razorpay Secure Checkout</span>
                <h3 className="text-lg font-black text-white mt-1.5 truncate">{razorpayProduct.title}</h3>
                <p className="font-mono text-2xl font-black text-green-400 mt-2">{razorpayProduct.price}</p>
              </div>

              <div className="p-6">
                
                {/* Method selector */}
                {razorpayStep === "payment_method" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-2">Select Payment Method</span>
                    
                    <button
                      onClick={() => handleSelectRazorpayMethod("UPI")}
                      className="w-full h-12 rounded-xl border border-white/10 hover:border-green-500/20 bg-black/20 hover:bg-green-500/5 transition-all text-xs font-bold flex items-center justify-between px-4 cursor-pointer"
                    >
                      <span>UPI (GooglePay, PhonePe)</span>
                      <span className="text-[10px] text-white/40 font-mono">Instant routing</span>
                    </button>

                    <button
                      onClick={() => handleSelectRazorpayMethod("CARD")}
                      className="w-full h-12 rounded-xl border border-white/10 hover:border-green-500/20 bg-black/20 hover:bg-green-500/5 transition-all text-xs font-bold flex items-center justify-between px-4 cursor-pointer"
                    >
                      <span>Credit / Debit Card</span>
                      <span className="text-[10px] text-white/40 font-mono">VISA, Mastercard</span>
                    </button>

                    <button
                      onClick={() => handleSelectRazorpayMethod("NETBANKING")}
                      className="w-full h-12 rounded-xl border border-white/10 hover:border-green-500/20 bg-black/20 hover:bg-green-500/5 transition-all text-xs font-bold flex items-center justify-between px-4 cursor-pointer"
                    >
                      <span>Netbanking</span>
                      <span className="text-[10px] text-white/40 font-mono">Secure banking portals</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setRazorpayStep(null);
                        setRazorpayProduct(null);
                      }}
                      className="w-full h-10 text-white/40 hover:text-white text-xs font-bold text-center mt-2 transition-colors cursor-pointer"
                    >
                      Cancel Checkout
                    </button>
                  </div>
                )}

                {/* Processing Spinner */}
                {razorpayStep === "processing" && (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                    <p className="text-sm font-semibold text-white">Contacting bank servers...</p>
                    <p className="text-xs text-white/40 mt-1 font-mono uppercase tracking-wider">Method: {razorpayMethod}</p>
                  </div>
                )}

                {/* Success Panel */}
                {razorpayStep === "success" && (
                  <div className="py-6 flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 mb-4">
                      <CheckCircle2 className="w-8 h-8 animate-bounce" />
                    </div>
                    <h4 className="text-lg font-black text-white">Payment Successful</h4>
                    <p className="text-xs text-white/40 mt-1.5 max-w-[200px] leading-relaxed font-body">Your payment has been completed and verified on Razorpay secure servers.</p>
                    
                    <div className="bg-black/30 border border-white/5 rounded-xl p-3 w-full my-6 text-left font-mono text-[9px] text-white/40 space-y-1">
                      <p>REF_ID: pay_EL_{Math.random().toString(36).substring(2, 12).toUpperCase()}</p>
                      <p>GATEWAY: RAZORPAY_API_v3</p>
                    </div>

                    <button
                      onClick={handleCompleteRazorpayPayment}
                      className="w-full h-11 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer font-sans"
                    >
                      Complete Transaction &rarr;
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
      <Footer />
    </div>
  );
}
