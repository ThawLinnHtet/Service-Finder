"use client"

import styles from "./sidebar.module.css"
import UserSidebar from "./components/UserSidebar"
import UserHeader from "./components/UserHeader"

interface UserLayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default function UserLayout({ children, params }: UserLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <UserSidebar />
      <main className={styles.mainContent}>
        <UserHeader />
        {children}
      </main>
    </div>
  )
}
