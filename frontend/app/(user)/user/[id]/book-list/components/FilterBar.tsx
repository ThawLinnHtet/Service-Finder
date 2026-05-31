"use client"

import styles from "../book-list.module.css"

const FILTERS = ["All", "Confirmed", "Rescheduled", "Cancelled"]

interface FilterBarProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className={styles.filterBar}>
      <span className={styles.filterLabel}>Filter status:</span>
      {FILTERS.map((f) => (
        <button
          key={f}
          className={`${styles.filterPill} ${activeFilter === f ? styles.filterPillActive : ""}`}
          onClick={() => onFilterChange(f)}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
