import { motion } from "framer-motion";

export function FloatCard({ children, amplitude=12, duration=3.5, rotate=2, delay=0 }) {
  return <motion.div animate={{y:[0,-amplitude,-amplitude/2,0],rotate:[-rotate,rotate,-rotate/2,-rotate]}} transition={{duration,delay,repeat:Infinity,ease:"easeInOut"}}>{children}</motion.div>
}
