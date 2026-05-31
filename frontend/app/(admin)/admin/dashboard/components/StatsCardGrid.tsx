import { User, Briefcase, ShoppingBag } from "lucide-react"
import styles from "../dashboard.module.css"

const stats = [
  { label: "Users", value: "1K", icon: User, iconClass: styles.statsIconBlue, fillClass: styles.bgBlue, fillLight: styles.bgBlueLight, width1: "70%", width2: "30%" },
  { label: "Taskers", value: "19K", icon: Briefcase, iconClass: styles.statsIconOrange, fillClass: styles.bgOrange, fillLight: styles.bgOrangeLight, width1: "85%", width2: "40%" },
  { label: "Services", value: "200", icon: ShoppingBag, iconClass: styles.statsIconPurple, fillClass: styles.bgPurple, fillLight: styles.bgPurpleLight, width1: "45%", width2: "60%" },
  { label: "Earn MMK", value: "200M", icon: null, iconClass: styles.statsIconTeal, fillClass: styles.bgTeal, fillLight: styles.bgTealLight, width1: "65%", width2: "80%" },
]

export default function StatsCardGrid() {
  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <div key={i} className={styles.statsCard}>
            <div className={styles.statsCardHeader}>
              <div className={`${styles.statsIcon} ${stat.iconClass}`}>
                {Icon ? <Icon className="w-5 h-5" /> : <span className="font-bold">K</span>}
              </div>
              <span className={styles.statsLabel}>{stat.label}</span>
            </div>
            <div className={styles.statsValue}>{stat.value}</div>
            <div className={styles.progressBar}>
              <div className={`${styles.progressFill} ${stat.fillClass}`} style={{ width: stat.width1 }}></div>
            </div>
            <div className={`${styles.progressBar} ${styles.progressBarLight}`}>
              <div className={`${styles.progressFill} ${stat.fillLight}`} style={{ width: stat.width2 }}></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
