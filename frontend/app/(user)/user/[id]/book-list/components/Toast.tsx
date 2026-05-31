"use client"

import { useEffect } from "react"
import { CheckCircle, AlertCircle, X } from "lucide-react"
import styles from "../book-list.module.css"

export interface ToastData {
  message: string
  type?: "success" | "error"
}

interface ToastProps {
  toast: ToastData | null
  onClose: () => void
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(onClose, 4000)
      return () => clearTimeout(timer)
    }
  }, [toast, onClose])

  if (!toast) return null

  const isError = toast.type === "error"

  return (
    <div className={styles.toastContainer}>
      <div className={`${styles.toast} ${isError ? styles.toastError : ""}`}>
        <div className={`${styles.toastIcon} ${isError ? styles.toastIconError : styles.toastIconSuccess}`}>
          {isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
        </div>
        <span className={styles.toastMessage}>{toast.message}</span>
        <button className={styles.toastCloseBtn} onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
