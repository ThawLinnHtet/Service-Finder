"use client"

import styles from "../settings.module.css"

interface PlaceholderTabProps {
  title: string
  description: string
}

export default function PlaceholderTab({ title, description }: PlaceholderTabProps) {
  return (
    <div className={styles.contentWrapper}>
      <h3 className={styles.contentTitle}>{title}</h3>
      <p className={styles.placeholderText}>{description}</p>
    </div>
  )
}
