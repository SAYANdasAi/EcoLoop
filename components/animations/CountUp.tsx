import { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

interface CountUpProps {
  target: number;
  prefix?: string;
  suffix?: string;
}

export function CountUp({ target, prefix="", suffix="" }: CountUpProps) {
  const ref=useRef(null); const isInView=useInView(ref,{once:true}); const motionVal=useMotionValue(0);
  const spring=useSpring(motionVal,{stiffness:80,damping:20});
  const display=useTransform(spring,v=>prefix+Math.round(v).toLocaleString("en-IN")+suffix);
  useEffect(()=>{ if(isInView) motionVal.set(target) },[isInView]);
  return <motion.span ref={ref} className="font-display font-bold">{display}</motion.span>
}
