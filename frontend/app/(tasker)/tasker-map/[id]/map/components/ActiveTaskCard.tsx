"use client"

import type { RouteInfo } from "./types"
import styles from "../map.module.css"

interface ActiveTaskCardProps {
  route: RouteInfo | null
  collapsed: boolean
  onToggleCollapse: () => void
  onDirectionToggle: () => void
  onCall: () => void
}

export default function ActiveTaskCard({
  route,
  collapsed,
  onToggleCollapse,
  onDirectionToggle,
  onCall,
}: ActiveTaskCardProps) {
  if (!route) return null

  const { tasker, user, totalDistanceKm, estimatedMinutes, steps, source } = route

  return (
    <div className={styles.taskCard}>
      <div className={styles.taskCardHeader}>
        <div className={styles.taskStatus}>
          <span className={styles.statusDot} />
          <p className={styles.statusLabel}>Active Duty</p>
        </div>
        <div className={styles.cardActions}>
          <span className={styles.sourceBadge}>{source === "api" ? "LIVE" : "MOCK"}</span>
          <button className={styles.cardActionBtn} onClick={onCall} title="Call User">
            <i className="fa-solid fa-phone" />
          </button>
          <button className={styles.cardActionBtn} onClick={onToggleCollapse} title="Minimize">
            <i className="fa-solid fa-minus" />
          </button>
        </div>
      </div>

      <div className={`${styles.cardContent} ${collapsed ? styles.cardContentHidden : ""}`}>
        {/* Dual Profile */}
        <div className={styles.dualProfile}>
          <div className={styles.profileSide}>
            <div className={styles.profileSmallAvatar}>
              <img src={tasker.avatar} alt={tasker.name} className={styles.profileSmallImg} />
            </div>
            <div className={styles.profileSmallName}>{tasker.name}</div>
            <div className={styles.profileSmallMeta}>★ {tasker.rating} · {tasker.jobsCompleted} jobs</div>
          </div>

          <div className={styles.routeArrow}>
            <div className={styles.routeArrowLine} />
            <i className="fa-solid fa-motorcycle" style={{ fontSize: "1.25rem", color: "#c4b5fd" }} />
            <div className={styles.routeDist}>{totalDistanceKm.toFixed(1)} km</div>
            <div className={styles.routeArrowLine} />
          </div>

          <div className={styles.profileSide}>
            <div className={styles.profileSmallAvatar}>
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} className={styles.profileSmallImg} />
            </div>
            <div className={styles.profileSmallName}>{user.name}</div>
            <div className={styles.profileSmallMeta}>{user.serviceRequested}</div>
          </div>
        </div>

        {/* Telemetry */}
        <div className={styles.telemetryGrid}>
          <div>
            <p className={styles.telemetryLabel}>Distance</p>
            <p className={`${styles.telemetryVal} ${styles.telemetryValPurple}`}>{totalDistanceKm.toFixed(1)} km</p>
          </div>
          <div>
            <p className={styles.telemetryLabel}>ETA</p>
            <p className={`${styles.telemetryVal} ${styles.telemetryValGreen}`}>{estimatedMinutes} mins</p>
          </div>
        </div>

        {/* Route Steps */}
        {steps.length > 0 && (
          <div className={styles.routeSteps}>
            <p className={styles.routeStepsLabel}>
              <i className="fa-solid fa-road" /> Directions
            </p>
            <div className={styles.routeStepsList}>
              {steps.map((step, i) => (
                <div key={i} className={styles.routeStepItem}>
                  <div className={styles.routeStepIcon}>
                    <i className={`fa-solid ${step.icon}`} />
                  </div>
                  <div className={styles.routeStepBody}>
                    <span className={styles.routeStepInstr}>{step.instruction}</span>
                    <span className={styles.routeStepDist}>{step.distanceKm.toFixed(2)} km</span>
                  </div>
                  <span className={styles.routeStepDir}>{step.direction}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className={styles.cardFooter}>
          <button className={`${styles.footerBtn} ${styles.dirBtn}`} onClick={onDirectionToggle}>
            <i className="fa-solid fa-route" /> <span>GPS Route</span>
          </button>
          <button className={`${styles.footerBtn} ${styles.startBtn}`} onClick={onCall}>
            <i className="fa-solid fa-phone" /> <span>Call</span>
          </button>
        </div>
      </div>
    </div>
  )
}
