import styles from "../map.module.css"
import { Search, Menu } from "lucide-react"

interface MapHeaderProps {
  onToggleTaskerList: () => void
  onTogglePrice: () => void
  onToggleFilter: () => void
  onToggleSort: () => void
}

export default function MapHeader({ onToggleTaskerList, onTogglePrice, onToggleFilter, onToggleSort }: MapHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.logo}>Logo</h1>
        <nav className={styles.nav}>
          <button className={styles.navBtn}>Category</button>
          <button className={`${styles.navBtn} ${styles.navBtnActive}`} onClick={onToggleTaskerList}>
            All tasker
          </button>
          <button className={styles.navBtn} onClick={onTogglePrice}>
            Any price
          </button>
          <button className={styles.navBtn} onClick={onToggleFilter}>
            Filters
          </button>
          <button className={styles.navBtn} onClick={onToggleSort}>
            Sort
          </button>
        </nav>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.ratingBadge}>
          <span className={styles.ratingStar}>★</span>
          <span>5.0(+K Taskers)</span>
        </div>
        <div className={styles.searchWrapper}>
          <input type="text" placeholder="Search..." className={styles.searchInput} />
          <Search className={styles.searchIcon} />
        </div>
        <button className={styles.menuBtn}>
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
