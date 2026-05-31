import { Variants } from "framer-motion"
export const fadeUp: Variants = { hidden:{opacity:0,y:32}, visible:{opacity:1,y:0, transition:{duration:0.7,ease:[0.16,1,0.3,1]}} }
export const fadeIn: Variants = { hidden:{opacity:0}, visible:{opacity:1, transition:{duration:0.5}} }
export const stagger: Variants = { hidden:{}, visible:{transition:{staggerChildren:0.1,delayChildren:0.1}} }
export const slideLeft: Variants = { hidden:{opacity:0,x:-48}, visible:{opacity:1,x:0, transition:{duration:0.7,ease:[0.16,1,0.3,1]}} }
export const slideRight: Variants = { hidden:{opacity:0,x:48}, visible:{opacity:1,x:0, transition:{duration:0.7,ease:[0.16,1,0.3,1]}} }
export const scaleIn: Variants = { hidden:{opacity:0,scale:0.9}, visible:{opacity:1,scale:1, transition:{duration:0.6,ease:[0.16,1,0.3,1]}} }
export const floatAnim = {
  animate:{ y:[0,-16,-6,0], rotate:[-2,2,-1,-2], transition:{duration:4, repeat:Infinity, ease:"easeInOut"} }
}
export const cardHover = {
  whileHover:{ scale:1.03, boxShadow:"0 0 28px rgba(74,222,128,0.14)", borderColor:"rgba(22,163,74,0.35)", transition:{duration:0.2} },
  whileTap:{ scale:0.96 }
}
