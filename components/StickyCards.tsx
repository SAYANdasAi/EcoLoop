"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cards } from "../lib/data";
import styles from "./StickyCards.module.scss";

// Register ScrollTrigger for client-side execution
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CardProps {
  i: number;
  title: string;
  description: string;
  src: string;
  url: string;
  color: string;
  cardRef: (el: HTMLDivElement | null) => void;
  cardInnerRef: (el: HTMLDivElement | null) => void;
}

// Convert hex colors to a premium translucent RGBA format for glassmorphism
const hexToRGBA = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function Card({
  i,
  title,
  description,
  src,
  url,
  color,
  cardRef,
  cardInnerRef,
}: CardProps) {
  const localInnerRef = useRef<HTMLDivElement | null>(null);

  // 3D Tilt Hover effect using GSAP quickTo for buttery performance
  useEffect(() => {
    const cardInner = localInnerRef.current;
    if (!cardInner) return;

    // quickTo helpers for ultra-smooth 60fps movement
    const xTo = gsap.quickTo(cardInner, "rotateY", { duration: 0.4, ease: "power2.out" });
    const yTo = gsap.quickTo(cardInner, "rotateX", { duration: 0.4, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = cardInner.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      const mouseX = (e.clientX - rect.left) / width - 0.5;
      const mouseY = (e.clientY - rect.top) / height - 0.5;
      
      xTo(mouseX * 10);
      yTo(-mouseY * 10);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    cardInner.addEventListener("mousemove", handleMouseMove);
    cardInner.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cardInner.removeEventListener("mousemove", handleMouseMove);
      cardInner.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={cardRef} 
      className={styles.cardContainer}
    >
      <div className={styles.cardInnerWrapper}>
        <div
          ref={(el) => {
            localInnerRef.current = el;
            cardInnerRef(el);
          }}
          className={styles.cardInner}
          style={{
            backgroundColor: hexToRGBA(color, 0.65), // Translucent glassmorphism base
            transformStyle: "preserve-3d",
          }}
        >
          {/* Card Left Column with Parallax Text (floating in 3D Z-plane) */}
          <div className={styles.leftColumn} style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
            <div className={styles.textGroup}>
              <h2 className={styles.cardTitle}>{title}</h2>
              <p className={styles.cardDesc}>{description}</p>
            </div>
            <a href={url} className={styles.cardLink}>
              <span>See more</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          {/* Card Right Column with Parallax Image (floating in higher Z-plane) */}
          <div className={styles.rightColumn} style={{ transform: "translateZ(45px)", transformStyle: "preserve-3d" }}>
            <div className={styles.imageOuterWrapper}>
              <div className={styles.imageInner}>
                <Image
                  src={src}
                  alt={title}
                  fill
                  priority={i < 2}
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StickyCards() {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [windowWidth, setWindowWidth] = useState(1000);

  // Track responsive screen width for dynamic card fanning spacing
  useEffect(() => {
    if (typeof window === "undefined") return;
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // GSAP scroll trigger pinning & shuffling timeline
  useEffect(() => {
    // Register ScrollTrigger inside the client effect to ensure proper environment context
    gsap.registerPlugin(ScrollTrigger);

    const container = mainContainerRef.current;
    const stickyElement = container?.querySelector(`.${styles.stickyDeck}`);
    if (!container || !stickyElement) return;

    const cardsElements = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (cardsElements.length === 0) return;

    const cardWrappers = cardsElements.map(el => el.querySelector(`.${styles.cardInnerWrapper}`));
    const cardImages = cardsElements.map(el => el.querySelector(`.${styles.imageInner}`));
    const cardTexts = cardsElements.map(el => el.querySelector(`.${styles.textGroup}`));
    const innerCards = cardInnerRefs.current.filter((el): el is HTMLDivElement => el !== null);

    const ctx = gsap.context(() => {
      // 1. Initialize initial stacked states for wrapper containers and z-indices on parent containers
      cardsElements.forEach((el, i) => {
        const wrapper = cardWrappers[i];
        if (!wrapper) return;
        
        const initScale = 0.9 - i * 0.035;
        const initY = i * 12;
        const initRotate = (i % 3 - 1) * 1.5;
        const initZIndex = cardsElements.length - i;

        gsap.set(wrapper, {
          scale: initScale,
          y: initY,
          x: 0,
          rotate: initRotate,
        });

        gsap.set(el, {
          zIndex: initZIndex,
        });
      });

      // 2. Initialize internal card parallax elements starting state
      cardsElements.forEach((el, i) => {
        const img = cardImages[i];
        const text = cardTexts[i];
        if (img) gsap.set(img, { scale: 1.25, y: -25 });
        if (text) gsap.set(text, { y: 30 });
      });

      // 3. Reveal entrance animation for the inner cards once they enter viewport
      gsap.fromTo(
        innerCards,
        { opacity: 0, y: 80, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            once: true,
          },
        }
      );

      // 4. Create the main fanning & shuffling scrolltrigger timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=300%",
          scrub: 0.5,
          pin: stickyElement,
          pinSpacing: true,
          invalidateOnRefresh: true,
        }
      });

      cardsElements.forEach((el, i) => {
        const wrapper = cardWrappers[i];
        const img = cardImages[i];
        const text = cardTexts[i];
        if (!wrapper) return;

        // Circular loop radial position math:
        // Distribute the 5 cards evenly (72-degree increments) around a 360-degree loop.
        const angle = (i * 360) / 5 - 90; // Top starts at -90 degrees
        const angleRad = (angle * Math.PI) / 180;
        
        // Responsive loop radius and cards scaling values to perfectly fit different screens
        const radius = windowWidth < 640 ? 110 : windowWidth < 1024 ? 180 : 250;
        const fanScale = windowWidth < 640 ? 0.38 : windowWidth < 1024 ? 0.45 : 0.52;

        const fanX = radius * Math.cos(angleRad);
        const fanY = radius * Math.sin(angleRad);
        // A gentle, readable radial tilt so they fan organically along the curve without being upside down
        const fanRotate = (i - 2) * 10; 

        // Reversed stacked targets (at progress 0.75)
        const revScale = 0.9 - (4 - i) * 0.035;
        const revY = (4 - i) * 12;
        const revX = 0;
        const revRotate = ((4 - i) % 3 - 1) * 1.5;

        // timeline tweens
        // Stacking -> Circular Fanning (duration 0.3)
        tl.to(wrapper, {
          x: fanX,
          y: fanY,
          scale: fanScale,
          rotate: fanRotate,
          duration: 0.3,
          ease: "power2.inOut",
        }, 0.15);

        // Circular Fanning -> Reversed Stack (duration 0.3)
        tl.to(wrapper, {
          x: revX,
          y: revY,
          scale: revScale,
          rotate: revRotate,
          duration: 0.3,
          ease: "power2.inOut",
        }, 0.45);

        // Parallax effects across the active fanning-merging range (duration 0.6)
        if (img) {
          tl.to(img, {
            scale: 1.0,
            y: 25,
            duration: 0.6,
            ease: "power1.inOut",
          }, 0.15);
        }
        if (text) {
          tl.to(text, {
            y: -30,
            duration: 0.6,
            ease: "power1.inOut",
          }, 0.15);
        }
      });

      // Swapping zIndex on the parent container at exactly 0.45 progress (midpoint of fanning)
      cardsElements.forEach((el, i) => {
        tl.set(el, { zIndex: cardsElements.length - i }, 0);
        tl.set(el, { zIndex: i + 1 }, 0.45);
      });
    }, container);

    // Refresh ScrollTrigger after a slight delay to ensure correct layout calculations
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [windowWidth]);

  return (
    <main ref={mainContainerRef} className={styles.mainContainer}>
      <div className={styles.stickyDeck}>
        {cards.map((card, i) => (
          <Card
            key={card.title}
            i={i}
            title={card.title}
            description={card.description}
            src={card.src}
            url={card.url}
            color={card.color || "#111111"}
            cardRef={(el) => {
              cardRefs.current[i] = el;
            }}
            cardInnerRef={(el) => {
              cardInnerRefs.current[i] = el;
            }}
          />
        ))}
      </div>
    </main>
  );
}
