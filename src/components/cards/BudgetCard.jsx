import { useState } from 'react'
import { formatAmount, getMonthKey } from '../../utils/formatters'
import { CATEGORIES } from '../../utils/categories'
import cardStyles from './cards.module.css'
import styles from './BudgetCard.module.css'

export default function BudgetCard({ records, budgets, saveBudget }) {
  const [editing, setEditing] = useState(null)
  const [editValue, setEditValue] = useState('')
  const monthKey = getMonthKey()
  const thisMonth = records.filter(r => r.date.startsWith(monthKey) && r.type === 'expense')

  function spentFor(category) {
    return thisMonth.filter(r => r.catName === category).reduce((s, r) => s + r.amount, 0)
  }

  function startEdit(cat, current) {
    setEditing(cat)
    setEditValue(String(current || ''))
  }

  async function saveEdit(cat) {
    const val = parseInt(editValue) || 0
    await saveBudget(cat, val)
    setEditing(null)
  }

  return (
    <div className={`${cardStyles.card} ${cardStyles.lavender}`}>
      <div className={cardStyles.cardHeader}>
        <div className={cardStyles.cardTitle}><span>🎯</span>예산 현황</div>
      </div>
      {CATEGORIES.map(({ key, emoji }) => {
        const spent = spentFor(key)
        const budget = budgets[key] || 0
        const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
        const isOver = budget > 0 && spent > budget
        const barClass = pct >= 100 ? styles.over : pct >= 80 ? styles.warn : styles.ok

        return (
          <div key={key} className={styles.budgetItem}>
            <div className={styles.row}>
              <span className={styles.cat}>{emoji} {key}</span>
              <div className={styles.right}>
                {editing === key ? (
                  <input
                    className={styles.editInput}
                    type="number"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={() => saveEdit(key)}
                    onKeyDown={e => e.key === 'Enter' && saveEdit(key)}
                    autoFocus
                  />
                ) : (
                  <span className={styles.amounts} onClick={() => startEdit(key, budget)}>
                    <b>{formatAmount(spent)}</b> / {budget > 0 ? formatAmount(budget) : '예산 설정'}
                  </span>
                )}
                {isOver && <span className={styles.overTag}>초과!</span>}
              </div>
            </div>
            {budget > 0 && (
              <div className={styles.barBg}>
                <div className={`${styles.bar} ${barClass}`} style={{ width: `${pct}%` }} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
