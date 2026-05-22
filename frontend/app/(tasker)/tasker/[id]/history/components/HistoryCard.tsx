"use client"

import { useState } from "react"
import { Building, Grid3x3, Calendar, Pin } from "lucide-react"
import styles from "../history.module.css"

export interface HistoryBooking {
  id: number
  client: string
  location: string
  service: string
  date: string
  rating: number
  pinned: boolean
  status: "Completed" | "Pending" | "Cancelled"
}

interface HistoryCardProps {
  booking: HistoryBooking
  isSelectionMode: boolean
  isChecked: boolean
  onToggle: (id: number) => void
  onRate: (id: number, rating: number) => void
  onTogglePin: (id: number) => void
}

export default function HistoryCard({
  booking,
  isSelectionMode,
  isChecked,
  onToggle,
  onRate,
  onTogglePin,
}: HistoryCardProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const statusClass =
    booking.status === "Completed"
      ? styles.statusCompleted
      : booking.status === "Pending"
      ? styles.statusPending
      : styles.statusCancelled

  return (
    <div className={styles.historyCard}>
      <div className={styles.cardMain}>
        <div className={styles.imageBox}>
          <Building className={styles.imageIcon} />
        </div>

        <div className={styles.clientInfo}>
          <div className={styles.clientName}>{booking.client}</div>
          <div className={styles.clientLocation}>
            <Grid3x3 className={styles.infoIcon} />
            <span>{booking.location}</span>
          </div>
        </div>

        <div className={styles.serviceDate}>
          <div className={styles.serviceName}>{booking.service}</div>
          <div className={styles.dateText}>
            <span className={styles.dateDot} />
            <Calendar className={styles.infoIcon} />
            <span>{booking.date}</span>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.starRow}>
            {[1, 2, 3, 4, 5].map((i) => {
              const filled = hoverRating > 0 ? i <= hoverRating : i <= booking.rating
              return (
                <button
                  key={i}
                  className={styles.starBtn}
                  onClick={() => onRate(booking.id, i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  title={`Rate ${i} star${i > 1 ? "s" : ""}`}
                >
                  {filled ? "★" : "☆"}
                </button>
              )
            })}
          </div>

          <button
            className={`${styles.pinBtn} ${booking.pinned ? styles.pinBtnActive : ""}`}
            onClick={() => onTogglePin(booking.id)}
            title={booking.pinned ? "Unpin" : "Pin to top"}
          >
            <Pin className={styles.pinIcon} />
            <span>{booking.pinned ? "Pinned" : "Pin"}</span>
          </button>

          <span className={`${styles.statusText} ${statusClass}`}>
            {booking.status}
          </span>
        </div>
      </div>

      <div
        className={styles.checkboxWrapper}
        style={{
          width: isSelectionMode ? "2rem" : "0",
          opacity: isSelectionMode ? 1 : 0,
          overflow: isSelectionMode ? "visible" : "hidden",
        }}
      >
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={isChecked}
            onChange={() => onToggle(booking.id)}
          />
          <div className={styles.checkboxBox}>
            <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </label>
      </div>
    </div>
  )
}
