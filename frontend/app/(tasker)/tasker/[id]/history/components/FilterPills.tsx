"use client"

import styles from "../history.module.css"

const FILTERS = ["All", "Pending", "Completed", "Cancelled"] as const

export type HistoryFilter = (typeof FILTERS)[number]

interface FilterPillsProps {
  filter: HistoryFilter
  onFilterChange: (f: HistoryFilter) => void
}

export default function FilterPills({ filter, onFilterChange }: FilterPillsProps) {
  return (
    <div className={styles.filterPills}>
      {FILTERS.map((f) => (
        <button
          key={f}
          className={`${styles.pill} ${filter === f ? styles.pillActive : ""}`}
          onClick={() => onFilterChange(f)}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
