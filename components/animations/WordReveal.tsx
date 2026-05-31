import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function WordReveal({ text, className, greenWords=[] }) {
  return (
    <motion.h1 className={cn("font-display",className)} initial="hidden" whileInView="visible" viewport={{once:true}} variants={{visible:{transition:{staggerChildren:0.07}}}}>
      {text.split(" ").map((word,i) => (
        <motion.span key={i} style={{display:"inline-block",marginRight:"0.3em"}} variants={{hidden:{opacity:0,y:24,filter:"blur(4px)"},visible:{opacity:1,y:0,filter:"blur(0px)",transition:{duration:0.6,ease:[0.16,1,0.3,1]}}}} className={greenWords.includes(word)?"text-green-400":""}>{word}</motion.span>
      ))}
    </motion.h1>
  )
}
