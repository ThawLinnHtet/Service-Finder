"use client"

import { SquarePen, Eye, EyeOff, X } from "lucide-react"
import styles from "../profile.module.css"

interface FormFieldProps {
  label: string
  value: string
  type: string
  showPassword?: boolean
  onTogglePassword?: () => void
  onClear?: () => void
  onEdit?: () => void
}

export default function FormField({ label, value, type, showPassword, onTogglePassword, onClear, onEdit }: FormFieldProps) {
  return (
    <div className={styles.formGroup}>
      <div className={styles.labelRow}>
        <label className={styles.label}>{label}</label>
        <div className={styles.fieldActions}>
          {onClear && value && (
            <button className={styles.fieldEditBtn} onClick={onClear}>
              <X className="w-3 h-3" />
            </button>
          )}
          <button className={styles.fieldEditBtn} onClick={onEdit}>
            <SquarePen className="w-3 h-3" />
          </button>
        </div>
      </div>
      {type === "password" ? (
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            value={value}
            className={styles.input}
            readOnly
          />
          <button className={styles.passwordToggle} onClick={onTogglePassword}>
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      ) : (
        <input type={type} value={value} className={styles.input} readOnly />
      )}
    </div>
  )
}
