"use client"

import { Sparkles } from "lucide-react"
import styles from "../dashboard.module.css"
import Timer from "./Timer"

export default function ActiveJobPanel() {
  return (
    <section className={styles.activeJobCard}>
      <div className={styles.activeJobBadge}>Active Now</div>
      <h2 className={styles.activeJobTitle}>In progress job</h2>
      <div className={styles.activeJobRow}>
        <div className={styles.activeJobIconBox}>
          <Sparkles className="w-6 h-6" />
        </div>
        <Timer />
      </div>
      <button className={styles.completeJobBtn}>Mark as Completed</button>
    </section>
  )
}
