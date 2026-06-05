"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Leaf, 
  Mail, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AppContext";
import { LogoFull } from "../../../components/Logo";
import { signIn } from "next-auth/react";


// ==========================================
// CUSTOM ICONS
// ==========================================

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// ==========================================
// SUB-COMPONENTS
// ==========================================

const StatPill = ({ icon: Icon, text, delay }: { icon: any, text: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 1, 
      y: [0, -10, 0],
    }}
    transition={{ 
      opacity: { duration: 0.5, delay },
      y: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }
    }}
    className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl"
  >
    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-sm font-semibold text-white/90">{text}</span>
  </motion.div>
);

const InputField = ({ 
  label, 
  type, 
  placeholder, 
  icon: Icon, 
  value, 
  onChange, 
  error,
  showPasswordToggle,
  onTogglePassword
}: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-green-600'}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-11 pl-10 pr-10 bg-slate-50 border rounded-xl text-sm transition-all outline-none 
          ${error 
            ? 'border-red-200 focus:border-red-400 focus:ring-4 ring-red-500/10' 
            : 'border-slate-200 focus:border-green-500 focus:ring-4 ring-green-500/10'
          }`}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {type === "password" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      )}
    </div>
    {error && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{error}</p>}
  </div>
);

// ==========================================
// MAIN PAGE
// ==========================================

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email address";
    
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const success = await login(email);
      if (!success) {
        setErrors({ email: "Authentication failed. Please try again." });
        setIsLoading(false);
      }
    } catch (err) {
      setErrors({ email: "Authentication failed. Please try again." });
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans antialiased overflow-hidden">
      
      {/* LEFT PANEL - DESKTOP ONLY */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative flex-col justify-between p-12 overflow-hidden">
        
        {/* Animated Background Gradients/Particles */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-500/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
          
          {/* Subtle Dot Grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px' 
          }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <LogoFull textSize="text-2xl" iconSize="w-10 h-10" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl font-extrabold text-white leading-[1.1] mb-6"
          >
            Every device <br />
            <span className="text-green-500">deserves</span> a <br />
            second life.
          </motion.h1>
          
          <div className="flex flex-col gap-4 mt-12">
            <StatPill icon={ShieldCheck} text="♻️ 12,400 devices recovered" delay={0.2} />
            <div className="ml-8">
              <StatPill icon={Cpu} text="🧠 AI-graded in seconds" delay={0.4} />
            </div>
            <div className="ml-4">
              <StatPill icon={BarChart3} text="📦 Real-time tracking" delay={0.6} />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10">
          <p className="text-sm text-slate-500 font-medium">
            © 2024 EcoLoop Inc. Leading the circular electronics economy.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative">
        
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8">
          <LogoFull />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500 font-medium">Sign in to your EcoLoop account</p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full h-11 flex items-center justify-center gap-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            <button
              onClick={() => handleSocialLogin('github')}
              className="w-full h-11 flex items-center justify-center gap-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm"
            >
              <GithubIcon className="w-5 h-5 text-slate-900" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-white px-4 text-slate-400">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <InputField
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              icon={Mail}
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              error={errors.email}
            />

            <div className="relative">
              <InputField
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={ShieldCheck}
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                error={errors.password}
                showPasswordToggle
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
              <div className="flex justify-end mt-1.5">
                <Link href="/auth/forgot" className="text-[11px] font-bold text-green-600 hover:text-green-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-green-600 hover:bg-green-500 disabled:bg-green-400 text-white rounded-xl font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-semibold text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-green-600 hover:text-green-500 transition-colors">
              Sign up &rarr;
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  );
}
