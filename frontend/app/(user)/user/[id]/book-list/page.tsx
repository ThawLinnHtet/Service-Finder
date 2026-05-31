"use client"

import { useState, useCallback, useMemo } from "react"
import styles from "./book-list.module.css"
import BookListHeader from "./components/BookListHeader"
import FilterBar from "./components/FilterBar"
import BookCard from "./components/BookCard"
import type { Booking } from "./components/BookCard"
import Pagination from "./components/Pagination"
import EmptyState from "./components/EmptyState"
import RescheduleModal from "./components/RescheduleModal"
import CancelModal from "./components/CancelModal"
import CreateModal from "./components/CreateModal"
import Toast from "./components/Toast"
import type { ToastData } from "./components/Toast"

const initialBookings: Booking[] = [
  { id: 1, service: "House Cleaning", provider: "Hla Hla Win", rating: "4.5", date: "Thur, Oct 24", time: "9:00PM", status: "Confirmed" },
  { id: 2, service: "House Cleaning", provider: "Hla Hla Win", rating: "4.5", date: "Thur, Oct 24", time: "9:00PM", status: "Confirmed" },
  { id: 3, service: "House Cleaning", provider: "Hla Hla Win", rating: "4.5", date: "Thur, Oct 24", time: "9:00PM", status: "Confirmed" },
  { id: 4, service: "Deep Kitchen Clean", provider: "Khin Sandar", rating: "4.8", date: "Fri, Oct 25", time: "10:00AM", status: "Confirmed" },
  { id: 5, service: "Laundry & Ironing", provider: "Aung Myo", rating: "4.7", date: "Sat, Oct 26", time: "2:00PM", status: "Confirmed" },
  { id: 6, service: "Office Sanitation", provider: "Ei Mon", rating: "4.9", date: "Mon, Oct 28", time: "8:00AM", status: "Confirmed" },
  { id: 7, service: "House Cleaning", provider: "Hla Hla Win", rating: "4.5", date: "Tue, Oct 29", time: "11:30AM", status: "Confirmed" },
  { id: 8, service: "Deep Kitchen Clean", provider: "Khin Sandar", rating: "4.8", date: "Wed, Oct 30", time: "3:00PM", status: "Confirmed" },
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
}

function formatTime(timeStr: string) {
  if (!timeStr.includes(":")) return timeStr
  const [h, m] = timeStr.split(":")
  const hours = parseInt(h)
  const ampm = hours >= 12 ? "PM" : "AM"
  const h12 = hours % 12 || 12
  return `${h12}:${m}${ampm}`
}

const ITEMS_PER_PAGE = 3

export default function BookListPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentFilter, setCurrentFilter] = useState("All")
  const [filterVisible, setFilterVisible] = useState(false)
  const [rescheduleId, setRescheduleId] = useState<number | null>(null)
  const [cancelId, setCancelId] = useState<number | null>(null)
  const [cancelProvider, setCancelProvider] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [toast, setToast] = useState<ToastData | null>(null)

  const showToast = useCallback((message: string, type?: "success" | "error") => {
    setToast({ message, type })
  }, [])

  const closeToast = useCallback(() => setToast(null), [])

  const filtered = useMemo(() => {
    if (currentFilter === "All") return bookings
    return bookings.filter((b) => b.status === currentFilter)
  }, [bookings, currentFilter])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const activeCount = bookings.filter((b) => b.status !== "Cancelled").length

  const handleFilterChange = (f: string) => {
    setCurrentFilter(f)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setBookings(initialBookings)
    setCurrentPage(1)
    setCurrentFilter("All")
    showToast("Booking list state restored to defaults.")
  }

  const handleCreate = (service: string, provider: string, date: string, time: string) => {
    const newBooking: Booking = {
      id: bookings.length + 1,
      service,
      provider,
      rating: "4.7",
      date: formatDate(date),
      time: formatTime(time),
      status: "Confirmed",
    }
    setBookings((prev) => [newBooking, ...prev])
    setCurrentPage(1)
    setShowCreate(false)
    showToast(`Booked ${service} with ${provider} successfully!`)
  }

  const handleReschedule = (id: number, date: string, time: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, date: formatDate(date), time: formatTime(time), status: "Rescheduled" as const }
          : b
      )
    )
    const b = bookings.find((x) => x.id === id)
    setRescheduleId(null)
    showToast(`Rescheduled service with ${b?.provider} to ${formatDate(date)} @ ${formatTime(time)}`)
  }

  const handleCancel = (id: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" as const } : b))
    )
    const b = bookings.find((x) => x.id === id)
    setCancelId(null)
    showToast(`Successfully cancelled booking with ${b?.provider}.`, "error")
  }

  return (
    <div className={styles.main}>
      <section className={styles.section}>
        <BookListHeader
          activeCount={activeCount}
          onReset={handleReset}
          onNewBooking={() => setShowCreate(true)}
          onToggleFilter={() => setFilterVisible(!filterVisible)}
        />

        {filterVisible && (
          <FilterBar
            activeFilter={currentFilter}
            onFilterChange={handleFilterChange}
          />
        )}

        <div className={styles.list}>
          {paginated.length > 0 ? (
            paginated.map((booking) => (
              <BookCard
                key={booking.id}
                booking={booking}
                onReschedule={(id) => setRescheduleId(id)}
                onCancel={(id, provider) => {
                  setCancelId(id)
                  setCancelProvider(provider)
                }}
              />
            ))
          ) : (
            <EmptyState filter={currentFilter} />
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>

      <RescheduleModal
        bookingId={rescheduleId}
        onClose={() => setRescheduleId(null)}
        onConfirm={handleReschedule}
      />

      <CancelModal
        bookingId={cancelId}
        providerName={cancelProvider}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
      />

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onConfirm={handleCreate}
        />
      )}

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}
