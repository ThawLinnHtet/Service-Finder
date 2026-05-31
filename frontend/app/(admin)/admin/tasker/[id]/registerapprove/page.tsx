"use client"

import { useState } from "react"
import styles from "./register.module.css"
import ProviderFormFields from "./components/ProviderFormFields"
import NrcPhotoSection from "./components/NrcPhotoSection"
import ActionFooter from "./components/ActionFooter"
import ToastNotification from "./components/ToastNotification"
import DeclineModal from "./components/DeclineModal"

const taskerData = {
  name: "Aung Kaung Myat",
  phone: "09774271230",
  email: "aung123@gmail.com",
  password: "123456",
  specificSkill: "House Cleaning, repair",
  currentLocation: "Haling, Yangon",
  serviceArea: "Yangon",
  serviceDescription: "",
  baseRate: "100000MMK",
  experienceYear: "3 year",
  nrcFullForm: "6/mangyi(naing)123456",
  nrcFront: "",
  nrcBack: "",
}

export default function RegisterApprovePage() {
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
    setToast({
      show: true,
      message: "Provider registration accepted successfully!",
      type: "success",
    })
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000)
  }

  const handleDeclineSubmit = (reason: string) => {
    setDeclineOpen(false)
    setToast({
      show: true,
      message: `Provider registration declined. Reason: ${reason}`,
      type: "error",
    })
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Provider Registration Form</h1>
      </header>
      <ProviderFormFields data={taskerData} />
      <NrcPhotoSection />
      <ActionFooter onAction={handleAction} />
      <ToastNotification show={toast.show} message={toast.message} type={toast.type} />
      <DeclineModal open={declineOpen} onClose={() => setDeclineOpen(false)} onSubmit={handleDeclineSubmit} />
    </div>
  )
}
