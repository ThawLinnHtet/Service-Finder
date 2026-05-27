"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, User, BookOpen, Clock, MessageSquare, Settings, LogOut, PanelLeftOpen, PanelLeftClose } from "lucide-react"
import styles from "../sidebar.module.css"

export default function UserSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const navLinks = [
    { href: "/user/123/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/user/123/profile", label: "Profile", icon: User },
    { href: "/user/123/book-list", label: "Book List", icon: BookOpen },
    { href: "/user/123/history", label: "History", icon: Clock },
    { href: "/user/123/chat", label: "Chat", icon: MessageSquare },
    { href: "/user/123/settings", label: "Setting", icon: Settings },
  ]

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.sidebarTopSection}>
        <div className={styles.logo}>
          <h1 className={styles.logoText}>Logo</h1>
        </div>
        <button className={styles.panelToggle} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </button>
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
      <div className={styles.navSection}>
        <nav className={styles.nav}>
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ""}`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            )
          })}
          <Link href="#" className={`${styles.navLink} ${styles.navLinkExit}`}>
            <LogOut className="w-5 h-5" />
            <span>Exit</span>
          </Link>
        </nav>
          <div className={styles.sidebarFooter}>
            <LogOut className={styles.footerLogoutIcon} />
            <button className={styles.logoutBtn}>Log out</button>
            <p className={styles.termsText}>Terms of Use and Privacy Policy</p>
          </div>
      </div>
    </aside>
  )
}
