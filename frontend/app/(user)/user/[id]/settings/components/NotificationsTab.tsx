"use client"

import styles from "../settings.module.css"

interface NotificationsState {
  dailyUpdate: boolean
  newEvent: boolean
  chatWithPerson: boolean
  desktopNotification: boolean
  emailNotification: boolean
}

interface NotificationsTabProps {
  notifications: NotificationsState
  onChange: (updates: Partial<NotificationsState>) => void
}

export default function NotificationsTab({ notifications, onChange }: NotificationsTabProps) {
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
                onChange={(e) => onChange({ dailyUpdate: e.target.checked })}
                className={styles.checkbox}
              />
              <span>Daily productivity update</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={notifications.newEvent}
                onChange={(e) => onChange({ newEvent: e.target.checked })}
                className={styles.checkbox}
              />
              <span>New event created</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={notifications.chatWithPerson}
                onChange={(e) => onChange({ chatWithPerson: e.target.checked })}
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
              onChange={(e) => onChange({ desktopNotification: e.target.checked })}
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
              onChange={(e) => onChange({ emailNotification: e.target.checked })}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  )
}
