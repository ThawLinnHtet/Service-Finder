"use client"

import { useEffect } from "react"
import { X, Check, AlertTriangle, Info } from "lucide-react"
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

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <Check className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
}

const iconClassMap: Record<ToastType, string> = {
  success: styles.toastIconSuccess,
  warning: styles.toastIconWarning,
  info: styles.toastIconInfo,
}

const titleMap: Record<ToastType, string> = {
  success: "Operation Successful",
  warning: "Warning",
  info: "Info",
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(onClose, 4000)
      return () => clearTimeout(timer)
    }
  }, [toast, onClose])

  if (!toast) return null

  return (
    <div className={styles.toastContainer}>
      <div className={styles.toast}>
        <div className={`${styles.toastIcon} ${iconClassMap[toast.type]}`}>
          {iconMap[toast.type]}
        </div>
        <div className={styles.toastContent}>
          <h4 className={styles.toastTitle}>{titleMap[toast.type]}</h4>
          <p className={styles.toastMessage}>{toast.message}</p>
        </div>
        <button className={styles.toastClose} onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
