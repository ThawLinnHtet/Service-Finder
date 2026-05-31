"use client"

import { Calendar, Clock, Star, Briefcase } from "lucide-react"
import styles from "../book-list.module.css"

export interface Booking {
  id: number
  service: string
  provider: string
  rating: string
  date: string
  time: string
  status: "Confirmed" | "Rescheduled" | "Cancelled"
}

interface BookCardProps {
  booking: Booking
  onReschedule: (id: number) => void
  onCancel: (id: number, provider: string) => void
}

const statusClassMap: Record<string, string> = {
  Confirmed: "",
  Rescheduled: styles.cardStatusRescheduled,
  Cancelled: styles.cardStatusCancelled,
}

export default function BookCard({ booking, onReschedule, onCancel }: BookCardProps) {
  const isCancelled = booking.status === "Cancelled"
  const statusClass = statusClassMap[booking.status] || ""

  return (
    <div className={`${styles.card} ${isCancelled ? styles.cardCancelled : ""}`}>
      <div className={styles.cardWave} />

      <div className={styles.cardTop}>
        <div className={styles.cardServiceRow}>
          <div className={styles.cardServiceIcon}>
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h4 className={styles.cardServiceName}>
              {booking.service}
              {isCancelled && (
                <span style={{ marginLeft: "0.5rem", fontSize: "0.6875rem", background: "rgba(0,0,0,0.25)", padding: "0.125rem 0.5rem", borderRadius: "9999px", fontWeight: 400, verticalAlign: "middle" }}>
                  Cancelled
                </span>
              )}
            </h4>
            <p className={styles.cardDateTime}>
              <Clock className="w-3 h-3" />
              <span>{booking.date} &bull; {booking.time}</span>
            </p>
          </div>
        </div>

        <div className={styles.cardProviderBlock}>
          <div className={styles.cardProviderAvatar}>
            {booking.provider.charAt(0)}
          </div>
          <div>
            <p className={styles.cardProviderName}>{booking.provider}</p>
            <p className={styles.cardProviderRating}>
              <Star className={styles.cardRatingStar} />
              <span>({booking.rating}&#9733;)</span>
            </p>
          </div>
          <span className={`${styles.cardStatusBadge} ${statusClass}`}>
            {booking.status}
          </span>
        </div>
      </div>

      <div className={styles.cardActions}>
        <button
          className={`${styles.cardActionBtn} ${styles.cardActionPrimary}`}
          disabled={isCancelled}
          onClick={() => onReschedule(booking.id)}
        >
          <Calendar className="w-4 h-4" />
          <span>Reschedule</span>
        </button>
        <button
          className={`${styles.cardActionBtn} ${styles.cardActionSecondary}`}
          disabled={isCancelled}
          onClick={() => onCancel(booking.id, booking.provider)}
        >
          <span>Cancel</span>
        </button>
      </div>
    </div>
  )
}
