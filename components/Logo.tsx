import { motion, SVGMotionProps } from "framer-motion";

/**
 * Reusable SVG Icon for the Brand Logo (Infinity Loop ribbon in green gradient)
 */
export function LogoIcon({ className = "w-9 h-9", glow = true, ...props }: SVGMotionProps<SVGSVGElement> & { glow?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 80 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glow ? "filter drop-shadow-[0_0_8px_rgba(0,230,118,0.45)]" : ""}`}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      {...props}
    >
      <defs>
        <linearGradient id="logoGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#00E676" />
        </linearGradient>
      </defs>
      {/* Precision Mathematical Infinity Ribbon Path */}
      <motion.path
        d="M40 20C28 8, 12 8, 12 20C12 32, 28 32, 40 20C52 8, 68 8, 68 20C68 32, 52 32, 40 20Z"
        stroke="url(#logoGreenGradient)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

/**
 * Reusable Typography Text Wordmark (lowercase "ecoloop" where "oo" is an infinity loop)
 */
export function LogoText({ className = "text-xl", ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`font-display font-bold tracking-tight text-current select-none inline-flex items-center gap-0.5 ${className}`}
      {...props}
    >
      <span>ecol</span>
      <span className="inline-flex items-center mx-[-1px] text-mint-glow filter drop-shadow-[0_0_4px_rgba(0,230,118,0.4)]">
        <svg className="w-5.5 h-3" viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
          <path d="M20 10C14 4, 4 4, 4 10C4 16, 14 16, 20 10C26 4, 36 4, 36 10C36 16, 26 16, 20 10Z" />
        </svg>
      </span>
      <span>p</span>
    </span>
  );
}

/**
 * Full Horizontal Lockup (Icon + Wordmark)
 */
export function LogoFull({
  className = "flex items-center gap-2.5 group",
  iconSize = "w-9 h-9",
  textSize = "text-xl",
  glow = true
}: {
  className?: string;
  iconSize?: string;
  textSize?: string;
  glow?: boolean;
}) {
  return (
    <div className={className}>
      <LogoIcon className={`${iconSize} transition-transform group-hover:scale-105 duration-300`} glow={glow} />
      <LogoText className={`${textSize} text-white group-hover:text-green-400 transition-colors duration-300`} />
    </div>
  );
}

/**
 * Reusable Brand Tagline
 */
export function LogoTagline({ className = "" }: { className?: string }) {
  return (
    <div className={`font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-mint-glow font-bold uppercase select-none ${className}`}>
      CIRCLE BACK. GIVE FORWARD.
    </div>
  );
}
