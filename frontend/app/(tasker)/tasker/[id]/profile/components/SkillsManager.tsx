"use client"

import { useState } from "react"
import { SquarePen, Plus, X } from "lucide-react"
import styles from "../profile.module.css"

interface SkillsManagerProps {
  skills: string[]
  onAdd: (skill: string) => void
  onRemove: (skill: string) => void
}

export default function SkillsManager({ skills, onAdd, onRemove }: SkillsManagerProps) {
  const [newSkill, setNewSkill] = useState("")

  const handleAdd = () => {
    if (newSkill.trim()) {
      onAdd(newSkill.trim())
      setNewSkill("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd()
  }

  return (
    <div className={styles.formGroup}>
      <div className={styles.labelRow}>
        <label className={styles.label}>Specific Skill</label>
        <button className={styles.fieldEditBtn}>
          <SquarePen className="w-3 h-3" />
        </button>
      </div>
      <div className={styles.skillsContainer}>
        {skills.map((skill, index) => (
          <div key={index} className={styles.skillTag}>
            <span>{skill}</span>
            <button className={styles.skillRemove} onClick={() => onRemove(skill)}>
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
            onKeyDown={handleKeyDown}
          />
          {newSkill && (
            <button className={styles.addSkillBtn} onClick={handleAdd}>
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
