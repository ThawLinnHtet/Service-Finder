"use client"

import { useState, useRef, useEffect } from "react"
import styles from "../map.module.css"

interface MapHeaderProps {
  onToggleDrawer: () => void
  onToggleToken: () => void
}

export default function MapHeader({ onToggleDrawer, onToggleToken }: MapHeaderProps) {
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const dateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setShowDateDropdown(false)
      }
    }
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.logo}>Logo</div>
        <div className={styles.dateBtn} ref={dateRef} onClick={() => setShowDateDropdown(!showDateDropdown)}>
          <span>Monday 6, May 2026</span>
          <i className="fa-solid fa-chevron-down" style={{ fontSize: "0.75rem" }} />
          {showDateDropdown && (
            <div className={styles.dateDropdown}>
              <a href="#">Today (May 6, 2026)</a>
              <a href="#">Tomorrow (May 7, 2026)</a>
              <a href="#">Wednesday (May 8, 2026)</a>
            </div>
          )}
        </div>
      </div>

      <div className={styles.headerRight}>
        <button className={styles.tokenBtn} onClick={onToggleToken}>
          <i className="fa-solid fa-key" style={{ color: "#fde047" }} />
          <span className="hidden md:inline">Mapbox Token</span>
        </button>

        <div className={styles.gridLabel}>
          <i className="fa-solid fa-map-location-dot" style={{ color: "#c7d2fe" }} />
          <span>Yangon Active Grid</span>
        </div>

        <div className={styles.navArrows}>
          <button><i className="fa-solid fa-chevron-left" /></button>
          <span className={styles.navToday}>Today</span>
          <button><i className="fa-solid fa-chevron-right" /></button>
        </div>

        <button className={styles.burgerBtn} onClick={onToggleDrawer}>
          <i className="fa-solid fa-bars" />
        </button>
      </div>
    </header>
  )
}
