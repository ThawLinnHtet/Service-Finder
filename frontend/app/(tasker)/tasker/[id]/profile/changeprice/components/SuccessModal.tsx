"use client"

import { useRouter, useParams } from "next/navigation"
import styles from "../changeprice.module.css"

interface SuccessModalProps {
  open: boolean
  onClose: () => void
  recap: {
    baseRate: string
    experience: string
    reason: string
  }
}

export default function SuccessModal({ open, onClose, recap }: SuccessModalProps) {
  const router = useRouter()
  const params = useParams()

  const handleDashboard = () => {
    router.push(`/tasker/${params.id}/dashboard`)
  }

  return (
    <div className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}>
      <div className={`${styles.modalCard} text-center`}>
        <div className={styles.successIcon}>
          <svg fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className={styles.successTitle}>Price Request Submitted!</h3>
        <p className={styles.successDesc}>
          Your price change request has been submitted for review. You will be notified once it is approved.
        </p>
        <div className={styles.recapBox}>
          <div className={styles.recapRow}>
            <span className={styles.recapLabel}>Base Rate:</span>
            <span className={styles.recapValue}>{recap.baseRate}</span>
          </div>
          <div className={styles.recapRow}>
            <span className={styles.recapLabel}>Experience:</span>
            <span className={styles.recapValue}>{recap.experience}</span>
          </div>
          <div className={styles.recapRow}>
            <span className={styles.recapLabel}>Reason:</span>
            <span className={styles.recapValue}>{recap.reason}</span>
          </div>
        </div>
        <button type="button" onClick={handleDashboard} className={styles.btnDashboard}>
          Return to Dashboard
        </button>
      </div>
    </div>
  )
}
