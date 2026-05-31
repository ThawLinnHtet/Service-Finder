"use client"

import styles from "../profile.module.css"

interface ProfileCardProps {
  name: string
  profession: string
  price: string
}

export default function ProfileCard({ name, profession, price }: ProfileCardProps) {
  return (
    <div className={styles.profileCard}>
      <div className={styles.profileCardContent}>
        <div className={styles.profileAvatar}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" />
        </div>
        <div className={styles.profileInfo}>
          <h3 className={styles.profileName}>{name}</h3>
          <p className={styles.profileProfession}>{profession}</p>
          <div className={styles.profileDivider}></div>
          <div className={styles.profilePrice}>{price}</div>
        </div>
      </div>
      <div className={styles.profileCardDecoration}></div>
    </div>
  )
}
