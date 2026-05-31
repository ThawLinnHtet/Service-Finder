"use client"

import styles from "../map.module.css"

interface ToastProps {
  message: string
  visible: boolean
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <div className={`${styles.toast} ${visible ? styles.toastVisible : styles.toastHidden}`}>
      <i className={`fa-solid fa-circle-info ${styles.toastIcon}`} style={{ color: "#34d399" }} />
      <span className={styles.toastMsg}>{message}</span>
    </div>
  )
}
