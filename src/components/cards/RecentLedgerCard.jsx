import LedgerItem from '../common/LedgerItem'
import cardStyles from './cards.module.css'

export default function RecentLedgerCard({ records }) {
  const recent = records.slice(0, 5)
  return (
    <div className={`${cardStyles.card} ${cardStyles.beige}`}>
      <div className={cardStyles.cardHeader}>
        <div className={cardStyles.cardTitle}><span>📋</span>최근 내역</div>
      </div>
      {recent.length === 0
        ? <p style={{ fontSize: 13, color: 'var(--text-light)', textAlign: 'center', padding: '16px 0' }}>아직 내역이 없어요 🌸</p>
        : recent.map(r => <LedgerItem key={r.id} record={r} />)
      }
    </div>
  )
}
