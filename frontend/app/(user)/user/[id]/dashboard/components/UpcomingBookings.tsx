"use client"

import { Star, Hammer, Toolbox } from "lucide-react"
import styles from "../dashboard.module.css"

interface UpcomingBooking {
  id: number
  service: string
  icon: React.ElementType
  dateTime: string
  taskerName: string
  rating: number
  status: "confirmed" | "assigned"
}

const upcomingBookings: UpcomingBooking[] = [
  {
    id: 1,
    service: "House Cleaning",
    icon: Toolbox,
    dateTime: "Thur , Oct 24 • 9:00PM",
    taskerName: "Hla Hla Win",
    rating: 4.5,
    status: "confirmed",
  },
  {
    id: 2,
    service: "Building",
    icon: Hammer,
    dateTime: "Thur , Oct 24 • 9:00PM",
    taskerName: "Ko Tin Maung",
    rating: 4.5,
    status: "assigned",
  },
]

export default function UpcomingBookings() {
  return (
    <div className={styles.upcomingSection}>
      <h3 className={styles.sectionTitle}>Upcoming Booking</h3>

      {upcomingBookings.map((booking) => {
        const Icon = booking.icon
        const statusKey = `status${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}` as keyof typeof styles
        return (
          <div key={booking.id} className={styles.bookingCard}>
            <div className={styles.bookingCardHeader}>
              <div className={styles.bookingCardIcon}>
                <Icon className="w-5 h-5" />
              </div>
              <div className={styles.bookingCardInfo}>
                <h4 className={styles.bookingCardTitle}>{booking.service}</h4>
                <p className={styles.bookingCardDateTime}>{booking.dateTime}</p>
              </div>
              <span className={`${styles.bookingCardStatus} ${styles[statusKey]}`}>
                {booking.status}
              </span>
            </div>

            <div className={styles.bookingCardTasker}>
              <div className={styles.taskerAvatar} />
              <p className={styles.taskerName}>
                {booking.taskerName}{" "}
                <span className={styles.taskerRating}>
                  ({booking.rating} <Star className="w-3 h-3" />)
                </span>
              </p>
            </div>

            <div className={styles.bookingCardActions}>
              {booking.status === "confirmed" ? (
                <>
                  <button className={styles.rescheduleBtn}>Reschedule</button>
                  <button className={styles.cancelBtn}>Cancel</button>
                </>
              ) : (
                <>
                  <button className={styles.rescheduleBtn}>Chat</button>
                  <button className={styles.cancelBtn}>Details</button>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
