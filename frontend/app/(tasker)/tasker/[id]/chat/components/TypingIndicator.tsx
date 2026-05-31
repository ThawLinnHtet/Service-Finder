"use client"

import { Circle } from "lucide-react"
import styles from "../chat.module.css"

export default function TypingIndicator() {
  return (
    <div className={styles.typingIndicator}>
      <div className={styles.typingBubble}>
        <div className={styles.typingDots}>
          <Circle className={styles.dot} />
          <Circle className={styles.dot} />
          <Circle className={styles.dot} />
        </div>
        <span className={styles.typingText}>typing.....</span>
      </div>
    </div>
  )
}
