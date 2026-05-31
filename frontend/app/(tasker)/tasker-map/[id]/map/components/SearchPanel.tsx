"use client"

import { useState } from "react"
import { MOCK_USERS, SERVICE_ICONS } from "./types"
import styles from "../map.module.css"

interface SearchPanelProps {
  onSearch: (query: string) => void
  onUserSelect: (userId: number) => void
}

export default function SearchPanel({ onSearch, onUserSelect }: SearchPanelProps) {
  const [query, setQuery] = useState("")

  const filteredUsers = query.trim()
    ? MOCK_USERS.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.serviceRequested.toLowerCase().includes(query.toLowerCase()) ||
          u.address.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const handleSubmit = () => {
    if (query.trim()) onSearch(query.trim())
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit()
  }

  return (
    <div className={styles.searchPanel}>
      <div className={styles.searchHandle}>
        <div />
      </div>

      <div className={styles.searchBox}>
        <div className={styles.searchRow}>
          <div className={styles.searchInputWrap}>
            <i className={`fa-solid fa-magnifying-glass ${styles.searchInputIcon}`} />
            <input
              type="text"
              placeholder="Search user, service, or address..."
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={handleKeyUp}
            />
          </div>
          <button className={styles.searchBtn} onClick={handleSubmit}>
            <span>Search</span>
          </button>
        </div>

        {/* Search results dropdown */}
        {query.trim() && filteredUsers.length > 0 && (
          <div className={styles.searchResults}>
            {filteredUsers.map((u) => {
              const icon = SERVICE_ICONS[u.serviceRequested] || "fa-circle"
              return (
                <button
                  key={u.id}
                  className={styles.searchResultItem}
                  onClick={() => { onUserSelect(u.id); setQuery("") }}
                >
                  <div className={styles.searchResultAvatar}>
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`} alt={u.name} />
                  </div>
                  <div className={styles.searchResultBody}>
                    <span className={styles.searchResultName}>{u.name}</span>
                    <span className={styles.searchResultService}>
                      <i className={`fa-solid ${icon}`} /> {u.serviceRequested}
                    </span>
                  </div>
                  <span className={styles.searchResultAddr}>{u.address}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Quick pills */}
        {!query.trim() && (
          <div className={styles.pillsRow}>
            {MOCK_USERS.slice(0, 4).map((u) => {
              const icon = SERVICE_ICONS[u.serviceRequested] || "fa-circle"
              return (
                <button
                  key={u.id}
                  className={styles.pill}
                  onClick={() => { onUserSelect(u.id) }}
                >
                  <i className={`fa-solid ${icon}`} style={{ marginRight: "0.25rem" }} /> {u.name.split(" ")[0]}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
