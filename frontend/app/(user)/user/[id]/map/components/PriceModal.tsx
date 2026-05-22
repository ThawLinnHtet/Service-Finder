import styles from "../map.module.css"

interface PriceModalProps {
  show: boolean
  priceRange: number
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClose: () => void
  onApply: () => void
}

const formatPrice = (price: number) => {
  return price >= 1000 ? `${price / 1000}K` : price.toString()
}

export default function PriceModal({ show, priceRange, onPriceChange, onClose, onApply }: PriceModalProps) {
  return (
    <div className={`${styles.modal} ${show ? "" : styles.modalHidden}`}>
      <h3 className={styles.priceTitle}>Price in MMK</h3>
      <input
        type="range"
        min="10000"
        max="1000000"
        step="10000"
        value={priceRange}
        onChange={onPriceChange}
        className={styles.priceSlider}
      />
      <div className={styles.priceRange}>
        <span>10K</span>
        <span>1000K</span>
      </div>
      <p className={styles.priceValueDisplay}>
        MMK {formatPrice(priceRange)} -0K
      </p>
      <div className={styles.modalActions}>
        <button className={styles.modalCancelBtn} onClick={onClose}>
          Cancel
        </button>
        <button className={styles.modalApplyBtn} onClick={onApply}>
          Apply
        </button>
      </div>
    </div>
  )
}
