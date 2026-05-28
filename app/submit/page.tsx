"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import {
  X,
  Camera,
  CheckCircle,
  AlertTriangle,
  Flame,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Cpu,
  Coins,
  ShieldCheck,
  RefreshCw,
  Info,
  Leaf,
} from "lucide-react";

// ==========================================
// ZOD VALIDATION SCHEMA
// ==========================================

const formSchema = z.object({
  brand: z.string().min(1, "Please select a brand"),
  modelName: z.string().min(2, "Model name must be at least 2 characters"),
  purchaseYear: z.string().min(1, "Please select purchase year"),
  storage: z.string().min(1, "Please select storage capacity"),
  batteryHealth: z.number().min(10).max(100),
  screenCondition: z.enum(["no_damage", "minor_scratches", "cracked", "shattered"], {
    message: "Please select screen condition",
  }),
  bodyCondition: z.enum(["excellent", "good", "fair", "poor"], {
    message: "Please select body condition",
  }),
  functionalIssues: z.array(z.string()).default([]),
  waterDamage: z.boolean().default(false),
  accessories: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof formSchema>;

// ==========================================
// IMAGE UPLOAD TYPES
// ==========================================

interface ImageUploadSlot {
  id: "front" | "back" | "left" | "right" | "damage";
  label: string;
  description: string;
}

const UPLOAD_SLOTS: ImageUploadSlot[] = [
  { id: "front", label: "Front View", description: "Screen showing" },
  { id: "back", label: "Back Plate", description: "Camera panel visible" },
  { id: "left", label: "Left Side", description: "Volume buttons & tray" },
  { id: "right", label: "Right Side", description: "Power key & bezel" },
  { id: "damage", label: "Close-up", description: "Scratches, scuffs, or dents" },
];

// ==========================================
// DROPZONE BOX SUB-COMPONENT
// ==========================================

interface DropzoneBoxProps {
  slot: ImageUploadSlot;
  preview?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

function DropzoneBox({ slot, preview, onUpload, onRemove }: DropzoneBoxProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) onUpload(acceptedFiles[0]);
    },
    accept: { "image/*": [".jpeg", ".png", ".jpg", ".webp"] },
    maxFiles: 1,
    disabled: !!preview,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all ${
        preview
          ? "border-slate-200 bg-slate-50 cursor-default"
          : isDragActive
          ? "border-green-500 bg-green-50"
          : "border-slate-200 hover:border-green-400 hover:bg-green-50/30 bg-white cursor-pointer"
      }`}
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className="absolute inset-0 w-full h-full p-1.5 flex flex-col">
          <div className="relative flex-1 w-full rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={slot.label} className="absolute inset-0 w-full h-full object-cover" />
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="absolute top-1 right-1 p-0.5 rounded-full bg-slate-950/70 hover:bg-red-600 text-white transition-colors"
              aria-label="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <span className="text-[10px] font-bold text-slate-500 mt-1 truncate">{slot.label}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center select-none pointer-events-none">
          <div className={`p-2 rounded-lg mb-1.5 ${isDragActive ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"}`}>
            <Camera className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-700">{slot.label}</span>
          <span className="text-[9px] text-slate-400 mt-0.5">{slot.description}</span>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function SubmitDevicePage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<number>(1);
  const [images, setImages] = useState<Record<string, string>>({});
  const imagesRef = useRef(images);
  useEffect(() => { imagesRef.current = images; }, [images]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "",
      modelName: "",
      purchaseYear: "2022",
      storage: "",
      batteryHealth: 85,
      screenCondition: undefined,
      bodyCondition: undefined,
      functionalIssues: [],
      waterDamage: false,
      accessories: [],
    },
  });

  const batteryHealth = watch("batteryHealth");
  const screenCondition = watch("screenCondition");
  const bodyCondition = watch("bodyCondition");
  const functionalIssues = watch("functionalIssues");
  const brand = watch("brand");
  const modelName = watch("modelName");
  const waterDamage = watch("waterDamage");

  const uploadedCount = Object.keys(images).filter((k) => images[k]).length;
  const step1Disabled = uploadedCount < 4;

  const handleImageUpload = (slotId: string, file: File) => {
    const url = URL.createObjectURL(file);
    if (images[slotId]) URL.revokeObjectURL(images[slotId]);
    setImages((prev) => ({ ...prev, [slotId]: url }));
  };

  const removeImage = (slotId: string) => {
    if (images[slotId]) URL.revokeObjectURL(images[slotId]);
    setImages((prev) => { const next = { ...prev }; delete next[slotId]; return next; });
  };

  useEffect(() => {
    return () => {
      Object.values(imagesRef.current).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const goNext = () => { setDirection(1); setStep((p) => (p + 1) as 1 | 2 | 3); };
  const goPrev = () => { setDirection(-1); setStep((p) => (p - 1) as 1 | 2 | 3); };

  const onSubmitForm = (data: FormData) => {
    console.log("Submitting form data:", data);
    setDirection(1);
    setStep(3);
    setIsAnalyzing(true);
    setShowResult(false);
    setTimeout(() => { setIsAnalyzing(false); setShowResult(true); }, 2000);
  };

  // AI classification logic
  const getResult = () => {
    const deviceTitle = `${brand || "Unknown"} ${modelName || "Device"}`;

    if (waterDamage || screenCondition === "shattered" || bodyCondition === "poor" || batteryHealth < 35) {
      return {
        device: deviceTitle, outcome: "Recycle" as const,
        badgeCls: "bg-red-600 text-white",
        cardCls: "border-red-100 bg-red-50/30",
        barCls: "bg-red-600",
        confidence: 94, value: "₹1,500",
        reason: "Device has critical hardware failure: either water ingress, a shattered display, or severely degraded battery chemistry. Safe extraction of raw minerals via certified e-waste recycling is the optimal circular outcome.",
        secondary: "Alternative: Precious metal extraction & mineral loop",
        refurbish: 10, parts: 40, reuse: 5, recycle: 94,
      };
    }
    if (screenCondition === "cracked" || (functionalIssues && functionalIssues.length > 2) || (batteryHealth >= 35 && batteryHealth < 70)) {
      return {
        device: deviceTitle, outcome: "Repair" as const,
        badgeCls: "bg-amber-500 text-slate-950",
        cardCls: "border-amber-100 bg-amber-50/30",
        barCls: "bg-amber-500",
        confidence: 82, value: "₹6,000",
        reason: "Device is functional but has a cracked screen and a degraded battery. Screen replacement estimated at ₹2,000. After repair, resale value reaches ₹6,000 — yielding a net circular value of ₹4,000.",
        secondary: "Alternative: Parts recovery — screen glass & logic board",
        refurbish: 45, parts: 75, reuse: 20, recycle: 15,
      };
    }
    if (screenCondition === "minor_scratches" || bodyCondition === "fair" || bodyCondition === "good" || (batteryHealth >= 70 && batteryHealth < 85)) {
      return {
        device: deviceTitle, outcome: "Refurbish" as const,
        badgeCls: "bg-blue-600 text-white",
        cardCls: "border-blue-100 bg-blue-50/30",
        barCls: "bg-blue-600",
        confidence: 87, value: "₹11,500",
        reason: "Device has minor wear but is fully functional. Recommending professional sanitization, casing buff, and battery calibration before listing as Certified Refurbished. Expected resale value: ₹11,500.",
        secondary: "Alternative: Direct C2C marketplace listing",
        refurbish: 87, parts: 60, reuse: 30, recycle: 10,
      };
    }
    return {
      device: deviceTitle, outcome: "Reuse" as const,
      badgeCls: "bg-green-600 text-white",
      cardCls: "border-green-100 bg-green-50/30",
      barCls: "bg-green-600",
      confidence: 96, value: "₹18,500",
      reason: "Device is in excellent condition with premium battery health and zero structural damage. No repairs needed. Immediate route: direct peer-to-peer marketplace listing to maximise circular value at ₹18,500.",
      secondary: "Alternative: B2B bulk buyout at ₹16,000",
      refurbish: 20, parts: 25, reuse: 96, recycle: 5,
    };
  };

  const result = getResult();

  const stepVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 48 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] as const } },
    exit: (dir: number) => ({ opacity: 0, x: dir * -48, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const } }),
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">

      {/* Minimal Top Bar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 group">
            <div className="w-7 h-7 rounded-md bg-green-600 flex items-center justify-center">
              <Leaf className="w-4 h-4 fill-white stroke-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-green-600 transition-colors">EcoLoop</span>
          </Link>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-mono">
            DEVICE SUBMISSION
          </span>
        </div>
      </header>

      <div className="pt-14 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10">

          {/* ======== PROGRESS HEADER ======== */}
          <div className="mb-8">
            {/* Step bubbles */}
            <div className="flex items-center gap-0 mb-4">
              {[
                { n: 1, label: "Photos" },
                { n: 2, label: "Details" },
                { n: 3, label: "AI Result" },
              ].map((s, i) => (
                <React.Fragment key={s.n}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold border-2 transition-all ${
                      step > s.n
                        ? "bg-green-600 border-green-600 text-white"
                        : step === s.n
                        ? "bg-white border-green-600 text-green-600"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}>
                      {step > s.n ? <CheckCircle className="w-4 h-4" /> : s.n}
                    </div>
                    <span className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${
                      step >= s.n ? "text-green-600" : "text-slate-400"
                    }`}>{s.label}</span>
                  </div>
                  {i < 2 && (
                    <div className={`flex-1 h-0.5 mt-[-12px] mx-1 transition-colors ${step > s.n ? "bg-green-600" : "bg-slate-200"}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Animated progress bar */}
            <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-600 rounded-full"
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* ======== STEP CARD ======== */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>

                {/* ─────────────── STEP 1 ─────────────── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="p-6 sm:p-8"
                  >
                    <div className="mb-7">
                      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Upload 4–5 photos of your device
                      </h1>
                      <p className="mt-1.5 text-sm text-slate-500 flex items-start gap-1.5">
                        <Info className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        Good photos = better AI accuracy. Upload at least 4 hardware angles.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7">
                      {UPLOAD_SLOTS.map((slot) => (
                        <DropzoneBox
                          key={slot.id}
                          slot={slot}
                          preview={images[slot.id]}
                          onUpload={(file) => handleImageUpload(slot.id, file)}
                          onRemove={() => removeImage(slot.id)}
                        />
                      ))}
                    </div>

                    {/* Upload progress feedback */}
                    <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-green-500 rounded-full"
                          animate={{ width: `${(uploadedCount / 5) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                        {uploadedCount} / 5 photos
                        {uploadedCount >= 4 && <span className="ml-1 text-green-600">✓ Ready</span>}
                      </span>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button
                        onClick={goNext}
                        disabled={step1Disabled}
                        className={`inline-flex items-center gap-1.5 h-11 px-6 rounded-xl text-sm font-bold transition-all ${
                          step1Disabled
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-500 shadow-md shadow-green-200 hover:shadow-green-300 hover:scale-[1.01]"
                        }`}
                      >
                        Continue to Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ─────────────── STEP 2 ─────────────── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="p-6 sm:p-8"
                  >
                    <div className="mb-7">
                      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Tell us about your device
                      </h1>
                      <p className="mt-1.5 text-sm text-slate-500">
                        Detailed info helps EcoLoop AI route your device to the highest-value outcome.
                      </p>
                    </div>

                    <form id="details-form" onSubmit={handleSubmit(onSubmitForm)} className="space-y-7">

                      {/* Brand & Model Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="label-xs">Brand</label>
                          <select {...register("brand")} className="input-base">
                            <option value="">Select brand…</option>
                            {["Apple","Samsung","OnePlus","Xiaomi","Realme","Other"].map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                          {errors.brand && <p className="err">{errors.brand.message}</p>}
                        </div>
                        <div>
                          <label className="label-xs">Model Name</label>
                          <input type="text" placeholder="e.g. iPhone 13 Pro" {...register("modelName")} className="input-base" />
                          {errors.modelName && <p className="err">{errors.modelName.message}</p>}
                        </div>
                      </div>

                      {/* Year & Storage Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="label-xs">Year of Purchase</label>
                          <select {...register("purchaseYear")} className="input-base">
                            {Array.from({ length: 7 }, (_, i) => 2024 - i).map((y) => (
                              <option key={y} value={String(y)}>{y}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="label-xs">Storage Capacity</label>
                          <select {...register("storage")} className="input-base">
                            <option value="">Select…</option>
                            {["32GB","64GB","128GB","256GB","512GB"].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          {errors.storage && <p className="err">{errors.storage.message}</p>}
                        </div>
                      </div>

                      {/* Battery Health Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="label-xs">Battery Health</label>
                          <span className={`text-sm font-black px-2.5 py-0.5 rounded-lg border font-mono ${
                            batteryHealth >= 80 ? "text-green-700 bg-green-50 border-green-200"
                            : batteryHealth >= 50 ? "text-amber-700 bg-amber-50 border-amber-200"
                            : "text-red-700 bg-red-50 border-red-200"
                          }`}>{batteryHealth}%</span>
                        </div>
                        <Controller
                          name="batteryHealth"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="range" min={10} max={100} step={1}
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-green-600 bg-slate-100"
                            />
                          )}
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                          <span>10% Critical</span>
                          <span>100% New</span>
                        </div>
                      </div>

                      {/* Screen Condition Radio Cards */}
                      <div>
                        <label className="label-xs mb-2 block">Screen Condition</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            { val: "no_damage", icon: CheckCircle, label: "No damage", desc: "Perfect, zero visible marks" },
                            { val: "minor_scratches", icon: AlertTriangle, label: "Minor scratches", desc: "Hairline scuffs, barely visible" },
                            { val: "cracked", icon: Flame, label: "Cracked", desc: "Single crack, still readable" },
                            { val: "shattered", icon: X, label: "Shattered", desc: "Glass broken, display bleeding" },
                          ].map(({ val, icon: Icon, label, desc }) => (
                            <label
                              key={val}
                              className={`flex gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                                screenCondition === val
                                  ? "border-green-500 bg-green-50/50 shadow-sm"
                                  : "border-slate-200 hover:border-slate-300 bg-white"
                              }`}
                            >
                              <input type="radio" value={val} {...register("screenCondition")} className="sr-only" />
                              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${screenCondition === val ? "text-green-600" : "text-slate-400"}`} />
                              <div>
                                <div className="text-sm font-bold text-slate-900">{label}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                        {errors.screenCondition && <p className="err mt-1">{errors.screenCondition.message}</p>}
                      </div>

                      {/* Body Condition Cards */}
                      <div>
                        <label className="label-xs mb-2 block">Body & Chassis Condition</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {[
                            { val: "excellent", label: "Excellent", desc: "Mint, no dents" },
                            { val: "good", label: "Good", desc: "Light scuffs" },
                            { val: "fair", label: "Fair", desc: "Visible marks" },
                            { val: "poor", label: "Poor", desc: "Bent / cracked" },
                          ].map(({ val, label, desc }) => (
                            <label
                              key={val}
                              className={`flex flex-col items-center text-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                bodyCondition === val
                                  ? "border-green-500 bg-green-50/50 shadow-sm"
                                  : "border-slate-200 hover:border-slate-300 bg-white"
                              }`}
                            >
                              <input type="radio" value={val} {...register("bodyCondition")} className="sr-only" />
                              <span className={`text-sm font-bold ${bodyCondition === val ? "text-green-700" : "text-slate-900"}`}>{label}</span>
                              <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{desc}</span>
                            </label>
                          ))}
                        </div>
                        {errors.bodyCondition && <p className="err mt-1">{errors.bodyCondition.message}</p>}
                      </div>

                      {/* Functional Issues */}
                      <div>
                        <label className="label-xs mb-2 block">Functional Issues</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[
                            { id: "battery_drain", label: "Battery drains fast" },
                            { id: "camera_fault", label: "Camera issues" },
                            { id: "speaker_fault", label: "Speaker / mic fault" },
                            { id: "port_fault", label: "Charging port issue" },
                            { id: "button_fault", label: "Buttons unresponsive" },
                          ].map((issue) => (
                            <label
                              key={issue.id}
                              className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors text-sm"
                            >
                              <input
                                type="checkbox"
                                value={issue.id}
                                {...register("functionalIssues")}
                                className="rounded border-slate-300 text-green-600 focus:ring-green-500 w-4 h-4"
                              />
                              <span className="font-medium text-slate-700">{issue.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Water Damage Toggle */}
                      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div>
                          <div className="text-sm font-bold text-slate-900">Water Damage History</div>
                          <div className="text-xs text-slate-500 mt-0.5">Has the device ever been exposed to water?</div>
                        </div>
                        <Controller
                          name="waterDamage"
                          control={control}
                          render={({ field }) => (
                            <button
                              type="button"
                              onClick={() => field.onChange(!field.value)}
                              className={`relative w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${field.value ? "bg-green-600" : "bg-slate-300"}`}
                            >
                              <motion.div
                                className="w-5 h-5 bg-white rounded-full shadow"
                                animate={{ x: field.value ? 20 : 0 }}
                                transition={{ type: "spring", stiffness: 600, damping: 35 }}
                              />
                            </button>
                          )}
                        />
                      </div>

                      {/* Accessories */}
                      <div>
                        <label className="label-xs mb-2 block">Accessories Present</label>
                        <div className="flex flex-wrap gap-3">
                          {["Charger", "Box", "Earphones"].map((acc) => (
                            <label key={acc} className="flex items-center gap-2 cursor-pointer font-semibold text-sm text-slate-700">
                              <input
                                type="checkbox"
                                value={acc}
                                {...register("accessories")}
                                className="rounded border-slate-300 text-green-600 focus:ring-green-500 w-4 h-4"
                              />
                              <span>{acc}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                    </form>

                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={goPrev}
                        className="inline-flex items-center gap-1.5 h-11 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold text-slate-600 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </button>
                      <button
                        type="submit"
                        form="details-form"
                        className="inline-flex items-center gap-1.5 h-11 px-6 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-bold shadow-md shadow-green-200 hover:shadow-green-300 hover:scale-[1.01] active:scale-[0.98] transition-all"
                      >
                        Submit for AI Analysis
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ─────────────── STEP 3 ─────────────── */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="p-6 sm:p-8"
                  >
                    {/* Loading */}
                    {isAnalyzing && (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="relative mb-6">
                          <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                          </div>
                          <div className="absolute -inset-1 rounded-full border-2 border-green-500/20 animate-ping" />
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900">Analyzing your device with AI…</h2>
                        <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">
                          EcoLoop neural engine is evaluating image data, component health, and condition grades.
                        </p>
                        <div className="mt-6 flex gap-1.5">
                          {[0,1,2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-green-500"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Result */}
                    {showResult && (
                      <div>
                        {/* Device + Badge */}
                        <div className={`rounded-2xl border-2 p-6 mb-6 text-center ${result.cardCls}`}>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">AI Classification Result</span>
                          <h2 className="text-2xl font-black text-slate-900 mt-1">{result.device}</h2>

                          <motion.div
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
                            className="mt-5 inline-flex"
                          >
                            <span className={`text-2xl font-black px-6 py-3 rounded-xl ${result.badgeCls}`}>
                              {result.outcome}
                            </span>
                          </motion.div>

                          <div className="mt-5">
                            <div className="text-4xl font-black text-slate-900">{result.value}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Estimated Circular Value</div>
                          </div>
                        </div>

                        {/* AI Reasoning */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                              <Cpu className="w-4 h-4 text-green-600" />
                              AI Diagnostic Reasoning
                            </span>
                            <span className="text-xs font-black text-green-600 font-mono">{result.confidence}% confidence</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-4">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${result.confidence}%` }}
                              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                              className={`h-full rounded-full ${result.barCls}`}
                            />
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{result.reason}</p>
                          <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-500 font-semibold">
                            {result.secondary}
                          </div>
                        </div>

                        {/* Probability Breakdown */}
                        <div className="border border-slate-100 rounded-xl p-4 bg-white mb-6">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100 pb-2 mb-3">
                            All Outcome Probabilities
                          </h4>
                          {[
                            { label: "Refurbish & Resell", pct: result.refurbish, cls: "bg-blue-600" },
                            { label: "Parts Harvesting", pct: result.parts, cls: "bg-amber-500" },
                            { label: "Direct Reuse (P2P)", pct: result.reuse, cls: "bg-green-600" },
                            { label: "Scrap Recycling", pct: result.recycle, cls: "bg-red-500" },
                          ].map(({ label, pct, cls }) => (
                            <div key={label} className="mb-3 last:mb-0">
                              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                <span>{label}</span>
                                <span className="font-mono">{pct}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                  className={`h-full rounded-full ${cls}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-5">
                          <button className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold shadow-md shadow-green-200 hover:shadow-green-300 hover:scale-[1.01] active:scale-[0.98] transition-all">
                            <Coins className="w-5 h-5" />
                            List on Marketplace
                          </button>
                          <button className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-slate-200 hover:border-green-500 hover:bg-green-50 text-slate-700 font-bold transition-all">
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                            Schedule Pickup
                          </button>
                        </div>

                        {/* Restart */}
                        <div className="text-center">
                          <button
                            onClick={() => { setDirection(-1); setStep(1); setImages({}); setShowResult(false); }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-green-600 transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Submit another device
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* Inline Tailwind micro-utility styles */}
      <style>{`
        .label-xs { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; margin-bottom: 6px; }
        .input-base { width: 100%; height: 40px; padding: 0 12px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #0f172a; outline: none; transition: border-color 0.15s; }
        .input-base:focus { border-color: #16a34a; }
        .err { font-size: 11px; font-weight: 700; color: #ef4444; margin-top: 4px; }
      `}</style>
    </div>
  );
}
