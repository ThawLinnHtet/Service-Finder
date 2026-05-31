"use client"

import styles from "../map.module.css"

interface FilterModalProps {
  open: boolean
  onClose: () => void
  availableOnly: boolean
  onAvailableChange: (value: boolean) => void
  noOffersOnly: boolean
  onNoOffersChange: (value: boolean) => void
  dropdown?: boolean
}

export default function FilterModal({ open, onClose, availableOnly, onAvailableChange, noOffersOnly, onNoOffersChange, dropdown }: FilterModalProps) {
  if (!open) return null

  const content = (
    <div className={styles.filterModal} onClick={(e) => e.stopPropagation()}>
      <h2 className={styles.filterTitle}>Adjust the tasker</h2>

      <div className={styles.filterOption}>
        <div>
          <h3 className={styles.filterOptionTitle}>Available tasks only</h3>
          <p className={styles.filterOptionSub}>Hide tasks that are already assigned</p>
        </div>
        <label className={styles.toggleLabel}>
          <input type="checkbox" className={styles.toggleInput} checked={availableOnly} onChange={() => onAvailableChange(!availableOnly)} />
          <div className={`${styles.toggleTrack} ${availableOnly ? styles.toggleActive : ""}`}>
            <div className={`${styles.toggleDot} ${availableOnly ? styles.toggleDotOn : ""}`} />
          </div>
        </label>
      </div>

      <div className={styles.filterOption2}>
        <div>
          <h3 className={styles.filterOptionTitle}>Tasks with no offers only</h3>
          <p className={styles.filterOptionSub}>Hide tasks that have offers</p>
        </div>
        <label className={styles.toggleLabel}>
          <input type="checkbox" className={styles.toggleInput} checked={noOffersOnly} onChange={() => onNoOffersChange(!noOffersOnly)} />
          <div className={`${styles.toggleTrack} ${noOffersOnly ? styles.toggleActive : ""}`}>
            <div className={`${styles.toggleDot} ${noOffersOnly ? styles.toggleDotOn : ""}`} />
          </div>
        </label>
      </div>

      <div className={styles.filterActions}>
        <button className={styles.filterApplyBtn} onClick={onClose}>Apply</button>
      </div>
    </div>
  )

  if (dropdown) return content

  return (
    <div className={styles.filterOverlay} onClick={onClose}>
      {content}
    </div>
  )
}