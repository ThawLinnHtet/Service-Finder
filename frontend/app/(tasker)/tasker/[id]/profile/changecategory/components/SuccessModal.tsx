"use client"

import styles from "../changecategory.module.css"

interface SuccessModalProps {
  open: boolean
  onClose: () => void
  recap: {
    category: string
    title: string
    rate: string
    experience: string
    skills: string
  }
}

export default function SuccessModal({ open, onClose, recap }: SuccessModalProps) {
  return (
    <div className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}>
      <div className={`${styles.modalCard} text-center`}>
        <div className={styles.successIcon}>
          <svg fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className={styles.successTitle}>Service Updated Successfully!</h3>
        <p className={styles.successDesc}>Your service information updates have been saved. Your profile has been updated automatically.</p>
        <div className={styles.recapBox}>
          <div className={styles.recapRow}>
            <span className={styles.recapLabel}>Category:</span>
            <span className={styles.recapValue}>{recap.category}</span>
          </div>
          <div className={styles.recapRow}>
            <span className={styles.recapLabel}>Job Title:</span>
            <span className={styles.recapValue}>{recap.title}</span>
          </div>
          <div className={styles.recapRow}>
            <span className={styles.recapLabel}>Base Rate:</span>
            <span className={styles.recapValue}>{recap.rate}</span>
          </div>
          <div className={styles.recapRow}>
            <span className={styles.recapLabel}>Experience:</span>
            <span className={styles.recapValue}>{recap.experience}</span>
          </div>
          <div className={styles.recapRow}>
            <span className={styles.recapLabel}>Skills Selected:</span>
            <span className={styles.recapValue}>{recap.skills}</span>
          </div>
        </div>
        <button type="button" onClick={onClose} className={styles.btnDashboard}>Return to Dashboard</button>
      </div>
    </div>
  )
}
