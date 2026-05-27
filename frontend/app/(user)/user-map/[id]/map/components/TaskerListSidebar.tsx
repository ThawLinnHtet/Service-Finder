"use client"

import { RefreshCw } from "lucide-react"
import type { Tasker } from "./types"
import TaskerCard from "./TaskerCard"
import styles from "../map.module.css"

interface TaskerListSidebarProps {
  taskers: Tasker[]
  showTaskerList: boolean
  onToggle: () => void
  onTaskerClick: (id: number) => void
}

export default function TaskerListSidebar({ taskers, showTaskerList, onToggle, onTaskerClick }: TaskerListSidebarProps) {
  return (
    <div className={`${styles.taskerList} ${!showTaskerList ? styles.taskerListHidden : ""}`}>
      <div className={styles.taskerListHeader}>
        <h2 className={styles.taskerListTitle}>All Taskers about category</h2>
      </div>

      <div className={styles.notificationBanner}>
        <svg className={styles.bannerArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
        </svg>
        2 New Taskers Added!
      </div>

      <div className={styles.taskerCards}>
        {taskers.map((tasker) => (
          <TaskerCard key={tasker.id} tasker={tasker} onClick={() => onTaskerClick(tasker.id)} />
        ))}
      </div>

      <div className={styles.taskerListFooter}>
        <button className={styles.cancelBtn} onClick={onToggle}>
          Cancel
        </button>
        <div className={styles.refreshText}>
          <RefreshCw className={styles.refreshIcon} />
          <div>
            <span className={styles.refreshLabel}>Please wait</span>
            <span className={styles.refreshSubtitle}>Click to load more</span>
          </div>
        </div>
      </div>
    </div>
  )
}
