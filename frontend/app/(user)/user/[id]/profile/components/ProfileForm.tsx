"use client"

import { useState } from "react"
import { SquarePen, Eye, EyeOff } from "lucide-react"
import styles from "../profile.module.css"

interface ProfileFormProps {
  profileData: {
    name: string
    location: string
    phone: string
    email: string
  }
  children?: React.ReactNode
}

export default function ProfileForm({ profileData, children }: ProfileFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={styles.profileForm}>
      <h3 className={styles.formTitle}>Profile Details</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>User Name</label>
            <button className={styles.editIconBtn}>
              <SquarePen className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            value={profileData.name}
            className={styles.input}
            readOnly
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Password</label>
            <button className={styles.editIconBtn}>
              <SquarePen className="w-4 h-4" />
            </button>
          </div>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              value="..............."
              className={styles.input}
              readOnly
            />
            <button
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>My Location</label>
            <button className={styles.editIconBtn}>
              <SquarePen className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            value={profileData.location}
            className={styles.input}
            readOnly
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Ph No</label>
            <button className={styles.editIconBtn}>
              <SquarePen className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            value={profileData.phone}
            className={styles.input}
            readOnly
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Email</label>
            <button className={styles.editIconBtn}>
              <SquarePen className="w-4 h-4" />
            </button>
          </div>
          <input
            type="email"
            value={profileData.email}
            className={styles.input}
            readOnly
          />
        </div>

        {children}
      </div>
    </div>
  )
}
