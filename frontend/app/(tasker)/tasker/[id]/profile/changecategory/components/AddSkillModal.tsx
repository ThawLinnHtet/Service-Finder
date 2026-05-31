"use client"

import { useRef, useEffect } from "react"
import styles from "../changecategory.module.css"

interface AddSkillModalProps {
  open: boolean
  onClose: () => void
  onAdd: (skill: string) => void
}

export default function AddSkillModal({ open, onClose, onAdd }: AddSkillModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  const handleAdd = () => {
    const value = inputRef.current?.value.trim()
    if (value) {
      onAdd(value)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}>
      <div className={`${styles.modalCard} ${open ? styles.modalCardOpen : ""}`}>
        <h3 className={styles.modalTitle}>Add Specific Skill</h3>
        <p className={styles.modalDesc}>Type a skill name to add it to your service information list.</p>
        <input
          ref={inputRef}
          type="text"
          placeholder="e.g. Roof Repair, Deep Cleaning"
          className={styles.modalInput}
          onKeyDown={handleKey}
        />
        <div className={styles.modalActions}>
          <button type="button" onClick={onClose} className={styles.btnCancel}>Cancel</button>
          <button type="button" onClick={handleAdd} className={styles.btnAddTag}>Add Tag</button>
        </div>
      </div>
    </div>
  )
}
