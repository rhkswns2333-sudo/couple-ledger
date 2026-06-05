import { formatAmount } from '../../utils/formatters'
import styles from './LedgerItem.module.css'

export default function LedgerItem({ record }) {
  const { type, cat, catName, amount, memo, date, writer } = record
  const isIncome = type === 'income'

  return (
    <div className={styles.item}>
      <div className={styles.icon}>{cat}</div>
      <div className={styles.info}>
        <p className={styles.memo}>{memo}</p>
        <div className={styles.meta}>
          <span>{date.slice(5)}</span>
          <span>{catName}</span>
          <span className={styles.writer}>{writer}</span>
        </div>
      </div>
      <span className={`${styles.amount} ${isIncome ? styles.income : styles.expense}`}>
        {isIncome ? '+' : '-'}{formatAmount(amount)}
      </span>
    </div>
  )
}
