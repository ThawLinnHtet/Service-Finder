"use client"

import { PackageOpen } from "lucide-react"
import styles from "../history.module.css"
import HistoryCard from "./HistoryCard"
import type { HistoryBooking } from "../page"

interface HistoryListProps {
  bookings: HistoryBooking[]
  onRebook: (id: number) => void
}

export default function HistoryList({ bookings, onRebook }: HistoryListProps) {
  if (bookings.length === 0) {
    return (
      <div className={styles.cardList}>
        <div className={styles.emptyState}>
          <PackageOpen className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No bookings found in this section.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.cardList}>
      {bookings.map((b) => (
        <HistoryCard key={b.id} booking={b} onRebook={onRebook} />
      ))}
    </div>
  )
}
