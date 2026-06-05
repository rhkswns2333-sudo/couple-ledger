import { useState } from 'react'
import HomeTab from '../tabs/HomeTab'
import CalendarTab from '../tabs/CalendarTab'
import LedgerTab from '../tabs/LedgerTab'
import StatsTab from '../tabs/StatsTab'
import NLInputModal from '../modals/NLInputModal'
import ManualInputModal from '../modals/ManualInputModal'
import StickerBurst from '../common/StickerBurst'
import { useRecords } from '../../hooks/useRecords'
import { useBudgets } from '../../hooks/useBudgets'
import styles from './AppShell.module.css'

const TABS = [
  { key: 'home', label: '🏠 홈' },
  { key: 'calendar', label: '📅 캘린더' },
  { key: 'ledger', label: '📋 내역' },
  { key: 'stats', label: '📊 통계' },
]

export default function AppShell({ onLock }) {
  const [activeTab, setActiveTab] = useState('home')
  const [modal, setModal] = useState(null)
  const [burstKey, setBurstKey] = useState(0)
  const { records, loading, addRecord } = useRecords()
  const { budgets, saveBudget } = useBudgets()

  const now = new Date()
  const monthLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월`

  async function handleSave(record) {
    await addRecord(record)
    setBurstKey(k => k + 1)
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>우리 가계부 💕</h1>
          <p className={styles.month}>{monthLabel}</p>
        </div>
        <span className={styles.deco}>🎀</span>
        <button className={styles.lockBtn} onClick={onLock} title="잠금">🔒</button>
      </header>

      <nav className={styles.tabBar}>
        {TABS.map(t => (
          <button
            key={t.key}
            className={`${styles.tab} ${activeTab === t.key ? styles.active : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className={styles.content}>
        {activeTab === 'home' && <HomeTab records={records} budgets={budgets} loading={loading} saveBudget={saveBudget} />}
        {activeTab === 'calendar' && <CalendarTab records={records} />}
        {activeTab === 'ledger' && <LedgerTab records={records} />}
        {activeTab === 'stats' && <StatsTab records={records} />}
      </main>

      <button className={styles.fab} onClick={() => setModal('nl')}>✏️</button>
      <StickerBurst trigger={burstKey} />

      {modal === 'nl' && (
        <NLInputModal
          onClose={() => setModal(null)}
          onManual={() => setModal('manual')}
          onSave={handleSave}
        />
      )}
      {modal === 'manual' && (
        <ManualInputModal
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
