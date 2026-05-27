"use client"

import styles from "../map.module.css"

interface FilterModalProps {
  show: boolean
  availableOnly: boolean
  noOffersOnly: boolean
  onToggleAvailable: (checked: boolean) => void
  onToggleNoOffers: (checked: boolean) => void
  onApply: () => void
  dropdown?: boolean
}

export default function FilterModal({ show, availableOnly, noOffersOnly, onToggleAvailable, onToggleNoOffers, onApply, dropdown }: FilterModalProps) {
  if (!show) return null

  const content = (
    <div className={styles.filterModal} onClick={(e) => e.stopPropagation()}>
      <h2 className={styles.filterTitle}>Adjust the tasker</h2>

      <div className={styles.filterOption}>
        <div>
          <h3 className={styles.filterOptionTitle}>Available tasks only</h3>
          <p className={styles.filterOptionSub}>Hide tasks that are already assigned</p>
        </div>
        <label className={styles.toggleLabel}>
          <input type="checkbox" className={styles.toggleInput} checked={availableOnly} onChange={(e) => onToggleAvailable(e.target.checked)} />
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
          <input type="checkbox" className={styles.toggleInput} checked={noOffersOnly} onChange={(e) => onToggleNoOffers(e.target.checked)} />
          <div className={`${styles.toggleTrack} ${noOffersOnly ? styles.toggleActive : ""}`}>
            <div className={`${styles.toggleDot} ${noOffersOnly ? styles.toggleDotOn : ""}`} />
          </div>
        </label>
      </div>

      <div className={styles.filterActions}>
        <button className={styles.filterApplyBtn} onClick={onApply}>Apply</button>
      </div>
    </div>
  )

  if (dropdown) return content

  return (
    <div className={styles.filterOverlay} onClick={onApply}>
      {content}
    </div>
  )
}