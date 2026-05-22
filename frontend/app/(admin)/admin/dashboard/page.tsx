"use client"

import styles from "./dashboard.module.css"
import GreetingSection from "./components/GreetingSection"
import ServicesTable from "./components/ServicesTable"
import StatsCardGrid from "./components/StatsCardGrid"
import CalendarWidget from "./components/CalendarWidget"
import ActivityLog from "./components/ActivityLog"

export default function AdminDashboard() {
  return (
    <div className={styles.dashboardWrapper}>
      <section className={styles.mainContent}>
        <GreetingSection />
        <ServicesTable />
      </section>
      <aside className={styles.rightSidebar}>
        <StatsCardGrid />
        <CalendarWidget />
        <ActivityLog />
      </aside>
    </div>
  )
}
