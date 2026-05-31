"use client"

import styles from "../history.module.css"
import HistoryCard from "./HistoryCard"
import type { HistoryBooking } from "./HistoryCard"

interface HistoryListProps {
  bookings: HistoryBooking[]
  isSelectionMode: boolean
  selectedIds: Set<number>
  onToggle: (id: number) => void
  onRate: (id: number, rating: number) => void
  onTogglePin: (id: number) => void
}

export default function HistoryList({
  bookings,
  isSelectionMode,
  selectedIds,
  onToggle,
  onRate,
  onTogglePin,
}: HistoryListProps) {
  if (bookings.length === 0) {
    return (
      <div className={styles.cardList}>
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className={styles.emptyTitle}>No booking history found</p>
          <p className={styles.emptySubtitle}>Try a different filter or check back later!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.cardList}>
      {bookings.map((b) => (
        <HistoryCard
          key={b.id}
          booking={b}
          isSelectionMode={isSelectionMode}
          isChecked={selectedIds.has(b.id)}
          onToggle={onToggle}
          onRate={onRate}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  )
}
