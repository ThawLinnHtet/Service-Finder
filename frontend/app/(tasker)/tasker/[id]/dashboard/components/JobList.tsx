"use client"

import { useEffect, useState } from "react"
import { MoreVertical } from "lucide-react"
import styles from "../dashboard.module.css"
import JobCard from "./JobCard"

const filters = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
]

export default function JobList() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [menuOpen, setMenuOpen] = useState(false)

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen)
  }

  const handleMenuSelect = (option: string) => {
    setMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest(`.${styles.menuWrapper}`)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside)
    }
    return () => document.removeEventListener("click", handleClickOutside)
  }, [menuOpen])

  return (
    <section className={styles.card}>
      <div className={styles.filterTabsContainer}>
        <div className={styles.filterTabs}>
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`${styles.filterTab} ${activeFilter === filter.id ? styles.filterTabActive : ""}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className={styles.menuWrapper}>
          <button className={styles.menuBtn} onClick={handleMenuClick}>
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className={styles.menuDropdown}>
              <button className={styles.menuItem} onClick={() => handleMenuSelect("pinned")}>
                Pinned
              </button>
              <button className={styles.menuItem} onClick={() => handleMenuSelect("select")}>
                Select
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.jobList}>
        <JobCard
          clientName="Client Name"
          serviceType="Move-out-cleaning"
          location="Haling Township"
          date="08-06-2026"
          status="Completed"
          isPinned
        />
        <JobCard
          clientName="Client Name"
          serviceType="General Repair"
          location="Haling Township"
          date="08-06-2026"
          status="Pending"
        />
      </div>
    </section>
  )
}
