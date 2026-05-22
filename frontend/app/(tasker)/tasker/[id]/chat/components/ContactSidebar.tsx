"use client"

import { Search, MoreVertical } from "lucide-react"
import styles from "../chat.module.css"
import ContactItem from "./ContactItem"

interface Contact {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
  isActive: boolean
}

interface ContactSidebarProps {
  contacts: Contact[]
  selectedContact: Contact
  onContactClick: (contact: Contact) => void
}

export default function ContactSidebar({ contacts, selectedContact, onContactClick }: ContactSidebarProps) {
  return (
    <div className={styles.contactSidebar}>
      <div className={styles.contactCard}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
          />
          <Search className={styles.searchIcon} />
        </div>

        <div className={styles.contactHeader}>
          <h4 className={styles.contactTitle}>Last Chat</h4>
          <MoreVertical className={styles.menuIcon} />
        </div>

        <div className={styles.contactList}>
          {contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isActive={contact.id === selectedContact.id}
              onClick={onContactClick}
            />
          ))}
        </div>
      </div>

      <div className={styles.illustration}>
        <img
          src="https://api.dicebear.com/7.x/shapes/svg?seed=chat"
          alt="illustration"
          className={styles.illustrationImg}
        />
      </div>
    </div>
  )
}
