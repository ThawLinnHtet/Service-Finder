"use client"

import styles from "../requests.module.css"

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

interface RequestCardProps {
  request: BookingRequest
  isSelectionMode: boolean
  isChecked: boolean
  onToggle: (id: number) => void
  onAccept: (id: number) => void
  onDecline: (id: number) => void
}

export default function RequestCard({
  request,
  isSelectionMode,
  isChecked,
  onToggle,
  onAccept,
  onDecline,
}: RequestCardProps) {
  const [datePart] = request.date.split(" ")
  const day = request.date.split(" ")[1]
  const month = request.date.split(" ")[0]

  return (
    <div className={styles.card}>
      <div className={styles.cardRow}>
        <div className={styles.dateBlock}>
          <span className={styles.dateMonth}>{month}</span>
          <span className={styles.dateDay}>{day}</span>
          <span className={styles.dateWeekday}>{request.weekday}</span>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoColumn}>
            <div className={styles.infoRow}>
              <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={styles.infoText}>{request.time}</span>
            </div>
            <span className={styles.categoryBadge}>{request.category}</span>
          </div>

          <div className={styles.userSection}>
            <div className={styles.userRow}>
              <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className={styles.userLabel}>{request.user}</span>
            </div>
            <div className={styles.userRow}>
              <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className={styles.infoText}>{request.location}</span>
            </div>
          </div>

          <div className={styles.phoneRow}>
            <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className={styles.phoneText}>{request.phone}</span>
          </div>
        </div>
      </div>

      <div className={styles.cardActions}>
        <div className={styles.actionBtns}>
          <button className={styles.declineBtn} onClick={() => onDecline(request.id)}>
            Decline
          </button>
          <button className={styles.acceptBtn} onClick={() => onAccept(request.id)}>
            Accept
          </button>
        </div>

        <div
          className={styles.checkboxWrapper}
          style={{ width: isSelectionMode ? "2rem" : "0", opacity: isSelectionMode ? 1 : 0, overflow: isSelectionMode ? "visible" : "hidden" }}
        >
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkboxInput}
              checked={isChecked}
              onChange={() => onToggle(request.id)}
            />
            <div className={styles.checkboxBox}>
              <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
