import { ChevronLeft, ChevronRight } from "lucide-react"
import styles from "../dashboard.module.css"

const calendarDays = [
  { label: "Sun", date: "10" },
  { label: "Mon", date: "11" },
  { label: "Tue", date: "12" },
  { label: "Wed", date: "13", active: true },
  { label: "Thu", date: "14" },
  { label: "Fri", date: "15" },
  { label: "Sat", date: "16" },
]

export default function CalendarWidget() {
  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <h3 className={styles.calendarTitle}>May 2026</h3>
        <div className={styles.calendarNav}>
          <button className={styles.calendarNavBtn}><ChevronLeft className="w-5 h-5" /></button>
          <button className={styles.calendarNavBtn}><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      <div className={styles.calendarGrid}>
        {calendarDays.map((day, i) => (
          <div key={i} className={styles.calendarDay}>
            <div className={styles.calendarLabel}>{day.label}</div>
            {day.active ? (
              <div className={styles.calendarDateActive}>{day.date}</div>
            ) : (
              <div className={styles.calendarDate}>{day.date}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
