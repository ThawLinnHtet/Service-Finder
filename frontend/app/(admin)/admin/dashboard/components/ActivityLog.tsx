import styles from "../dashboard.module.css"

const activities = [
  { name: "Aung Kaung Myat", action: "Add one new services", time: "5 hour ago" },
  { name: "Aung Kaung Myat", action: "Add one new services", time: "5 hour ago" },
  { name: "Aung Kaung Myat", action: "Add one new services", time: "5 hour ago" },
]

export default function ActivityLog() {
  return (
    <>
      <div className={styles.divider}></div>
      <div className={styles.activityLog}>
        <h3 className={styles.activityTitle}>Activity Log</h3>
        <div className={styles.activityList}>
          {activities.map((act, i) => (
            <div key={i} className={styles.activityItem}>
              <div className={styles.activityAvatar}></div>
              <div className={styles.activityContent}>
                <div className={styles.activityHeader}>
                  <h4 className={styles.activityName}>{act.name}</h4>
                  <span className={styles.activityTime}>{act.time}</span>
                </div>
                <p className={styles.activityAction}>{act.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
