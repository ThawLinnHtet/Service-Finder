"use client"

import styles from "../chat.module.css"

interface Message {
  id: number
  text: string
  isSender: boolean
  avatar: string
}

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div
      className={`${styles.message} ${
        message.isSender ? styles.messageSender : styles.messageReceiver
      }`}
    >
      <img src={message.avatar} alt="avatar" className={styles.messageAvatar} />
      <div
        className={`${styles.messageBubble} ${
          message.isSender ? styles.bubbleRight : styles.bubbleLeft
        }`}
      >
        <p className={styles.messageText}>{message.text}</p>
      </div>
    </div>
  )
}
