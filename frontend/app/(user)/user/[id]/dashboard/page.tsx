"use client"

import styles from "./dashboard.module.css"
import ReliabilityBanner from "./components/ReliabilityBanner"
import BookingHistory from "./components/BookingHistory"
import UpcomingBookings from "./components/UpcomingBookings"
import MessagesPanel from "./components/MessagesPanel"
import Footer from "../components/Footer"

export default function DashboardPage() {
  return (
    <div className={styles.main}>
      <div className={styles.contentGrid}>
        <div className={styles.leftColumn}>
          <ReliabilityBanner />
          <BookingHistory />
        </div>
        <div className={styles.rightColumn}>
          <UpcomingBookings />
          <MessagesPanel />
        </div>
      </div>
      <Footer />
    </div>
  )
}
