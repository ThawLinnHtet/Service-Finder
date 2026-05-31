"use client"

import { Mail, ChevronRight } from "lucide-react"
import styles from "../dashboard.module.css"

export default function MessagesPanel() {
  return (
    <div className={styles.messagesCard}>
      <h3 className={styles.sectionTitle}>Messages</h3>
      <p className={styles.messagesSubtitle}>You have new messages</p>

      <div className={styles.messagesList}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.messageItem}>
            <div className={styles.messageIcon}>
              <Mail className="w-4 h-4" />
            </div>
            <div className={styles.messageContent}>
              <h5 className={styles.messageSender}>User Name</h5>
              <p className={styles.messagePreview}>I am late today.</p>
            </div>
            <div className={styles.messageMeta}>
              <p className={styles.messageTime}>Today 1:00pm</p>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
