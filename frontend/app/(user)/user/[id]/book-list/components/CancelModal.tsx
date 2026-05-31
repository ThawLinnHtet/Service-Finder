"use client"

import { AlertTriangle } from "lucide-react"
import styles from "../book-list.module.css"

interface CancelModalProps {
  bookingId: number | null
  providerName: string
  onClose: () => void
  onConfirm: (id: number) => void
}

export default function CancelModal({ bookingId, providerName, onClose, onConfirm }: CancelModalProps) {
  if (bookingId === null) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.cancelIcon}>
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className={styles.cancelModalTitle}>Cancel Booking?</h3>
        <p className={styles.cancelModalDesc}>
          Are you sure you want to cancel your service with{" "}
          <strong>{providerName}</strong>? This action cannot be undone.
        </p>

        <div className={styles.modalActions}>
          <button className={`${styles.modalBtn} ${styles.modalBtnSecondary}`} onClick={onClose}>
            Keep Booking
          </button>
          <button
            className={`${styles.modalBtn} ${styles.modalBtnDanger}`}
            onClick={() => onConfirm(bookingId)}
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
