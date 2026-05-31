"use client"

import { Calendar, Edit3 } from "lucide-react"
import styles from "../profile.module.css"

interface UserProfileCardProps {
  name: string
  joinDate: string
}

export default function UserProfileCard({ name, joinDate }: UserProfileCardProps) {
  return (
    <div className={styles.profileHeader}>
      <div className={styles.avatarSection}>
        <div className={styles.avatar}>
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aung"
            alt="User Profile"
          />
        </div>
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>{name}</h2>
          <div className={styles.joinDate}>
            <Calendar className="w-4 h-4" />
            <span>Date: {joinDate}</span>
          </div>
        </div>
      </div>
      <div className={styles.editButtonContainer}>
        <button className={styles.editButton}>
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  )
}
