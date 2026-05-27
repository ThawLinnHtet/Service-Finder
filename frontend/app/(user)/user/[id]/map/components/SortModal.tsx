"use client"

import { Clock, DollarSign, TrendingUp } from "lucide-react"
import styles from "../map.module.css"

interface SortModalProps {
  show: boolean
  sortOption: string
  onSortChange: (option: string) => void
  onApply: () => void
  dropdown?: boolean
}

const options = [
  { id: "recent", label: "Most recently posted", icon: Clock },
  { id: "price_asc", label: "Lowest price", icon: DollarSign },
  { id: "price_desc", label: "Highest price", icon: TrendingUp },
]

export default function SortModal({ show, sortOption, onSortChange, onApply, dropdown }: SortModalProps) {
  if (!show) return null

  const content = (
    <div className={styles.sortModal} onClick={(e) => e.stopPropagation()}>
      <h2 className={styles.sortLabel}>Sort by</h2>

      <div className={styles.sortOptions}>
        {options.map((option) => {
          const Icon = option.icon
          const isActive = sortOption === option.id
          return (
            <button
              key={option.id}
              className={`${styles.sortOption} ${isActive ? styles.sortOptionActive : ""}`}
              onClick={() => onSortChange(option.id)}
            >
              <div className={`${styles.sortOptionIcon} ${isActive ? styles.sortOptionIconActive : ""}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>

      <div className={styles.sortFooter}>
        <button className={styles.sortApplyBtn} onClick={onApply}>Apply</button>
      </div>
    </div>
  )

  if (dropdown) return content

  return (
    <div className={styles.sortOverlay} onClick={onApply}>
      {content}
    </div>
  )
}