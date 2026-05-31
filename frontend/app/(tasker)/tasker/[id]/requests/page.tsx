"use client"

import { useState, useCallback } from "react"
import styles from "./requests.module.css"
import PanelHeader from "./components/PanelHeader"
import RequestList from "./components/RequestList"
import Pagination from "./components/Pagination"
import Toast from "./components/Toast"

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

const initialRequests: BookingRequest[] = [
  { id: 101, date: "Sep 13", weekday: "Wed", time: "2:00pm - 4:00pm", category: "Moving", user: "User Name", location: "Haling, Yangon", phone: "09774271230" },
  { id: 102, date: "Sep 13", weekday: "Wed", time: "2:00pm - 4:00pm", category: "Moving", user: "User Name", location: "Haling, Yangon", phone: "09774271230" },
  { id: 103, date: "Sep 13", weekday: "Wed", time: "2:00pm - 4:00pm", category: "Moving", user: "User Name", location: "Haling, Yangon", phone: "09774271230" },
  { id: 104, date: "Sep 13", weekday: "Wed", time: "2:00pm - 4:00pm", category: "Moving", user: "User Name", location: "Haling, Yangon", phone: "09774271230" },
  { id: 105, date: "Sep 13", weekday: "Wed", time: "2:00pm - 4:00pm", category: "Moving", user: "User Name", location: "Haling, Yangon", phone: "09774271230" },
  { id: 106, date: "Sep 14", weekday: "Thu", time: "10:00am - 12:00pm", category: "Cleaning", user: "Thura Tun", location: "Kamayut, Yangon", phone: "09883124451" },
  { id: 107, date: "Sep 14", weekday: "Thu", time: "1:00pm - 3:00pm", category: "Plumbing", user: "Aye Aye", location: "Insein, Yangon", phone: "09224151242" },
  { id: 108, date: "Sep 15", weekday: "Fri", time: "4:00pm - 6:00pm", category: "Electrical", user: "Kyaw Zayar", location: "Sanchaung, Yangon", phone: "09441122334" },
  { id: 109, date: "Sep 15", weekday: "Fri", time: "9:00am - 11:00am", category: "Moving", user: "Phyu Phyu", location: "Bahan, Yangon", phone: "09334551122" },
  { id: 110, date: "Sep 16", weekday: "Sat", time: "1:00pm - 4:00pm", category: "Gardening", user: "Mya Mya", location: "Mayangone, Yangon", phone: "09775566332" },
]

const ITEMS_PER_PAGE = 5

type ToastType = "success" | "warning" | "info"

export default function RequestsPage() {
  const [requests, setRequests] = useState<BookingRequest[]>(initialRequests)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedRequests = requests.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type })
  }, [])

  const closeToast = useCallback(() => {
    setToast(null)
  }, [])

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
    const allSelected = paginatedRequests.every((r) => selectedIds.has(r.id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      paginatedRequests.forEach((r) => {
        if (allSelected) next.delete(r.id)
        else next.add(r.id)
      })
      return next
    })
    showToast(allSelected ? "Cleared all selections" : "Selected all items on this page", "info")
  }

  const deleteSelected = () => {
    if (selectedIds.size === 0) {
      showToast("Please select at least one request to delete", "warning")
      return
    }
    const count = selectedIds.size
    setRequests((prev) => prev.filter((r) => !selectedIds.has(r.id)))
    setSelectedIds(new Set())
    const newTotalPages = Math.ceil((requests.length - count) / ITEMS_PER_PAGE)
    if (currentPage > newTotalPages && currentPage > 1) {
      setCurrentPage(newTotalPages)
    }
    showToast(`Successfully deleted ${count} request(s)`, "success")
  }

  const acceptRequest = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id))
    const newTotalPages = Math.ceil((requests.length - 1) / ITEMS_PER_PAGE)
    if (currentPage > newTotalPages && currentPage > 1) {
      setCurrentPage(newTotalPages)
    }
    showToast("Booking request accepted successfully!", "success")
  }

  const declineRequest = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id))
    const newTotalPages = Math.ceil((requests.length - 1) / ITEMS_PER_PAGE)
    if (currentPage > newTotalPages && currentPage > 1) {
      setCurrentPage(newTotalPages)
    }
    showToast("Booking request declined.", "info")
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <section className={styles.panel}>
      <PanelHeader
        count={requests.length}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedIds.size}
        onToggleSelectionMode={toggleSelectionMode}
        onSelectAll={selectAll}
        onDeleteSelected={deleteSelected}
      />
      <RequestList
        requests={paginatedRequests}
        isSelectionMode={isSelectionMode}
        selectedIds={selectedIds}
        onToggle={toggleItemSelection}
        onAccept={acceptRequest}
        onDecline={declineRequest}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <Toast toast={toast} onClose={closeToast} />
    </section>
  )
}
