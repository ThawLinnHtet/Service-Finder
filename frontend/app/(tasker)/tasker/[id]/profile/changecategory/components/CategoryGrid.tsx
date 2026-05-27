"use client"

import styles from "../changecategory.module.css"

const categories = [
  {
    id: "cleaning",
    label: "Cleaning Services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a9 9 0 1116.5 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 19.5h-1.5M4.5 19.5h15m-15 0a3 3 0 01-3-3v-3.375c0-.621.504-1.125 1.125-1.125h13.75c.621 0 1.125.504 1.125 1.125v3.375a3 3 0 01-3 3M8.25 10.5h7.5M12 3v7.5" />
      </svg>
    ),
  },
  {
    id: "repair",
    label: "Repair Services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.67 2.67 0 1021 17.25l-5.83-5.83m-3.75 3.75L11.42 15.17zM11.42 15.17l-6.21-6.21A2.67 2.67 0 119 5.21l6.21 6.21m-3.75 3.75l1.58-1.58m-1.58 1.58H1.5M15.17 11.42l1.58-1.58m-1.58 1.58V1.5" />
      </svg>
    ),
  },
  {
    id: "building",
    label: "Building Services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .414-.336.75-.75.75H4.5a.75.75 0 01-.75-.75v-4.25m16.5 0a3 3 0 00-3-3H7.125a3 3 0 00-3 3m16.5 0V11.25c0-.414-.336-.75-.75-.75H4.5a.75.75 0 01-.75.75v2.9m16.5 0H3.75M12 3v3.75m0 0H7.5m4.5 0h4.5" />
      </svg>
    ),
  },
  {
    id: "education",
    label: "Education",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.231-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84a50.58 50.58 0 00-2.658.814m-15.482 0l6.2 1.55a12.078 12.078 0 016.5 0l6.22-1.55" />
      </svg>
    ),
  },
  {
    id: "electrical",
    label: "Electrical Services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    id: "moving",
    label: "Moving Services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.317-5.113a1.5 1.5 0 00-1.493-1.408h-2.126M15.75 18.75h-6.75M5.25 15H18M18 15V11.25a2.25 2.25 0 00-2.25-2.25H13.5M12 9V4.5A2.25 2.25 0 009.75 2.25H5.25A2.25 2.25 0 003 4.5V15h9a3 3 0 003-3V9m0 0h1.5M9 7.5h.008v.008H9V7.5z" />
      </svg>
    ),
  },
]

interface CategoryGridProps {
  selected: string
  onSelect: (id: string) => void
}

export default function CategoryGrid({ selected, onSelect }: CategoryGridProps) {
  return (
    <div className={styles.categoryGrid}>
      {categories.map((cat) => (
        <div
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`${styles.categoryCard} ${selected === cat.id ? styles.categoryCardActive : ""}`}
        >
          <div className={styles.categoryIcon}>{cat.icon}</div>
          <span className={styles.categoryLabel}>{cat.label}</span>
          <div className={`${styles.checkedBadge} ${selected !== cat.id ? styles.badgeHidden : ""}`}>
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  )
}
