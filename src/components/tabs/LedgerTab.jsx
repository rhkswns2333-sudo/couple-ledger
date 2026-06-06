import { useState, useMemo } from 'react'
import LedgerItem from '../common/LedgerItem'
import { CATEGORIES, WRITERS } from '../../utils/categories'
import cardStyles from '../cards/cards.module.css'
import styles from './LedgerTab.module.css'

function getDefaultMonth(records) {
  const today = new Date()
  const thisKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  const prevDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const prevKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`
  const months = new Set(records.map(r => r.date.slice(0, 7)))
  if (months.has(thisKey)) return thisKey
  if (months.has(prevKey)) return prevKey
  return '전체'
}

export default function LedgerTab({ records, onEdit, onDelete }) {
  const [catFilter, setCatFilter] = useState('전체')
  const [writerFilter, setWriterFilter] = useState('전체')
  const [monthFilter, setMonthFilter] = useState(() => getDefaultMonth(records))

  const monthOptions = useMemo(() => {
    const keys = [...new Set(records.map(r => r.date.slice(0, 7)))].sort()
    return keys.map(key => {
      const [y, m] = key.split('-')
      const yy = String(y).slice(2)
      return { key, label: `${yy}년 ${Number(m)}월` }
    })
  }, [records])

  const filtered = records.filter(r => {
    const monthOk = monthFilter === '전체' || r.date.startsWith(monthFilter)
    const catOk = catFilter === '전체' || r.catName === catFilter
    const writerOk = writerFilter === '전체' || r.writer === writerFilter
    return monthOk && catOk && writerOk
  })

  return (
    <div className={cardStyles.card}>
      <div className={cardStyles.cardHeader}>
        <div className={cardStyles.cardTitle}><span>📋</span>내역</div>
        <select
          className={styles.monthSelect}
          value={monthFilter}
          onChange={e => setMonthFilter(e.target.value)}
        >
          <option value="전체">전체</option>
          {monthOptions.map(o => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className={styles.filters}>
        <div className={styles.filterRow}>
          {['전체', ...CATEGORIES.map(c => c.key)].map(k => (
            <button
              key={k}
              className={`${styles.filterBtn} ${catFilter === k ? styles.active : ''}`}
              onClick={() => setCatFilter(k)}
            >
              {k}
            </button>
          ))}
        </div>
        <div className={styles.filterRow}>
          {['전체', ...WRITERS.map(w => w.key)].map(k => (
            <button
              key={k}
              className={`${styles.filterBtn} ${writerFilter === k ? styles.active : ''}`}
              onClick={() => setWriterFilter(k)}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0
        ? <p style={{ fontSize: 13, color: 'var(--text-light)', textAlign: 'center', padding: '24px 0' }}>내역이 없어요 🌸</p>
        : filtered.map(r => <LedgerItem key={r.id} record={r} onEdit={onEdit} onDelete={onDelete} />)
      }
    </div>
  )
}
