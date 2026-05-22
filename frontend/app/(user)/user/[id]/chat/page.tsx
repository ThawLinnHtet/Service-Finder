"use client"

import { useState, useRef, useEffect } from "react"
import styles from "./chat.module.css"
import ContactSidebar from "./components/ContactSidebar"
import ChatWindow from "./components/ChatWindow"

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
        <ContactSidebar
          contacts={contacts}
          selectedContact={selectedContact}
          onContactClick={handleContactClick}
        />
        <ChatWindow
          selectedContact={selectedContact}
          messages={messages}
          message={message}
          onMessageChange={setMessage}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
          messagesEndRef={messagesEndRef}
        />
      </div>
    </div>
  )
}
