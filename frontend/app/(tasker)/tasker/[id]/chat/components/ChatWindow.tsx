"use client"

import { RefObject } from "react"
import { Phone, Video, MoreVertical } from "lucide-react"
import styles from "../chat.module.css"
import MessageBubble from "./MessageBubble"
import TypingIndicator from "./TypingIndicator"
import MessageInput from "./MessageInput"

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

interface ChatWindowProps {
  selectedContact: Contact
  messages: Message[]
  message: string
  onMessageChange: (value: string) => void
  onSendMessage: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
  messagesEndRef: RefObject<HTMLDivElement | null>
}

export default function ChatWindow({
  selectedContact,
  messages,
  message,
  onMessageChange,
  onSendMessage,
  onKeyPress,
  messagesEndRef,
}: ChatWindowProps) {
  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderInfo}>
          <h3 className={styles.chatHeaderName}>{selectedContact.name}</h3>
          <p className={styles.chatHeaderStatus}>Last seen recently</p>
        </div>
        <div className={styles.chatHeaderActions}>
          <button className={styles.headerActionBtn}>
            <Phone className="w-4 h-4" />
          </button>
          <button className={styles.headerActionBtn}>
            <Video className="w-4 h-4" />
          </button>
          <button className={styles.headerActionBtn}>
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={styles.messagesArea}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <TypingIndicator />
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        message={message}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onKeyPress={onKeyPress}
      />
    </div>
  )
}
