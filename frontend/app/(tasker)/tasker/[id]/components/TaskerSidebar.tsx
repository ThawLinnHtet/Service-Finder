import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, User, FileText, Clock, MessageSquare, Settings, LogOut } from "lucide-react"
import styles from "../sidebar.module.css"

export default function TaskerSidebar() {
  const pathname = usePathname()

  const navLinks = [
    { href: "/tasker/123/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tasker/123/profile", label: "Profile", icon: User },
    { href: "/tasker/123/requests", label: "Requests", icon: FileText },
    { href: "/tasker/123/history", label: "History", icon: Clock },
    { href: "/tasker/123/chat", label: "Chat", icon: MessageSquare },
    { href: "/tasker/123/settings", label: "Setting", icon: Settings },
  ]

  return (
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
        <h2 className={styles.userName}>Tasker Name</h2>
        <p className={styles.userEmail}>kaung123@gmail.com</p>
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
          <button className={styles.logoutBtn}>Log out</button>
          <p className={styles.termsText}>Terms of Use and Privacy Policy</p>
        </div>
      </div>
    </aside>
  )
}
