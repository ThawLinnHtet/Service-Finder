"use client"

import { useState } from "react"
import styles from "./category.module.css"
import CategoryFormFields from "./components/CategoryFormFields"
import ActionFooter from "./components/ActionFooter"
import ToastNotification from "./components/ToastNotification"
import DeclineModal from "./components/DeclineModal"

export default function CategoryChangeApprovePage() {
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  })
  const [declineOpen, setDeclineOpen] = useState(false)

  const handleAction = (type: "accept" | "decline") => {
    if (type === "decline") {
      setDeclineOpen(true)
      return
    }
    const name = "Aung Kaung Myat"
    setToast({
      show: true,
      message: `Category update for ${name} has been approved and accepted!`,
      type: "success",
    })
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000)
  }

  const handleDeclineSubmit = (reason: string) => {
    setDeclineOpen(false)
    const name = "Aung Kaung Myat"
    setToast({
      show: true,
      message: `Category update for ${name} has been declined. Reason: ${reason}`,
      type: "error",
    })
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000)
  }

  return (
    <div className={styles.container}>
      <div className={styles.formBlock}>
        <div className={styles.titleWrap}>
          <h1 className={styles.title}>Provider Update Service Category Form</h1>
        </div>
        <CategoryFormFields />
      </div>
      <ActionFooter onAction={handleAction} />
      <ToastNotification show={toast.show} message={toast.message} type={toast.type} />
      <DeclineModal open={declineOpen} onClose={() => setDeclineOpen(false)} onSubmit={handleDeclineSubmit} />
    </div>
  )
}
