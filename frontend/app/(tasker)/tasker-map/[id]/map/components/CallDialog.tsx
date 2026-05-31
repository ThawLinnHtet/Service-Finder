"use client"

import styles from "../map.module.css"

interface CallDialogProps {
  open: boolean
  userName: string
  onClose: () => void
  onAccept: () => void
}

export default function CallDialog({ open, userName, onClose, onAccept }: CallDialogProps) {
  return (
    <div className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}>
      <div className={styles.callDialog}>
        <div className={styles.callAvatarWrap}>
          <div className={styles.callPing} />
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`}
            alt="Caller"
            className={styles.callAvatarImg}
          />
        </div>
        <h3 className={styles.callName}>{userName}</h3>
        <p className={styles.callStatus}>
          <i className={`fa-solid fa-phone-volume ${styles.callPulse}`} /> Tasker Dispatch Calling...
        </p>
        <div className={styles.callActions}>
          <button className={`${styles.callBtn} ${styles.callBtnDecline}`} onClick={onClose}>
            <i className="fa-solid fa-phone-slash" />
          </button>
          <button className={`${styles.callBtn} ${styles.callBtnAccept}`} onClick={onAccept}>
            <i className="fa-solid fa-check" />
          </button>
        </div>
      </div>
    </div>
  )
}
