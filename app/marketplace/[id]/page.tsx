"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Leaf,
  ArrowLeft,
  Cpu,
  Layers,
  Wrench,
  CheckCircle2,
  ShoppingBag,
  Heart,
  MessageSquare,
  Lock,
  Sparkles,
  X,
  ShieldAlert,
  Loader2,
  Check,
  Globe
} from "lucide-react";
import { useAuth, useBasket } from "../../../context/AppContext";
import { LogoFull } from "../../../components/Logo";
import Footer from "../../../components/Footer";
import InteractiveGridBg from "../../../components/InteractiveGridBg";
import SideMenu from "../../../components/SideMenu";
import Marquee from "../../../components/Marquee";
import { FadeUp } from "../../../components/animations/FadeUp";
import { motion, AnimatePresence } from "framer-motion";

// Static default products to match the main catalog
const staticProducts = [
  {
    title: "iPhone 14 Pro",
    type: "Refurbished",
    role: "B2C Seller",
    price: "$649",
    tagCls: "bg-green-400/10 border-green-400/20 text-green-400",
    specs: ["128GB Space Black", "90% Battery Health", "1 Year EcoLoop Warranty", "Fully Inspected Grade A Screen"],
    visual: (
      <div className="w-40 h-72 rounded-[3rem] border-[8px] border-white/20 bg-black/40 flex flex-col p-3 relative shadow-2xl">
        <div className="w-16 h-4 bg-black/60 rounded-full mx-auto mb-2 border border-white/10" />
        <div className="flex-1 rounded-[2.2rem] bg-black/30 flex flex-col items-center justify-center p-4 relative overflow-hidden border border-white/5">
          <span className="text-xs font-bold text-white/50">IPHONE 14</span>
          <Cpu className="w-8 h-8 text-green-400 mt-4 animate-pulse" />
          <span className="text-xs font-bold text-green-400 mt-4 font-mono tracking-wider">GRADE A</span>
        </div>
      </div>
    ),
    radial: "rgba(74,222,128,0.12)",
    borderHover: "hover:border-green-400/50",
    btnColor: "bg-green-500 hover:bg-green-400 text-black",
    carbon: 14.6,
    deviceGrade: "Grade A (Mint)"
  },
  {
    title: "Galaxy S23 Ultra",
    type: "Pre-Owned",
    role: "B2B Verified",
    price: "$580",
    tagCls: "bg-blue-400/10 border-blue-400/20 text-blue-400",
    specs: ["256GB Phantom Black", "Light cosmetic scuffs (Grade B)", "Fully Audited Diagnostics", "Certified OEM Display Glass"],
    visual: (
      <div className="w-40 h-72 rounded-3xl border-[8px] border-white/20 bg-black/40 flex flex-col p-3 relative shadow-2xl">
        <div className="w-12 h-1.5 bg-black/60 rounded-full mx-auto mb-2 border border-white/10" />
        <div className="flex-1 rounded-xl bg-black/30 flex flex-col items-center justify-center p-4 relative overflow-hidden border border-white/5">
          <span className="text-xs font-bold text-white/50">S23 ULTRA</span>
          <Layers className="w-8 h-8 text-blue-400 mt-4 animate-pulse" />
          <span className="text-xs font-bold text-blue-400 mt-4 font-mono tracking-wider">GRADE B</span>
        </div>
      </div>
    ),
    radial: "rgba(59,130,246,0.12)",
    borderHover: "hover:border-blue-400/50",
    btnColor: "bg-blue-500 hover:bg-blue-400 text-black",
    carbon: 12.2,
    deviceGrade: "Grade B (Fair)"
  },
  {
    title: "MacBook Air M2 Screen",
    type: "Salvaged Parts",
    role: "B2B Certified",
    price: "$199",
    tagCls: "bg-yellow-400/10 border-yellow-400/20 text-yellow-400",
    specs: ["OEM Grade A+ Salvage", "Fully tested, no dead pixels", "6-Month Parts Warranty", "Reclaimed from clean recycling batches"],
    visual: (
      <div className="w-56 h-40 rounded-xl border-[4px] border-white/20 bg-black/40 flex flex-col p-2.5 relative shadow-2xl">
        <div className="flex-1 rounded-lg bg-black/30 flex flex-col items-center justify-center p-3 relative overflow-hidden border border-white/5">
          <span className="text-xs font-bold text-white/50">MACBOOK M2</span>
          <Wrench className="w-7 h-7 text-yellow-400 mt-2 animate-bounce" />
          <span className="text-[10px] font-bold text-yellow-400 mt-2 font-mono tracking-wider">RECLAIMED</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-b mt-2" />
      </div>
    ),
    radial: "rgba(250,204,21,0.1)",
    borderHover: "hover:border-yellow-400/50",
    btnColor: "bg-yellow-500 hover:bg-yellow-400 text-black",
    carbon: 22.8,
    deviceGrade: "OEM Salvage"
  }
];

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { user, toggleWishlist, sendMessage, upgradePlan } = useAuth();
  const { addItem, items } = useBasket();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal & Checkout States
  const [showUpgradeModal, setShowUpgradeModal] = useState<string | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatText, setChatText] = useState("");
  const [razorpayStep, setRazorpayStep] = useState<"payment_method" | "processing" | "success" | null>(null);
  const [razorpayMethod, setRazorpayMethod] = useState<string | null>(null);

  const plan = user?.plan || "free";
  const inWishlist = user?.wishlist?.includes(id) || false;
  const hasAccessToSeller = plan === "pro" || plan === "smart";

  useEffect(() => {
    // Fetch custom products
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const custom = data.products || [];
        const allProducts = [
          ...staticProducts.map((p) => ({
            ...p,
            id: p.title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
            sellerName: "Circular Automated Hub",
            sellerEmail: "hub@ecoloop.ai",
            specs: p.specs
          })),
          ...custom
        ];

        const match = allProducts.find((p) => p.id === id);
        setProduct(match || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, [id]);

  const handleToggleWishlist = () => {
    if (!user) {
      showToast("✦ Please sign in to wishlist items");
      return;
    }
    toggleWishlist(id);
    showToast(!inWishlist ? `✦ Added to Wishlist!` : `✦ Removed from Wishlist`);
  };

  const handleAddToBasket = () => {
    if (user?.role === "seller") {
      showToast("✦ Sellers cannot buy items!");
      return;
    }
    addItem({
      title: product.title,
      price: product.price,
      type: product.type,
      role: product.role || "B2C Seller"
    });
    showToast("✦ Added to Basket!");
    setTimeout(() => {
      router.push("/dashboard?tab=basket");
    }, 1000);
  };

  const handleBuyNow = () => {
    if (user?.role === "seller") {
      showToast("✦ Sellers cannot buy items!");
      return;
    }
    setRazorpayStep("payment_method");
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
      title: product.title,
      price: product.price,
      type: product.type,
      role: product.role || "B2C Seller"
    });
    setRazorpayStep(null);
    showToast("✦ Transaction complete! Added to Basket.");
    setTimeout(() => {
      router.push("/dashboard?tab=basket");
    }, 1000);
  };

  const handleChatSeller = () => {
    if (!user) {
      showToast("✦ Please log in to chat with sellers");
      return;
    }
    if (user.plan === "free") {
      setShowUpgradeModal("pro");
    } else {
      setShowChatModal(true);
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !user || !product) return;
    sendMessage(user.email, product.sellerEmail, chatText.trim());
    setChatText("");
    setShowChatModal(false);
    showToast("✦ Message sent securely to circular supplier!");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-green-500 mb-2" />
        <span className="ml-2 font-mono text-sm">Auditing ledger assets...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-slate-100 p-6">
        <h3 className="text-xl font-bold font-ui">Circular Asset Not Found</h3>
        <p className="text-xs text-white/40 mt-1 max-w-xs text-center font-body">
          The requested product ID does not match any certified ledger entry in the database.
        </p>
        <Link
          href="/marketplace"
          className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-green-400 hover:text-green-300 bg-green-500/10 border border-green-500/20 px-5 py-2 rounded-full transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
      </div>
    );
  }

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

      <InteractiveGridBg />
      <SideMenu />
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
              href="/marketplace"
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Shop</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Product Details Section */}
      <main className="max-w-6xl mx-auto px-6 pt-36 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Glassmorphic Visual Box */}
          <div className="md:col-span-5 bg-[#161616]/80 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[440px] relative overflow-hidden shadow-2xl group">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${product.radial || "rgba(34,197,94,0.08)"} 0%, transparent 70%)`,
              }}
            />
            {product.visual ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                {product.visual}
              </motion.div>
            ) : (
              <motion.img
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={product.image}
                alt={product.title}
                className="w-44 h-76 rounded-3xl object-cover border border-white/15 bg-black/40 shadow-2xl relative z-10"
              />
            )}
            
            <div className="mt-8 text-center relative z-10">
              <span className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest block">Circular Registry ID</span>
              <span className="text-xs font-mono text-green-400 mt-1 block select-all bg-black/35 border border-white/5 px-3 py-1.5 rounded-lg font-bold">
                {product.id}
              </span>
            </div>
          </div>

          {/* Right Column: Spec Sheet & Actions */}
          <div className="md:col-span-7 space-y-8">
            <FadeUp>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`rounded-md border px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${product.tagCls || "bg-green-400/10 border-green-400/20 text-green-400"}`}>
                  {product.type}
                </span>
                <span className="text-xs font-mono font-semibold text-white/40">{product.role || "Verified Supplier"}</span>
                {product.deviceGrade && (
                  <span className="bg-white/5 border border-white/10 rounded-md px-2 py-0.5 text-[10px] font-mono text-white/70">
                    {product.deviceGrade}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-4 font-display">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mt-3">
                <span className="font-mono text-3xl font-black text-white">{product.price}</span>
                <span className="text-xs text-white/40 font-body">Includes circular taxes and audits</span>
              </div>
            </FadeUp>

            {/* Spec Sheet List */}
            <FadeUp delay={0.15}>
              <div className="border-t border-white/5 pt-6">
                <h4 className="text-xs font-bold text-white/30 uppercase tracking-wider mb-4 font-mono">Ledger Certified Audit Specs</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-white/75 font-body">
                  {product.specs?.map((spec: string, i: number) => (
                    <li key={i} className="flex items-center gap-2.5 bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>{spec}</span>
                    </li>
                  )) || (
                    <li className="flex items-center gap-2.5 bg-white/[0.01] border border-white/5 p-3 rounded-xl col-span-2 text-white/40">
                      Diagnostics cleared. Standard factory hardware layout verified.
                    </li>
                  )}
                </ul>
              </div>
            </FadeUp>

            {/* Environmental carbon score indicators */}
            <FadeUp delay={0.2}>
              <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/15 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0 mt-0.5">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-ui">Circular Impact Metrics</h4>
                  <p className="text-xs text-white/50 leading-relaxed mt-1 font-body">
                    By sourcing this reclaimed asset instead of raw production, you avoid roughly{" "}
                    <span className="text-green-400 font-mono font-bold">{product.carbon || 14.6} kg of CO2e</span> from escaping into the environment ledger.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Seller Info card */}
            <FadeUp delay={0.25}>
              <div className="p-5 rounded-2xl bg-[#161616]/90 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-wider block">Supplier Profile</span>
                  {hasAccessToSeller ? (
                    <div>
                      <span className="text-xs font-bold text-white block">{product.sellerName || "Circular Hub"}</span>
                      <span className="text-[10px] font-mono text-white/40 mt-0.5 block">{product.sellerEmail || "hub@ecoloop.ai"}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs font-bold text-white/60 block">Supplier ID: EL_VERIFIED_HUB</span>
                      <button
                        onClick={() => setShowUpgradeModal("pro")}
                        className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider hover:text-yellow-400 transition-colors mt-1 block"
                      >
                        Upgrade subscription to chat &rarr;
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={handleChatSeller}
                    className="h-10 px-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white/80 transition-all flex items-center gap-1.5 cursor-pointer font-sans"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message Supplier
                  </button>

                  <button
                    onClick={handleToggleWishlist}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-4.5 h-4.5 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>
              </div>
            </FadeUp>

            {/* Purchasing options */}
            <FadeUp delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
                {user?.role === "seller" ? (
                  <div className="flex-1 p-4 rounded-xl bg-slate-900/60 border border-white/5 text-center text-xs text-white/40 font-body">
                    You are logged in with a <strong>Supplier Store Account</strong>. Self-sourcing of trade listings is restricted.
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleAddToBasket}
                      className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-xs text-white transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                    >
                      <ShoppingBag className="w-4.5 h-4.5" />
                      Add to Basket
                    </button>

                    <button
                      onClick={handleBuyNow}
                      className="flex-1 h-12 rounded-xl bg-green-500 hover:bg-green-400 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer font-sans"
                    >
                      Secure Instant Checkout
                    </button>
                  </>
                )}
              </div>
            </FadeUp>

          </div>

        </div>
      </main>

      {/* ==========================================
          MODALS & SECURE CHECKOUTS
      ========================================== */}
      <AnimatePresence>
        
        {/* Upgrade Plan Modal */}
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#080808]/95 backdrop-blur-xl flex items-center justify-center p-6 font-sans text-slate-100"
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
                Accessing verified supplier profiles and starting direct trades requires upgrading your circular profile subscription. Choose a plan below to activate.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    upgradePlan("pro");
                    setShowUpgradeModal(null);
                    showToast("✦ Account successfully upgraded to PRO plan!");
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
                    showToast("✦ Account successfully upgraded to SMART plan!");
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

        {/* Messaging Box modal */}
        {showChatModal && (
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
              className="bg-[#111111] border border-white/5 max-w-md w-full rounded-[2rem] p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[100%] bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />

              <div className="border-b border-white/5 pb-3 flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-sm font-bold text-white">Message {product.sellerName}</h4>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">{product.sellerEmail}</p>
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendChatMessage} className="space-y-4">
                <textarea
                  rows={4}
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  placeholder="Type a secure message to request custom diagnostics, shipping ledgers, or price adjustments..."
                  className="w-full p-4 bg-black/40 border border-white/10 focus:border-green-500 rounded-xl text-xs outline-none text-white transition-all font-body resize-none"
                  required
                />
                
                <button
                  type="submit"
                  className="w-full h-11 bg-green-500 hover:bg-green-400 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer font-sans"
                >
                  Send secure message
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Razorpay Simulated Checkout modal */}
        {razorpayStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#080808]/95 backdrop-blur-xl flex items-center justify-center p-6 font-sans text-slate-100"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111111] border border-white/5 max-w-sm w-full rounded-[2.2rem] overflow-hidden shadow-2xl relative"
            >
              
              {/* Razorpay brand header */}
              <div className="bg-[#1C2434] p-6 text-center border-b border-white/5">
                <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase font-mono">Razorpay Secure Checkout</span>
                <h3 className="text-base font-black text-white mt-1.5 truncate">{product.title}</h3>
                <p className="font-mono text-2xl font-black text-green-400 mt-2">{product.price}</p>
              </div>

              <div className="p-6">
                
                {/* Method Selector */}
                {razorpayStep === "payment_method" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-2 font-mono">Select Payment Method</span>
                    
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
                      onClick={() => setRazorpayStep(null)}
                      className="w-full h-10 text-white/40 hover:text-white text-xs font-bold text-center mt-2 transition-colors cursor-pointer font-mono uppercase tracking-wider"
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
                      <Check className="w-8 h-8 text-green-400 animate-bounce" />
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
