"use client"

import { useState } from "react"
import styles from "./profile.module.css"
import UserProfileCard from "./components/UserProfileCard"
import ProfileForm from "./components/ProfileForm"

export default function ProfilePage() {
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
          <UserProfileCard name={profileData.name} joinDate={profileData.joinDate} />
          <ProfileForm profileData={profileData}>
            <div className={styles.saveButtonContainer}>
              <button
                className={`${styles.saveButton} ${isSaving ? styles.saving : ""} ${saved ? styles.saved : ""}`}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : saved ? "Saved!" : "Save"}
              </button>
            </div>
          </ProfileForm>
        </div>
      </div>
    </div>
  )
}
