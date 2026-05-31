"use client"

import { Search } from "lucide-react"
import { categories } from "./types"
import styles from "../map.module.css"

interface CategoryModalProps {
  open: boolean
  onClose: () => void
  search: string
  onSearchChange: (value: string) => void
  selected: string[]
  onSelect: (categories: string[]) => void
  dropdown?: boolean
}

export default function CategoryModal({ open, onClose, search, onSearchChange, selected, onSelect, dropdown }: CategoryModalProps) {
  if (!open) return null

  const filteredCategories = categories.filter(cat =>
    cat.label.toLowerCase().includes(search.toLowerCase())
  )

  const visibleIds = filteredCategories.map(c => c.id)
  const visibleSelectedCount = selected.filter(id => visibleIds.includes(id)).length
  const allVisibleSelected = visibleIds.length > 0 && visibleSelectedCount === visibleIds.length

  const handleAllToggle = () => {
    if (allVisibleSelected) {
      const remaining = selected.filter(id => !visibleIds.includes(id))
      onSelect(remaining.length === 0 ? ["all"] : remaining)
    } else {
      const withoutAll = selected.filter(id => id !== "all")
      const newCats = [...new Set([...withoutAll, ...visibleIds])]
      onSelect(newCats.length === categories.length ? ["all"] : newCats)
    }
  }

  const handleCategoryClick = (id: string) => {
    const withoutAll = selected.filter(s => s !== "all")
    if (withoutAll.includes(id)) {
      const result = withoutAll.filter(s => s !== id)
      onSelect(result.length === 0 ? ["all"] : result)
    } else {
      const newCats = [...withoutAll, id]
      onSelect(newCats.length === categories.length ? ["all"] : newCats)
    }
  }

  const handleClearAll = () => {
    onSelect(["all"])
    onSearchChange("")
  }

  const isActive = (id: string) => {
    if (id === "all") return selected.includes("all") || allVisibleSelected
    return selected.includes(id)
  }

  const content = (
    <div className={styles.categoryModal} onClick={(e) => e.stopPropagation()}>
      {/* Top Bar: Category Label */}
      <div className={styles.catHeader}>
        <span className={styles.catHeaderLabel}>All Categories</span>
      </div>

      {/* Search & Clear Row */}
      <div className={styles.catSearchRow}>
        <div className={styles.catSearchWrapper}>
          <span className={styles.catSearchIcon}>
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.catSearchInput}
          />
        </div>
        <button className={styles.catClearBtn} onClick={handleClearAll}>
          Clear All
        </button>
      </div>

      {/* Checkbox Grid */}
      <div className={styles.catGridWrapper}>
        <div className={styles.catGrid}>
          {/* All checkbox */}
          <label className={styles.catCheckLabel} onClick={(e) => { e.preventDefault(); handleAllToggle() }}>
            <input
              type="checkbox"
              className={styles.catCheckbox}
              checked={allVisibleSelected}
              readOnly
            />
            <span className={styles.catCheckText}>All</span>
          </label>

          {filteredCategories.map((cat) => (
            <label
              key={cat.id}
              className={styles.catCheckLabel}
              onClick={(e) => { e.preventDefault(); handleCategoryClick(cat.id) }}
            >
              <input
                type="checkbox"
                className={styles.catCheckbox}
                checked={isActive(cat.id)}
                readOnly
              />
              <span className={styles.catCheckText}>{cat.label}</span>
            </label>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className={styles.catNoResults}>No categories found matching your search.</div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.catFooter}>
        <button className={styles.catBtnCancel} onClick={onClose}>Cancel</button>
        <button className={styles.catBtnApply} onClick={onClose}>Apply</button>
      </div>
    </div>
  )

  if (dropdown) return content

  return (
    <div className={styles.categoryOverlay} onClick={onClose}>
      {content}
    </div>
  )
}
