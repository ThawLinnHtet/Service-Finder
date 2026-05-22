"use client"

import styles from "./sidebar.module.css"
import TaskerSidebar from "./components/TaskerSidebar"
import TaskerHeader from "./components/TaskerHeader"

interface TaskerLayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default function TaskerLayout({ children, params }: TaskerLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <TaskerSidebar />
      <main className={styles.mainContent}>
        <TaskerHeader />
        {children}
      </main>
    </div>
  )
}
