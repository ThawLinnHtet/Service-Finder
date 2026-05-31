"use client"

import { LayoutGrid, Calendar } from "lucide-react"
import styles from "../dashboard.module.css"

interface BookingItemProps {
  id: number
  name: string
  service: string
  date: string
  price: string
  status: "completed" | "cancelled" | "confirmed" | "assigned"
}

function getStatusClass(status: string) {
  switch (status) {
    case "completed":
      return styles.statusCompleted
    case "cancelled":
      return styles.statusCancelled
    case "confirmed":
      return styles.statusConfirmed
    case "assigned":
      return styles.statusAssigned
    default:
      return ""
  }
}

export default function BookingItem({ name, service, date, price, status }: BookingItemProps) {
  return (
    <div className={styles.bookingItem}>
      <div className={styles.bookingInfo}>
        <div className={styles.bookingImage} />
        <div>
          <h4 className={styles.bookingName}>{name}</h4>
          <p className={styles.bookingService}>
            <LayoutGrid className="w-3 h-3" /> {service}
          </p>
          <p className={styles.bookingDate}>
            <Calendar className="w-3 h-3" /> {date}
          </p>
        </div>
      </div>
      <div className={styles.bookingActions}>
        <div className={styles.bookingPrice}>
          <span className={styles.priceSymbol}>K</span>
          {price.replace("MMK", "").trim()}
        </div>
        <p className={`${styles.bookingStatus} ${getStatusClass(status)}`}>
          {status}
        </p>
        <button className={styles.detailLink}>
          {status === "cancelled" ? "Details" : "Rebook"}
        </button>
      </div>
    </div>
  )
}
