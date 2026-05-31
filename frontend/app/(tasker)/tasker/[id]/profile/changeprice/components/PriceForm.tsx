"use client"

import styles from "../changeprice.module.css"

interface PriceFormProps {
  baseRate: string
  experienceYear: string
  reason: string
  toast: { show: boolean; message: string; type: "success" | "error" | "info" }
  onBaseRateChange: (val: string) => void
  onExperienceChange: (val: string) => void
  onReasonChange: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
}

const formatNumber = (val: string) => {
  const digits = val.replace(/\D/g, "")
  return digits ? Number(digits).toLocaleString("en-US") : ""
}

export default function PriceForm({
  baseRate,
  experienceYear,
  reason,
  toast,
  onBaseRateChange,
  onExperienceChange,
  onReasonChange,
  onSubmit,
  onBack,
}: PriceFormProps) {
  const handleRateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBaseRateChange(formatNumber(e.target.value))
  }

  const toastClass = toast.show
    ? `${styles.toast} ${toast.type === "success" ? styles.toastSuccess : toast.type === "error" ? styles.toastError : styles.toastInfo}`
    : styles.toastHidden

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <h1 className={styles.title}>Request more price</h1>

      <div className={styles.rowGrid}>
        <div className={styles.fieldBase}>
          <label className={styles.fieldLabel}>Base Rate(MMK)</label>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={baseRate}
              onChange={handleRateInput}
              placeholder="e.g. 150000"
              className={styles.pillInput}
            />
            <span className={styles.inputSuffix}>MMK</span>
          </div>
        </div>

        <div className={styles.fieldExp}>
          <label className={styles.fieldLabel}>Experience Year</label>
          <div className={styles.selectContainer}>
            <select
              value={experienceYear}
              onChange={(e) => onExperienceChange(e.target.value)}
              className={styles.pillSelect}
            >
              <option value="" disabled hidden>YY</option>
              <option value="1">01 Year</option>
              <option value="2">02 Years</option>
              <option value="3">03 Years</option>
              <option value="4">04 Years</option>
              <option value="5">05 Years</option>
              <option value="6">06+ Years</option>
            </select>
            <div className={styles.selectArrowBox}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.fieldRating}>
          <div className={styles.ratingBadge}>
            <span className={styles.ratingValue}>4.0 / 5</span>
            <span className={styles.ratingLabel}>Rating</span>
          </div>
        </div>
      </div>

      <div className={styles.fieldFull}>
        <label className={styles.fieldLabel}>Your reason for request more fee</label>
        <textarea
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          rows={6}
          placeholder="Explain why you request the price?"
          className={styles.pillTextarea}
        />
      </div>

      <div className={toastClass}>
        {toast.message}
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onBack} className={styles.btnBack}>Back</button>
        <button type="submit" className={styles.btnContinue}>Continue</button>
      </div>
    </form>
  )
}
