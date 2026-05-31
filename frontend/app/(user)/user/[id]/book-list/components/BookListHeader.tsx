"use client"

import { useEffect, useRef, useState } from "react"
import { MoreHorizontal, RotateCcw, Plus, Filter } from "lucide-react"
import styles from "../book-list.module.css"

interface BookListHeaderProps {
  activeCount: number
  onReset: () => void
  onNewBooking: () => void
  onToggleFilter: () => void
}

export default function BookListHeader({ activeCount, onReset, onNewBooking, onToggleFilter }: BookListHeaderProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div className={styles.sectionHeader}>
      <div className={styles.headerLeft}>
        <h2 className={styles.headerTitle}>Booking List</h2>
        <span className={styles.activeBadge}>{activeCount} Active</span>
      </div>
      <div className={styles.headerMenuWrapper} ref={ref}>
        <button className={styles.headerMenuBtn} onClick={() => setOpen(!open)}>
          <MoreHorizontal className="w-5 h-5" />
        </button>
        {open && (
          <div className={styles.dropdownMenu}>
            <button className={styles.dropdownItem} onClick={() => { onReset(); setOpen(false) }}>
              <RotateCcw className="w-4 h-4" />
              <span>Reset List State</span>
            </button>
            <button className={styles.dropdownItem} onClick={() => { onNewBooking(); setOpen(false) }}>
              <Plus className="w-4 h-4" />
              <span>New Booking</span>
            </button>
            <button className={styles.dropdownItem} onClick={() => { onToggleFilter(); setOpen(false) }}>
              <Filter className="w-4 h-4" />
              <span>Filter List</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
