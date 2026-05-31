"use client"

import { LayoutGrid, Calendar } from "lucide-react"
import styles from "../history.module.css"
import type { HistoryBooking } from "../page"

interface HistoryCardProps {
  booking: HistoryBooking
  onRebook: (id: number) => void
}

export default function HistoryCard({ booking, onRebook }: HistoryCardProps) {
  const statusColorClass =
    booking.status === "Completed"
      ? styles.statusCompleted
      : booking.status === "Saved"
      ? styles.statusPending
      : styles.statusCancelled

  return (
    <div className={styles.historyCard}>
      <div className={styles.cardMain}>
        <div className={styles.imageBox}>
          <img src={booking.image} alt={booking.taskerName} className={styles.cardImage} />
        </div>

        <div className={styles.clientInfo}>
          <div className={styles.clientName}>{booking.taskerName}</div>
          <div className={styles.clientLocation}>
            <LayoutGrid className={styles.infoIcon} />
            <span>{booking.serviceType}</span>
          </div>
        </div>

        <div className={styles.serviceDate}>
          <div className={styles.serviceName}>{booking.serviceType}</div>
          <div className={styles.dateText}>
            <span className={styles.dateDot} />
            <Calendar className={styles.infoIcon} />
            <span>{booking.date}</span>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.priceRow}>
            <span className={styles.priceBadge}>K</span>
            <span className={styles.priceValue}>{booking.price}MMK</span>
          </div>
          <span className={`${styles.statusText} ${statusColorClass}`}>
            {booking.status}
          </span>
          <button className={styles.rebookBtn} onClick={() => onRebook(booking.id)}>
            Rebook
          </button>
        </div>
      </div>
    </div>
  )
}
