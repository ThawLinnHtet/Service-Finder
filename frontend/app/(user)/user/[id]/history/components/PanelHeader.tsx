"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpZA, ArrowDownAZ, RotateCcw } from "lucide-react"
import styles from "../history.module.css"

interface Counts {
  completed: number
  saved: number
  cancelled: number
}

type SortOrder = "newest" | "oldest"

interface PanelHeaderProps {
  counts: Counts
  sortOrder: SortOrder
  onSort: (order: SortOrder) => void
  onReset: () => void
}

export default function PanelHeader({
  counts,
  sortOrder,
  onSort,
  onReset,
}: PanelHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className={styles.panelHeader}>
      <div className={styles.headerLeft}>
        <h2 className={styles.headerTitle}>My Booking</h2>
        <div className={styles.statusBadges}>
          <span className={`${styles.statusBadge} ${styles.statusBadgeCompleted}`}>
            {counts.completed} completed
          </span>
          <span className={`${styles.statusBadge} ${styles.statusBadgePending}`}>
            {counts.saved} Saved
          </span>
          <span className={`${styles.statusBadge} ${styles.statusBadgeCancelled}`}>
            {counts.cancelled} Cancelled
          </span>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <a href="#" className={styles.pinnedLink}>Pinned</a>

        <div className={styles.bulkActionsWrapper}>
          <button className={styles.menuBtn} onClick={() => setDropdownOpen((p) => !p)}>
            <MoreHorizontal className="w-6 h-6" />
          </button>
          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button
                className={`${styles.dropdownItem} ${sortOrder === "newest" ? styles.dropdownItemActive : ""}`}
                onClick={() => { onSort("newest"); setDropdownOpen(false) }}
              >
                <ArrowUpZA className="w-4 h-4" /> Newest First
              </button>
              <button
                className={`${styles.dropdownItem} ${sortOrder === "oldest" ? styles.dropdownItemActive : ""}`}
                onClick={() => { onSort("oldest"); setDropdownOpen(false) }}
              >
                <ArrowDownAZ className="w-4 h-4" /> Oldest First
              </button>
              <hr className={styles.dropdownDivider} />
              <button
                className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                onClick={() => { onReset(); setDropdownOpen(false) }}
              >
                <RotateCcw className="w-4 h-4" /> Reset Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
