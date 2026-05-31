"use client"

import { useEffect, useState } from "react"
import styles from "../dashboard.module.css"

export default function Timer() {
  const [elapsedTime, setElapsedTime] = useState("01:24:12")

  useEffect(() => {
    let seconds = 5052
    const interval = setInterval(() => {
      seconds++
      const h = Math.floor(seconds / 3600).toString().padStart(2, "0")
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0")
      const s = (seconds % 60).toString().padStart(2, "0")
      setElapsedTime(`${h}:${m}:${s}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.activeJobTimerInfo}>
      <div className={styles.timerLabel}>
        <span>Time Elapsed</span>
        <span>{elapsedTime}</span>
      </div>
      <div className={styles.timerBar}>
        <div className={styles.timerProgress} />
      </div>
      <div className={styles.timerSchedule}>
        <span>Start: 4:00PM</span>
        <span>Finish: 6:00PM</span>
      </div>
    </div>
  )
}
