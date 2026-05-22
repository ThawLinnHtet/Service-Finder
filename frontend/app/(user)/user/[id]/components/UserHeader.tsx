import { Globe, Bell } from "lucide-react"
import styles from "../sidebar.module.css"

export default function UserHeader() {
  return (
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
  )
}
