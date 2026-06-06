import { useState } from 'react'
import { getDaysInMonth } from '../../utils/formatters'
import LedgerItem from '../common/LedgerItem'
import cardStyles from '../cards/cards.module.css'
import styles from './CalendarTab.module.css'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export default function CalendarTab({ records }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState(today.getDate())

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = getDaysInMonth(year, month)

  function dateStr(d) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  function dayExpense(d) {
    return records.filter(r => r.date === dateStr(d) && r.type === 'expense').reduce((s, r) => s + r.amount, 0)
  }

  function dayIncome(d) {
    return records.filter(r => r.date === dateStr(d) && r.type === 'income').reduce((s, r) => s + r.amount, 0)
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelected(null)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelected(null)
  }

  const selectedRecords = selected ? records.filter(r => r.date === dateStr(selected)) : []

  return (
    <>
      <div className={cardStyles.card}>
        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={prevMonth}>◀</button>
          <span className={styles.monthLabel}>{year}년 {month + 1}월</span>
          <button className={styles.navBtn} onClick={nextMonth}>▶</button>
        </div>
        <div className={styles.grid}>
          {DAY_LABELS.map((d, i) => (
            <div key={d} className={`${styles.dayHeader} ${i === 0 ? styles.sun : i === 6 ? styles.sat : ''}`}>{d}</div>
          ))}
          {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const d = i + 1
            const expense = dayExpense(d)
            const income = dayIncome(d)
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            const isSelected = d === selected
            return (
              <button
                key={d}
                className={`${styles.day} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
                onClick={() => setSelected(d === selected ? null : d)}
              >
                <span>{d}</span>
                {income > 0 && <span className={styles.income}>{income >= 10000 ? `+${Math.round(income / 10000)}만` : `+${income}`}</span>}
                {expense > 0 && <span className={styles.expense}>{expense >= 10000 ? `-${Math.round(expense / 10000)}만` : `-${expense}`}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {selected && (
        <div className={`${cardStyles.card} ${cardStyles.pink}`}>
          <p className={styles.detailTitle}>📌 {month + 1}월 {selected}일</p>
          {selectedRecords.length === 0
            ? <p style={{ fontSize: 13, color: 'var(--text-light)', padding: '8px 0' }}>내역이 없어요 🌸</p>
            : selectedRecords.map(r => <LedgerItem key={r.id} record={r} />)
          }
        </div>
      )}
    </>
  )
}
