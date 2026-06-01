"use client";

import React from "react";
import styles from "./Marquee.module.scss";

export default function Marquee() {
  const content = "ECOLOOP ✦ NOTHING GOES WASTE ✦ ";

  return (
    <div className={styles.backgroundMarquee}>
      <div className={styles.marqueeTrack}>
        <span className={styles.milkerText}>{content}</span>
        <span className={styles.milkerText}>{content}</span>
      </div>
    </div>
  );
}
