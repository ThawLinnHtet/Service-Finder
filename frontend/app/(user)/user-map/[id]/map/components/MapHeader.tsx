"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Menu } from "lucide-react"
import PriceModal from "./PriceModal"
import FilterModal from "./FilterModal"
import SortModal from "./SortModal"
import CategoryModal from "./CategoryModal"
import TaskerListSidebar from "./TaskerListSidebar"
import MenuDropdown from "./MenuDropdown"
import type { Tasker } from "./types"
import styles from "../map.module.css"

interface MapHeaderProps {
  activeNav: string
  showPriceModal: boolean
  showFilterModal: boolean
  showSortModal: boolean
  showCategoryModal: boolean
  showTaskerList: boolean
  priceRange: number
  availableOnly: boolean
  noOffersOnly: boolean
  sortOption: string
  categorySearch: string
  selectedCategories: string[]
  taskers: Tasker[]
  formatPrice: (price: number) => string
  onToggleTaskerList: () => void
  onTogglePrice: () => void
  onToggleFilter: () => void
  onToggleSort: () => void
  onToggleCategory: () => void
  onPriceChange: (val: number) => void
  onAvailableChange: (val: boolean) => void
  onNoOffersChange: (val: boolean) => void
  onSortChange: (val: string) => void
  onCategorySearchChange: (val: string) => void
  onCategorySelect: (cats: string[]) => void
  onTaskerClick: (id: number) => void
}

export default function MapHeader({
  activeNav, showPriceModal, showFilterModal, showSortModal, showCategoryModal, showTaskerList,
  priceRange, availableOnly, noOffersOnly, sortOption, categorySearch, selectedCategories, taskers, formatPrice,
  onToggleTaskerList, onTogglePrice, onToggleFilter, onToggleSort, onToggleCategory,
  onPriceChange, onAvailableChange, onNoOffersChange, onSortChange, onCategorySearchChange, onCategorySelect,
  onTaskerClick,
}: MapHeaderProps) {
  const [showMenuDropdown, setShowMenuDropdown] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)

  const filteredTaskers = searchQuery.trim()
    ? taskers.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const anyOpen = showPriceModal || showFilterModal || showSortModal || showCategoryModal || showTaskerList

  return (
    <>
      {anyOpen && <div className={styles.dropdownBackdrop} onClick={() => {
        if (showTaskerList) onToggleTaskerList()
        else if (showCategoryModal) onToggleCategory()
        else if (showPriceModal) onTogglePrice()
        else if (showFilterModal) onToggleFilter()
        else if (showSortModal) onToggleSort()
      }} />}
      <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.logo}>Logo</h1>

        <nav className={styles.nav}>
          <div className={styles.navItem}>
            <button className={`${styles.navBtn} ${activeNav === "category" ? styles.navBtnActive : ""}`} onClick={onToggleCategory}>
              Category
            </button>
            {showCategoryModal && (
              <div className={`${styles.navDropdown} ${styles.navDropdownLeft}`}>
                <CategoryModal
                  open={showCategoryModal}
                  onClose={onToggleCategory}
                  search={categorySearch}
                  onSearchChange={onCategorySearchChange}
                  selected={selectedCategories}
                  onSelect={onCategorySelect}
                  dropdown
                />
              </div>
            )}
          </div>

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
                  open={showPriceModal}
                  onClose={onTogglePrice}
                  priceRange={priceRange}
                  onPriceChange={onPriceChange}
                  formatPrice={formatPrice}
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
                  open={showFilterModal}
                  onClose={onToggleFilter}
                  availableOnly={availableOnly}
                  onAvailableChange={onAvailableChange}
                  noOffersOnly={noOffersOnly}
                  onNoOffersChange={onNoOffersChange}
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
                  open={showSortModal}
                  onClose={onToggleSort}
                  sortOption={sortOption}
                  onSortChange={onSortChange}
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

        <div className={styles.searchWrapper} ref={searchRef}>
          <input type="text" placeholder="Search..." className={styles.searchInput} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Search className={styles.searchIcon} />
          {searchQuery.trim() && filteredTaskers.length > 0 && (
            <div className={styles.searchDropdown}>
              <div
                style={{
                  borderRadius: "24px",
                  border: "1px solid #0f0f0f",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  overflow: "hidden",
                }}
              >
                {filteredTaskers.map((t) => (
                  <div
                    key={t.id}
                    className={styles.searchDropdownRow}
                    onClick={() => { onTaskerClick(t.id); setSearchQuery("") }}
                  >
                    <div className={styles.searchDropdownName}>{t.name}</div>
                    <div className={styles.searchDropdownLocation}>{t.address}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
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