"use client"

import styles from "../chat.module.css"

interface Contact {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
  isActive: boolean
}

interface ContactItemProps {
  contact: Contact
  isActive: boolean
  onClick: (contact: Contact) => void
}

export default function ContactItem({ contact, isActive, onClick }: ContactItemProps) {
  return (
    <div
      className={`${styles.contactItem} ${isActive ? styles.contactItemActive : ""}`}
      onClick={() => onClick(contact)}
    >
      <img
        src={contact.avatar}
        alt={contact.name}
        className={`${styles.contactAvatar} ${isActive ? styles.avatarActive : ""}`}
      />
      <div className={styles.contactInfo}>
        <div className={styles.contactRow}>
          <span className={styles.contactName}>{contact.name}</span>
          <span className={styles.contactTime}>{contact.time}</span>
        </div>
        <p className={styles.contactMessage}>{contact.lastMessage}</p>
      </div>
    </div>
  )
}
