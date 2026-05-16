"use client"

import { useState } from "react"
import {
  LayoutGrid,
  Calendar,
  Star,
  Mail,
  ChevronRight,
  Hammer,
  Toolbox,
} from "lucide-react"
import styles from "./dashboard.module.css"

interface BookingItem {
  id: number
  name: string
  service: string
  date: string
  price: string
  status: "completed" | "cancelled" | "confirmed" | "assigned"
}

interface UpcomingBooking {
  id: number
  service: string
  icon: React.ElementType
  dateTime: string
  taskerName: string
  rating: number
  status: "confirmed" | "assigned"
}

const bookings: BookingItem[] = [
  {
    id: 1,
    name: "Tasker Name",
    service: "Move-out-cleaning",
    date: "08-06-2026",
    price: "10000MMK",
    status: "completed",
  },
  {
    id: 2,
    name: "Tasker Name",
    service: "Move-out-cleaning",
    date: "08-06-2026",
    price: "10000MMK",
    status: "completed",
  },
  {
    id: 3,
    name: "Tasker Name",
    service: "Move-out-cleaning",
    date: "08-06-2026",
    price: "10000MMK",
    status: "cancelled",
  },
]

const upcomingBookings: UpcomingBooking[] = [
  {
    id: 1,
    service: "House Cleaning",
    icon: Toolbox,
    dateTime: "Thur , Oct 24 • 9:00PM",
    taskerName: "Hla Hla Win",
    rating: 4.5,
    status: "confirmed",
  },
  {
    id: 2,
    service: "Building",
    icon: Hammer,
    dateTime: "Thur , Oct 24 • 9:00PM",
    taskerName: "Ko Tin Maung",
    rating: 4.5,
    status: "assigned",
  },
]

const tabs = [
  { id: "all", label: "All" },
  { id: "past", label: "Past Booking" },
  { id: "confirmed", label: "Confirmed" },
  { id: "cancelled", label: "Cancelled" },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all")

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return styles.statusCompleted
      case "cancelled":
        return styles.statusCancelled
      case "confirmed":
        return styles.statusConfirmed
      case "assigned":
        return styles.statusAssigned
      default:
        return ""
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.contentGrid}>
        <div className={styles.leftColumn}>
          <div className={styles.reliabilityBanner}>
            <div className={styles.bannerContent}>
              <h2 className={styles.bannerTitle}>100%</h2>
              <p className={styles.bannerSubtitle}>Reliability Rate</p>
            </div>
            <div className={styles.bannerIllustration}>
              <svg viewBox="0 0 200 200" className={styles.bannerSvg}>
                <rect x="140" y="60" width="40" height="100" fill="#E2E8F0" rx="4" />
                <circle cx="160" cy="80" r="2" fill="#CBD5E0" />
                <circle cx="160" cy="100" r="2" fill="#CBD5E0" />
                <circle cx="160" cy="120" r="2" fill="#CBD5E0" />
                <path d="M80 160 L85 80 L110 80 L115 160" fill="#333" />
                <circle cx="97" cy="65" r="15" fill="#333" />
                <path d="M110 90 L150 90 L160 130 L120 130 Z" fill="#6366F1" />
              </svg>
            </div>
          </div>

          <div className={styles.bookingHistoryCard}>
            <div className={styles.tabs}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={styles.bookingList}>
              {bookings.map((booking) => (
                <div key={booking.id} className={styles.bookingItem}>
                  <div className={styles.bookingInfo}>
                    <div className={styles.bookingImage} />
                    <div>
                      <h4 className={styles.bookingName}>{booking.name}</h4>
                      <p className={styles.bookingService}>
                        <LayoutGrid className="w-3 h-3" /> {booking.service}
                      </p>
                      <p className={styles.bookingDate}>
                        <Calendar className="w-3 h-3" /> {booking.date}
                      </p>
                    </div>
                  </div>
                  <div className={styles.bookingActions}>
                    <div className={styles.bookingPrice}>
                      <span className={styles.priceSymbol}>K</span>
                      {booking.price.replace("MMK", "").trim()}
                    </div>
                    <p className={`${styles.bookingStatus} ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </p>
                    <button className={styles.detailLink}>
                      {booking.status === "cancelled" ? "Details" : "Rebook"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.upcomingSection}>
            <h3 className={styles.sectionTitle}>Upcoming Booking</h3>

            {upcomingBookings.map((booking) => {
              const Icon = booking.icon
              return (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingCardHeader}>
                    <div className={styles.bookingCardIcon}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className={styles.bookingCardInfo}>
                      <h4 className={styles.bookingCardTitle}>{booking.service}</h4>
                      <p className={styles.bookingCardDateTime}>{booking.dateTime}</p>
                    </div>
                    <span className={`${styles.bookingCardStatus} ${styles[`status${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}`]}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className={styles.bookingCardTasker}>
                    <div className={styles.taskerAvatar} />
                    <p className={styles.taskerName}>
                      {booking.taskerName}{" "}
                      <span className={styles.taskerRating}>
                        ({booking.rating} <Star className="w-3 h-3" />)
                      </span>
                    </p>
                  </div>

                  <div className={styles.bookingCardActions}>
                    {booking.status === "confirmed" ? (
                      <>
                        <button className={styles.rescheduleBtn}>Reschedule</button>
                        <button className={styles.cancelBtn}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className={styles.rescheduleBtn}>Chat</button>
                        <button className={styles.cancelBtn}>Details</button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

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
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h2 className={styles.footerLogo}>LOGO</h2>
            <p className={styles.footerCopyright}>
              @2026 Project. Dependable services for your home.
            </p>
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