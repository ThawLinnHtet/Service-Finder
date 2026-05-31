import { User, MessageSquare } from "lucide-react"
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

interface TaskerCardProps {
  tasker: Tasker
  onClick: () => void
}

export default function TaskerCard({ tasker, onClick }: TaskerCardProps) {
  return (
    <div className={styles.taskerCard} onClick={onClick}>
      <div className={styles.taskerCardImage}>
        <User className="w-8 h-8 text-gray-300" />
      </div>
      <div className={styles.taskerCardContent}>
        <div className={styles.taskerCardHeader}>
          <h4 className={styles.taskerCardName}>{tasker.name}</h4>
          <div className={styles.taskerCardTags}>
            {tasker.tags.map((tag, i) => (
              <span key={i} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className={styles.taskerCardMeta}>
          <span className={styles.ratingText}>★</span>
          <span>{tasker.rating} Rating</span>
          <MessageSquare className="w-3 h-3 ml-2" />
          <span>{tasker.reviews} Reviews</span>
        </div>
        <div className={styles.taskerCardFooter}>
          <p className={styles.priceText}>
            Start from : <span className={styles.priceValue}>{tasker.price} MMK</span>
          </p>
          <button className={`${styles.orderBtn} ${tasker.online ? styles.orderBtnOnline : styles.orderBtnOffline}`}>
            {tasker.online ? "Order Now" : "Closed"}
          </button>
        </div>
      </div>
    </div>
  )
}
