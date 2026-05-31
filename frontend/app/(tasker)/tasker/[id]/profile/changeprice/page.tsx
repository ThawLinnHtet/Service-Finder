"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import styles from "./changeprice.module.css"
import PriceForm from "./components/PriceForm"
import SuccessModal from "./components/SuccessModal"

export default function ChangePricePage() {
  const router = useRouter()
  const params = useParams()
  const [baseRate, setBaseRate] = useState("")
  const [experienceYear, setExperienceYear] = useState("")
  const [reason, setReason] = useState("")
  const [successOpen, setSuccessOpen] = useState(false)
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" | "info" }>({
    show: false,
    message: "",
    type: "success",
  })

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 5000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!baseRate || !experienceYear || !reason) {
      showToast("Please fill in all fields before continuing.", "error")
      return
    }
    showToast(
      `Form submitted! Requested ${baseRate} MMK with ${experienceYear} YY experience.`,
      "success"
    )
    setSuccessOpen(true)
  }

  const handleBack = () => {
    setBaseRate("")
    setExperienceYear("")
    setReason("")
    setToast({ show: false, message: "", type: "success" })
    router.push(`/tasker/${params.id}/profile`)
  }

  const recapData = {
    baseRate: baseRate ? baseRate + " MMK" : "-",
    experience: experienceYear ? experienceYear + (experienceYear === "1" ? " Year" : " Years") : "-",
    reason: reason || "-",
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PriceForm
          baseRate={baseRate}
          experienceYear={experienceYear}
          reason={reason}
          toast={toast}
          onBaseRateChange={setBaseRate}
          onExperienceChange={setExperienceYear}
          onReasonChange={setReason}
          onSubmit={handleSubmit}
          onBack={handleBack}
        />
      </div>

      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        recap={recapData}
      />
    </div>
  )
}
