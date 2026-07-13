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
  QrCode,
  Heart,
  MessageSquare,
  CreditCard,
  PlusCircle,
  Bookmark,
  Compass
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
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    logout, 
    updateProfile,
    toggleWishlist,
    upgradePlan,
    updateBankDetails,
    listProduct,
    chatMessages,
    sendMessage
  } = useAuth();
  const { items, removeItem, clearBasket, totalPrice, checkout, addItem } = useBasket();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab State
  const [activeTab, setActiveTab] = useState<string>("overview");

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

  // Seller Listing Device States
  const [deviceName, setDeviceName] = useState("");
  const [devicePrice, setDevicePrice] = useState("");
  const [deviceCategory, setDeviceCategory] = useState("Refurbished");
  const [deviceGrade, setDeviceGrade] = useState("Grade A");
  const [deviceSpecs, setDeviceSpecs] = useState("");
  const [deviceImage, setDeviceImage] = useState("");
  const [isListing, setIsListing] = useState(false);
  const [listSuccess, setListSuccess] = useState(false);

  // Seller Bank Config States
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [bankSuccess, setBankSuccess] = useState(false);

  // Chatting State
  const [selectedChatPartner, setSelectedChatPartner] = useState<string | null>(null);
  const [chatText, setChatText] = useState("");
  const [customProducts, setCustomProducts] = useState<any[]>([]);

  // Sync tab from URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

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

  // Sync profile & bank values when user loads
  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      if (user.bankDetails) {
        setAccountHolder(user.bankDetails.accountHolder || "");
        setBankName(user.bankDetails.bankName || "");
        setAccountNum(user.bankDetails.accountNum || "");
        setIfsc(user.bankDetails.ifsc || "");
      }
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

  // Save Bank Details
  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountHolder || !bankName || !accountNum || !ifsc) return;
    setIsSavingBank(true);
    setTimeout(() => {
      updateBankDetails({ accountHolder, bankName, accountNum, ifsc });
      setIsSavingBank(false);
      setBankSuccess(true);
      setTimeout(() => setBankSuccess(false), 3000);
    }, 1000);
  };

  // List product
  const handleListProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName || !devicePrice) return;
    setIsListing(true);
    setTimeout(() => {
      const parsedPrice = parseFloat(devicePrice) || 0;
      listProduct({
        title: deviceName,
        price: `$${parsedPrice}`,
        type: deviceCategory,
        role: `${deviceGrade} Listed`,
        specs: deviceSpecs ? deviceSpecs.split(",").map((s) => s.trim()) : ["Diagnostics Cleared"],
        image: deviceImage || `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=256&auto=format&fit=crop`
      });
      setIsListing(false);
      setListSuccess(true);
      setDeviceName("");
      setDevicePrice("");
      setDeviceSpecs("");
      setDeviceImage("");
      setTimeout(() => setListSuccess(false), 3000);
    }, 1000);
  };

  // Send message
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !selectedChatPartner) return;
    sendMessage(user.email, selectedChatPartner, chatText.trim());
    setChatText("");
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
          {(user.role === "seller"
            ? [
                { id: "overview", label: "Seller Overview", icon: TrendingUp },
                { id: "list-device", label: "List Device", icon: PlusCircle },
                { id: "my-listings", label: `My Listings (${user.listedProducts?.length || 0})`, icon: Layers },
                { id: "chats", label: "Buyer Messages", icon: MessageSquare },
                { id: "bank", label: "Payout Setup", icon: CreditCard },
                { id: "profile", label: "Profile Registry", icon: User }
              ]
            : [
                { id: "overview", label: "Circular Overview", icon: TrendingUp },
                { id: "basket", label: `Refurbished Basket (${items.length})`, icon: ShoppingBag },
                { id: "wishlist", label: `My Wishlist (${user.wishlist?.length || 0})`, icon: Heart },
                { id: "plans", label: `Premium Plans (${user.plan.toUpperCase()})`, icon: Sparkles },
                { id: "chats", label: "Seller Chat", icon: MessageSquare },
                { id: "profile", label: "Profile Registry", icon: User }
              ]
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
              {/* Left Bento: Earnings/Claim Widget */}
              {user.role === "seller" ? (
                <div className="lg:col-span-4 bg-[#111111]/85 border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between shadow-xl min-h-[300px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mb-6">
                      <Coins className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1.5">Seller Listed Valuation</span>
                    <h3 className="font-mono text-4xl font-black text-white">
                      ${user.listedProducts?.reduce((sum: number, p: any) => sum + parseFloat(p.price.replace(/[^0-9.]/g, "")) || 0, 0).toFixed(2) || "0.00"}
                    </h3>
                    <p className="text-xs text-white/40 mt-3 font-body">Combined value of all listed circular assets.</p>
                  </div>
                  <div className="mt-8">
                    <button
                      onClick={() => setActiveTab("list-device")}
                      className="w-full h-11 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                    >
                      <PlusCircle className="w-4.5 h-4.5" />
                      List New Device
                    </button>
                  </div>
                </div>
              ) : (
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
              )}

              {/* Right Bento: Diagnostics/Catalog list */}
              {user.role === "seller" ? (
                <div className="lg:col-span-8 bg-[#111111]/85 border border-white/5 rounded-[2rem] p-8 shadow-xl flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-ui text-lg font-bold text-white">Active Device Catalog</h4>
                        <p className="text-xs text-white/40 mt-0.5 font-body">Refurbished hardware currently listed by you</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-x-auto">
                    {!user.listedProducts || user.listedProducts.length === 0 ? (
                      <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 rounded-2xl bg-black/25">
                        <PlusCircle className="w-8 h-8 text-white/20 mb-3" />
                        <p className="text-sm font-semibold text-white/50">No listed devices found</p>
                        <p className="text-xs text-white/30 mt-1 max-w-xs font-body">Create listings in the 'List Device' tab to start selling circular parts.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5 min-w-[500px]">
                        {user.listedProducts.map((device: any) => (
                          <div key={device.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0 group">
                            <div className="flex items-center gap-3.5">
                              <img src={device.image} alt={device.title} className="w-11 h-11 rounded-xl object-cover bg-slate-900 border border-white/10" />
                              <div>
                                <h5 className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">{device.title}</h5>
                                <div className="flex gap-2 items-center mt-1">
                                  <span className="font-mono text-[9px] text-white/30 tracking-widest">{device.id}</span>
                                  <span className="w-1 h-1 rounded-full bg-white/25" />
                                  <span className="text-[10px] text-white/40">{device.date}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <span className="inline-flex rounded px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest border uppercase bg-green-500/10 border-green-500/20 text-green-400">
                                  {device.type}
                                </span>
                                <span className="block font-mono text-[10px] text-white/30 mt-1 font-bold">{device.role}</span>
                              </div>
                              <div className="min-w-[70px] text-right font-mono font-bold text-sm text-white">
                                {device.price}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
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
              )}
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
                    className="w-full sm:w-auto h-11 bg-green-500 hover:bg-green-400 disabled:bg-white/5 border border-transparent text-slate-950 font-bold px-8 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
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

          {activeTab === "wishlist" && (
            <motion.div
              key="wishlist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-[#111111]/85 border border-white/5 rounded-[2rem] p-8 shadow-xl min-h-[400px]"
            >
              <div className="border-b border-white/5 pb-4 mb-6">
                <h4 className="font-ui text-lg font-bold text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <span>My Wishlist</span>
                </h4>
                <p className="text-xs text-white/40 mt-1 font-body">Refurbished products and circular assets you bookmarked</p>
              </div>

              {!user.wishlist || user.wishlist.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-4">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <p className="text-base font-semibold text-white/50">Your wishlist is empty</p>
                  <p className="text-xs text-white/30 mt-1.5 max-w-xs font-body leading-relaxed">
                    Explore products in the marketplace and add them to your wishlist.
                  </p>
                  <Link
                    href="/marketplace"
                    className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-green-500 hover:bg-green-400 px-5 text-xs font-bold text-slate-950 transition-colors"
                  >
                    Explore Marketplace
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                  {[
                    { id: "iphone-14-pro", title: "iPhone 14 Pro", type: "Refurbished", price: "$649" },
                    { id: "galaxy-s23-ultra", title: "Galaxy S23 Ultra", type: "Pre-Owned", price: "$580" },
                    { id: "macbook-air-m2-screen", title: "MacBook Air M2 Screen", type: "Salvaged Parts", price: "$199" },
                    ...customProducts
                  ].filter(p => user.wishlist.includes(p.id || p.title.toLowerCase().replace(/[^a-z0-9]/g, "-"))).map((p) => {
                    const pid = p.id || p.title.toLowerCase().replace(/[^a-z0-9]/g, "-");
                    return (
                      <div key={pid} className="bg-black/30 border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-green-500/20 transition-all">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[10px] font-mono font-bold tracking-widest text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded uppercase">{p.type}</span>
                            <button
                              onClick={() => toggleWishlist(pid)}
                              className="text-white/40 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <h5 className="text-base font-bold text-white mt-4">{p.title}</h5>
                          <p className="text-mono text-xl font-bold text-white/95 mt-2">{p.price}</p>
                        </div>
                        <div className="mt-6">
                          <button
                            onClick={() => {
                              addItem({ title: p.title, price: p.price, type: p.type, role: "Sourced" });
                              toggleWishlist(pid);
                            }}
                            className="w-full h-10 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Move to Basket
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "plans" && (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-[#111111]/85 border border-white/5 rounded-[2rem] p-8 shadow-xl min-h-[400px] relative overflow-hidden"
            >
              <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[150%] bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />

              <div className="border-b border-white/5 pb-4 mb-8">
                <h4 className="font-ui text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span>Premium Circular Subscriptions</span>
                </h4>
                <p className="text-xs text-white/40 mt-1 font-body">Upgrade your account to unlock verified seller details, direct messaging, and AI valuation deals.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                {[
                  {
                    id: "free",
                    title: "Free Tier",
                    price: "$0",
                    period: "forever",
                    desc: "Explore verified circular commerce and track your recycled device statistics.",
                    features: ["Browse Marketplace", "Basic device scans", "Self-delivery options"],
                    activeCls: "border-white/10 bg-black/20",
                  },
                  {
                    id: "pro",
                    title: "Pro Plan",
                    price: "$19",
                    period: "month",
                    desc: "Access verified seller details, communicate with suppliers, and get instant circular payouts.",
                    features: ["Everything in Free", "Unlocks Seller Contact Details", "Direct messaging with sellers", "Standard AI appraisals"],
                    activeCls: "border-green-500/30 bg-green-500/5 ring-1 ring-green-500/20",
                  },
                  {
                    id: "smart",
                    title: "Smart Plan",
                    price: "$49",
                    period: "month",
                    desc: "Orchestrate high-volume circular trade with advanced AI deals analysis and premium coverage.",
                    features: ["Everything in Pro", "Access to Seller bank & legal details", "AI-powered recommendations & insights", "Priority ledger verification", "Zero trading commission fees"],
                    activeCls: "border-blue-500/30 bg-blue-500/5 ring-1 ring-blue-500/20",
                  }
                ].map((plan) => {
                  const isCurrent = user.plan === plan.id;
                  return (
                    <div key={plan.id} className={`rounded-2xl p-6 border flex flex-col justify-between transition-all relative overflow-hidden ${plan.activeCls}`}>
                      {isCurrent && (
                        <div className="absolute top-3 right-3 bg-green-600 text-white font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
                          ACTIVE PLAN
                        </div>
                      )}
                      <div>
                        <h5 className="text-lg font-bold text-white">{plan.title}</h5>
                        <p className="text-white/40 text-xs mt-1.5 font-body leading-relaxed min-h-[48px]">{plan.desc}</p>
                        <div className="mt-6 flex items-baseline gap-1 font-mono">
                          <span className="text-3xl font-black text-white">{plan.price}</span>
                          <span className="text-white/40 text-xs">/{plan.period}</span>
                        </div>
                        <ul className="mt-6 space-y-3 font-body text-xs text-white/60">
                          {plan.features.map((f, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-8">
                        {isCurrent ? (
                          <div className="w-full h-11 bg-white/5 border border-white/10 text-white/50 text-xs font-bold rounded-xl flex items-center justify-center">
                            Currently Active
                          </div>
                        ) : (
                          <button
                            onClick={() => upgradePlan(plan.id as any)}
                            className="w-full h-11 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer font-sans"
                          >
                            Upgrade to {plan.title}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === "list-device" && (
            <motion.div
              key="list-device"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl bg-[#111111]/85 border border-white/5 rounded-[2rem] p-8 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[150%] bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />

              <div className="border-b border-white/5 pb-4 mb-6">
                <h4 className="font-ui text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-green-400" />
                  <span>List Reclaimed Electronics</span>
                </h4>
                <p className="text-xs text-white/40 mt-1 font-body">Create a circular listing and post your diagnostics grade for buyers.</p>
              </div>

              <form onSubmit={handleListProduct} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Device Name</label>
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="e.g. iPhone 13 Pro Max"
                    required
                    className="w-full h-11 px-4 bg-black/40 border border-white/10 focus:border-green-500 rounded-xl text-sm outline-none transition-all text-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Price (USD)</label>
                    <input
                      type="number"
                      value={devicePrice}
                      onChange={(e) => setDevicePrice(e.target.value)}
                      placeholder="e.g. 549"
                      required
                      className="w-full h-11 px-4 bg-black/40 border border-white/10 focus:border-green-500 rounded-xl text-sm outline-none transition-all text-white font-medium font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Diagnostics Grade</label>
                    <select
                      value={deviceGrade}
                      onChange={(e) => setDeviceGrade(e.target.value)}
                      className="w-full h-11 px-4 bg-black/40 border border-white/10 focus:border-green-500 rounded-xl text-sm outline-none transition-all text-white font-medium"
                    >
                      <option value="Grade A">Grade A (Like New)</option>
                      <option value="Grade B">Grade B (Lightly Scuffed)</option>
                      <option value="Grade C">Grade C (Moderately Used)</option>
                      <option value="Grade D">Grade D (Scrap/Parts Only)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Category Type</label>
                    <select
                      value={deviceCategory}
                      onChange={(e) => setDeviceCategory(e.target.value)}
                      className="w-full h-11 px-4 bg-black/40 border border-white/10 focus:border-green-500 rounded-xl text-sm outline-none transition-all text-white font-medium"
                    >
                      <option value="Refurbished">Refurbished Product</option>
                      <option value="Pre-Owned">Pre-Owned Mobile</option>
                      <option value="Salvaged Parts">Salvaged Component</option>
                      <option value="Raw Materials">Raw Materials</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Image URL (Optional)</label>
                    <input
                      type="text"
                      value={deviceImage}
                      onChange={(e) => setDeviceImage(e.target.value)}
                      placeholder="Custom URL or leave empty for default"
                      className="w-full h-11 px-4 bg-black/40 border border-white/10 focus:border-green-500 rounded-xl text-sm outline-none transition-all text-white font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Specifications (Comma-Separated)</label>
                  <input
                    type="text"
                    value={deviceSpecs}
                    onChange={(e) => setDeviceSpecs(e.target.value)}
                    placeholder="e.g. 128GB Storage, 88% Battery health, 1 Year warranty"
                    className="w-full h-11 px-4 bg-black/40 border border-white/10 focus:border-green-500 rounded-xl text-sm outline-none transition-all text-white font-medium font-body"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between gap-4 flex-col sm:flex-row">
                  {listSuccess ? (
                    <span className="text-xs font-bold text-green-400 flex items-center gap-1.5 animate-pulse">
                      <CheckCircle2 className="w-4.5 h-4.5" />
                      <span>Listing created successfully and catalog updated!</span>
                    </span>
                  ) : (
                    <span className="text-xs text-white/30 font-body">Listing will immediately load to the shared marketplace.</span>
                  )}

                  <button
                    type="submit"
                    disabled={isListing}
                    className="w-full sm:w-auto h-11 bg-green-500 hover:bg-green-400 disabled:bg-white/5 border border-transparent text-slate-950 font-bold px-8 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                  >
                    {isListing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Submit Listing</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "my-listings" && (
            <motion.div
              key="my-listings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-[#111111]/85 border border-white/5 rounded-[2rem] p-8 shadow-xl min-h-[400px]"
            >
              <div className="border-b border-white/5 pb-4 mb-6 flex justify-between items-center">
                <div>
                  <h4 className="font-ui text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-green-400" />
                    <span>My Created Listings</span>
                  </h4>
                  <p className="text-xs text-white/40 mt-1 font-body">Your listed circular electronics, components, and inventory catalog.</p>
                </div>
                <span className="font-mono text-xs text-white/40">{user.listedProducts?.length || 0} listed items</span>
              </div>

              {!user.listedProducts || user.listedProducts.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-4">
                    <Layers className="w-6 h-6" />
                  </div>
                  <p className="text-base font-semibold text-white/50">You have no listings</p>
                  <p className="text-xs text-white/30 mt-1.5 max-w-xs font-body leading-relaxed">
                    Start posting circular parts or refurbished electronics to earn payouts.
                  </p>
                  <button
                    onClick={() => setActiveTab("list-device")}
                    className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-green-500 hover:bg-green-400 px-5 text-xs font-bold text-slate-950 transition-colors cursor-pointer font-sans"
                  >
                    List First Device
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                  {user.listedProducts.map((p: any) => (
                    <div key={p.id} className="bg-black/30 border border-white/5 rounded-2xl overflow-hidden hover:border-green-500/20 transition-all flex flex-col justify-between h-full">
                      <div className="h-40 bg-black/20 relative flex items-center justify-center">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-60" />
                        <span className="absolute top-3 right-3 text-[9px] font-mono tracking-widest bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded font-bold text-green-400 uppercase">
                          {p.type}
                        </span>
                      </div>
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{p.role}</span>
                          <h5 className="text-base font-bold text-white mt-1.5">{p.title}</h5>
                          <ul className="text-xs text-white/40 mt-3 space-y-1 font-body">
                            {p.specs?.map((spec: string, idx: number) => (
                              <li key={idx}>• {spec}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className="font-mono text-xl font-bold text-white">{p.price}</span>
                          <span className="text-[9px] font-mono text-white/30 tracking-widest">ID: {p.id}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "bank" && (
            <motion.div
              key="bank"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl bg-[#111111]/85 border border-white/5 rounded-[2rem] p-8 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[150%] bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />

              <div className="border-b border-white/5 pb-4 mb-6">
                <h4 className="font-ui text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-400" />
                  <span>Seller Bank Setup</span>
                </h4>
                <p className="text-xs text-white/40 mt-1 font-body">Configure your bank registry to receive payments automatically from buyer purchases.</p>
              </div>

              <form onSubmit={handleSaveBankDetails} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="Enter full legal name"
                    required
                    className="w-full h-11 px-4 bg-black/40 border border-white/10 focus:border-green-500 rounded-xl text-sm outline-none transition-all text-white font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Chase Bank, HDFC, HSBC"
                    required
                    className="w-full h-11 px-4 bg-black/40 border border-white/10 focus:border-green-500 rounded-xl text-sm outline-none transition-all text-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Account Number</label>
                    <input
                      type="text"
                      value={accountNum}
                      onChange={(e) => setAccountNum(e.target.value)}
                      placeholder="Enter bank account number"
                      required
                      className="w-full h-11 px-4 bg-black/40 border border-white/10 focus:border-green-500 rounded-xl text-sm outline-none transition-all text-white font-medium font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">IFSC / Routing Code</label>
                    <input
                      type="text"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                      placeholder="IFSC or routing code"
                      required
                      className="w-full h-11 px-4 bg-black/40 border border-white/10 focus:border-green-500 rounded-xl text-sm outline-none transition-all text-white font-medium font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4 flex-col sm:flex-row">
                  {bankSuccess ? (
                    <span className="text-xs font-bold text-green-400 flex items-center gap-1.5 animate-pulse">
                      <CheckCircle2 className="w-4.5 h-4.5" />
                      <span>Bank parameters successfully saved to secure ledger!</span>
                    </span>
                  ) : (
                    <span className="text-xs text-white/30 font-body">Information is encrypted and saved locally.</span>
                  )}

                  <button
                    type="submit"
                    disabled={isSavingBank}
                    className="w-full sm:w-auto h-11 bg-green-500 hover:bg-green-400 disabled:bg-white/5 border border-transparent text-slate-950 font-bold px-8 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                  >
                    {isSavingBank ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Save Payout Methods</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "chats" && (
            <motion.div
              key="chats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-[#111111]/85 border border-white/5 rounded-[2rem] p-8 shadow-xl min-h-[500px]"
            >
              <div className="border-b border-white/5 pb-4 mb-6">
                <h4 className="font-ui text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                  <span>Circular Sourcing Messenger</span>
                </h4>
                <p className="text-xs text-white/40 mt-1 font-body">Direct, end-to-end messaging ledger for coordinating transactions.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[450px]">
                {/* Left Side: Users List */}
                <div className="lg:col-span-4 border-r border-white/5 pr-4 flex flex-col gap-2 overflow-y-auto no-scrollbar font-sans">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 px-2">Active Chats</span>

                  {(() => {
                    const staticList = user.role === "seller"
                      ? [
                          { email: "buyer1@ecoloop.ai", name: "Alex (Verified Sourcing)" },
                          { email: "sayan@ecoloop.ai", name: "Sayan Das (Buyer)" }
                        ]
                      : [
                          { email: "sayan@ecoloop.ai", name: "Sayan Das (B2C Seller)" },
                          { email: "ellen@circular.parts", name: "Ellen Parts Reclaimer" },
                          { email: "alex@greenreclaim.co", name: "Alex Wholesale Reclaim" }
                        ];

                    const listMap = new Map<string, string>();
                    staticList.forEach(p => listMap.set(p.email, p.name));

                    Object.keys(chatMessages || {}).forEach(chatId => {
                      if (chatId.includes(user.email)) {
                        const parts = chatId.split("_");
                        const partnerEmail = parts.find(p => p !== user.email);
                        if (partnerEmail && !listMap.has(partnerEmail)) {
                          const formattedName = partnerEmail.split("@")[0].replace(/[._]/g, " ");
                          listMap.set(partnerEmail, formattedName.charAt(0).toUpperCase() + formattedName.slice(1) + " (Contact)");
                        }
                      }
                    });

                    return Array.from(listMap.entries()).map(([email, name]) => ({ email, name }));
                  })().map((partner) => {
                    const chatId = [user.email, partner.email].sort().join("_");
                    const lastMsg = chatMessages[chatId]?.[chatMessages[chatId].length - 1];
                    const isActive = selectedChatPartner === partner.email;

                    return (
                      <button
                        key={partner.email}
                        onClick={() => setSelectedChatPartner(partner.email)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                          isActive
                            ? "bg-green-500/10 border-green-500/20 text-green-400 font-semibold"
                            : "bg-black/20 border-white/5 text-white/60 hover:bg-white/5"
                        }`}
                      >
                        <span className="text-xs font-bold text-white/90">{partner.name}</span>
                        <span className="text-[10px] text-white/40 font-mono truncate">{partner.email}</span>
                        {lastMsg && (
                          <span className="text-[10px] text-white/30 truncate mt-1">
                            {lastMsg.sender === user.email ? "You: " : ""}{lastMsg.text}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right Side: Chat Bubbles */}
                <div className="lg:col-span-8 flex flex-col justify-between h-full bg-black/20 rounded-2xl p-4 border border-white/5 font-sans">
                  {selectedChatPartner ? (
                    <>
                      <div className="border-b border-white/5 pb-2 mb-4 flex justify-between items-center">
                        <span className="text-xs font-bold text-white">Chatting with {selectedChatPartner}</span>
                      </div>

                      <div className="flex-grow overflow-y-auto space-y-3 pr-2 mb-4 flex flex-col no-scrollbar">
                        {(() => {
                          const chatId = [user.email, selectedChatPartner].sort().join("_");
                          const msgs = chatMessages[chatId] || [];
                          if (msgs.length === 0) {
                            return (
                              <div className="flex-grow flex items-center justify-center text-center text-xs text-white/30 font-body">
                                No messages yet. Say hello to initiate circular sourcing negotiations!
                              </div>
                            );
                          }
                          return msgs.map((m: any) => {
                            const isMe = m.sender === user.email;
                            return (
                              <div key={m.id} className={`flex flex-col max-w-[75%] ${isMe ? "self-end items-end" : "self-start items-start"}`}>
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

                      <form onSubmit={handleSendChatMessage} className="flex gap-2 border-t border-white/5 pt-3">
                        <input
                          type="text"
                          value={chatText}
                          onChange={(e) => setChatText(e.target.value)}
                          placeholder="Type your secure message..."
                          className="flex-grow h-10 px-4 bg-black/40 border border-white/10 focus:border-green-500 rounded-xl text-xs outline-none text-white transition-all font-body"
                        />
                        <button
                          type="submit"
                          className="h-10 bg-green-500 hover:bg-green-400 text-slate-950 font-bold px-4 rounded-xl text-xs transition-colors cursor-pointer font-sans"
                        >
                          Send
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center text-white/35 p-6">
                      <MessageSquare className="w-8 h-8 text-white/20 mb-3" />
                      <p className="text-xs font-semibold">No Conversation Active</p>
                      <p className="text-[10px] mt-1 max-w-xs leading-relaxed font-body">Select a messaging partner from the list to view the ledger and send a message.</p>
                    </div>
                  )}
                </div>
              </div>
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
