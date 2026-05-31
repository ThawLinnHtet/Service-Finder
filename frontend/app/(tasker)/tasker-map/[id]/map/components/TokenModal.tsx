"use client"

import { useState } from "react"
import styles from "../map.module.css"

interface TokenModalProps {
  open: boolean
  onClose: () => void
  onSave: (token: string) => void
}

export default function TokenModal({ open, onClose, onSave }: TokenModalProps) {
  const [value, setValue] = useState("")

  return (
    <div className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}>
      <div className={styles.tokenModal}>
        <div className={styles.tokenTitle}>
          <h3>
            <i className="fa-solid fa-key" /> Mapbox Credentials
          </h3>
          <button className={styles.tokenClose} onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <p className={styles.tokenDesc}>
          We have initiated a functional public Mapbox demo access token for testing. You can replace it with your custom Mapbox Developer Access Token to load specific vector styled grids:
        </p>
        <input
          type="text"
          placeholder="pk.eyJ1Ijo..."
          className={styles.tokenInput}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className={styles.tokenActions}>
          <button className={styles.tokenBtnCancel} onClick={onClose}>Cancel</button>
          <button className={styles.tokenBtnApply} onClick={() => onSave(value)}>Apply Key</button>
        </div>
      </div>
    </div>
  )
}
