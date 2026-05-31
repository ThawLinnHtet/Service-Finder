"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import FormField from "./FormField"
import SkillsManager from "./SkillsManager"
import ChangePasswordModal from "./ChangePasswordModal"
import styles from "../profile.module.css"

interface OverviewFormProps {
  skills: string[]
  onAddSkill: (skill: string) => void
  onRemoveSkill: (skill: string) => void
}

const overviewFields = [
  { label: "Tasker Name", value: "Aung Kaung Myat", type: "text" },
  { label: "Location", value: "Haling, Yangon, Myanmar", type: "text" },
  { label: "Ph No", value: "09774271230", type: "text" },
  { label: "Service Name", value: "Cleaning Services - House Cleaning", type: "text" },
  { label: "Service Area", value: "Yangon", type: "text" },
  { label: "Email", value: "kaung123@gmail.com", type: "email" },
  { label: "Password", value: "********", type: "password" },
]

export default function OverviewForm({ skills, onAddSkill, onRemoveSkill }: OverviewFormProps) {
  const router = useRouter()
  const params = useParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)

  const handlePasswordChange = (newPassword: string) => {
    console.log("Password changed to:", newPassword)
    setShowChangePassword(false)
  }

  return (
    <section className={styles.overviewSection}>
      <h3 className={styles.sectionTitle}>Overview</h3>
      <div className={styles.divider}></div>
      <div className={styles.formGrid}>
        {overviewFields.map((field, index) => (
          <FormField
            key={index}
            label={field.label}
            value={field.value}
            type={field.type}
            showPassword={field.type === "password" ? showPassword : undefined}
            onTogglePassword={field.type === "password" ? () => setShowPassword(!showPassword) : undefined}
            onEdit={field.label === "Service Name" ? () => router.push(`/tasker/${params.id}/profile/changecategory`) : field.type === "password" ? () => setShowChangePassword(true) : undefined}
          />
        ))}
        <SkillsManager skills={skills} onAdd={onAddSkill} onRemove={onRemoveSkill} />
      </div>

      {showChangePassword && (
        <ChangePasswordModal
          onConfirm={handlePasswordChange}
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </section>
  )
}
