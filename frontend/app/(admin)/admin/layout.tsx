"use client"

import styles from "./layout.module.css"
import AdminSidebar from "./components/AdminSidebar"
import AdminHeader from "./components/AdminHeader"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <AdminSidebar />
      <main className={styles.main}>
        <AdminHeader />
        <div className={styles.content}>
          <div className={styles.mainContent}>{children}</div>
        </div>
      </main>
    </div>
  )
}
