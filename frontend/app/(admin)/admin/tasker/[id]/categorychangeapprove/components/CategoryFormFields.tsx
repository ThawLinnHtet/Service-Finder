"use client"

import { useState } from "react"
import styles from "../category.module.css"

export default function CategoryFormFields() {
  const [name, setName] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [reason, setReason] = useState("")

  return (
    <div className={styles.fields}>
      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>Name :</div>
        <div className={styles.fieldValue}>
          <input
            type="text"
            placeholder="Enter name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
          />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>Specific Skill:</div>
        <div className={`${styles.fieldValue} ${styles.displayValue}`}>
          House Cleaning ,repair
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>Job Title:</div>
        <div className={styles.fieldValue}>
          <input
            type="text"
            placeholder="Enter job title..."
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className={styles.inputField}
          />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>Your reason for changed service:</div>
        <div className={styles.fieldValue}>
          <input
            type="text"
            placeholder="Enter reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={styles.inputField}
          />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>Base Rate(MMK):</div>
        <div className={`${styles.fieldValue} ${styles.displayValue}`}>
          100000MMK
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>Experience Year:</div>
        <div className={`${styles.fieldValue} ${styles.displayValue}`}>
          3 year
        </div>
      </div>
    </div>
  )
}
