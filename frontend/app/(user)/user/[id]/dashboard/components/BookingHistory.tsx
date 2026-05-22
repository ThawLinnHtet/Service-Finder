"use client"

import { useState } from "react"
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

  return (
    <div className={styles.bookingHistoryCard}>
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
      <div className={styles.bookingList}>
        {bookings.map((booking) => (
          <BookingItem key={booking.id} {...booking} />
        ))}
      </div>
    </div>
  )
}
