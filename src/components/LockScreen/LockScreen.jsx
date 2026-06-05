import { useState } from 'react'
import styles from './LockScreen.module.css'

export default function LockScreen({ correctPin, onUnlock }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  function inputDigit(n) {
    if (pin.length >= 6) return
    const next = pin + n
    setPin(next)
    if (next.length === 6) {
      if (next === correctPin) {
        onUnlock()
      } else {
        setError('비밀번호가 틀렸어요!')
        setPin('')
        setTimeout(() => setError(''), 1500)
      }
    }
  }

  function deleteDigit() {
    setPin(p => p.slice(0, -1))
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <div className={styles.icon}>🔒</div>
        <h1 className={styles.title}>우리 가계부 💕</h1>
        <p className={styles.sub}>비밀번호 6자리를 입력해주세요</p>
        <div className={styles.dots}>
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className={styles.dot}
              data-filled={i < pin.length ? 'true' : 'false'}
            />
          ))}
        </div>
        <div className={styles.numpad}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => inputDigit(String(n))} className={styles.numBtn}>
              {n}
            </button>
          ))}
          <span />
          <button onClick={() => inputDigit('0')} className={styles.numBtn}>0</button>
          <button onClick={deleteDigit} className={styles.numBtn}>⌫</button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  )
}
