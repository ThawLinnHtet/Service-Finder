"use client"

import { useState } from "react"
import {
  LayoutGrid,
  Link2,
  Bell,
  Globe,
  CreditCard,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  Trash,
  Settings,
} from "lucide-react"
import styles from "./settings.module.css"

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

const languageList = ["English", "Myanmar"]

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

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className={styles.contentWrapper}>
            <h3 className={styles.contentTitle}>My Setting</h3>
            <div className={styles.contentBody}>
              <div className={styles.settingRow}>
                <div>
                  <h4 className={styles.settingLabel}>Appaerance</h4>
                  <p className={styles.settingDesc}>Customize how you theams looks on your device.</p>
                </div>
                <div className={styles.selectWrapper}>
                  <select
                    value={appearance}
                    onChange={(e) => setAppearance(e.target.value)}
                    className={styles.select}
                  >
                    <option value="Light">Light</option>
                    <option value="Dark">Dark</option>
                  </select>
                  <ChevronDown className={styles.selectIcon} />
                </div>
              </div>

              <div className={styles.settingRowVertical}>
                <div>
                  <h4 className={styles.settingLabel}>Two-factor authentication</h4>
                  <p className={styles.settingDesc}>
                    Keep your account secure by enabling 2FA via SMS or using a temporary one-time passcode(TOTP).
                  </p>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className={styles.contentWrapper}>
            <h3 className={styles.contentTitle}>My Notification</h3>
            <div className={styles.contentBody}>
              <div className={styles.notificationSection}>
                <div className={styles.notificationHeader}>
                  <h4 className={styles.settingLabel}>Notify me when</h4>
                  <a href="#" className={styles.notificationLink}>About notification?</a>
                </div>
                <div className={styles.checkboxList}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={notifications.dailyUpdate}
                      onChange={(e) =>
                        setNotifications({ ...notifications, dailyUpdate: e.target.checked })
                      }
                      className={styles.checkbox}
                    />
                    <span>Daily productivity update</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={notifications.newEvent}
                      onChange={(e) =>
                        setNotifications({ ...notifications, newEvent: e.target.checked })
                      }
                      className={styles.checkbox}
                    />
                    <span>New event created</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={notifications.chatWithPerson}
                      onChange={(e) =>
                        setNotifications({ ...notifications, chatWithPerson: e.target.checked })
                      }
                      className={styles.checkbox}
                    />
                    <span>When chat with person</span>
                  </label>
                </div>
              </div>

              <div className={styles.settingRowVertical}>
                <div>
                  <h4 className={styles.settingLabel}>Desktop Notification</h4>
                  <p className={styles.settingDesc}>
                    Receive desktop notification whenever your organization requires your attentions.
                  </p>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={notifications.desktopNotification}
                    onChange={(e) =>
                      setNotifications({ ...notifications, desktopNotification: e.target.checked })
                    }
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.settingRowVertical}>
                <div>
                  <h4 className={styles.settingLabel}>Email Notification</h4>
                  <p className={styles.settingDesc}>
                    Receive email whenever your organization requires your attentions.
                  </p>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={notifications.emailNotification}
                    onChange={(e) =>
                      setNotifications({ ...notifications, emailNotification: e.target.checked })
                    }
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>
        )

      case "language":
        return (
          <div className={styles.contentWrapper}>
            <h3 className={styles.contentTitle}>Language</h3>
            <div className={styles.contentBody}>
              <div className={styles.settingRow}>
                <h4 className={styles.settingLabel}>Translate into this language</h4>
                <div className={styles.selectWrapper}>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className={styles.select}
                  >
                    <option value="Myanmar">Myanmar</option>
                    <option value="English">English</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                  <ChevronDown className={styles.selectIcon} />
                </div>
              </div>

              <div className={styles.languageCard}>
                <div className={styles.languageHeader}>
                  <p className={styles.languageDesc}>Automatically translate to this language</p>
                  <button className={styles.addLanguageBtn}>Add a language</button>
                </div>
                <div className={styles.languageList}>
                  {languageList.map((lang, index) => (
                    <div key={lang}>
                      <div className={styles.languageItem}>
                        <span className={styles.languageName}>{lang}</span>
                        <button className={styles.removeLanguageBtn}>
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                      {index < languageList.length - 1 && <div className={styles.languageDivider} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case "linked":
        return (
          <div className={styles.contentWrapper}>
            <h3 className={styles.contentTitle}>Linked Accounts</h3>
            <p className={styles.placeholderText}>Manage your connected services here.</p>
          </div>
        )

      case "payment":
        return (
          <div className={styles.contentWrapper}>
            <h3 className={styles.contentTitle}>Payment and Billing</h3>
            <p className={styles.placeholderText}>View invoices and manage payment methods.</p>
          </div>
        )

      case "help":
        return (
          <div className={styles.contentWrapper}>
            <h3 className={styles.contentTitle}>Help Center</h3>
            <p className={styles.placeholderText}>Need assistance? Check our documentation or contact support.</p>
          </div>
        )

      case "privacy":
        return (
          <div className={styles.contentWrapper}>
            <h3 className={styles.contentTitle}>Privacy Policy</h3>
            <p className={styles.placeholderText}>Your privacy is important to us. Read our full policy details here.</p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.main}>
      <h2 className={styles.pageTitle}>Setting</h2>

      <div className={styles.settingsLayout}>
        <div className={styles.settingsList}>
          {settingsList.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className={`${styles.settingsCard} ${activeTab === item.id ? styles.settingsCardActive : ""}`}
                onClick={() => setActiveTab(item.id)}
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

        <div className={styles.detailPanel}>{renderContent()}</div>
      </div>

      <div className={styles.illustration}>
        <img
          src="https://placehold.co/300x200/FFF/7C5DCC?text=Illustration"
          alt="Decoration"
        />
      </div>
    </div>
  )
}