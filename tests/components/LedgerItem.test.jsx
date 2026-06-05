import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LedgerItem from '../../src/components/common/LedgerItem'

const expenseRecord = {
  id: '1', type: 'expense', cat: '☕', catName: '카페',
  amount: 6100, memo: '스타벅스', date: '2026-06-06', writer: '🐰'
}

const incomeRecord = {
  id: '2', type: 'income', cat: '💰', catName: '수입',
  amount: 2500000, memo: '월급', date: '2026-06-04', writer: '🐻'
}

describe('LedgerItem', () => {
  it('지출 금액에 마이너스 표시', () => {
    render(<LedgerItem record={expenseRecord} />)
    expect(screen.getByText('-6,100원')).toBeInTheDocument()
  })

  it('수입 금액에 플러스 표시', () => {
    render(<LedgerItem record={incomeRecord} />)
    expect(screen.getByText('+2,500,000원')).toBeInTheDocument()
  })

  it('메모와 작성자 표시', () => {
    render(<LedgerItem record={expenseRecord} />)
    expect(screen.getByText('스타벅스')).toBeInTheDocument()
    expect(screen.getByText('🐰')).toBeInTheDocument()
  })
})
