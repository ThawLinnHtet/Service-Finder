"use client"

import { Mail, ChevronRight } from "lucide-react"
import styles from "../dashboard.module.css"

export default function MessagesPanel() {
  return (
    <section className={styles.card}>
      <h3 className={styles.cardTitle}>Messages</h3>
      <p className={styles.cardSubtitle}>You have new messages</p>
      <div className={styles.messageList}>
        <div className={styles.messageItem}>
          <div className={styles.messageIconBox}>
            <Mail className="w-4 h-4" />
          </div>
          <div className={styles.messageContent}>
            <div className={styles.messageHeader}>
              <h5 className={styles.messageSender}>User Name</h5>
              <span className={styles.messageTime}>Today 1:00pm</span>
            </div>
            <p className={styles.messagePreview}>I am late today.</p>
          </div>
          <ChevronRight className="w-3 h-3" />
        </div>
        <div className={styles.messageItem}>
          <div className={styles.messageIconBox}>
            <Mail className="w-4 h-4" />
          </div>
          <div className={styles.messageContent}>
            <div className={styles.messageHeader}>
              <h5 className={styles.messageSender}>User Name</h5>
              <span className={styles.messageTime}>Today 1:00pm</span>
            </div>
            <p className={styles.messagePreview}>I am late today.</p>
          </div>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </section>
  )
}
