import { motion } from "framer-motion";
import { fadeUp } from "../../lib/animations";

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeUp({ children, delay=0, className="" }: FadeUpProps) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{once:true,margin:"-80px"}} variants={fadeUp} transition={{delay}} className={className}>
      {children}
    </motion.div>
  )
}

