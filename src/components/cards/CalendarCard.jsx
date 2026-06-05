import { useState } from 'react'
import { getDaysInMonth } from '../../utils/formatters'
import LedgerItem from '../common/LedgerItem'
import cardStyles from './cards.module.css'
import styles from './CalendarCard.module.css'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export default function CalendarCard({ records }) {
  const today = new Date()
  const [selected, setSelected] = useState(null)

  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = getDaysInMonth(year, month)

  function dateStr(d) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  function hasData(d) {
    return records.some(r => r.date === dateStr(d))
  }

  const selectedRecords = selected ? records.filter(r => r.date === dateStr(selected)) : []

  return (
    <div className={`${cardStyles.card} ${cardStyles.mint}`}>
      <div className={cardStyles.cardHeader}>
        <div className={cardStyles.cardTitle}><span>📅</span>캘린더</div>
      </div>
      <div className={styles.grid}>
        {DAY_LABELS.map((d, i) => (
          <div key={d} className={`${styles.dayHeader} ${i === 0 ? styles.sun : i === 6 ? styles.sat : ''}`}>{d}</div>
        ))}
        {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1
          const isToday = d === today.getDate()
          const isSelected = d === selected
          return (
            <button
              key={d}
              className={`${styles.day} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
              onClick={() => setSelected(d === selected ? null : d)}
            >
              {d}
              {hasData(d) && <span className={styles.dot} />}
            </button>
          )
        })}
      </div>
      {selected && (
        <div className={styles.detail}>
          <p className={styles.detailTitle}>📌 {month + 1}월 {selected}일</p>
          {selectedRecords.length === 0
            ? <p className={styles.empty}>내역이 없어요 🌸</p>
            : selectedRecords.map(r => <LedgerItem key={r.id} record={r} />)
          }
        </div>
      )}
    </div>
  )
}
