import styles from "../tasker.module.css"

export default function ActionFooter({ onAction }: { onAction: (type: "accept" | "decline") => void }) {
  return (
    <footer className={styles.footer}>
      <button onClick={() => onAction("decline")} className={styles.btnDecline}>Decline</button>
      <button onClick={() => onAction("accept")} className={styles.btnAccept}>Accept</button>
    </footer>
  )
}
