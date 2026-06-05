import SummaryCard from '../cards/SummaryCard'
import BudgetCard from '../cards/BudgetCard'
import CalendarCard from '../cards/CalendarCard'
import RecentLedgerCard from '../cards/RecentLedgerCard'

export default function HomeTab({ records, budgets, loading, saveBudget }) {
  if (loading) return <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>🌸 불러오는 중...</p>

  return (
    <>
      <SummaryCard records={records} />
      <BudgetCard records={records} budgets={budgets} saveBudget={saveBudget} />
      <CalendarCard records={records} />
      <RecentLedgerCard records={records} />
    </>
  )
}
