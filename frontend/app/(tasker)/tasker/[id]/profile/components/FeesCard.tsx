"use client"

import { Star } from "lucide-react"
import styles from "../profile.module.css"

export default function FeesCard() {
  return (
    <div className={styles.feesCard}>
      <div className={styles.feesContent}>
        <div className={styles.feesIcon}>
          <Star className="w-6 h-6" />
        </div>
        <div className={styles.feesText}>
          <h4 className={styles.feesTitle}>Your customer services fee</h4>
          <p className={styles.feesSubtitle}>From 20000MMK</p>
        </div>
      </div>
      <button className={styles.feesBtn}>Request more price</button>
    </div>
  )
}
