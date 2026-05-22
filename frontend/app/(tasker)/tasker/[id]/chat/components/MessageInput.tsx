"use client"

import { Plus, Smile, Mic, Send } from "lucide-react"
import styles from "../chat.module.css"

interface MessageInputProps {
  message: string
  onMessageChange: (value: string) => void
  onSendMessage: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
}

export default function MessageInput({ message, onMessageChange, onSendMessage, onKeyPress }: MessageInputProps) {
  return (
    <div className={styles.inputArea}>
      <div className={styles.inputWrapper}>
        <button className={styles.inputActionBtn}>
          <Plus className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={onKeyPress}
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
          <button className={styles.sendBtn} onClick={onSendMessage}>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
