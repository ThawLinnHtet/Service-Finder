"use client"

import { useState } from "react"
import styles from "./settings.module.css"
import SettingsSidebar from "./components/SettingsSidebar"
import GeneralTab from "./components/GeneralTab"
import NotificationsTab from "./components/NotificationsTab"
import LanguageTab from "./components/LanguageTab"
import PlaceholderTab from "./components/PlaceholderTab"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [appearance, setAppearance] = useState("Light")
  const [selectedLanguage, setSelectedLanguage] = useState("Myanmar")
  const [notifications, setNotifications] = useState({
    dailyUpdate: true,
    newEvent: true,
    chatWithPerson: true,
    desktopNotification: true,
    emailNotification: false,
  })

  const tabs: Record<string, React.ReactNode> = {
    general: <GeneralTab appearance={appearance} onAppearanceChange={setAppearance} />,
    notifications: <NotificationsTab notifications={notifications} onChange={(u) => setNotifications({ ...notifications, ...u })} />,
    language: <LanguageTab selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />,
    linked: <PlaceholderTab title="Linked Accounts" description="Manage your connected services here." />,
    payment: <PlaceholderTab title="Payment and Billing" description="View invoices and manage payment methods." />,
    help: <PlaceholderTab title="Help Center" description="Need assistance? Check our documentation or contact support." />,
    privacy: <PlaceholderTab title="Privacy Policy" description="Your privacy is important to us. Read our full policy details here." />,
  }

  return (
    <div className={styles.main}>
      <h2 className={styles.pageTitle}>Setting</h2>
      <div className={styles.settingsLayout}>
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className={styles.detailPanel}>{tabs[activeTab]}</div>
      </div>
      <div className={styles.illustration}>
        <img src="https://placehold.co/300x200/FFF/7C5DCC?text=Illustration" alt="Decoration" />
      </div>
    </div>
  )
}
