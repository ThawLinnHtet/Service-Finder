import { CheckCircle, XCircle } from "lucide-react"
import styles from "../register.module.css"

interface ToastProps {
  show: boolean
  message: string
  type: "success" | "error"
}

export default function ToastNotification({ show, message, type }: ToastProps) {
  if (!show) return null

  return (
    <div className={styles.toast}>
      {type === "success" ? (
        <CheckCircle className={styles.toastIconSuccess} />
      ) : (
        <XCircle className={styles.toastIconError} />
      )}
      <span>{message}</span>
    </div>
  )
}
