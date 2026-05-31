import styles from "../price.module.css"

interface ToastProps {
  show: boolean
  message: string
  type: "success" | "error"
}

export default function ToastNotification({ show, message, type }: ToastProps) {
  const toastClass = `${styles.toast} ${show ? styles.toastVisible : ""} ${type === "success" ? styles.toastSuccess : styles.toastError}`

  return (
    <div className={toastClass}>
      <span>{message}</span>
    </div>
  )
}
