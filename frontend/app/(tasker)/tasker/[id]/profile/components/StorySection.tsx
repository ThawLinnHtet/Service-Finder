"use client"

import { SquarePen } from "lucide-react"
import styles from "../profile.module.css"

interface StorySectionProps {
  story: string
}

export default function StorySection({ story }: StorySectionProps) {
  return (
    <section className={styles.storySection}>
      <div className={styles.storyHeader}>
        <h3 className={styles.storyTitle}>They talk about their story</h3>
        <button className={styles.editBtn}>
          <SquarePen className="w-4 h-4" />
        </button>
      </div>
      <p className={styles.storyText}>
        {story}
        <button className={styles.readMoreBtn}>Read more</button>
      </p>
    </section>
  )
}
