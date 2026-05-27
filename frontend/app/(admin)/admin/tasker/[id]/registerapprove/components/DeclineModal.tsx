"use client"

import { useState } from "react"
import styles from "../register.module.css"

interface DeclineModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
}

export default function DeclineModal({ open, onClose, onSubmit }: DeclineModalProps) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState(false)

  if (!open) return null

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError(true)
      return
    }
    onSubmit(reason.trim())
    setReason("")
    setError(false)
  }

  return (
    <div className={styles.declineOverlay}>
      <div className={styles.declineModal}>
        <h3 className={styles.declineTitle}>Reason for Decline</h3>
        <div className={styles.declineClearRow}>
          <button type="button" onClick={() => { setReason(""); setError(false) }} className={styles.declineClearBtn}>
            Clear All
          </button>
        </div>
        <div className={styles.declineInputWrap}>
          <textarea
            value={reason}
            onChange={(e) => { setReason(e.target.value); setError(false) }}
            placeholder="Please write down the specific reason for declining this provider profile..."
            rows={6}
            className={styles.declineTextarea}
          />
        </div>
        <p className={`${styles.declineError} ${error ? styles.declineErrorVisible : ""}`}>
          * Please enter a reason before sending.
        </p>
        <div className={styles.declineActions}>
          <button type="button" onClick={onClose} className={styles.declineBtnCancel}>Cancel</button>
          <button type="button" onClick={handleSubmit} className={styles.declineBtnSend}>Send</button>
        </div>
      </div>
    </div>
  )
}
