"use client"

import { useState, useCallback, useMemo } from "react"
import styles from "./history.module.css"
import FilterPills from "./components/FilterPills"
import type { HistoryFilter } from "./components/FilterPills"
import PanelHeader from "./components/PanelHeader"
import HistoryList from "./components/HistoryList"
import Pagination from "./components/Pagination"
import Toast from "./components/Toast"

interface HistoryBooking {
  id: number
  client: string
  location: string
  service: string
  date: string
  rating: number
  pinned: boolean
  status: "Completed" | "Pending" | "Cancelled"
}

const initialHistory: HistoryBooking[] = [
  { id: 1, client: "User Name", location: "Haling, Yangon", service: "Moving", date: "Sep 13, 2025", rating: 4, pinned: true, status: "Completed" },
  { id: 2, client: "Thura Tun", location: "Kamayut, Yangon", service: "Cleaning", date: "Sep 14, 2025", rating: 5, pinned: false, status: "Completed" },
  { id: 3, client: "Aye Aye", location: "Insein, Yangon", service: "Plumbing", date: "Sep 15, 2025", rating: 3, pinned: true, status: "Pending" },
  { id: 4, client: "Kyaw Zayar", location: "Sanchaung, Yangon", service: "Electrical", date: "Sep 16, 2025", rating: 0, pinned: false, status: "Cancelled" },
  { id: 5, client: "Phyu Phyu", location: "Bahan, Yangon", service: "Moving", date: "Sep 17, 2025", rating: 5, pinned: false, status: "Completed" },
  { id: 6, client: "Mya Mya", location: "Mayangone, Yangon", service: "Gardening", date: "Sep 18, 2025", rating: 2, pinned: false, status: "Pending" },
  { id: 7, client: "Zaw Zaw", location: "Dagon, Yangon", service: "Plumbing", date: "Sep 19, 2025", rating: 4, pinned: false, status: "Completed" },
  { id: 8, client: "Hla Hla", location: "Hlaingthaya, Yangon", service: "Moving", date: "Sep 20, 2025", rating: 0, pinned: false, status: "Cancelled" },
  { id: 9, client: "Tin Tin", location: "Yankin, Yangon", service: "Electrical", date: "Sep 21, 2025", rating: 1, pinned: false, status: "Pending" },
  { id: 10, client: "Su Su", location: "Tamwe, Yangon", service: "Cleaning", date: "Sep 22, 2025", rating: 3, pinned: false, status: "Completed" },
]

const ITEMS_PER_PAGE = 5

type ToastType = "success" | "warning" | "info"

export default function HistoryPage() {
  const [bookings, setBookings] = useState<HistoryBooking[]>(initialHistory)
  const [filter, setFilter] = useState<HistoryFilter>("All")
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type })
  }, [])

  const closeToast = useCallback(() => {
    setToast(null)
  }, [])

  const filteredBookings = useMemo(() => {
    return filter === "All"
      ? bookings
      : bookings.filter((b) => b.status === filter)
  }, [bookings, filter])

  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      if (a.pinned === b.pinned) return 0
      return a.pinned ? -1 : 1
    })
  }, [filteredBookings])

  const totalPages = Math.ceil(sortedBookings.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedBookings = sortedBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const counts = useMemo(() => {
    return {
      completed: bookings.filter((b) => b.status === "Completed").length,
      pending: bookings.filter((b) => b.status === "Pending").length,
      cancelled: bookings.filter((b) => b.status === "Cancelled").length,
    }
  }, [bookings])

  const handleFilterChange = (f: HistoryFilter) => {
    setFilter(f)
    setCurrentPage(1)
  }

  const toggleSelectionMode = () => {
    setIsSelectionMode((prev) => {
      if (prev) setSelectedIds(new Set())
      return !prev
    })
  }

  const toggleItemSelection = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    const allSelected = paginatedBookings.every((b) => selectedIds.has(b.id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      paginatedBookings.forEach((b) => {
        if (allSelected) next.delete(b.id)
        else next.add(b.id)
      })
      return next
    })
    showToast(allSelected ? "Cleared all selections" : "Selected all items on this page", "info")
  }

  const deleteSelected = () => {
    if (selectedIds.size === 0) {
      showToast("Please select at least one booking to delete", "warning")
      return
    }
    const count = selectedIds.size
    setBookings((prev) => prev.filter((b) => !selectedIds.has(b.id)))
    setSelectedIds(new Set())
    const newTotalPages = Math.ceil((bookings.length - count) / ITEMS_PER_PAGE)
    if (currentPage > newTotalPages && currentPage > 1) {
      setCurrentPage(newTotalPages)
    }
    showToast(`Successfully deleted ${count} booking(s)`, "success")
  }

  const handleRate = (id: number, rating: number) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b
        const oldRating = b.rating
        if (oldRating === rating) {
          showToast(`Removed rating for ${b.client}`, "info")
        } else {
          showToast(`Rated ${b.client} ${rating} star${rating > 1 ? "s" : ""}`, "success")
        }
        return { ...b, rating: oldRating === rating ? 0 : rating }
      })
    )
  }

  const handleTogglePin = (id: number) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b
        showToast(b.pinned ? `Unpinned ${b.client}` : `Pinned ${b.client} to top`, "info")
        return { ...b, pinned: !b.pinned }
      })
    )
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className={styles.pageWrapper}>
      <FilterPills filter={filter} onFilterChange={handleFilterChange} />

      <section className={styles.panel}>
        <PanelHeader
          counts={counts}
          isSelectionMode={isSelectionMode}
          selectedCount={selectedIds.size}
          onToggleSelectionMode={toggleSelectionMode}
          onSelectAll={selectAll}
          onDeleteSelected={deleteSelected}
        />
        <HistoryList
          bookings={paginatedBookings}
          isSelectionMode={isSelectionMode}
          selectedIds={selectedIds}
          onToggle={toggleItemSelection}
          onRate={handleRate}
          onTogglePin={handleTogglePin}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}
