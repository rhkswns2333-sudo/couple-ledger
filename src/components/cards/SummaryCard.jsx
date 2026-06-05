import { formatAmount, getMonthKey } from '../../utils/formatters'
import cardStyles from './cards.module.css'
import styles from './SummaryCard.module.css'

export default function SummaryCard({ records }) {
  const monthKey = getMonthKey()
  const thisMonth = records.filter(r => r.date.startsWith(monthKey))
  const income = thisMonth.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0)
  const expense = thisMonth.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0)
  const balance = income - expense

  return (
    <div className={`${cardStyles.card} ${cardStyles.pink}`}>
      <div className={cardStyles.cardHeader}>
        <div className={cardStyles.cardTitle}><span>💰</span>이번 달 요약</div>
        <span className={cardStyles.cardTag}>{monthKey.slice(5)}월</span>
      </div>
      <div className={styles.grid}>
        <div className={`${styles.item} ${styles.income}`}>
          <p className={styles.label}>💚 수입</p>
          <p className={`${styles.amount} ${styles.incomeColor}`}>{formatAmount(income)}</p>
        </div>
        <div className={`${styles.item} ${styles.expense}`}>
          <p className={styles.label}>🩷 지출</p>
          <p className={`${styles.amount} ${styles.expenseColor}`}>{formatAmount(expense)}</p>
        </div>
        <div className={`${styles.item} ${styles.balance}`}>
          <p className={styles.label}>💜 잔액</p>
          <p className={styles.amount}>{formatAmount(balance)}</p>
        </div>
      </div>
    </div>
  )
}
