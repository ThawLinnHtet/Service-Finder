"use client"

import { useState } from "react"
import { Image, CheckCircle, XCircle } from "lucide-react"
import styles from "./tasker.module.css"

interface TaskerData {
  name: string
  phone: string
  email: string
  password: string
  specificSkill: string
  currentLocation: string
  serviceArea: string
  serviceDescription: string
  baseRate: string
  experienceYear: string
  nrcFullForm: string
  nrcFront: string
  nrcBack: string
}

const taskerData: TaskerData = {
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
    if (type === "accept") {
      setToast({
        show: true,
        message: "Provider registration accepted successfully!",
        type: "success",
      })
    } else {
      setToast({
        show: true,
        message: "Provider registration declined.",
        type: "error",
      })
    }

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }))
    }, 3000)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Provider Registration Form</h1>
      </header>

      <div className={styles.formContent}>
        <div className={styles.formRow}>
          <span className={styles.formLabel}>Name :</span>
          <span className={styles.formValue}>{taskerData.name}</span>
        </div>

        <div className={styles.formRow}>
          <span className={styles.formLabel}>Ph No:</span>
          <span className={styles.formValue}>{taskerData.phone}</span>
        </div>

        <div className={styles.formRow}>
          <span className={styles.formLabel}>Email:</span>
          <span className={styles.formValue}>{taskerData.email}</span>
        </div>

        <div className={styles.formRow}>
          <span className={styles.formLabel}>Password:</span>
          <span className={styles.formValue}>{taskerData.password}</span>
        </div>

        <div className={styles.formRow}>
          <span className={styles.formLabel}>Specific Skill:</span>
          <span className={styles.formValue}>{taskerData.specificSkill}</span>
        </div>

        <div className={styles.formRow}>
          <span className={styles.formLabel}>Current Location:</span>
          <span className={styles.formValue}>{taskerData.currentLocation}</span>
        </div>

        <div className={styles.formRow}>
          <span className={styles.formLabel}>Service Area:</span>
          <span className={styles.formValue}>{taskerData.serviceArea}</span>
        </div>

        <div className={styles.formRowVertical}>
          <span className={styles.formLabel}>Service Description:</span>
          <span className={styles.descriptionPlaceholder}>
            {taskerData.serviceDescription || "(No description provided)"}
          </span>
        </div>

        <div className={styles.formRow}>
          <span className={styles.formLabel}>Base Rate(MMK):</span>
          <span className={styles.formValue}>{taskerData.baseRate}</span>
        </div>

        <div className={styles.formRow}>
          <span className={styles.formLabel}>Experience Year:</span>
          <span className={styles.formValue}>{taskerData.experienceYear}</span>
        </div>

        <div className={styles.formRow}>
          <span className={styles.formLabel}>NRC Full Form:</span>
          <span className={styles.formValue}>{taskerData.nrcFullForm}</span>
        </div>

        <div className={styles.nrcSection}>
          <div className={styles.nrcRow}>
            <div className={styles.nrcItem}>
              <span className={styles.formLabel}>NRC Photo:</span>
              <span className={styles.formValue}>Front</span>
              <div className={styles.nrcImageBox}>
                <Image className={styles.nrcImageIcon} />
              </div>
            </div>

            <div className={styles.nrcItem}>
              <span className={styles.formValue}>Back</span>
              <div className={styles.nrcImageBox}>
                <Image className={styles.nrcImageIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <button onClick={() => handleAction("decline")} className={styles.btnDecline}>
          Decline
        </button>
        <button onClick={() => handleAction("accept")} className={styles.btnAccept}>
          Accept
        </button>
      </footer>

      {toast.show && (
        <div className={styles.toast}>
          {toast.type === "success" ? (
            <CheckCircle className={styles.toastIconSuccess} />
          ) : (
            <XCircle className={styles.toastIconError} />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}