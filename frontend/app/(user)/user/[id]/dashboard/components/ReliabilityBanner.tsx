"use client"

import styles from "../dashboard.module.css"

export default function ReliabilityBanner() {
  return (
    <div className={styles.reliabilityBanner}>
      <div className={styles.bannerContent}>
        <h2 className={styles.bannerTitle}>100%</h2>
        <p className={styles.bannerSubtitle}>Reliability Rate</p>
      </div>
      <div className={styles.bannerIllustration}>
        <svg viewBox="0 0 200 200" className={styles.bannerSvg}>
          <rect x="140" y="60" width="40" height="100" fill="#E2E8F0" rx="4" />
          <circle cx="160" cy="80" r="2" fill="#CBD5E0" />
          <circle cx="160" cy="100" r="2" fill="#CBD5E0" />
          <circle cx="160" cy="120" r="2" fill="#CBD5E0" />
          <path d="M80 160 L85 80 L110 80 L115 160" fill="#333" />
          <circle cx="97" cy="65" r="15" fill="#333" />
          <path d="M110 90 L150 90 L160 130 L120 130 Z" fill="#6366F1" />
        </svg>
      </div>
    </div>
  )
}
