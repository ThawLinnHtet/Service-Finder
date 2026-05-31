"use client"

import styles from "../requests.module.css"
import RequestCard from "./RequestCard"

interface BookingRequest {
  id: number
  date: string
  weekday: string
  time: string
  category: string
  user: string
  location: string
  phone: string
}

interface RequestListProps {
  requests: BookingRequest[]
  isSelectionMode: boolean
  selectedIds: Set<number>
  onToggle: (id: number) => void
  onAccept: (id: number) => void
  onDecline: (id: number) => void
}

export default function RequestList({
  requests,
  isSelectionMode,
  selectedIds,
  onToggle,
  onAccept,
  onDecline,
}: RequestListProps) {
  if (requests.length === 0) {
    return (
      <div className={styles.cardList}>
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className={styles.emptyTitle}>No booking requests available</p>
          <p className={styles.emptySubtitle}>Check back later for new tasks!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.cardList}>
      {requests.map((req) => (
        <RequestCard
          key={req.id}
          request={req}
          isSelectionMode={isSelectionMode}
          isChecked={selectedIds.has(req.id)}
          onToggle={onToggle}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      ))}
    </div>
  )
}
