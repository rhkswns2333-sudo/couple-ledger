import { useState } from 'react'
import HomeTab from '../tabs/HomeTab'
import CalendarTab from '../tabs/CalendarTab'
import LedgerTab from '../tabs/LedgerTab'
import StatsTab from '../tabs/StatsTab'
import InputModal from '../modals/InputModal'
import StickerBurst from '../common/StickerBurst'
import { useRecords } from '../../hooks/useRecords'
import { useBudgets } from '../../hooks/useBudgets'
import styles from './AppShell.module.css'
import modalStyles from '../modals/modals.module.css'

const TABS = [
  { key: 'home', label: '🏠 홈' },
  { key: 'calendar', label: '📅 캘린더' },
  { key: 'ledger', label: '📋 내역' },
  { key: 'stats', label: '📊 통계' },
]

export default function AppShell({ onLock }) {
  const [activeTab, setActiveTab] = useState('home')
  const [modal, setModal] = useState(null)
  const [editRecord, setEditRecord] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [burstKey, setBurstKey] = useState(0)
  const { records, loading, addRecord, updateRecord, deleteRecord } = useRecords()
  const { budgets, saveBudget } = useBudgets()

  const now = new Date()
  const monthLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월`

  async function handleSave(record) {
    if (editRecord) {
      await updateRecord(editRecord.id, record)
    } else {
      await addRecord(record)
      setBurstKey(k => k + 1)
    }
    setEditRecord(null)
  }

  function handleEdit(record) {
    setEditRecord(record)
    setModal('input')
  }

  function handleDelete(id) {
    setDeleteId(id)
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>우리 가계부 💕</h1>
          <p className={styles.month}>{monthLabel}</p>
        </div>
        <span className={styles.deco}>🎀</span>
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
        {activeTab === 'ledger' && <LedgerTab records={records} onEdit={handleEdit} onDelete={handleDelete} />}
        {activeTab === 'stats' && <StatsTab records={records} />}
      </main>

      <button className={styles.fab} onClick={() => setModal('input')}>✏️</button>
      <StickerBurst trigger={burstKey} />

      {modal === 'input' && (
        <InputModal
          onClose={() => { setModal(null); setEditRecord(null) }}
          onSave={handleSave}
          editRecord={editRecord}
        />
      )}

      {deleteId && (
        <div className={modalStyles.confirmOverlay} onClick={() => setDeleteId(null)}>
          <div className={modalStyles.confirmBox} onClick={e => e.stopPropagation()}>
            <div className={modalStyles.confirmEmoji}>🗑️</div>
            <p className={modalStyles.confirmMsg}>정말 삭제할까요?</p>
            <p className={modalStyles.confirmSub}>삭제하면 되돌릴 수 없어요</p>
            <div className={modalStyles.confirmBtns}>
              <button className={modalStyles.confirmNo} onClick={() => setDeleteId(null)}>취소</button>
              <button className={modalStyles.confirmYes} onClick={() => { deleteRecord(deleteId); setDeleteId(null) }}>삭제하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
