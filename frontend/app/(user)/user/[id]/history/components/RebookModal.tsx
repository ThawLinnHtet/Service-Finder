"use client"

import { useState, useRef, useEffect } from "react"
import { RefreshCw, X } from "lucide-react"
import styles from "../history.module.css"
import type { HistoryBooking } from "../page"

interface RebookModalProps {
  booking: HistoryBooking
  onConfirm: (date: string) => void
  onClose: () => void
}

export default function RebookModal({ booking, onConfirm, onClose }: RebookModalProps) {
  const [date, setDate] = useState(() => {
    const t = new Date()
    t.setDate(t.getDate() + 1)
    return t.toISOString().split("T")[0]
  })
  const [notes, setNotes] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formatted = date.split("-").reverse().join("-")
    onConfirm(formatted)
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} ref={containerRef}>
        <div className={styles.modalHeader}>
          <div className={styles.modalIconBox}>
            <RefreshCw className="w-8 h-8" />
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <h3 className={styles.modalTitle}>Rebook Service</h3>
        <p className={styles.modalDesc}>
          You are rebooking the <strong>{booking.serviceType}</strong> service with <strong>{booking.taskerName}</strong>.
        </p>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Preferred Appointment Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Service Note (Optional)</label>
            <textarea
              placeholder="e.g. Please bring special detergent..."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={styles.formTextarea}
            />
          </div>

          <div className={styles.modalFeeRow}>
            <span className={styles.feeLabel}>Service Fee:</span>
            <span className={styles.feeValue}>
              <span className={styles.priceBadgeSmall}>K</span> {booking.price} MMK
            </span>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.modalCancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.modalConfirmBtn}>
              Confirm Rebook
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
