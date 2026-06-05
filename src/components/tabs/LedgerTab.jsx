import { useState } from 'react'
import LedgerItem from '../common/LedgerItem'
import { CATEGORIES, WRITERS } from '../../utils/categories'
import cardStyles from '../cards/cards.module.css'
import styles from './LedgerTab.module.css'

export default function LedgerTab({ records }) {
  const [catFilter, setCatFilter] = useState('전체')
  const [writerFilter, setWriterFilter] = useState('전체')

  const filtered = records.filter(r => {
    const catOk = catFilter === '전체' || r.catName === catFilter
    const writerOk = writerFilter === '전체' || r.writer === writerFilter
    return catOk && writerOk
  })

  return (
    <div className={cardStyles.card}>
      <div className={cardStyles.cardHeader}>
        <div className={cardStyles.cardTitle}><span>📋</span>전체 내역</div>
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
        : filtered.map(r => <LedgerItem key={r.id} record={r} />)
      }
    </div>
  )
}
