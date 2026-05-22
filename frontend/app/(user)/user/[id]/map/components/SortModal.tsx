import { Clock, DollarSign, TrendingUp } from "lucide-react"
import styles from "../map.module.css"

interface SortModalProps {
  show: boolean
  sortOption: string
  onSortChange: (option: string) => void
  onApply: () => void
}

export default function SortModal({ show, sortOption, onSortChange, onApply }: SortModalProps) {
  return (
    <div className={`${styles.modal} ${show ? "" : styles.modalHidden}`}>
      <h3 className={styles.sortTitle}>Sort by</h3>
      <div className={styles.sortOptions}>
        <button
          className={`${styles.sortOption} ${sortOption === "recent" ? styles.sortOptionActive : ""}`}
          onClick={() => onSortChange("recent")}
        >
          <Clock className="w-5 h-5" />
          Most recently posted
        </button>
        <button
          className={`${styles.sortOption} ${sortOption === "price_asc" ? styles.sortOptionActive : ""}`}
          onClick={() => onSortChange("price_asc")}
        >
          <DollarSign className="w-5 h-5" />
          Lowest price
        </button>
        <button
          className={`${styles.sortOption} ${sortOption === "price_desc" ? styles.sortOptionActive : ""}`}
          onClick={() => onSortChange("price_desc")}
        >
          <TrendingUp className="w-5 h-5" />
          Highest price
        </button>
      </div>
      <div className={styles.sortFooter}>
        <button className={styles.sortApplyBtn} onClick={onApply}>
          Apply
        </button>
      </div>
    </div>
  )
}
