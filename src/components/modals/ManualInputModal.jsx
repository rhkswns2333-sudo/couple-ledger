import { useState } from 'react'
import { CATEGORIES, INCOME_CATEGORY, WRITERS } from '../../utils/categories'
import { getTodayString } from '../../utils/formatters'
import styles from './modals.module.css'

export default function ManualInputModal({ onSave, onClose }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [catKey, setCatKey] = useState(CATEGORIES[0].key)
  const [memo, setMemo] = useState('')
  const [date, setDate] = useState(getTodayString())
  const [writer, setWriter] = useState(WRITERS[0].key)

  const activeCat = type === 'expense'
    ? CATEGORIES.find(c => c.key === catKey) || CATEGORIES[0]
    : INCOME_CATEGORY

  function handleSubmit(e) {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return
    onSave({
      type,
      amount: Number(amount),
      catName: activeCat.key,
      emoji: activeCat.emoji,
      memo,
      date,
      writer,
    })
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={e => e.stopPropagation()}>
        <div className={styles.handle} />
        <h2 className={styles.title}>직접 입력 ✏️</h2>

        <div className={styles.typeToggle}>
          {['expense', 'income'].map(t => (
            <button
              key={t}
              type="button"
              className={`${styles.typeBtn} ${type === t ? styles.typeBtnActive : ''}`}
              onClick={() => setType(t)}
            >
              {t === 'expense' ? '💸 지출' : '💰 수입'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>금액</label>
          <div className={styles.amountWrap}>
            <input
              type="number"
              className={styles.amountInput}
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              min="1"
            />
            <span className={styles.amountUnit}>원</span>
          </div>

          {type === 'expense' && (
            <>
              <label className={styles.label}>카테고리</label>
              <div className={styles.catGrid}>
                {CATEGORIES.map(c => (
                  <button
                    key={c.key}
                    type="button"
                    className={`${styles.catBtn} ${catKey === c.key ? styles.catBtnActive : ''}`}
                    style={catKey === c.key ? { borderColor: c.color, background: c.color + '33' } : {}}
                    onClick={() => setCatKey(c.key)}
                  >
                    <span>{c.emoji}</span>
                    <span>{c.key}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <label className={styles.label}>메모</label>
          <input
            type="text"
            className={styles.textInput}
            placeholder="어디서 썼어요? (선택)"
            value={memo}
            onChange={e => setMemo(e.target.value)}
          />

          <label className={styles.label}>날짜</label>
          <input
            type="date"
            className={styles.textInput}
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          <label className={styles.label}>작성자</label>
          <div className={styles.writerRow}>
            {WRITERS.map(w => (
              <button
                key={w.key}
                type="button"
                className={`${styles.writerBtn} ${writer === w.key ? styles.writerBtnActive : ''}`}
                onClick={() => setWriter(w.key)}
              >
                {w.key} {w.label}
              </button>
            ))}
          </div>

          <button type="submit" className={styles.saveBtn}>저장하기 🌸</button>
        </form>
      </div>
    </div>
  )
}
