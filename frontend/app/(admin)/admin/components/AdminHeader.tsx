import { Users, Mail } from "lucide-react"
import styles from "../layout.module.css"

export default function AdminHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>Admin Dashboard</h1>
      <div className={styles.headerRight}>
        <div className={styles.avatars}>
          <img src="https://i.pravatar.cc/150?u=1" alt="Team" className={styles.avatar} />
          <img src="https://i.pravatar.cc/150?u=2" alt="Team" className={styles.avatar} />
          <img src="https://i.pravatar.cc/150?u=3" alt="Team" className={styles.avatar} />
          <div className={styles.avatarMore}>+3</div>
        </div>
        <button className={styles.inviteBtn}>
          <Users className="w-4 h-4" /> Invite
        </button>
        <div className={styles.divider} />
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><Mail className="w-5 h-5" /></button>
          <button className={styles.iconBtn}>
            <div className={styles.bellDot} />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
          </button>
          <div className={styles.profile}>
            <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className={styles.profileImg} />
            <span className={styles.profileName}>Admin</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>
    </header>
  )
}
