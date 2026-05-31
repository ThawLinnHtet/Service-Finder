import { Search, SlidersHorizontal, ChevronsUpDown, MoreVertical } from "lucide-react"
import styles from "../dashboard.module.css"

const serviceData = [
  { name: "Aung Kaung Myat", date: "30 May 2026, 08:00PM", type: "House cleaning", amount: "10000MMK" },
  { name: "Aung Kaung Myat", date: "30 May 2026, 08:00PM", type: "House cleaning", amount: "10000MMK" },
  { name: "Aung Kaung Myat", date: "30 May 2026, 08:00PM", type: "House cleaning", amount: "10000MMK" },
  { name: "Aung Kaung Myat", date: "30 May 2026, 08:00PM", type: "House cleaning", amount: "10000MMK" },
  { name: "Aung Kaung Myat", date: "30 May 2026, 08:00PM", type: "House cleaning", amount: "10000MMK" },
  { name: "Aung Kaung Myat", date: "30 May 2026, 08:00PM", type: "House cleaning", amount: "10000MMK" },
]

export default function ServicesTable() {
  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeader}>
        <h3 className={styles.tableTitle}>Services Forms</h3>
        <div className={styles.tableActions}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input type="text" placeholder="Search a tasker" className={styles.searchInput} />
          </div>
          <button className={styles.filterBtn}>
            <SlidersHorizontal className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeadRow}>
              <th className={styles.tableHeaderCell}>
                <div className={styles.sortableHeader}>Name <ChevronsUpDown className="w-3 h-3" /></div>
              </th>
              <th className={styles.tableHeaderCell}>Date</th>
              <th className={styles.tableHeaderCell}>Type</th>
              <th className={styles.tableHeaderCell}>Amount</th>
              <th className={styles.tableHeaderCell}></th>
            </tr>
          </thead>
          <tbody>
            {serviceData.map((row, i) => (
              <tr key={i} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <div className={styles.nameCell}>
                    <div className={styles.avatar}></div>
                    <span className={styles.nameText}>{row.name}</span>
                  </div>
                </td>
                <td className={styles.tableCell}>{row.date}</td>
                <td className={styles.tableCell}>{row.type}</td>
                <td className={styles.tableCell}>{row.amount}</td>
                <td className={styles.tableCellAction}>
                  <button className={styles.moreBtn}><MoreVertical className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
