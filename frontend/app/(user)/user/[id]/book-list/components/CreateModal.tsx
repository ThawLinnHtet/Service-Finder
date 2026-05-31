"use client"

import { useState } from "react"
import { PlusCircle, X } from "lucide-react"
import styles from "../book-list.module.css"

interface CreateModalProps {
  onClose: () => void
  onConfirm: (service: string, provider: string, date: string, time: string) => void
}

const SERVICES = ["House Cleaning", "Deep Kitchen Clean", "Laundry & Ironing", "Office Sanitation"]
const PROVIDERS = [
  { name: "Hla Hla Win", rating: "4.5" },
  { name: "Khin Sandar", rating: "4.8" },
  { name: "Aung Myo", rating: "4.7" },
  { name: "Ei Mon", rating: "4.9" },
]

export default function CreateModal({ onClose, onConfirm }: CreateModalProps) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDate = tomorrow.toISOString().split("T")[0]

  const [service, setService] = useState(SERVICES[0])
  const [provider, setProvider] = useState(PROVIDERS[0].name)
  const [date, setDate] = useState(defaultDate)
  const [time, setTime] = useState("09:00")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(service, provider, date, time)
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            <PlusCircle className="w-5 h-5" style={{ color: "#6D52C4" }} />
            <span>Create Service Booking</span>
          </h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Service Type</label>
            <select className={styles.formSelect} value={service} onChange={(e) => setService(e.target.value)}>
              {SERVICES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Service Provider</label>
            <select className={styles.formSelect} value={provider} onChange={(e) => setProvider(e.target.value)}>
              {PROVIDERS.map((p) => (
                <option key={p.name} value={p.name}>{p.name} ({p.rating}&#9733;)</option>
              ))}
            </select>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={styles.formInput} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className={styles.formInput} />
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={`${styles.modalBtn} ${styles.modalBtnSecondary}`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`${styles.modalBtn} ${styles.modalBtnPrimary}`}>
              Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
