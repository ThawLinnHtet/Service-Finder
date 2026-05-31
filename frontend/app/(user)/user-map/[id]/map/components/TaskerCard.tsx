"use client"

import { MessageSquare } from "lucide-react"
import type { Tasker } from "./types"
import styles from "../map.module.css"

interface TaskerCardProps {
  tasker: Tasker
  onClick: () => void
}

const emojis = ["📦", "🧹", "🚚", "🧼", "🔨", "🧴", "🔧", "👤"]

export default function TaskerCard({ tasker, onClick }: TaskerCardProps) {
  const emoji = emojis[tasker.id % emojis.length]

  return (
    <div className={styles.taskerCard} onClick={onClick}>
      <div className={styles.taskerCardImage}>
        <span className={styles.taskerCardEmoji}>{emoji}</span>
      </div>
      <div className={styles.taskerCardContent}>
        <div className={styles.taskerCardTags}>
          {tasker.tags.map((tag, i) => (
            <span key={i} className={styles.tag}>{tag}</span>
          ))}
        </div>
        <h4 className={styles.taskerCardName}>{tasker.name}</h4>
        <div className={styles.taskerCardMeta}>
          <svg className={styles.ratingStar} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span><span className={styles.ratingValue}>{tasker.rating}</span> Rating</span>
          <svg className={styles.reviewIcon} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span><span className={styles.reviewValue}>{tasker.reviews.toLocaleString()}</span> Reviews</span>
        </div>
        <div className={styles.taskerCardFooter}>
          <p className={styles.priceText}>
            Start from : <span className={styles.priceValue}>{tasker.price} MMK</span>
          </p>
          <button
            className={`${styles.orderBtn} ${tasker.online ? styles.orderBtnOnline : styles.orderBtnOffline}`}
            onClick={(e) => e.stopPropagation()}
          >
            {tasker.online ? "Order Now" : "Closed"}
          </button>
        </div>
      </div>
    </div>
  )
}
