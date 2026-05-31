"use client"

import { useState } from "react"
import styles from "../price.module.css"

export default function PriceFormFields() {
  const [name, setName] = useState("")
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

      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>His/Her Rating:</div>
        <div className={`${styles.fieldValue} ${styles.displayValue}`}>
          4.0 / 5
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>Your reason for request more fee:</div>
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
    </div>
  )
}
