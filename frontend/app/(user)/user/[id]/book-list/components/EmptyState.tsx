"use client"

import { FolderOpen } from "lucide-react"
import styles from "../book-list.module.css"

interface EmptyStateProps {
  filter: string
}

export default function EmptyState({ filter }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <FolderOpen className={styles.emptyIcon} />
      <p className={styles.emptyText}>
        No bookings found for &ldquo;{filter}&rdquo;
      </p>
      <p className={styles.emptySubtext}>
        Try changing the filter or create a new booking.
      </p>
    </div>
  )
}
