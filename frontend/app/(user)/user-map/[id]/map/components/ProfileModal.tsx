"use client"

import { useState } from "react"
import { X, Star, History, CalendarPlus, ChevronDown, ChevronUp, MapPin, Phone, Mail, Clock } from "lucide-react"
import type { Tasker } from "./types"
import styles from "../map.module.css"

interface ProfileModalProps {
  show: boolean
  tasker: Tasker | null
  onClose: () => void
  onConfirm: () => void
}

export default function ProfileModal({ show, tasker, onClose, onConfirm }: ProfileModalProps) {
  const [isBioExpanded, setIsBioExpanded] = useState(false)

  if (!tasker) return null

  return (
    <div className={`${styles.profileOverlay} ${!show ? styles.profileOverlayHidden : ""}`}>
      <div className={styles.profileModal}>
        <div className={styles.profileContent}>
          {/* Close button */}
            <button className={styles.profileCloseBtn} onClick={onClose}>
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Header: title left, icons right */}
          <div className={styles.profileHeaderTop}>
            <div>
              <h2 className={styles.profileTitle}>Tutor/teacher/guide</h2>
              <p className={styles.profileSubtitle}>
                {tasker.name} with 3 years experience
              </p>
            </div>
            <div className={styles.profileHeaderIcons}>
              <button className={styles.profileIconBtn} title="History">
                <Clock className="w-5 h-5" />
              </button>
              <button className={styles.profileIconBtn} title="Calendar Booking">
                <CalendarPlus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stars row */}
          <div className={styles.profileStarsRow}>
            <div className={styles.profileStars}>
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
              <Star className="w-3 h-3 text-amber-300 stroke-2 fill-none" />
            </div>
            <span className={styles.profileRatingText}>{tasker.rating}/5</span>
            <span className={styles.profileRatingSep}>-</span>
            <span className={styles.profileTaskerCount}>{tasker.reviews}+tasker</span>
          </div>

          {/* Avatar + Speech Bubble */}
          <div className={styles.profileAvatarRow}>
            {/* Inline SVG Avatar */}
            <div className={styles.profileSvgAvatar}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="48" fill="none" />
                <path d="M25,50 C20,30 30,10 50,10 C70,10 80,30 75,50 C75,58 72,70 70,75 C68,78 65,80 65,80 L35,80 C35,80 32,78 30,75 C28,70 25,58 25,50 Z" fill="#4B3621" />
                <rect x="44" y="65" width="12" height="15" rx="4" fill="#FAD1B8" />
                <path d="M44,72 C44,72 50,76 56,72 L56,78 L44,78 Z" fill="#E5B59C" />
                <ellipse cx="50" cy="48" rx="20" ry="23" fill="#FAD1B8" />
                <path d="M30,38 C32,24 42,20 50,22 C58,20 68,24 70,38 C72,32 70,22 65,18 C58,15 42,15 35,18 C30,22 28,32 30,38 Z" fill="#5C4033" />
                <circle cx="41" cy="44" r="8" fill="none" stroke="#222" strokeWidth="1.5" />
                <circle cx="59" cy="44" r="8" fill="none" stroke="#222" strokeWidth="1.5" />
                <line x1="49" y1="44" x2="51" y2="44" stroke="#222" strokeWidth="1.5" />
                <path d="M33,44 C31,43 29,45 28,47" fill="none" stroke="#222" strokeWidth="1.2" />
                <path d="M67,44 C69,43 71,45 72,47" fill="none" stroke="#222" strokeWidth="1.2" />
                <circle cx="41" cy="44" r="2" fill="#222" />
                <circle cx="59" cy="44" r="2" fill="#222" />
                <path d="M36,35 C38,33 43,34 45,36" fill="none" stroke="#5C4033" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M64,35 C62,33 57,34 55,36" fill="none" stroke="#5C4033" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M49,49 C50,52 51,52 51,49" fill="none" stroke="#E5B59C" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M45,54 C47,58 53,58 55,54" fill="none" stroke="#D32F2F" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="35" cy="51" r="2" fill="#FF8A80" opacity="0.6" />
                <circle cx="65" cy="51" r="2" fill="#FF8A80" opacity="0.6" />
                <path d="M35,80 L65,80 L60,74 L53,74 L50,78 L47,74 L40,74 Z" fill="#FFFFFF" />
                <polygon points="50,78 45,74 48,74" fill="#E0E0E0" />
                <polygon points="50,78 55,74 52,74" fill="#E0E0E0" />
                <path d="M30,80 C32,77 36,75 40,74 L37,80 Z" fill="#4A5F9E" />
                <path d="M70,80 C68,77 64,75 60,74 L63,80 Z" fill="#4A5F9E" />
                <path d="M38,78 C35,84 32,95 32,100 L68,100 C68,95 65,84 62,78" fill="#4A5F9E" />
                <path d="M43,76 L50,88 L57,76" fill="none" stroke="#3F51B5" strokeWidth="2" />
                <path d="M47,75 L53,75 L50,84 Z" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Speech bubble */}
            <div className={styles.profileSpeechBubble}>
              <p className={styles.profileSpeechText}>
                Hello everyone,
              </p>
              <p className={styles.profileSpeechSubtext}>
                My name is Dr Physics teachel,..........................................
                {isBioExpanded && (
                  <span className={styles.profileBioExpanded}>
                    I specialize in conceptual physics, advanced mechanics, and standard curriculum prep. With over 3 years of classroom and 1-on-1 private tutoring, I can help you achieve top grade percentiles!
                  </span>
                )}
              </p>
              <button onClick={() => setIsBioExpanded(!isBioExpanded)} className={styles.profileMoreBtn}>
                <span>More</span>
                {isBioExpanded ? <ChevronUp className="w-3.5 h-3.5 stroke-[3]" /> : <ChevronDown className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            </div>
          </div>

          {/* Contact + Schedule Grid */}
          <div className={styles.profileInfoGrid}>
            <div className={styles.profileContactCol}>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className={styles.profileAddress}>
                {tasker.address}
              </a>
              <a href={`tel:${tasker.phone}`} className={styles.profilePhone}>
                {tasker.phone}
              </a>
              <a href={`mailto:${tasker.email}`} className={styles.profileEmail}>
                {tasker.email}
              </a>
            </div>
            <div className={styles.profileScheduleCol}>
              <div className={styles.profileScheduleGrid}>
                <span className={styles.profileScheduleLabel}>Mon-Fri</span>
                <span className={styles.profileScheduleLabel}>Sat-Sun</span>
                <span className={styles.profileScheduleValue}>{tasker.hours.weekday}</span>
                {tasker.hours.closed ? (
                  <span className={styles.profileHoursClosed}>closed</span>
                ) : (
                  <span className={styles.profileScheduleValue}>{tasker.hours.weekend}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.profileActions}>
            <button className={styles.profileBtnBooking} onClick={onConfirm}>
              Booking
            </button>
            <button className={styles.profileBtnCancel} onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
