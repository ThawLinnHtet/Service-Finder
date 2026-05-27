import { RefreshCw } from "lucide-react"
import TaskerCard from "./TaskerCard"
import styles from "../map.module.css"

export interface Tasker {
  id: number
  name: string
  rating: number
  reviews: number
  price: number
  tags: string[]
  coords: [number, number]
  online: boolean
  description: string
  phone: string
  email: string
  address: string
  hours: {
    weekday: string
    weekend: string
    closed: boolean
  }
}

interface TaskerListSidebarProps {
  taskers: Tasker[]
  showTaskerList: boolean
  onToggle: () => void
  onTaskerClick: (id: number) => void
}

export default function TaskerListSidebar({ taskers, showTaskerList, onToggle, onTaskerClick }: TaskerListSidebarProps) {
  return (
    <div className={`${styles.taskerList} ${!showTaskerList ? styles.taskerListHidden : ""}`}>
      <div className={styles.taskerListHeader}>
        <h2 className={styles.taskerListTitle}>All Taskers about category</h2>
        <div className={styles.newTaskerBadge}>2 New Tasker Added</div>
      </div>
      <div className={styles.taskerCards}>
        {taskers.map((tasker) => (
          <TaskerCard key={tasker.id} tasker={tasker} onClick={() => onTaskerClick(tasker.id)} />
        ))}
      </div>
      <div className={styles.taskerListFooter}>
        <button className={styles.cancelBtn} onClick={onToggle}>
          Cancel
        </button>
        <div className={styles.refreshText}>
          <RefreshCw className="w-4 h-4" />
          Please wait
        </div>
      </div>
    </div>
  )
}
