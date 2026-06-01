import { motion } from "framer-motion";

interface GlowTextProps {
  children: React.ReactNode;
}

export function GlowText({ children }: GlowTextProps) {
  return <motion.span className="text-green-400 font-display" animate={{textShadow:["0 0 20px rgba(74,222,128,0.3)","0 0 40px rgba(74,222,128,0.8), 0 0 80px rgba(74,222,128,0.3)","0 0 20px rgba(74,222,128,0.3)"]}} transition={{duration:2.5,repeat:Infinity,ease:"easeInOut"}}>{children}</motion.span>
}
