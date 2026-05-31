"use client"

import styles from "./dashboard.module.css"
import StatsGrid from "./components/StatsGrid"
import NewBookingRequests from "./components/NewBookingRequests"
import JobList from "./components/JobList"
import ActiveJobPanel from "./components/ActiveJobPanel"
import MessagesPanel from "./components/MessagesPanel"
import LocationOverview from "./components/LocationOverview"
import Footer from "../components/Footer"

export default function DashboardPage() {
  return (
    <div className={styles.main}>
      <StatsGrid />
      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <NewBookingRequests />
          <JobList />
        </div>
        <div className={styles.rightColumn}>
          <ActiveJobPanel />
          <MessagesPanel />
          <LocationOverview />
        </div>
      </div>
      <Footer />
    </div>
  )
}
