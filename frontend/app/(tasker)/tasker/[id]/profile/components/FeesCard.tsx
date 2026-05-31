"use client"

import { useRouter, useParams } from "next/navigation"
import { Star } from "lucide-react"
import styles from "../profile.module.css"

export default function FeesCard() {
  const router = useRouter()
  const params = useParams()

  const handleRequestPrice = () => {
    router.push(`/tasker/${params.id}/profile/changeprice`)
  }
  return (
    <div className={styles.feesCard}>
      <div className={styles.feesContent}>
        <div className={styles.feesIcon}>
          <Star className="w-6 h-6" />
        </div>
        <div className={styles.feesText}>
          <h4 className={styles.feesTitle}>Your customer services fee</h4>
          <p className={styles.feesSubtitle}>From 20000MMK</p>
        </div>
      </div>
      <button className={styles.feesBtn} onClick={handleRequestPrice}>Request more price</button>
    </div>
  )
}
