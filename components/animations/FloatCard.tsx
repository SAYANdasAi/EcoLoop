import { motion } from "framer-motion";

interface FloatCardProps {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  rotate?: number;
  delay?: number;
}

export function FloatCard({ children, amplitude=12, duration=3.5, rotate=2, delay=0 }: FloatCardProps) {
  return <motion.div animate={{y:[0,-amplitude,-amplitude/2,0],rotate:[-rotate,rotate,-rotate/2,-rotate]}} transition={{duration,delay,repeat:Infinity,ease:"easeInOut"}}>{children}</motion.div>
}

