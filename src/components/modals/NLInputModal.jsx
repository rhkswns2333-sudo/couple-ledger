import { useState } from 'react'
import { WRITERS } from '../../utils/categories'
import { parseWithGemini } from '../../utils/gemini'
import { getTodayString, formatAmount } from '../../utils/formatters'
import styles from './modals.module.css'

const API_KEY_STORAGE = 'gemini_api_key'

export default function NLInputModal({ onSave, onClose, onManual }) {
  const [step, setStep] = useState('input') // 'input' | 'loading' | 'confirm'
  const [text, setText] = useState('')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || '')
  const [writer, setWriter] = useState(WRITERS[0].key)
  const [parsed, setParsed] = useState(null)
  const [error, setError] = useState('')

  async function handleParse() {
    if (!text.trim()) return
    if (!apiKey.trim()) { setError('Gemini API 키를 입력해주세요'); return }
    localStorage.setItem(API_KEY_STORAGE, apiKey.trim())
    setError('')
    setStep('loading')
    try {
      const result = await parseWithGemini(text, apiKey.trim(), getTodayString())
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

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={e => e.stopPropagation()}>
        <div className={styles.handle} />
        <h2 className={styles.title}>자연어로 입력 ✨</h2>

        {step === 'input' && (
          <>
            <label className={styles.label}>어떤 지출이었나요?</label>
            <textarea
              className={styles.nlTextarea}
              placeholder="예) 오늘 스타벅스에서 아메리카노 두 잔 8500원 마심"
              value={text}
              onChange={e => setText(e.target.value)}
              rows={3}
              autoFocus
            />

            <label className={styles.label}>Gemini API 키</label>
            <input
              type="password"
              className={styles.apiKeyInput}
              placeholder="AIza..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
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

            <div className={styles.confirmRow}>
              <button className={styles.cancelBtn} onClick={onManual}>직접 입력</button>
              <button className={styles.parseBtn} onClick={handleParse}>분석하기 🤖</button>
            </div>
          </>
        )}

        {step === 'loading' && (
          <div className={styles.loadingWrap}>
            <span className={styles.loadingEmoji}>🌸</span>
            <p className={styles.loadingText}>Gemini가 분석 중이에요...</p>
          </div>
        )}

        {step === 'confirm' && parsed && (
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
        )}
      </div>
    </div>
  )
}
