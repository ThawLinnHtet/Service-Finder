"use client"

import { useState } from "react"
import {
  Calendar,
  Edit3,
  Eye,
  EyeOff,
} from "lucide-react"
import styles from "./profile.module.css"

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const profileData = {
    name: "Aung Kaung Myat",
    email: "kaung123@gmail.com",
    joinDate: "4 May 2026",
    location: "Haling , Yangon ,Myanmar",
    phone: "09774271230",
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
  }

  return (
    <div className={styles.main}>
      <div className={styles.profileCard}>
        <div className={styles.banner}></div>

        <div className={styles.profileContent}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aung"
                  alt="User Profile"
                />
              </div>
              <div className={styles.userInfo}>
                <h2 className={styles.userName}>{profileData.name}</h2>
                <div className={styles.joinDate}>
                  <Calendar className="w-4 h-4" />
                  <span>Date: {profileData.joinDate}</span>
                </div>
              </div>
            </div>
            <div className={styles.editButtonContainer}>
              <button className={styles.editButton}>
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          <div className={styles.profileForm}>
            <h3 className={styles.formTitle}>Profile Details</h3>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>User Name</label>
                  <button className={styles.editIconBtn}>
                    <Edit3 className="w-4 h-4" />
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
                    <Edit3 className="w-4 h-4" />
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
                    <Edit3 className="w-4 h-4" />
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
                    <Edit3 className="w-4 h-4" />
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
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="email"
                  value={profileData.email}
                  className={styles.input}
                  readOnly
                />
              </div>

              <div className={styles.saveButtonContainer}>
                <button
                  className={`${styles.saveButton} ${isSaving ? styles.saving : ""} ${saved ? styles.saved : ""}`}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : saved ? "Saved!" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}