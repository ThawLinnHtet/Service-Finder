import { X, ChevronDown } from "lucide-react"
import styles from "../map.module.css"

interface Tasker {
  id: number
  name: string
  rating: number
  reviews: number
  price: number
  tags: string[]
  coords: [number, number]
  online: boolean
  description: string
  phone: string
  email: string
  address: string
  hours: {
    weekday: string
    weekend: string
    closed: boolean
  }
}

interface ProfileModalProps {
  show: boolean
  tasker: Tasker | null
  onClose: () => void
  onConfirm: () => void
}

export default function ProfileModal({ show, tasker, onClose, onConfirm }: ProfileModalProps) {
  return (
    <div className={`${styles.profileOverlay} ${!show ? styles.profileOverlayHidden : ""}`}>
      <div className={styles.profileModal}>
        <button className={styles.profileCloseBtn} onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
        {tasker && (
          <div className={styles.profileContent}>
            <div className={styles.profileHeader}>
              <div>
                <h2 className={styles.profileTitle}>Tutor/teacher/guide</h2>
                <p className={styles.profileSubtitle}>
                  {tasker.name} with 3 years experience
                </p>
              </div>
              <div className={styles.profileRating}>
                <div className={styles.profileRatingStars}>
                  {"★★★★☆".split("").map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
                <p className={styles.profileRatingText}>
                  {tasker.rating}/5 - {tasker.reviews}+tasker
                </p>
              </div>
            </div>
            <div className={styles.profileCard}>
              <div className={styles.profileAvatar}>
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tasker.id}`}
                  alt={tasker.name}
                  className={styles.profileAvatarImg}
                />
                {tasker.online && <div className={styles.profileOnline} />}
              </div>
              <div className={styles.profileDescription}>
                <p className={styles.profileQuote}>
                  &quot;{tasker.description}&quot;
                </p>
                <button className={styles.profileMoreBtn}>
                  More <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className={styles.profileGrid}>
              <div>
                <p className={styles.profileAddress}>{tasker.address}</p>
                <p className={styles.profilePhone}>{tasker.phone}</p>
                <p className={styles.profileEmail}>{tasker.email}</p>
              </div>
              <div className={styles.profileHours}>
                <div>
                  <p className={styles.hoursLabel}>Mon-Fri</p>
                  <p>{tasker.hours.weekday}</p>
                </div>
                <div>
                  <p className={styles.hoursLabel}>Sat-Sun</p>
                  {tasker.hours.closed ? (
                    <p className={styles.hoursClosed}>closed</p>
                  ) : (
                    <p>{tasker.hours.weekend}</p>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.profileActions}>
              <button className={styles.confirmBtn} onClick={onConfirm}>
                Confirm
              </button>
              <button className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
