"use client"

import {
  Settings,
  Link2,
  Bell,
  Globe,
  CreditCard,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import styles from "../settings.module.css"

interface SettingItem {
  id: string
  label: string
  icon: React.ElementType
  hasCaret?: boolean
}

const settingsList: SettingItem[] = [
  { id: "general", label: "General", icon: Settings, hasCaret: true },
  { id: "linked", label: "Linked Account", icon: Link2 },
  { id: "notifications", label: "Notification Setting", icon: Bell },
  { id: "language", label: "Language", icon: Globe },
  { id: "payment", label: "Payment and Billing", icon: CreditCard },
  { id: "help", label: "Help Center", icon: HelpCircle },
  { id: "privacy", label: "Privacy Policy", icon: ShieldCheck, hasCaret: true },
]

interface SettingsSidebarProps {
  activeTab: string
  onTabChange: (id: string) => void
}

export default function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <div className={styles.settingsList}>
      {settingsList.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.id}
            className={`${styles.settingsCard} ${activeTab === item.id ? styles.settingsCardActive : ""}`}
            onClick={() => onTabChange(item.id)}
          >
            <Icon className={styles.settingsIcon} />
            <span className={styles.settingsLabel}>{item.label}</span>
            {item.hasCaret ? (
              <ChevronRight className={styles.settingsArrow} />
            ) : (
              <ExternalLink className={styles.settingsArrow} />
            )}
          </div>
        )
      })}
    </div>
  )
}
