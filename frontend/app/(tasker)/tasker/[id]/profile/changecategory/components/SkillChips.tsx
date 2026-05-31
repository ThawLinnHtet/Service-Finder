"use client"

import styles from "../changecategory.module.css"

const defaultSkills = ["AC Installation", "Electrical Repair", "Plumbing", "Painting"]

interface SkillChipsProps {
  selected: string[]
  onToggle: (skill: string) => void
  onAddSkill: () => void
}

export default function SkillChips({ selected, onToggle, onAddSkill }: SkillChipsProps) {
  return (
    <div className={styles.skillsContainer}>
      {defaultSkills.map((skill) => (
        <div
          key={skill}
          onClick={() => onToggle(skill)}
          className={`${styles.skillChip} ${selected.includes(skill) ? styles.skillChipActive : ""}`}
        >
          {skill}
        </div>
      ))}
      <button type="button" onClick={onAddSkill} className={styles.addSkillBtn}>
        + Add skill
      </button>
    </div>
  )
}
