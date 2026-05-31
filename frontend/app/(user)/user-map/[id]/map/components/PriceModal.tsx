"use client"

import { useState, useEffect, useRef } from "react"
import styles from "../map.module.css"

interface PriceModalProps {
  open: boolean
  onClose: () => void
  priceRange: number
  onPriceChange: (value: number) => void
  formatPrice: (price: number) => string
  dropdown?: boolean
}

export default function PriceModal({ open, onClose, priceRange, onPriceChange, formatPrice, dropdown }: PriceModalProps) {
  const [notification, setNotification] = useState<{ text: string; success: boolean } | null>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!notification) return
    const timer = setTimeout(() => setNotification(null), 2500)
    return () => clearTimeout(timer)
  }, [notification])

  if (!open) return null

  const normalized = priceRange / 1000

  const handleApply = () => {
    setNotification({ text: `Applied: MMK 10K - ${normalized}K`, success: true })
  }

  const handleCancel = () => {
    onPriceChange(10000)
    onClose()
  }

  const content = (
    <div className={styles.priceModal} onClick={(e) => e.stopPropagation()}>
      <div
        ref={notifRef}
        className={`${styles.priceNotif} ${notification ? styles.priceNotifShow : ""}`}
        style={{ background: notification?.success === false ? "#e11d48" : "#6c5cb8" }}
      >
        <span>{notification?.text ?? ""}</span>
      </div>

      <h3 className={styles.priceTitle}>Price in MMK</h3>

      <div className={styles.priceSliderWrap}>
        <input
          type="range"
          min="10"
          max="1000"
          step="10"
          value={normalized}
          onChange={(e) => onPriceChange(parseInt(e.target.value) * 1000)}
          className={styles.priceSlider}
        />
      </div>

      <div className={styles.priceLabels}>
        <span>10K</span>
        <span>1000K</span>
      </div>

      <p className={styles.priceDisplay}>MMK 10K - {normalized}K</p>

      <div className={styles.priceActions}>
        <button className={styles.priceCancelBtn} onClick={handleCancel}>Cancel</button>
        <button className={styles.priceApplyBtn} onClick={handleApply}>Apply</button>
      </div>
    </div>
  )

  if (dropdown) return content

  return (
    <div className={styles.priceOverlay} onClick={onClose}>
      {content}
    </div>
  )
}
