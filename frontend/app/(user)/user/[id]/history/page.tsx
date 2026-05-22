"use client"

import { useState, useCallback, useMemo } from "react"
import styles from "./history.module.css"
import FilterPills from "./components/FilterPills"
import type { HistoryFilter } from "./components/FilterPills"
import PanelHeader from "./components/PanelHeader"
import HistoryList from "./components/HistoryList"
import Pagination from "./components/Pagination"
import RebookModal from "./components/RebookModal"
import Toast from "./components/Toast"

export interface HistoryBooking {
  id: number
  taskerName: string
  serviceType: string
  date: string
  status: "Completed" | "Saved" | "Cancelled"
  price: string
  image: string
}

const initialHistory: HistoryBooking[] = [
  { id: 1, taskerName: "Tasker Name", serviceType: "Move-out-cleaning", date: "08-06-2026", status: "Completed", price: "10000", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=200&h=150" },
  { id: 2, taskerName: "Tasker Name", serviceType: "Move-out-cleaning", date: "08-06-2026", status: "Completed", price: "10000", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=200&h=150" },
  { id: 3, taskerName: "Tasker Name", serviceType: "Move-out-cleaning", date: "08-06-2026", status: "Completed", price: "10000", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=200&h=150" },
  { id: 4, taskerName: "Aung Myo", serviceType: "Deep Home Cleaning", date: "08-05-2026", status: "Saved", price: "12500", image: "https://images.unsplash.com/photo-1627905646253-13013d274b5a?auto=format&fit=crop&q=80&w=200&h=150" },
  { id: 5, taskerName: "Hsu Lin", serviceType: "Garden Weeding", date: "08-04-2026", status: "Saved", price: "8000", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=200&h=150" },
  { id: 6, taskerName: "Min Thuta", serviceType: "Kitchen Deep Clean", date: "07-29-2026", status: "Cancelled", price: "15000", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=200&h=150" },
  { id: 7, taskerName: "Zin Mar", serviceType: "Bathroom Sanitation", date: "07-25-2026", status: "Cancelled", price: "9500", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200&h=150" },
  { id: 8, taskerName: "Kyaw Zay Ya", serviceType: "Window Dusting", date: "07-18-2026", status: "Completed", price: "6000", image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=200&h=150" },
  { id: 9, taskerName: "May Phoo", serviceType: "Ac Repair / Cleaning", date: "07-12-2026", status: "Completed", price: "22000", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=200&h=150" },
]

const ITEMS_PER_PAGE = 3

type ToastType = "success" | "warning" | "info"

type SortOrder = "newest" | "oldest"

export default function HistoryPage() {
  const [bookings, setBookings] = useState<HistoryBooking[]>(initialHistory)
  const [filter, setFilter] = useState<HistoryFilter>("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")
  const [rebookTarget, setRebookTarget] = useState<HistoryBooking | null>(null)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type })
  }, [])

  const closeToast = useCallback(() => {
    setToast(null)
  }, [])

  const counts = useMemo(() => {
    return {
      completed: bookings.filter((b) => b.status === "Completed").length,
      saved: bookings.filter((b) => b.status === "Saved").length,
      cancelled: bookings.filter((b) => b.status === "Cancelled").length,
    }
  }, [bookings])

  const filteredBookings = useMemo(() => {
    return filter === "All"
      ? [...bookings]
      : bookings.filter((b) => b.status === filter)
  }, [bookings, filter])

  const sortedBookings = useMemo(() => {
    const sorted = [...filteredBookings]
    sorted.sort((a, b) => {
      const [dA, mA, yA] = a.date.split("-").map(Number)
      const [dB, mB, yB] = b.date.split("-").map(Number)
      const dateA = new Date(yA, mA - 1, dA).getTime()
      const dateB = new Date(yB, mB - 1, dB).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })
    return sorted
  }, [filteredBookings, sortOrder])

  const totalPages = Math.ceil(sortedBookings.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedBookings = sortedBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleFilterChange = (f: HistoryFilter) => {
    setFilter(f)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSort = (order: SortOrder) => {
    setSortOrder(order)
    setCurrentPage(1)
    showToast(`Sorted by ${order === "newest" ? "newest" : "oldest"} first`, "info")
  }

  const handleReset = () => {
    setBookings(initialHistory)
    setFilter("All")
    setCurrentPage(1)
    setSortOrder("newest")
    showToast("Data restored to default.", "info")
  }

  const openRebookModal = (id: number) => {
    const booking = bookings.find((b) => b.id === id)
    if (booking) setRebookTarget(booking)
  }

  const closeRebookModal = () => {
    setRebookTarget(null)
  }

  const confirmRebook = (date: string) => {
    if (!rebookTarget) return
    const newBooking: HistoryBooking = {
      id: Date.now(),
      taskerName: rebookTarget.taskerName,
      serviceType: rebookTarget.serviceType,
      date,
      status: "Completed",
      price: rebookTarget.price,
      image: rebookTarget.image,
    }
    setBookings((prev) => [newBooking, ...prev])
    setRebookTarget(null)
    showToast(`Confirmed! Rebooked "${newBooking.serviceType}".`, "success")
  }

  return (
    <div className={styles.pageWrapper}>
      <FilterPills filter={filter} onFilterChange={handleFilterChange} />

      <section className={styles.panel}>
        <PanelHeader
          counts={counts}
          sortOrder={sortOrder}
          onSort={handleSort}
          onReset={handleReset}
        />
        <HistoryList
          bookings={paginatedBookings}
          onRebook={openRebookModal}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>

      {rebookTarget && (
        <RebookModal
          booking={rebookTarget}
          onConfirm={confirmRebook}
          onClose={closeRebookModal}
        />
      )}

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}
