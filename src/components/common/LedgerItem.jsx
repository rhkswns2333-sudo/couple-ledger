import { useState, useRef, useEffect } from 'react'
import { formatAmount } from '../../utils/formatters'
import styles from './LedgerItem.module.css'

export default function LedgerItem({ record, onEdit, onDelete }) {
  const { type, emoji, catName, amount, memo, date, writer } = record
  const isIncome = type === 'income'
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <div className={styles.item}>
      <div className={styles.icon}>{emoji}</div>
      <div className={styles.info}>
        <p className={styles.memo}>{memo || catName}</p>
        <div className={styles.meta}>
          <span>{date.slice(5)}</span>
          <span>{catName}</span>
          <span className={styles.writer}>{writer}</span>
        </div>
      </div>
      <span className={`${styles.amount} ${isIncome ? styles.income : styles.expense}`}>
        {isIncome ? '+' : '-'}{formatAmount(amount)}
      </span>
      {(onEdit || onDelete) && (
        <div className={styles.menuWrap} ref={menuRef}>
          <button className={styles.menuBtn} onClick={() => setMenuOpen(v => !v)}>⋮</button>
          {menuOpen && (
            <div className={styles.dropdown}>
              {onEdit && (
                <button className={styles.dropItem} onClick={() => { setMenuOpen(false); onEdit(record) }}>
                  ✏️ 수정하기
                </button>
              )}
              {onDelete && (
                <button className={`${styles.dropItem} ${styles.dropDelete}`} onClick={() => { setMenuOpen(false); onDelete(record.id) }}>
                  🗑️ 삭제하기
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
