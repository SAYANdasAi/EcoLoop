import { motion } from "framer-motion";
import { fadeUp } from "../../lib/animations";

export function FadeUp({ children, delay=0, className="" }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{once:true,margin:"-80px"}} variants={fadeUp} transition={{delay}} className={className}>
      {children}
    </motion.div>
  )
}
