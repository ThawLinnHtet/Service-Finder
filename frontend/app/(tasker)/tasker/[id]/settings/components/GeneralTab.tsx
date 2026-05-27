"use client"

import { Sun, Moon } from "lucide-react"
import styles from "../settings.module.css"

interface GeneralTabProps {
  appearance: string
  onAppearanceChange: (value: string) => void
}

export default function GeneralTab({ appearance, onAppearanceChange }: GeneralTabProps) {
  const isDark = appearance === "Dark"

  const toggleStyle: React.CSSProperties = {
    position: "relative",
    width: "6rem",
    height: "2.75rem",
    borderRadius: "9999px",
    border: "1px solid #cbd5e1",
    background: "white",
    cursor: "pointer",
    flexShrink: 0,
    padding: 0,
    outline: "none",
  }

  const thumbStyle: React.CSSProperties = {
    position: "absolute",
    top: "0.125rem",
    left: "0.125rem",
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "9999px",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    pointerEvents: "none",
    transform: isDark ? "translateX(3.25rem)" : "translateX(0)",
    transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
  }

  const sunActiveStyle: React.CSSProperties = {
    position: "absolute",
    color: "#818cf8",
    width: "1.125rem",
    height: "1.125rem",
    transition: "all 0.4s",
    opacity: isDark ? 0 : 1,
    scale: isDark ? "0.5" : "1",
  }

  const moonActiveStyle: React.CSSProperties = {
    position: "absolute",
    color: "#818cf8",
    width: "1rem",
    height: "1rem",
    transition: "all 0.4s",
    opacity: isDark ? 1 : 0,
    scale: isDark ? "1" : "0.5",
  }

  const sunBgStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: "0.625rem",
    color: "#94a3b8",
    width: "1.125rem",
    height: "1.125rem",
    zIndex: 1,
    transition: "opacity 0.4s",
  }

  const moonBgStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    right: "0.625rem",
    color: "#475569",
    width: "1rem",
    height: "1rem",
    zIndex: 1,
    transition: "opacity 0.4s",
  }

  return (
    <div className={styles.contentWrapper}>
      <h3 className={styles.contentTitle}>My Setting</h3>
      <div className={styles.contentBody}>
        <div className={styles.settingRow}>
          <div>
            <h4 className={styles.settingLabel}>Appaerance</h4>
            <p className={styles.settingDesc}>Customize how you theams looks on your device.</p>
          </div>
          <button
            role="switch"
            aria-checked={isDark}
            onClick={() => onAppearanceChange(isDark ? "Light" : "Dark")}
            style={toggleStyle}
          >
            <div style={thumbStyle}>
              <Sun style={sunActiveStyle} size={24} />
              <Moon style={moonActiveStyle} size={20} />
            </div>
            <Sun style={sunBgStyle} size={24} />
            <Moon style={moonBgStyle} size={20} />
          </button>
        </div>

        <div className={styles.settingRowVertical}>
          <div>
            <h4 className={styles.settingLabel}>Two-factor authentication</h4>
            <p className={styles.settingDesc}>
              Keep your account secure by enabling 2FA via SMS or using a temporary one-time passcode(TOTP).
            </p>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  )
}
