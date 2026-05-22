import styles from "../map.module.css"

interface FilterModalProps {
  show: boolean
  availableOnly: boolean
  noOffersOnly: boolean
  onToggleAvailable: (checked: boolean) => void
  onToggleNoOffers: (checked: boolean) => void
  onApply: () => void
}

export default function FilterModal({ show, availableOnly, noOffersOnly, onToggleAvailable, onToggleNoOffers, onApply }: FilterModalProps) {
  return (
    <div className={`${styles.modal} ${show ? "" : styles.modalHidden}`}>
      <h3 className={styles.filterTitle}>Adjust the tasker</h3>
      <div className={styles.filterItem}>
        <div className={styles.filterItemInfo}>
          <p className={styles.filterItemTitle}>Available tasks only</p>
          <p className={styles.filterItemSubtitle}>Hide tasks that are already assigned</p>
        </div>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            className={styles.toggleInput}
            checked={availableOnly}
            onChange={(e) => onToggleAvailable(e.target.checked)}
          />
          <span className={styles.toggleSlider} />
        </label>
      </div>
      <div className={styles.filterItem}>
        <div className={styles.filterItemInfo}>
          <p className={styles.filterItemTitle}>Tasks with no offers only</p>
          <p className={styles.filterItemSubtitle}>Hide tasks that have offers</p>
        </div>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            className={styles.toggleInput}
            checked={noOffersOnly}
            onChange={(e) => onToggleNoOffers(e.target.checked)}
          />
          <span className={styles.toggleSlider} />
        </label>
      </div>
      <button className={styles.filterApplyBtn} onClick={onApply}>
        Apply
      </button>
    </div>
  )
}
