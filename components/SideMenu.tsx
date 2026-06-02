"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useAuth, useBasket } from "../context/AppContext";
import styles from "./SideMenu.module.scss";

interface NavLinkItem {
  label: string;
  href: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Features", href: "/features" },
  { label: "AI Diagnostics", href: "/showcase" },
  { label: "Marketplace", href: "/marketplace" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Twitter", href: "https://twitter.com" },
];

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { items } = useBasket();

  const activeLinks = [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Features", href: "/features" },
    { label: "AI Diagnostics", href: "/showcase" },
    { label: "Marketplace", href: "/marketplace" },
    ...(isAuthenticated 
      ? [
          { label: "Dashboard", href: "/dashboard" },
          { label: `Basket (${items.length})`, href: "/dashboard?tab=basket" }
        ]
      : [
          { label: "Sign In", href: "/auth/login" }
        ]
    )
  ];

  // Magnetic Button Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.4);
    y.set((e.clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Drawer animation variants
  const drawerVariants = {
    closed: {
      width: "56px",
      height: "56px",
      top: "24px",
      right: "24px",
      borderRadius: "50%",
      transition: {
        duration: 0.75,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
    open: {
      width: "calc(100% - 24px)",
      height: "calc(100vh - 24px)",
      top: "12px",
      right: "12px",
      borderRadius: "24px",
      transition: {
        duration: 0.75,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
  };

  // 3D Perspective Flip variants for Links
  const linkVariants = {
    initial: {
      opacity: 0,
      rotateX: 90,
      translateY: 80,
      translateX: -20,
    },
    enter: (i: number) => ({
      opacity: 1,
      rotateX: 0,
      translateY: 0,
      translateX: 0,
      transition: {
        duration: 0.65,
        ease: [0.215, 0.61, 0.355, 1] as const,
        delay: 0.3 + i * 0.08,
      },
    }),
    exit: {
      opacity: 0,
      rotateX: 45,
      translateY: 20,
      transition: {
        duration: 0.25,
        ease: "easeOut" as const,
      },
    },
  };

  // Footer Row stagger variants
  const footerVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1] as const,
        delay: 0.7,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.25,
      },
    },
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={toggleMenu}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: mouseXSpring, y: mouseYSpring }}
        className={`${styles.menuBtn} ${isOpen ? styles.menuActive : ""}`}
        aria-label="Toggle menu"
      >
        <div className="relative flex flex-col justify-between w-6 h-3.5 pointer-events-none">
          {/* Top Line */}
          <motion.span
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 6 : 0,
              backgroundColor: isOpen ? "#ffffff" : "#050505",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-0.5 rounded-full"
          />
          {/* Middle Line */}
          <motion.span
            animate={{
              opacity: isOpen ? 0 : 1,
              backgroundColor: isOpen ? "#ffffff" : "#050505",
            }}
            transition={{ duration: 0.2 }}
            className="w-full h-0.5 rounded-full"
          />
          {/* Bottom Line */}
          <motion.span
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? -6 : 0,
              backgroundColor: isOpen ? "#ffffff" : "#050505",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-0.5 rounded-full"
          />
        </div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
            className={styles.backdrop}
          />
        )}
      </AnimatePresence>

      {/* Sliding Menu Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={styles.menuWindow}
          >
            {/* Nav container */}
            <div className={styles.navBody}>
              <span className={styles.footerLabel}>Navigation</span>
              <div className={styles.perspectiveParent}>
                {activeLinks.map((link, i) => (
                  <div key={link.label} className={styles.linkContainer}>
                    <motion.div
                      custom={i}
                      variants={linkVariants}
                      initial="initial"
                      animate="enter"
                      exit="exit"
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className={styles.navLink}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer row */}
            <motion.div
              variants={footerVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className={styles.footerRow}
            >
              <span className={styles.footerLabel}>Social Loop</span>
              <div className={styles.socialGrid}>
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
