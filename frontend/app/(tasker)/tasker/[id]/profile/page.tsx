"use client"

import { useState } from "react"
import {
  PenSquare,
  Eye,
  EyeOff,
  Plus,
  X,
  Star,
  Globe,
  Bell,
} from "lucide-react"
import styles from "./profile.module.css"

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [skills, setSkills] = useState(["House cleaning", "Repair"])
  const [newSkill, setNewSkill] = useState("")

  const profileData = {
    name: "Aung Kaung Myat",
    email: "kaung123@gmail.com",
    profession: "Moving",
    price: "MMK 1000000",
    story: "Hello everyone, my name is Mg Aung Kaung Myat. How are you? I hope you are well and happy. As for me I am ...",
  }

  const overviewFields = [
    { label: "Tasker Name", value: "Aung Kaung Myat", type: "text" },
    { label: "Location", value: "Haling, Yangon, Myanmar", type: "text" },
    { label: "Ph No", value: "09774271230", type: "text" },
    { label: "Service Area", value: "Yangon", type: "text" },
    { label: "Email", value: "kaung123@gmail.com", type: "email" },
    { label: "Password", value: "********", type: "password" },
  ]

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.contentGrid}>
        <div className={styles.leftColumn}>
          <section className={styles.storySection}>
            <div className={styles.storyHeader}>
              <h3 className={styles.storyTitle}>They talk about their story</h3>
              <button className={styles.editBtn}>
                <PenSquare className="w-4 h-4" />
              </button>
            </div>
            <p className={styles.storyText}>
              {profileData.story}
              <button className={styles.readMoreBtn}>Read more</button>
            </p>
          </section>

          <section className={styles.overviewSection}>
            <h3 className={styles.sectionTitle}>Overview</h3>
            <div className={styles.divider}></div>

            <div className={styles.formGrid}>
              {overviewFields.map((field, index) => (
                <div key={index} className={styles.formGroup}>
                  <div className={styles.labelRow}>
                    <label className={styles.label}>{field.label}</label>
                    <button className={styles.fieldEditBtn}>
                      <PenSquare className="w-3 h-3" />
                    </button>
                  </div>
                  {field.label === "Password" ? (
                    <div className={styles.passwordWrapper}>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={field.value}
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
                  ) : (
                    <input
                      type={field.type}
                      value={field.value}
                      className={styles.input}
                      readOnly
                    />
                  )}
                </div>
              ))}

              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>Specific Skill</label>
                  <button className={styles.fieldEditBtn}>
                    <PenSquare className="w-3 h-3" />
                  </button>
                </div>
                <div className={styles.skillsContainer}>
                  {skills.map((skill, index) => (
                    <div key={index} className={styles.skillTag}>
                      <span>{skill}</span>
                      <button
                        className={styles.skillRemove}
                        onClick={() => removeSkill(skill)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div className={styles.addSkillRow}>
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="+ Add skill"
                      className={styles.addSkillInput}
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    {newSkill && (
                      <button className={styles.addSkillBtn} onClick={addSkill}>
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.profileCard}>
            <div className={styles.profileCardContent}>
              <div className={styles.profileAvatar}>
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="Profile"
                />
              </div>
              <div className={styles.profileInfo}>
                <h3 className={styles.profileName}>{profileData.name}</h3>
                <p className={styles.profileProfession}>{profileData.profession}</p>
                <div className={styles.profileDivider}></div>
                <div className={styles.profilePrice}>{profileData.price}</div>
              </div>
            </div>
            <div className={styles.profileCardDecoration}></div>
          </div>

          <div className={styles.feesCard}>
            <div className={styles.feesContent}>
              <div className={styles.feesIcon}>
                <Star className="w-6 h-6" />
              </div>
              <div className={styles.feesText}>
                <h4 className={styles.feesTitle}>Your customer services fee</h4>
                <p className={styles.feesSubtitle}>From 20000MMK</p>
              </div>
            </div>
            <button className={styles.feesBtn}>Request more price</button>
          </div>

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