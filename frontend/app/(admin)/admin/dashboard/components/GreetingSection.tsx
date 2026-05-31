import styles from "../dashboard.module.css"

export default function GreetingSection() {
  return (
    <div className={styles.greeting}>
      <h2 className={styles.greetingTitle}>Hello Admin, Good Morning</h2>
      <p className={styles.greetingSubtitle}>Let&apos;s check your mail.</p>
    </div>
  )
}
