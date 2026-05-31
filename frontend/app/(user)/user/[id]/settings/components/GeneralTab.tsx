"use client"

import { ChevronDown } from "lucide-react"
import styles from "../settings.module.css"

interface GeneralTabProps {
  appearance: string
  onAppearanceChange: (value: string) => void
}

export default function GeneralTab({ appearance, onAppearanceChange }: GeneralTabProps) {
  return (
    <div className={styles.contentWrapper}>
      <h3 className={styles.contentTitle}>My Setting</h3>
      <div className={styles.contentBody}>
        <div className={styles.settingRow}>
          <div>
            <h4 className={styles.settingLabel}>Appaerance</h4>
            <p className={styles.settingDesc}>Customize how you theams looks on your device.</p>
          </div>
          <div className={styles.selectWrapper}>
            <select
              value={appearance}
              onChange={(e) => onAppearanceChange(e.target.value)}
              className={styles.select}
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
            <ChevronDown className={styles.selectIcon} />
          </div>
        </div>

        <div className={styles.settingRowVertical}>
          <div>
            <h4 className={styles.settingLabel}>Two-factor authentication</h4>
            <p className={styles.settingDesc}>
              Keep your account secure by enabling 2FA via SMS or using a temporary one-time passcode(TOTP).
            </p>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  )
}
