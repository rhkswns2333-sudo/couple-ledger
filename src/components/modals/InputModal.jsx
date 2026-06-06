import { useState } from 'react'
import { CATEGORIES, INCOME_CATEGORY, WRITERS } from '../../utils/categories'
import { parseWithGemini } from '../../utils/gemini'
import { getTodayString, formatAmount } from '../../utils/formatters'
import styles from './modals.module.css'

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY

export default function InputModal({ onSave, onClose, editRecord }) {
  const [tab, setTab] = useState('manual')
  const isEdit = !!editRecord

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={e => e.stopPropagation()}>
        <div className={styles.handle} />

        {!isEdit && (
          <div className={styles.tabRow}>
            <button
              className={`${styles.modalTab} ${tab === 'manual' ? styles.modalTabActive : ''}`}
              onClick={() => setTab('manual')}
            >
              ✏️ 직접입력
            </button>
            <button
              className={`${styles.modalTab} ${tab === 'nl' ? styles.modalTabActive : ''}`}
              onClick={() => setTab('nl')}
            >
              ✨ 자연어입력
            </button>
          </div>
        )}

        {(isEdit || tab === 'manual')
          ? <ManualForm onSave={onSave} onClose={onClose} initial={editRecord} />
          : <NLForm onSave={onSave} onClose={onClose} />
        }
      </div>
    </div>
  )
}

function ManualForm({ onSave, onClose, initial }) {
  const [type, setType] = useState(initial?.type || 'expense')
  const [amount, setAmount] = useState(initial?.amount ? String(initial.amount) : '')
  const [catKey, setCatKey] = useState(initial?.catName || CATEGORIES[0].key)
  const [memo, setMemo] = useState(initial?.memo || '')
  const [date, setDate] = useState(initial?.date || getTodayString())
  const [writer, setWriter] = useState(initial?.writer || WRITERS[0].key)

  const activeCat = type === 'expense'
    ? CATEGORIES.find(c => c.key === catKey) || CATEGORIES[0]
    : INCOME_CATEGORY

  function handleSubmit(e) {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return
    onSave({ type, amount: Number(amount), catName: activeCat.key, emoji: activeCat.emoji, memo, date, writer })
    onClose()
  }

  return (
    <>
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

        <button type="submit" className={styles.saveBtn}>
          {initial ? '수정 완료 🌸' : '저장하기 🌸'}
        </button>
      </form>
    </>
  )
}

function NLForm({ onSave, onClose }) {
  const [step, setStep] = useState('input') // 'input' | 'loading' | 'confirm'
  const [text, setText] = useState('')
  const [writer, setWriter] = useState(WRITERS[0].key)
  const [parsed, setParsed] = useState(null)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!text.trim()) return
    setError('')
    setStep('loading')
    try {
      const result = await parseWithGemini(text, GEMINI_KEY, getTodayString())
      setParsed({ ...result, writer })
      setStep('confirm')
    } catch (e) {
      setError(e.message || '파싱 실패')
      setStep('input')
    }
  }

  function handleConfirm() {
    if (!parsed) return
    onSave(parsed)
    onClose()
  }

  if (step === 'loading') {
    return (
      <div className={styles.loadingWrap}>
        <span className={styles.loadingEmoji}>🌸</span>
        <p className={styles.loadingText}>Gemini가 분석 중이에요...</p>
      </div>
    )
  }

  if (step === 'confirm' && parsed) {
    return (
      <>
        <div className={styles.previewCard}>
          <div className={styles.previewMain}>
            <span className={styles.previewEmoji}>{parsed.emoji}</span>
            <span className={`${styles.previewAmount} ${parsed.type === 'income' ? styles.previewIncome : ''}`}>
              {parsed.type === 'income' ? '+' : '-'}{formatAmount(parsed.amount)}
            </span>
          </div>
          <p className={styles.previewMeta}>
            {parsed.catName} · {parsed.date} · {parsed.writer}
          </p>
          {parsed.memo && <p className={styles.previewMeta}>{parsed.memo}</p>}
        </div>
        <div className={styles.confirmRow}>
          <button className={styles.cancelBtn} onClick={() => setStep('input')}>다시 입력</button>
          <button className={styles.saveBtn} onClick={handleConfirm}>저장하기 🌸</button>
        </div>
      </>
    )
  }

  return (
    <>
      <label className={styles.label}>어떤 수입/지출이었나요?</label>
      <textarea
        className={styles.nlTextarea}
        placeholder="예) 오늘 스타벅스에서 아메리카노 두 잔 8500원 마심"
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        autoFocus
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

      {error && <p className={styles.errorText}>{error}</p>}

      <button className={styles.saveBtn} style={{ marginTop: 20 }} onClick={handleSave}>
        저장하기 🌸
      </button>
    </>
  )
}
