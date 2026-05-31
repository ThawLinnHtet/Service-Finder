"use client"

import { useEffect } from "react"
import styles from "../history.module.css"

type ToastType = "success" | "warning" | "info"

interface ToastData {
  message: string
  type: ToastType
}

interface ToastProps {
  toast: ToastData | null
  onClose: () => void
}

const iconMap: Record<ToastType, JSX.Element> = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const borderClassMap: Record<ToastType, string> = {
  success: styles.toastSuccess,
  warning: styles.toastWarning,
  info: styles.toastInfo,
}

const iconClassMap: Record<ToastType, string> = {
  success: styles.toastIconSuccess,
  warning: styles.toastIconWarning,
  info: styles.toastIconInfo,
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast, onClose])

  if (!toast) return null

  return (
    <div className={styles.toastContainer}>
      <div className={`${styles.toast} ${borderClassMap[toast.type]}`}>
        <div className={`${styles.toastIcon} ${iconClassMap[toast.type]}`}>
          {iconMap[toast.type]}
        </div>
        <span className={styles.toastMessage}>{toast.message}</span>
        <button className={styles.toastClose} onClick={onClose}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
