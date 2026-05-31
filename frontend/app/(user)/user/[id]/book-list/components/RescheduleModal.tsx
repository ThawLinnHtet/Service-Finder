"use client"

import { useState } from "react"
import { Calendar, X } from "lucide-react"
import styles from "../book-list.module.css"

interface RescheduleModalProps {
  bookingId: number | null
  onClose: () => void
  onConfirm: (id: number, date: string, time: string) => void
}

export default function RescheduleModal({ bookingId, onClose, onConfirm }: RescheduleModalProps) {
  const [date, setDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split("T")[0]
  })
  const [time, setTime] = useState("09:00")

  if (bookingId === null) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(bookingId, date, time)
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            <Calendar className="w-5 h-5" style={{ color: "#6D52C4" }} />
            <span>Reschedule Booking</span>
          </h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className={styles.modalDesc}>
          Select a new date and time for your booking. Your provider will be notified.
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>New Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>New Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={`${styles.modalBtn} ${styles.modalBtnSecondary}`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`${styles.modalBtn} ${styles.modalBtnPrimary}`}>
              Update Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
