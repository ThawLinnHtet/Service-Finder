import { Image } from "lucide-react"
import styles from "../register.module.css"

export default function NrcPhotoSection() {
  return (
    <div className={styles.nrcSection}>
      <div className={styles.nrcRow}>
        <div className={styles.nrcItem}>
          <span className={styles.formLabel}>NRC Photo:</span>
          <span className={styles.formValue}>Front</span>
          <div className={styles.nrcImageBox}>
            <Image className={styles.nrcImageIcon} />
          </div>
        </div>
        <div className={styles.nrcItem}>
          <span className={styles.formValue}>Back</span>
          <div className={styles.nrcImageBox}>
            <Image className={styles.nrcImageIcon} />
          </div>
        </div>
      </div>
    </div>
  )
}
