"use client"

import { ChevronDown, Trash } from "lucide-react"
import styles from "../settings.module.css"

const languageList = ["English", "Myanmar"]

interface LanguageTabProps {
  selectedLanguage: string
  onLanguageChange: (lang: string) => void
}

export default function LanguageTab({ selectedLanguage, onLanguageChange }: LanguageTabProps) {
  return (
    <div className={styles.contentWrapper}>
      <h3 className={styles.contentTitle}>Language</h3>
      <div className={styles.contentBody}>
        <div className={styles.settingRow}>
          <h4 className={styles.settingLabel}>Translate into this language</h4>
          <div className={styles.selectWrapper}>
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className={styles.select}
            >
              <option value="Myanmar">Myanmar</option>
              <option value="English">English</option>
              <option value="Japanese">Japanese</option>
            </select>
            <ChevronDown className={styles.selectIcon} />
          </div>
        </div>

        <div className={styles.languageCard}>
          <div className={styles.languageHeader}>
            <p className={styles.languageDesc}>Automatically translate to this language</p>
            <button className={styles.addLanguageBtn}>Add a language</button>
          </div>
          <div className={styles.languageList}>
            {languageList.map((lang, index) => (
              <div key={lang}>
                <div className={styles.languageItem}>
                  <span className={styles.languageName}>{lang}</span>
                  <button className={styles.removeLanguageBtn}>
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
                {index < languageList.length - 1 && <div className={styles.languageDivider} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
