import { useState } from 'react'
import LockScreen from './components/LockScreen/LockScreen'
import AppShell from './components/AppShell/AppShell'

const CORRECT_PIN = import.meta.env.VITE_APP_PIN || '123456'
const SESSION_KEY = 'ledger_unlocked'

export default function App() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  )

  function handleUnlock() {
    sessionStorage.setItem(SESSION_KEY, '1')
    setUnlocked(true)
  }

  function handleLock() {
    sessionStorage.removeItem(SESSION_KEY)
    setUnlocked(false)
  }

  if (!unlocked) return <LockScreen correctPin={CORRECT_PIN} onUnlock={handleUnlock} />
  return <AppShell onLock={handleLock} />
}
