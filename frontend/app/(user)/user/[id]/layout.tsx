"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  User,
  MessageSquare,
  Settings,
  LogOut,
  Globe,
  Bell,
} from "lucide-react"
import styles from "./sidebar.module.css"

interface UserLayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default function UserLayout({ children, params }: UserLayoutProps) {
  const pathname = usePathname()

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h1 className={styles.logoText}>Logo</h1>
        </div>

        <div className={styles.userSection}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarInner}>
              <User className="w-8 h-8" />
            </div>
          </div>
          <h2 className={styles.userName}>User Name</h2>
          <p className={styles.userEmail}>aung123@gmail.com</p>
        </div>

        <nav className={styles.nav}>
          <Link
            href="/user/123/dashboard"
            className={`${styles.navLink} ${
              pathname === "/user/123/dashboard" ? styles.navLinkActive : ""
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/user/123/profile"
            className={`${styles.navLink} ${
              pathname === "/user/123/profile" ? styles.navLinkActive : ""
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
          <Link
            href="/user/123/chat"
            className={`${styles.navLink} ${
              pathname === "/user/123/chat" ? styles.navLinkActive : ""
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Chat</span>
          </Link>
          <Link
            href="/user/123/settings"
            className={`${styles.navLink} ${
              pathname === "/user/123/settings" ? styles.navLinkActive : ""
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Setting</span>
          </Link>
          <Link
            href="#"
            className={`${styles.navLink} ${styles.navLinkExit}`}
          >
            <LogOut className="w-5 h-5" />
            <span>Exit</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn}>Log out</button>
          <p className={styles.termsText}>Terms of Use and Privacy Policy</p>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>Hello, User</h1>
          <div className={styles.headerIcons}>
            <button className={styles.headerIconBtn}>
              <Globe className="w-5 h-5" />
            </button>
            <button className={`${styles.headerIconBtn} ${styles.notificationBtn}`}>
              <Bell className="w-5 h-5" />
              <span className={styles.notificationDot} />
            </button>
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}