"use client"

import { Star, Pin, LayoutGrid, Calendar } from "lucide-react"
import styles from "../dashboard.module.css"

export default function JobCard({
  clientName,
  serviceType,
  location,
  date,
  status,
  isPinned,
}: {
  clientName: string
  serviceType: string
  location: string
  date: string
  status: "Completed" | "Pending"
  isPinned?: boolean
}) {
  return (
    <div className={styles.jobCard}>
      <div className={styles.jobImage} />
      <div className={styles.jobContent}>
        <div className={styles.jobHeader}>
          <div>
            <h4 className={styles.jobClientName}>{clientName}</h4>
            <p className={styles.jobServiceType}>{serviceType}</p>
          </div>
          <div className={styles.jobRating}>
            <Star className="w-3 h-3" />
            <Star className="w-3 h-3" />
            <Star className="w-3 h-3" />
            <Star className="w-3 h-3" />
            <Star className="w-3 h-3" />
          </div>
        </div>
        <div className={styles.jobActions}>
          <button className={styles.pinBtn}>
            <Pin className="w-4 h-4" />{isPinned ? "pinned" : "pin"}
          </button>
        </div>
        <div className={styles.jobMeta}>
          <span><LayoutGrid className="w-3 h-3" /> {location}</span>
          <span><Calendar className="w-3 h-3" /> {date}</span>
          <span className={status === "Completed" ? styles.jobStatusCompleted : styles.jobStatusPending}>
            {status}
          </span>
        </div>
      </div>
    </div>
  )
}
