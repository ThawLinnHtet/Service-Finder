"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Menu } from "lucide-react"
import PriceModal from "./PriceModal"
import FilterModal from "./FilterModal"
import SortModal from "./SortModal"
import TaskerListSidebar from "./TaskerListSidebar"
import MenuDropdown from "./MenuDropdown"
import type { Tasker } from "./TaskerListSidebar"
import styles from "../map.module.css"

interface MapHeaderProps {
  activeNav: string
  showPriceModal: boolean
  showFilterModal: boolean
  showSortModal: boolean
  showTaskerList: boolean
  priceRange: number
  availableOnly: boolean
  noOffersOnly: boolean
  sortOption: string
  taskers: Tasker[]
  onToggleTaskerList: () => void
  onTogglePrice: () => void
  onToggleFilter: () => void
  onToggleSort: () => void
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onToggleAvailable: (checked: boolean) => void
  onToggleNoOffers: (checked: boolean) => void
  onSortChange: (option: string) => void
  onPriceApply: () => void
  onFilterApply: () => void
  onSortApply: () => void
  onTaskerClick: (id: number) => void
}

export default function MapHeader({
  activeNav, showPriceModal, showFilterModal, showSortModal, showTaskerList,
  priceRange, availableOnly, noOffersOnly, sortOption, taskers,
  onToggleTaskerList, onTogglePrice, onToggleFilter, onToggleSort,
  onPriceChange, onToggleAvailable, onToggleNoOffers, onSortChange,
  onPriceApply, onFilterApply, onSortApply, onTaskerClick,
}: MapHeaderProps) {
  const [showMenuDropdown, setShowMenuDropdown] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const btn = menuBtnRef.current
    if (!btn) return
    const stopProp = (e: MouseEvent) => e.stopPropagation()
    btn.addEventListener("mousedown", stopProp)
    return () => btn.removeEventListener("mousedown", stopProp)
  }, [showMenuDropdown])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenuDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const anyOpen = showPriceModal || showFilterModal || showSortModal || showTaskerList

  return (
    <>
      {anyOpen && <div className={styles.dropdownBackdrop} onClick={() => {
        if (showTaskerList) onToggleTaskerList()
        else if (showPriceModal) onTogglePrice()
        else if (showFilterModal) onToggleFilter()
        else if (showSortModal) onToggleSort()
      }} />}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.logo}>Logo</h1>

          <nav className={styles.nav}>
            <div className={styles.navItem}>
              <button className={`${styles.navBtn} ${activeNav === "taskerList" ? styles.navBtnActive : ""}`} onClick={onToggleTaskerList}>
                All tasker
              </button>
              {showTaskerList && (
                <div className={`${styles.navDropdown} ${styles.navDropdownLeft}`}>
                  <TaskerListSidebar
                    taskers={taskers}
                    showTaskerList={showTaskerList}
                    onToggle={onToggleTaskerList}
                    onTaskerClick={onTaskerClick}
                  />
                </div>
              )}
            </div>

            <div className={styles.navItem}>
              <button className={`${styles.navBtn} ${activeNav === "price" ? styles.navBtnActive : ""}`} onClick={onTogglePrice}>
                Any price
              </button>
              {showPriceModal && (
                <div className={styles.navDropdown}>
                  <PriceModal
                    show={showPriceModal}
                    priceRange={priceRange}
                    onPriceChange={onPriceChange}
                    onClose={onTogglePrice}
                    onApply={onPriceApply}
                    dropdown
                  />
                </div>
              )}
            </div>

            <div className={styles.navItem}>
              <button className={`${styles.navBtn} ${activeNav === "filter" ? styles.navBtnActive : ""}`} onClick={onToggleFilter}>
                Filters
              </button>
              {showFilterModal && (
                <div className={styles.navDropdown}>
                  <FilterModal
                    show={showFilterModal}
                    availableOnly={availableOnly}
                    noOffersOnly={noOffersOnly}
                    onToggleAvailable={onToggleAvailable}
                    onToggleNoOffers={onToggleNoOffers}
                    onApply={onFilterApply}
                    dropdown
                  />
                </div>
              )}
            </div>

            <div className={styles.navItem}>
              <button className={`${styles.navBtn} ${activeNav === "sort" ? styles.navBtnActive : ""}`} onClick={onToggleSort}>
                Sort
              </button>
              {showSortModal && (
                <div className={styles.navDropdown}>
                  <SortModal
                    show={showSortModal}
                    sortOption={sortOption}
                    onSortChange={onSortChange}
                    onApply={onSortApply}
                    dropdown
                  />
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.ratingBadge}>
            <span className={styles.ratingStar}>★</span>
            <span>5.0(+K Taskers)</span>
          </div>

          <div className={styles.searchWrapper}>
            <input type="text" placeholder="Search..." className={styles.searchInput} />
            <Search className={styles.searchIcon} />
          </div>

          <button ref={menuBtnRef} className={styles.menuBtn} onClick={() => setShowMenuDropdown(prev => !prev)}>
            <Menu className="w-5 h-5" />
          </button>
          {showMenuDropdown && (
            <MenuDropdown ref={menuRef} onClose={() => setShowMenuDropdown(false)} />
          )}
        </div>
      </header>
    </>
  )
}