"use client"

import { useState } from "react"
import { MoreVertical } from "lucide-react"
import styles from "../history.module.css"

interface Counts {
  completed: number
  pending: number
  cancelled: number
}

interface PanelHeaderProps {
  counts: Counts
  isSelectionMode: boolean
  selectedCount: number
  onToggleSelectionMode: () => void
  onSelectAll: () => void
  onDeleteSelected: () => void
}

export default function PanelHeader({
  counts,
  isSelectionMode,
  selectedCount,
  onToggleSelectionMode,
  onSelectAll,
  onDeleteSelected,
}: PanelHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className={styles.panelHeader}>
      <div className={styles.headerLeft}>
        <h2 className={styles.headerTitle}>Manage Booking</h2>
        <div className={styles.statusBadges}>
          <span className={`${styles.statusBadge} ${styles.statusBadgeCompleted}`}>
            {counts.completed} completed
          </span>
          <span className={`${styles.statusBadge} ${styles.statusBadgePending}`}>
            {counts.pending} Pending
          </span>
          <span className={`${styles.statusBadge} ${styles.statusBadgeCancelled}`}>
            {counts.cancelled} Cancelled
          </span>
        </div>
      </div>

      <div className={styles.actionsRow}>
        {!isSelectionMode ? (
          <div className={styles.bulkActionsWrapper}>
            <button className={styles.menuBtn} onClick={() => setDropdownOpen(!dropdownOpen)}>
              <MoreVertical className="w-6 h-6" />
            </button>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <button className={styles.dropdownItem} onClick={() => { onToggleSelectionMode(); setDropdownOpen(false) }}>
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Select
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className={styles.bulkActionsWrapper}>
              <button
                className={styles.bulkActionsBtn}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>Bulk Actions</span>
                <svg className={styles.dropdownIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button className={styles.dropdownItem} onClick={() => { onSelectAll(); setDropdownOpen(false) }}>
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Select all
                  </button>
                  <hr className={styles.dropdownDivider} />
                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                    onClick={() => { onDeleteSelected(); setDropdownOpen(false) }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete all
                  </button>
                </div>
              )}
            </div>
            <button className={styles.cancelBtn} onClick={onToggleSelectionMode}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  )
}
