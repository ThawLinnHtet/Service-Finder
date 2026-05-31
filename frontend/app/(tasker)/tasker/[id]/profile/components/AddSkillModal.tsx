"use client"

import { useState } from "react"
import { X } from "lucide-react"
import styles from "../profile.module.css"

interface AddSkillModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (skill: string) => void
}

const suggestedSkills = ["House cleaning", "Repair", "Moving", "Tutoring", "Cooking", "Gardening", "Laundry", "IT Support"]

export default function AddSkillModal({ isOpen, onClose, onSave }: AddSkillModalProps) {
  const [skillInput, setSkillInput] = useState("")
  const [selectedService, setSelectedService] = useState<string | null>(null)

  if (!isOpen) return null

  const selectSuggested = (skill: string) => {
    setSelectedService(skill === selectedService ? null : skill)
    setSkillInput(skill === selectedService ? "" : skill)
  }

  const handleSave = () => {
    if (skillInput.trim()) {
      onSave(skillInput.trim())
      setSkillInput("")
      setSelectedService(null)
      onClose()
    }
  }

  return (
    <div className={styles.skillModalOverlay}>
      <div className={styles.skillModalBackdrop} onClick={onClose} />
      <div className={styles.skillModalContainer}>
        <button onClick={onClose} className={styles.skillModalCloseBtn}>
          <X size={20} />
        </button>

        <h2 className={styles.skillModalTitle}>Add your skill</h2>

        <div className={styles.skillInputWrap}>
          <input
            type="text"
            placeholder="Type your custom skill..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className={styles.skillInput}
          />
        </div>

        <div className={styles.skillSuggestSection}>
          <h3 className={styles.skillSuggestTitle}>According to service name</h3>
          <div className={styles.skillChips}>
            {suggestedSkills.map((skill) => {
              const isActive = selectedService === skill
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => selectSuggested(skill)}
                  className={`${styles.skillChip} ${isActive ? styles.skillChipActive : ""}`}
                >
                  {skill}
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.skillActions}>
          <button type="button" onClick={onClose} className={styles.skillCancelBtn}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} className={styles.skillSaveBtn}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
