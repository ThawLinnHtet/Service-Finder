"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Mic,
  Send,
  Circle,
} from "lucide-react"
import styles from "./chat.module.css"

interface Message {
  id: number
  text: string
  isSender: boolean
  avatar: string
}

interface Contact {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
  isActive: boolean
}

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi my name is Mg Aung Kaung Myat.",
      isSender: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aung",
    },
    {
      id: 2,
      text: "I am your tasker baby boy",
      isSender: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    },
  ])
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "Aung Kaung Myat",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aung",
      lastMessage: "typing........",
      time: "10:15",
      isActive: true,
    },
    {
      id: 2,
      name: "Aung Kaung Myat",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aung2",
      lastMessage: "typing........",
      time: "10:15",
      isActive: false,
    },
    {
      id: 3,
      name: "Aung Kaung Myat",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aung3",
      lastMessage: "typing........",
      time: "10:15",
      isActive: false,
    },
    {
      id: 4,
      name: "Aung Kaung Myat",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aung4",
      lastMessage: "typing........",
      time: "10:15",
      isActive: false,
    },
  ])
  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: message,
          isSender: true,
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        },
      ])
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const handleContactClick = (contact: Contact) => {
    setContacts(
      contacts.map((c) => ({
        ...c,
        isActive: c.id === contact.id,
      }))
    )
    setSelectedContact(contact)
  }

  return (
    <div className={styles.main}>
      <div className={styles.chatLayout}>
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
                <div
                  key={contact.id}
                  className={`${styles.contactItem} ${
                    contact.isActive ? styles.contactItemActive : ""
                  }`}
                  onClick={() => handleContactClick(contact)}
                >
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className={`${styles.contactAvatar} ${
                      contact.isActive ? styles.avatarActive : ""
                    }`}
                  />
                  <div className={styles.contactInfo}>
                    <div className={styles.contactRow}>
                      <span className={styles.contactName}>{contact.name}</span>
                      <span className={styles.contactTime}>{contact.time}</span>
                    </div>
                    <p className={styles.contactMessage}>{contact.lastMessage}</p>
                  </div>
                </div>
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

        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderInfo}>
              <h3 className={styles.chatHeaderName}>{selectedContact.name}</h3>
              <p className={styles.chatHeaderStatus}>Last seen recently</p>
            </div>
            <div className={styles.chatHeaderActions}>
              <button className={styles.headerActionBtn}>
                <Phone className="w-5 h-5" />
              </button>
              <button className={styles.headerActionBtn}>
                <Video className="w-5 h-5" />
              </button>
              <button className={styles.headerActionBtn}>
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className={styles.messagesArea}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${
                  msg.isSender ? styles.messageSender : styles.messageReceiver
                }`}
              >
                <img src={msg.avatar} alt="avatar" className={styles.messageAvatar} />
                <div
                  className={`${styles.messageBubble} ${
                    msg.isSender ? styles.bubbleRight : styles.bubbleLeft
                  }`}
                >
                  <p className={styles.messageText}>{msg.text}</p>
                </div>
              </div>
            ))}

            <div className={styles.typingIndicator}>
              <div className={styles.typingBubble}>
                <div className={styles.typingDots}>
                  <Circle className={styles.dot} />
                  <Circle className={styles.dot} />
                  <Circle className={styles.dot} />
                </div>
                <span className={styles.typingText}>typing.....</span>
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write your messages"
                className={styles.messageInput}
              />
              <div className={styles.inputActions}>
                <button className={styles.inputActionBtn}>
                  <Smile className="w-5 h-5" />
                </button>
                <button className={styles.inputActionBtn}>
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  className={styles.sendBtn}
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}