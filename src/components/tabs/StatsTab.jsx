import { getMonthKey, formatAmount } from '../../utils/formatters'
import { CATEGORIES } from '../../utils/categories'
import cardStyles from '../cards/cards.module.css'
import styles from './StatsTab.module.css'

export default function StatsTab({ records }) {
  const monthKey = getMonthKey()
  const thisMonth = records.filter(r => r.date.startsWith(monthKey) && r.type === 'expense')
  const totalExpense = thisMonth.reduce((s, r) => s + r.amount, 0)

  const catData = CATEGORIES.map(c => ({
    ...c,
    amount: thisMonth.filter(r => r.catName === c.key).reduce((s, r) => s + r.amount, 0),
  })).filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount)

  const monthlyData = Array.from({ length: 5 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (4 - i))
    const key = getMonthKey(d)
    const amt = records.filter(r => r.date.startsWith(key) && r.type === 'expense').reduce((s, r) => s + r.amount, 0)
    return { key, label: `${d.getMonth() + 1}월`, amount: amt }
  })
  const maxMonthly = Math.max(...monthlyData.map(m => m.amount), 1)

  const writerData = [
    { key: '🐰', label: '🐰 나', amount: thisMonth.filter(r => r.writer === '🐰').reduce((s, r) => s + r.amount, 0) },
    { key: '🐻', label: '🐻 상대', amount: thisMonth.filter(r => r.writer === '🐻').reduce((s, r) => s + r.amount, 0) },
  ]
  const maxWriter = Math.max(...writerData.map(w => w.amount), 1)

  const RADIUS = 45
  const CIRC = 2 * Math.PI * RADIUS
  let offset = 0
  const donutSegments = totalExpense > 0 ? catData.map(c => {
    const pct = c.amount / totalExpense
    const dash = pct * CIRC
    const seg = { ...c, dash, offset }
    offset += dash
    return seg
  }) : []

  return (
    <>
      <div className={`${cardStyles.card} ${cardStyles.pink}`}>
        <div className={cardStyles.cardHeader}>
          <div className={cardStyles.cardTitle}><span>🍩</span>카테고리별 지출</div>
        </div>
        {totalExpense === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: 13, padding: '16px 0' }}>이번 달 지출이 없어요 🌸</p>
        ) : (
          <>
            <div className={styles.donutWrap}>
              <svg viewBox="0 0 120 120" width="150" height="150">
                <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="var(--pink-pale)" strokeWidth="20" />
                {donutSegments.map(s => (
                  <circle
                    key={s.key}
                    cx="60" cy="60" r={RADIUS}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="20"
                    strokeDasharray={`${s.dash} ${CIRC - s.dash}`}
                    strokeDashoffset={-s.offset}
                    transform="rotate(-90 60 60)"
                  />
                ))}
              </svg>
              <div className={styles.donutCenter}>
                <p className={styles.donutAmount}>{formatAmount(totalExpense)}</p>
                <p className={styles.donutLabel}>총 지출</p>
              </div>
            </div>
            <div className={styles.legend}>
              {catData.map(c => (
                <div key={c.key} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: c.color }} />
                  {c.emoji} {c.key} {Math.round(c.amount / totalExpense * 100)}%
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className={`${cardStyles.card} ${cardStyles.lavender}`}>
        <div className={cardStyles.cardHeader}>
          <div className={cardStyles.cardTitle}><span>📊</span>월별 지출 추이</div>
        </div>
        {monthlyData.map(m => (
          <div key={m.key} className={styles.barRow}>
            <span className={styles.barLabel} style={{ fontWeight: m.key === monthKey ? 700 : 400 }}>{m.label}</span>
            <div className={styles.barBg}>
              <div className={styles.barFill} style={{ width: `${(m.amount / maxMonthly) * 100}%` }} />
            </div>
            <span className={styles.barAmount}>{formatAmount(m.amount)}</span>
          </div>
        ))}
      </div>

      <div className={`${cardStyles.card} ${cardStyles.beige}`}>
        <div className={cardStyles.cardHeader}>
          <div className={cardStyles.cardTitle}><span>👫</span>누가 더 썼나</div>
        </div>
        {writerData.map(w => (
          <div key={w.key} className={styles.barRow}>
            <span className={styles.barLabel}>{w.label}</span>
            <div className={styles.barBg}>
              <div className={`${styles.barFill} ${w.key === '🐰' ? styles.barPink : styles.barMint}`} style={{ width: `${(w.amount / maxWriter) * 100}%` }} />
            </div>
            <span className={styles.barAmount}>{formatAmount(w.amount)}</span>
          </div>
        ))}
      </div>
    </>
  )
}
