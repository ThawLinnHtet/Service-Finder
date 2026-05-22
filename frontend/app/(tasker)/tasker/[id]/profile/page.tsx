"use client"

import { useState } from "react"
import StorySection from "./components/StorySection"
import OverviewForm from "./components/OverviewForm"
import ProfileCard from "./components/ProfileCard"
import FeesCard from "./components/FeesCard"
import styles from "./profile.module.css"

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [skills, setSkills] = useState(["House cleaning", "Repair"])

  const profileData = {
    name: "Aung Kaung Myat",
    email: "kaung123@gmail.com",
    profession: "Moving",
    price: "MMK 1000000",
    story: "Hello everyone, my name is Mg Aung Kaung Myat. How are you? I hope you are well and happy. As for me I am ...",
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
  }

  const addSkill = (skill: string) => setSkills([...skills, skill])
  const removeSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill))

  return (
    <div className={styles.main}>
      <div className={styles.contentGrid}>
        <div className={styles.leftColumn}>
          <StorySection story={profileData.story} />
          <OverviewForm skills={skills} onAddSkill={addSkill} onRemoveSkill={removeSkill} />
        </div>
        <div className={styles.rightColumn}>
          <ProfileCard name={profileData.name} profession={profileData.profession} price={profileData.price} />
          <FeesCard />
          <div className={styles.saveContainer}>
            <button
              id="saveBtn"
              className={`${styles.saveBtn} ${isSaving ? styles.saving : ""} ${saved ? styles.saved : ""}`}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : saved ? "Saved Successfully!" : "Save"}
            </button>
          </div>
        </div>
      </div>
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollLine}></div>
        <div className={styles.scrollDot}></div>
        <div className={styles.scrollLine}></div>
      </div>
    </div>
  )
}