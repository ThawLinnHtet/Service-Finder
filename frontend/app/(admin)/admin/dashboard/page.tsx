"use client"

import {
  User,
  Briefcase,
  ShoppingBag,
  Search,
  SlidersHorizontal,
  ChevronsUpDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import styles from "./dashboard.module.css"

const serviceData = [
  { name: "Aung Kaung Myat", date: "30 May 2026, 08:00PM", type: "House cleaning", amount: "10000MMK" },
  { name: "Aung Kaung Myat", date: "30 May 2026, 08:00PM", type: "House cleaning", amount: "10000MMK" },
  { name: "Aung Kaung Myat", date: "30 May 2026, 08:00PM", type: "House cleaning", amount: "10000MMK" },
  { name: "Aung Kaung Myat", date: "30 May 2026, 08:00PM", type: "House cleaning", amount: "10000MMK" },
  { name: "Aung Kaung Myat", date: "30 May 2026, 08:00PM", type: "House cleaning", amount: "10000MMK" },
  { name: "Aung Kaung Myat", date: "30 May 2026, 08:00PM", type: "House cleaning", amount: "10000MMK" },
]

const activities = [
  { name: "Aung Kaung Myat", action: "Add one new services", time: "5 hour ago" },
  { name: "Aung Kaung Myat", action: "Add one new services", time: "5 hour ago" },
  { name: "Aung Kaung Myat", action: "Add one new services", time: "5 hour ago" },
]

const calendarDays = [
  { label: "Sun", date: "10" },
  { label: "Mon", date: "11" },
  { label: "Tue", date: "12" },
  { label: "Wed", date: "13", active: true },
  { label: "Thu", date: "14" },
  { label: "Fri", date: "15" },
  { label: "Sat", date: "16" },
]

export default function AdminDashboard() {
  return (
    <div className={styles.dashboardWrapper}>
      <section className={styles.mainContent}>
        <div className={styles.greeting}>
          <h2 className={styles.greetingTitle}>Hello Admin, Good Morning</h2>
          <p className={styles.greetingSubtitle}>Let&apos;s check your mail.</p>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>Services Forms</h3>

            <div className={styles.tableActions}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search a tasker"
                  className={styles.searchInput}
                />
              </div>
              <button className={styles.filterBtn}>
                <SlidersHorizontal className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th className={styles.tableHeaderCell}>
                    <div className={styles.sortableHeader}>
                      Name <ChevronsUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className={styles.tableHeaderCell}>Date</th>
                  <th className={styles.tableHeaderCell}>Type</th>
                  <th className={styles.tableHeaderCell}>Amount</th>
                  <th className={styles.tableHeaderCell}></th>
                </tr>
              </thead>
              <tbody>
                {serviceData.map((row, i) => (
                  <tr key={i} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className={styles.nameCell}>
                        <div className={styles.avatar}></div>
                        <span className={styles.nameText}>{row.name}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>{row.date}</td>
                    <td className={styles.tableCell}>{row.type}</td>
                    <td className={styles.tableCell}>{row.amount}</td>
                    <td className={styles.tableCellAction}>
                      <button className={styles.moreBtn}>
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <aside className={styles.rightSidebar}>
        <div className={styles.statsGrid}>
          <div className={styles.statsCard}>
            <div className={styles.statsCardHeader}>
              <div className={`${styles.statsIcon} ${styles.statsIconBlue}`}>
                <User className="w-5 h-5" />
              </div>
              <span className={styles.statsLabel}>Users</span>
            </div>
            <div className={styles.statsValue}>1K</div>
            <div className={styles.progressBar}>
              <div className={`${styles.progressFill} ${styles.bgBlue}`} style={{ width: "70%" }}></div>
            </div>
            <div className={`${styles.progressBar} ${styles.progressBarLight}`}>
              <div className={`${styles.progressFill} ${styles.bgBlueLight}`} style={{ width: "30%" }}></div>
            </div>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statsCardHeader}>
              <div className={`${styles.statsIcon} ${styles.statsIconOrange}`}>
                <Briefcase className="w-5 h-5" />
              </div>
              <span className={styles.statsLabel}>Taskers</span>
            </div>
            <div className={styles.statsValue}>19K</div>
            <div className={styles.progressBar}>
              <div className={`${styles.progressFill} ${styles.bgOrange}`} style={{ width: "85%" }}></div>
            </div>
            <div className={`${styles.progressBar} ${styles.progressBarLight}`}>
              <div className={`${styles.progressFill} ${styles.bgOrangeLight}`} style={{ width: "40%" }}></div>
            </div>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statsCardHeader}>
              <div className={`${styles.statsIcon} ${styles.statsIconPurple}`}>
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className={styles.statsLabel}>Services</span>
            </div>
            <div className={styles.statsValue}>200</div>
            <div className={styles.progressBar}>
              <div className={`${styles.progressFill} ${styles.bgPurple}`} style={{ width: "45%" }}></div>
            </div>
            <div className={`${styles.progressBar} ${styles.progressBarLight}`}>
              <div className={`${styles.progressFill} ${styles.bgPurpleLight}`} style={{ width: "60%" }}></div>
            </div>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statsCardHeader}>
              <div className={`${styles.statsIcon} ${styles.statsIconTeal}`}>
                <span className="font-bold">K</span>
              </div>
              <span className={styles.statsLabel}>Earn MMK</span>
            </div>
            <div className={styles.statsValue}>200M</div>
            <div className={styles.progressBar}>
              <div className={`${styles.progressFill} ${styles.bgTeal}`} style={{ width: "65%" }}></div>
            </div>
            <div className={`${styles.progressBar} ${styles.progressBarLight}`}>
              <div className={`${styles.progressFill} ${styles.bgTealLight}`} style={{ width: "80%" }}></div>
            </div>
          </div>
        </div>

        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <h3 className={styles.calendarTitle}>May 2026</h3>
            <div className={styles.calendarNav}>
              <button className={styles.calendarNavBtn}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className={styles.calendarNavBtn}>
                <ChevronRight className="w-5 h-5" />
              </button>
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

        <div className={styles.divider}></div>

        <div className={styles.activityLog}>
          <h3 className={styles.activityTitle}>Activity Log</h3>
          <div className={styles.activityList}>
            {activities.map((act, i) => (
              <div key={i} className={styles.activityItem}>
                <div className={styles.activityAvatar}></div>
                <div className={styles.activityContent}>
                  <div className={styles.activityHeader}>
                    <h4 className={styles.activityName}>{act.name}</h4>
                    <span className={styles.activityTime}>{act.time}</span>
                  </div>
                  <p className={styles.activityAction}>{act.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}