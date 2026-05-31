"use client"

import { useState } from "react"
import styles from "./price.module.css"
import PriceFormFields from "./components/PriceFormFields"
import ActionFooter from "./components/ActionFooter"
import ToastNotification from "./components/ToastNotification"
import DeclineModal from "./components/DeclineModal"

export default function PriceChangeApprovePage() {
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
      message: `Fee request for ${name} has been approved and saved!`,
      type: "success",
    })
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000)
  }

  const handleDeclineSubmit = (reason: string) => {
    setDeclineOpen(false)
    const name = "Aung Kaung Myat"
    setToast({
      show: true,
      message: `Fee request for ${name} has been declined. Reason: ${reason}`,
      type: "error",
    })
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000)
  }

  return (
    <div className={styles.container}>
      <div className={styles.formBlock}>
        <div className={styles.titleWrap}>
          <h1 className={styles.title}>Provider Requested Fee Form</h1>
        </div>
        <PriceFormFields />
      </div>
      <ActionFooter onAction={handleAction} />
      <ToastNotification show={toast.show} message={toast.message} type={toast.type} />
      <DeclineModal open={declineOpen} onClose={() => setDeclineOpen(false)} onSubmit={handleDeclineSubmit} />
    </div>
  )
}
