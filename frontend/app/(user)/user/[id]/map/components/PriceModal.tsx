"use client"

import { useState, useEffect, useRef } from "react"
import styles from "../map.module.css"

interface PriceModalProps {
  show: boolean
  priceRange: number
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClose: () => void
  onApply: () => void
  dropdown?: boolean
}

export default function PriceModal({ show, priceRange, onPriceChange, onClose, onApply, dropdown }: PriceModalProps) {
  const [notification, setNotification] = useState<{ text: string; success: boolean } | null>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!notification) return
    const timer = setTimeout(() => setNotification(null), 2500)
    return () => clearTimeout(timer)
  }, [notification])

  if (!show) return null

  const normalized = priceRange / 1000

  const eventFromValue = (value: number): React.ChangeEvent<HTMLInputElement> => {
    const input = document.createElement("input")
    input.value = String(value)
    return { target: input } as unknown as React.ChangeEvent<HTMLInputElement>
  }

  const handleApply = () => {
    setNotification({ text: `Applied: MMK 10K - ${normalized}K`, success: true })
    onApply()
  }

  const handleCancel = () => {
    onPriceChange(eventFromValue(10000))
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
          min="10000"
          max="1000000"
          step="10000"
          value={priceRange}
          onChange={onPriceChange}
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