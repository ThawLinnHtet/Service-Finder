"use client"

import { useState, useRef, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import styles from "../profile.module.css"

interface ChangePasswordModalProps {
  onConfirm: (password: string) => void
  onClose: () => void
}

export default function ChangePasswordModal({ onConfirm, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("currentPass123")
  const [showCurrent, setShowCurrent] = useState(false)
  const [newPassword, setNewPassword] = useState("newSecurePass")
  const [showNew, setShowNew] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [onClose])

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} ref={containerRef}>
        <div className={styles.modalBody}>
          <label className={styles.modalLabel}>Current Password</label>
          <div className={styles.modalInputWrapper}>
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="••••••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={styles.modalInput}
            />
            <button
              type="button"
              className={styles.modalEyeBtn}
              onClick={() => setShowCurrent((p) => !p)}
            >
              {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <label className={styles.modalLabel}>New Password</label>
          <div className={styles.modalInputWrapper}>
            <input
              ref={inputRef}
              type={showNew ? "text" : "password"}
              placeholder="••••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.modalInput}
            />
            <button
              type="button"
              className={styles.modalEyeBtn}
              onClick={() => setShowNew((p) => !p)}
            >
              {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className={styles.modalForgotRow}>
          <button
            type="button"
            className={styles.modalForgotBtn}
            onClick={() => alert("Forgot password flow")}
          >
            Forgot password?
          </button>
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.modalCancelBtn}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.modalSaveBtn}
            onClick={() => onConfirm(newPassword)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
