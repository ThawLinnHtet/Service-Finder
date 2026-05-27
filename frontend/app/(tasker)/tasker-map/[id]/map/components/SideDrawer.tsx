"use client"

import { MOCK_USERS, MOCK_TASKER, SERVICE_ICONS } from "./types"
import { haversineDistance, formatDistance } from "./utils"
import styles from "../map.module.css"

interface SideDrawerProps {
  open: boolean
  activeUserId: number | null
  onSelectUser: (userId: number) => void
  onChangeStyle: (url: string) => void
  onClose: () => void
}

export default function SideDrawer({ open, activeUserId, onSelectUser, onChangeStyle, onClose }: SideDrawerProps) {
  const stylesList = [
    { label: "Roadmap", url: "mapbox://styles/mapbox/streets-v12", roadmap: true },
    { label: "Dark", url: "mapbox://styles/mapbox/dark-v11", roadmap: false },
    { label: "Navigation", url: "mapbox://styles/mapbox/navigation-night-v1", roadmap: false },
    { label: "Satellite", url: "mapbox://styles/mapbox/satellite-streets-v12", roadmap: false },
  ]

  return (
    <div className={`${styles.sideDrawer} ${open ? styles.sideDrawerOpen : ""}`}>
      <div>
        <div className={styles.drawerHeader}>
          <h3 className={styles.drawerTitle}>
            <i className="fa-solid fa-sliders" /> Dispatch Panel
          </h3>
          <button className={styles.drawerClose} onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className={styles.drawerSection}>
          <span className={styles.drawerSectionLabel}>
            <i className="fa-solid fa-user-gear" /> Tasker
          </span>
          <div className={styles.taskerInfoCard}>
            <img src={MOCK_TASKER.avatar} alt={MOCK_TASKER.name} className={styles.taskerInfoAvatar} />
            <div>
              <p className={styles.taskerInfoName}>{MOCK_TASKER.name}</p>
              <p className={styles.taskerInfoMeta}>★ {MOCK_TASKER.rating} · {MOCK_TASKER.jobsCompleted} jobs</p>
              <p className={styles.taskerInfoMeta}><i className="fa-solid fa-location-dot" style={{ color: "#a78bfa" }} /> Standby at Hledan</p>
            </div>
          </div>
        </div>

        <div className={styles.drawerSection}>
          <span className={styles.drawerSectionLabel}>
            <i className="fa-solid fa-users" /> Users Nearby
          </span>
          <div className={styles.userList}>
            {MOCK_USERS.map((u) => {
              const dist = haversineDistance(MOCK_TASKER.coords, u.coords)
              const active = activeUserId === u.id
              const icon = SERVICE_ICONS[u.serviceRequested] || "fa-circle"
              return (
                <button
                  key={u.id}
                  className={`${styles.userListItem} ${active ? styles.userListItemActive : ""}`}
                  onClick={() => onSelectUser(u.id)}
                >
                  <div className={styles.userListItemAvatar}>
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`} alt={u.name} />
                  </div>
                  <div className={styles.userListItemBody}>
                    <p className={styles.userListItemName}>{u.name}</p>
                    <p className={styles.userListItemService}>
                      <i className={`fa-solid ${icon}`} style={{ color: "#a78bfa" }} /> {u.serviceRequested}
                    </p>
                    <p className={styles.userListItemDist}>{formatDistance(dist)} · {u.address}</p>
                  </div>
                  <span className={`${styles.statusBadge} ${active ? styles.statusActive : styles.statusPending}`}>
                    {active ? "Active" : formatDistance(dist)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <span className={styles.drawerSectionLabel}>
            <i className="fa-solid fa-palette" /> Map Style
          </span>
          <div className={styles.styleGrid}>
            {stylesList.map((s) => (
              <button key={s.url} className={`${styles.styleBtn} ${s.roadmap ? styles.styleBtnActive : ""}`} onClick={() => onChangeStyle(s.url)}>
                {s.roadmap && <i className="fa-solid fa-road" style={{ marginRight: "0.25rem" }} />}
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.drawerFooter}>
        <div className={styles.drawerFooterContent}>
          <i className={`fa-solid fa-circle-info ${styles.drawerFooterIcon}`} />
          <p>Tap a user to calculate the route. Distances are live using Haversine formula with real Mapbox Directions API when token is valid.</p>
        </div>
      </div>
    </div>
  )
}
