"use client"

import { MapPin, Clock } from "lucide-react"
import { useParams } from "next/navigation"
import Link from "next/link"
import styles from "../dashboard.module.css"

export default function LocationOverview() {
  const params = useParams()
  const taskerId = params.id as string

  return (
    <section className={styles.card}>
      <div className={styles.locationHeader}>
        <h3 className={styles.cardTitle}>Location Overview</h3>
      </div>
      <Link href={`/tasker-map/${taskerId}/map`} className={styles.locationMapLink}>
        <div className={styles.locationMap}>
          <svg className={styles.mapGrid} viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.5" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.5" />
            <line x1="20" y1="0" x2="80" y2="100" stroke="white" strokeWidth="0.2" />
            <circle cx="60" cy="40" r="2" fill="white" />
          </svg>
          <div className={styles.mapPin}>
            <MapPin className="w-5 h-5" />
          </div>
        </div>
      </Link>
      <div className={styles.locationInfo}>
        <Clock className="w-4 h-4" />
        <span>2 more jobs in this area today</span>
      </div>
    </section>
  )
}
