"use client"

import { Briefcase, MessageSquare, Star, CheckCircle } from "lucide-react"
import styles from "../dashboard.module.css"

const stats = [
  { value: "1,234", label: "Total Jobs", icon: Briefcase, variant: "purple" },
  { value: "10", label: "Review By", icon: MessageSquare, variant: "orange" },
  { value: "4.0/5", label: "Rating", icon: Star, variant: "yellow" },
  { value: "0", label: "Completed", icon: CheckCircle, variant: "green" },
]

export default function StatsGrid() {
  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${styles.statCard} ${styles[`statCard${stat.variant.charAt(0).toUpperCase() + stat.variant.slice(1)}`]}`}
        >
          <div>
            <p className={styles.statValue}>{stat.value}</p>
            <p className={styles.statLabel}>{stat.label}</p>
          </div>
          <div className={`${styles.statIcon} ${styles[`statIcon${stat.variant.charAt(0).toUpperCase() + stat.variant.slice(1)}`]}`}>
            <stat.icon className="w-5 h-5" />
          </div>
        </div>
      ))}
    </div>
  )
}
