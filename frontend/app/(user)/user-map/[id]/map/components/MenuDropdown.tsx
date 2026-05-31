"use client"

import { forwardRef } from "react"
import { LogOut } from "lucide-react"
import styles from "../map.module.css"

interface MenuDropdownProps {
  onClose: () => void
}

const items = ["Profile", "Browse tasks", "Settings", "Help"]

const MenuDropdown = forwardRef<HTMLDivElement, MenuDropdownProps>(({ onClose }, ref) => (
  <div className={styles.dropdownMenu} ref={ref}>
    {items.map((item) => (
      <div key={item} className={styles.dropdownItem} onClick={onClose}>
        {item}
      </div>
    ))}
    <div className={styles.dropdownDivider} />
    <div className={styles.dropdownItem} onClick={onClose}>
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </div>
  </div>
))

MenuDropdown.displayName = "MenuDropdown"

export default MenuDropdown
