"use client"

import { useEffect, useState } from "react"
import {
  Briefcase,
  MessageSquare,
  Star,
  CheckCircle,
  LayoutGrid,
  Calendar,
  MapPin,
  ChevronRight,
  Mail,
  Clock,
  Sparkles,
  MoreVertical,
  Pin,
} from "lucide-react"
import styles from "./dashboard.module.css"

const stats = [
  { value: "1,234", label: "Total Jobs", icon: Briefcase, variant: "purple" },
  { value: "10", label: "Review By", icon: MessageSquare, variant: "orange" },
  { value: "4.0/5", label: "Rating", icon: Star, variant: "yellow" },
  { value: "0", label: "Completed", icon: CheckCircle, variant: "green" },
]

export default function DashboardPage() {
  const [elapsedTime, setElapsedTime] = useState("01:24:12")
  const [activeFilter, setActiveFilter] = useState("all")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let seconds = 5052
    const interval = setInterval(() => {
      seconds++
      const h = Math.floor(seconds / 3600).toString().padStart(2, "0")
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0")
      const s = (seconds % 60).toString().padStart(2, "0")
      setElapsedTime(`${h}:${m}:${s}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const filters = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ]

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen)
  }

  const handleMenuSelect = (option: string) => {
    setMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest(`.${styles.menuWrapper}`)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside)
    }
    return () => document.removeEventListener("click", handleClickOutside)
  }, [menuOpen])

  return (
    <div className={styles.main}>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={`${styles.statCard} ${styles[`statCard${stat.variant.charAt(0).toUpperCase() + stat.variant.slice(1)}`]}`}>
            <div>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
            <div className={`${styles.statIcon} ${styles[`statIcon${stat.variant.charAt(0).toUpperCase() + stat.variant.slice(1)}`]}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>New Booking Requests</h3>
            <div className={styles.bookingList}>
              <div className={styles.bookingItem}>
                <div className={styles.bookingInfo}>
                  <div className={styles.bookingAvatar} />
                  <div>
                    <h4 className={styles.bookingTitle}>Cleaning</h4>
                    <p className={styles.bookingLocation}>Location, Haling Township</p>
                    <p className={styles.bookingDate}>• Today</p>
                  </div>
                </div>
                <div className={styles.bookingActions}>
                  <button className={styles.declineBtn}>Decline</button>
                  <button className={styles.acceptBtn}>Accept</button>
                </div>
              </div>
              <div className={styles.bookingItem}>
                <div className={styles.bookingInfo}>
                  <div className={styles.bookingAvatar} />
                  <div>
                    <h4 className={styles.bookingTitle}>Repair</h4>
                    <p className={styles.bookingLocation}>Location, Haling Township</p>
                    <p className={styles.bookingDate}>• Today</p>
                  </div>
                </div>
                <div className={styles.bookingActions}>
                  <button className={styles.declineBtn}>Decline</button>
                  <button className={styles.acceptBtn}>Accept</button>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.card}>
<div className={styles.filterTabsContainer}>
            <div className={styles.filterTabs}>
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`${styles.filterTab} ${activeFilter === filter.id ? styles.filterTabActive : ""}`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className={styles.menuWrapper}>
              <button className={styles.menuBtn} onClick={handleMenuClick}>
                <MoreVertical className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className={styles.menuDropdown}>
                  <button className={styles.menuItem} onClick={() => handleMenuSelect("pinned")}>
                    Pinned
                  </button>
                  <button className={styles.menuItem} onClick={() => handleMenuSelect("select")}>
                    Select
                  </button>
                </div>
              )}
            </div>
          </div>
              {/* <div className={styles.menuWrapper}>
                <button className={styles.menuBtn} onClick={handleMenuClick}>
                  <MoreVertical className="w-4 h-4" />
                </button>
                {menuOpen && (
                  <div className={styles.menuDropdown}>
                    <button className={styles.menuItem} onClick={() => handleMenuSelect("pinned")}>
                      Pinned
                    </button>
                    <button className={styles.menuItem} onClick={() => handleMenuSelect("select")}>
                      Select
                    </button>
                  </div>
                )}
              </div> */}
            <div className={styles.jobList}>
              <div className={styles.jobCard}>
                <div className={styles.jobImage} />
                <div className={styles.jobContent}>
                  <div className={styles.jobHeader}>
                    <div>
                      <h4 className={styles.jobClientName}>Client Name</h4>
                      <p className={styles.jobServiceType}>Move-out-cleaning</p>
                    </div>
                    <div className={styles.jobRating}>
                      <Star className="w-3 h-3" />
                      <Star className="w-3 h-3" />
                      <Star className="w-3 h-3" />
                      <Star className="w-3 h-3" />
                      <Star className="w-3 h-3" />
                    </div>
                  </div>
                  <div className={styles.jobActions}>
                    <button className={styles.pinBtn}>
                      <Pin className="w-4 h-4" />pinned
                    </button>
                  </div>
                  <div className={styles.jobMeta}>
                    <span><LayoutGrid className="w-3 h-3" /> Haling Township</span>
                    <span><Calendar className="w-3 h-3" /> 08-06-2026</span>
                    <span className={styles.jobStatusCompleted}>Completed</span>
                  </div>
                </div>
              </div>

              <div className={styles.jobCard}>
                <div className={styles.jobImage} />
                <div className={styles.jobContent}>
                  <div className={styles.jobHeader}>
                    <div>
                      <h4 className={styles.jobClientName}>Client Name</h4>
                      <p className={styles.jobServiceType}>General Repair</p>
                    </div>
                    <div className={styles.jobRating}>
                      <Star className="w-3 h-3" />
                      <Star className="w-3 h-3" />
                      <Star className="w-3 h-3" />
                      <Star className="w-3 h-3" />
                      <Star className="w-3 h-3" />
                    </div>
                  </div>
                       <div className={styles.jobActions}>
                    <button className={styles.pinBtn}>
                      <Pin className="w-4 h-4" />pin
                    </button>
                  </div>
                  <div className={styles.jobMeta}>
                    <span><LayoutGrid className="w-3 h-3" /> Haling Township</span>
                    <span><Calendar className="w-3 h-3" /> 08-06-2026</span>
                    <span className={styles.jobStatusPending}>Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.rightColumn}>
          <section className={styles.activeJobCard}>
            <div className={styles.activeJobBadge}>Active Now</div>
            <h2 className={styles.activeJobTitle}>In progress job</h2>
            <div className={styles.activeJobRow}>
              <div className={styles.activeJobIconBox}>
                <Sparkles className="w-6 h-6" />
              </div>
              <div className={styles.activeJobTimerInfo}>
                <div className={styles.timerLabel}>
                  <span>Time Elapsed</span>
                  <span>{elapsedTime}</span>
                </div>
                <div className={styles.timerBar}>
                  <div className={styles.timerProgress} />
                </div>
                <div className={styles.timerSchedule}>
                  <span>Start: 4:00PM</span>
                  <span>Finish: 6:00PM</span>
                </div>
              </div>
            </div>
            <button className={styles.completeJobBtn}>Mark as Completed</button>
          </section>

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

          <section className={styles.card}>
            <div className={styles.locationHeader}>
              <h3 className={styles.cardTitle}>Location Overview</h3>
            </div>
            <div className={styles.locationMap}>
              <svg className={styles.mapGrid} viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.5" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.5" />
                <line x1="20" y1="0" x2="80" y2="100" stroke="white" strokeWidth="0.2" />
                <circle cx="60" cy="40" r="2" fill="white" />
              </svg>
              <div className={styles.mapPin}>
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div className={styles.locationInfo}>
              <Clock className="w-4 h-4" />
              <span>2 more jobs in this area today</span>
            </div>
          </section>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h1 className={styles.footerLogo}>LOGO</h1>
            <p className={styles.footerCopyright}>@2026 Project. Dependable services for your home.</p>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerColumnTitle}>Contact Us</h4>
            <a href="#" className={styles.footerLink}>About</a>
            <a href="#" className={styles.footerLink}>Terms of Services</a>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerColumnTitle}>Support</h4>
            <a href="#" className={styles.footerLink}>Privacy Policy</a>
            <a href="#" className={styles.footerLink}>Contact support</a>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerColumnTitle}>Connect</h4>
            <a href="#" className={styles.footerLink}>YouTube</a>
            <a href="#" className={styles.footerLink}>Telegram</a>
          </div>
        </div>
      </footer>
    </div>
  )
}