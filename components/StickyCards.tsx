"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cards } from "../lib/data";
import styles from "./StickyCards.module.scss";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ---------------------------------------------------------------------------
// Fan geometry
// ---------------------------------------------------------------------------
// Each card gets a rotation and horizontal offset so the deck fans out like
// a hand of playing cards spread on a table.  The centre card stays upright;
// cards further from centre tilt progressively more.
// ---------------------------------------------------------------------------

const getFanParams = (index: number, total: number) => {
  const mid = (total - 1) / 2;
  const t = (index - mid) / mid; // -1 … +1

  const maxRotation = 22;   // degrees at the outermost position
  const maxOffsetX = 260;  // px spread (desktop)
  const maxOffsetY = 60;   // px vertical arc drop at the edges
  const fanScale = 0.78; // scale while fanned

  return {
    rotate: t * maxRotation,
    x: t * maxOffsetX,
    // Arc: outer cards sit slightly lower than the centre one
    y: Math.abs(t) * maxOffsetY,
    scale: fanScale,
  };
};

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

interface CardData {
  title: string;
  description: string;
  src: string;
  url: string;
  color?: string;
}

interface CardProps extends CardData {
  i: number;
  total: number;
  cardRef: (el: HTMLDivElement | null) => void;
  cardInnerRef: (el: HTMLDivElement | null) => void;
}

function Card({ i, total, title, description, src, url, color, cardRef, cardInnerRef }: CardProps) {
  const localInnerRef = useRef<HTMLDivElement | null>(null);

  // 3-D tilt on hover
  useEffect(() => {
    const el = localInnerRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "rotateY", { duration: 0.35, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "rotateX", { duration: 0.35, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo(((e.clientX - r.left) / r.width - 0.5) * 12);
      yTo(-((e.clientY - r.top) / r.height - 0.5) * 12);
    };
    const onLeave = () => { xTo(0); yTo(0); };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={styles.cardContainer}
    >
      <div
        ref={(el) => {
          localInnerRef.current = el;
          cardInnerRef(el);
        }}
        className={styles.cardInner}
        style={{
          transformStyle: "preserve-3d",
          backgroundColor: color || "#18181b"
        }}
      >
        {/* Relevant image in the upper section */}
        <div className={styles.imageWrapper}>
          <Image
            src={src}
            alt={title}
            fill
            priority={i < 3}
            sizes="(max-width: 768px) 60vw, 280px"
            className="object-cover"
          />
        </div>

        {/* Content Section (text + link) */}
        <div className={styles.cardContent}>
          <div className={styles.textGroup}>
            <h2 className={styles.cardTitle}>{title}</h2>
            <p className={styles.cardDesc}>{description}</p>
          </div>
          <a href={url} className={styles.cardLink}>
            <span>See more</span>
            <svg
              width="16"
              height="16"
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
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StickyCards
// ---------------------------------------------------------------------------

export default function StickyCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardInnerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const deck = deckRef.current;
    if (!container || !deck) return;

    const inners = cardInnerRefs.current.filter(Boolean) as HTMLDivElement[];
    const outers = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const total = inners.length;

    // --- initial stacked state -------------------------------------------
    // All cards sit on top of each other, the top card is centred.
    // Each card is slightly smaller and offset downward than the one above.
    outers.forEach((el, i) => {
      const depth = total - 1 - i; // 0 = top card
      gsap.set(el, { zIndex: total - depth });
    });

    inners.forEach((el, i) => {
      const depth = total - 1 - i;
      gsap.set(el, {
        scale: 1 - depth * 0.04,
        y: depth * 14,
        rotate: (depth % 3 - 1) * 2,
        x: 0,
        opacity: 1,
      });
    });

    // --- entrance fade-in ------------------------------------------------
    gsap.fromTo(
      inners,
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          once: true,
        },
      }
    );

    // --- scroll-driven fan-out -------------------------------------------
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 640px) and (max-width: 1023px)",
          isMobile: "(max-width: 639px)",
        },
        (context) => {
          const { isDesktop, isTablet } = context.conditions as Record<string, boolean>;

          const xMultiplier = isDesktop ? 1.25 : isTablet ? 0.85 : 0.55;
          const yMultiplier = isDesktop ? 1 : isTablet ? 0.75 : 0.6;
          const rotMult = isDesktop ? 1 : isTablet ? 0.8 : 0.65;
          const fanScale = isDesktop ? 0.82 : isTablet ? 0.76 : 0.70;

          const mid = (total - 1) / 2;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: "+=200%",
              scrub: 0.6,
              pin: deck,
              pinSpacing: true,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          // Phase 1 (0 → 0.5): stack → fan
          inners.forEach((el, i) => {
            const t = (i - mid) / (mid || 1);
            const maxR = 22 * rotMult;
            const maxX = 320 * xMultiplier;
            const maxY = 60 * yMultiplier;

            tl.to(
              el,
              {
                rotate: t * maxR,
                x: t * maxX,
                y: Math.abs(t) * maxY,
                scale: fanScale,
                ease: "power2.inOut",
                duration: 0.5,
              },
              0
            );
          });

          // Phase 2 (0.5 → 1): fan holds (nothing to do — just let scrub sit)
        }
      );
    }, container);

    // --- hover: lift hovered card, dim siblings --------------------------
    inners.forEach((el, i) => {
      const siblings = inners.filter((_, j) => j !== i);

      el.addEventListener("mouseenter", () => {
        gsap.to(el, { y: "-=40", scale: "+=0.04", duration: 0.4, ease: "power2.out", overwrite: "auto" });
        gsap.to(siblings, { opacity: 0.28, duration: 0.3, ease: "power2.out" });
        gsap.to(outers[i], { zIndex: 999, duration: 0 });
      });

      el.addEventListener("mouseleave", () => {
        // Restore y and scale to whatever the scroll timeline has set
        ScrollTrigger.refresh(true);
        gsap.to(el, { scale: gsap.getProperty(el, "scale"), duration: 0.4, ease: "power2.out", overwrite: "auto" });
        gsap.to(siblings, { opacity: 1, duration: 0.4, ease: "power2.out" });
        gsap.to(outers[i], { zIndex: total - (total - 1 - i), duration: 0 });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className={styles.mainContainer}>
      <div ref={deckRef} className={styles.stickyDeck}>
        {cards.map((card, i) => (
          <Card
            key={card.title}
            i={i}
            total={cards.length}
            title={card.title}
            description={card.description}
            src={card.src}
            url={card.url}
            color={card.color}
            cardRef={(el) => { cardRefs.current[i] = el; }}
            cardInnerRef={(el) => { cardInnerRefs.current[i] = el; }}
          />
        ))}
      </div>
    </main>
  );
}