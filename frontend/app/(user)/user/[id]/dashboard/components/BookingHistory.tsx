"use client"

import { useState, useRef, useEffect } from "react"
import { MoreVertical } from "lucide-react"
import styles from "../dashboard.module.css"
import BookingItem from "./BookingItem"

interface Booking {
  id: number
  name: string
  service: string
  date: string
  price: string
  status: "completed" | "cancelled" | "confirmed" | "assigned"
}

const tabs = [
  { id: "all", label: "All" },
  { id: "past", label: "Saved" },
  { id: "confirmed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
]

const bookings: Booking[] = [
  {
    id: 1,
    name: "Tasker Name",
    service: "Move-out-cleaning",
    date: "08-06-2026",
    price: "10000MMK",
    status: "completed",
  },
  {
    id: 2,
    name: "Tasker Name",
    service: "Move-out-cleaning",
    date: "08-06-2026",
    price: "10000MMK",
    status: "completed",
  },
  {
    id: 3,
    name: "Tasker Name",
    service: "Move-out-cleaning",
    date: "08-06-2026",
    price: "10000MMK",
    status: "cancelled",
  },
]

export default function BookingHistory() {
  const [activeTab, setActiveTab] = useState("all")
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={styles.bookingHistoryCard}>
      <div className={styles.tabsRow}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className={styles.kebabWrapper} ref={menuRef}>
          <button className={styles.kebabBtn} onClick={() => setMenuOpen((prev) => !prev)}>
            <MoreVertical className="w-5 h-5" />
          </button>
          {menuOpen && (
            <div className={styles.kebabDropdown}>
              <button className={styles.kebabItem} onClick={() => { setMenuOpen(false); /* select action */ }}>
                Select
              </button>
              <button className={styles.kebabItem} onClick={() => { setMenuOpen(false); /* delete action */ }}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.bookingList}>
        {bookings.map((booking) => (
          <BookingItem key={booking.id} {...booking} />
        ))}
      </div>
    </div>
  )
}
