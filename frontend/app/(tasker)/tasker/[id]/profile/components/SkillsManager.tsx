"use client"

import { useState } from "react"
import { SquarePen, Plus, X } from "lucide-react"
import AddSkillModal from "./AddSkillModal"
import styles from "../profile.module.css"

interface SkillsManagerProps {
  skills: string[]
  onAdd: (skill: string) => void
  onRemove: (skill: string) => void
}

export default function SkillsManager({ skills, onAdd, onRemove }: SkillsManagerProps) {
  const [showModal, setShowModal] = useState(false)

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
        <button className={styles.addSkillBtn} onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      <AddSkillModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={onAdd}
      />
    </div>
  )
}
