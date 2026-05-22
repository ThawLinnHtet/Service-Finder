import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Mail, Settings } from "lucide-react"
import styles from "../layout.module.css"

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarIcon}>
        <LayoutDashboard className="w-6 h-6" />
      </div>
      <nav className={styles.nav}>
        <Link href="/admin/dashboard" className={`${styles.navItem} ${pathname === "/admin/dashboard" ? styles.navItemActive : ""}`}>
          <LayoutDashboard className="w-5 h-5" />
        </Link>
        <Link href="#" className={styles.navItem}><Users className="w-5 h-5" /></Link>
        <Link href="#" className={styles.navItem}><Mail className="w-5 h-5" /></Link>
        <Link href="#" className={styles.navItem}><Settings className="w-5 h-5" /></Link>
      </nav>
    </aside>
  )
}
