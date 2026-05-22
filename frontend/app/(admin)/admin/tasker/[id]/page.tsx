"use client"

import { useState } from "react"
import styles from "./tasker.module.css"
import ProviderFormFields from "./components/ProviderFormFields"
import NrcPhotoSection from "./components/NrcPhotoSection"
import ActionFooter from "./components/ActionFooter"
import ToastNotification from "./components/ToastNotification"

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

export default function AdminTaskerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  })

  const handleAction = (type: "accept" | "decline") => {
    setToast({
      show: true,
      message: type === "accept"
        ? "Provider registration accepted successfully!"
        : "Provider registration declined.",
      type: type === "accept" ? "success" : "error",
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
    </div>
  )
}
