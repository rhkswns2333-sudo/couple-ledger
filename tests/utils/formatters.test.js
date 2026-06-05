import { describe, it, expect } from 'vitest'
import { formatAmount, getMonthKey, getDaysInMonth } from '../../src/utils/formatters'

describe('formatAmount', () => {
  it('숫자를 원 단위 문자열로 변환', () => {
    expect(formatAmount(45000)).toBe('45,000원')
  })
  it('0원 처리', () => {
    expect(formatAmount(0)).toBe('0원')
  })
})

describe('getMonthKey', () => {
  it('날짜에서 YYYY-MM 키 반환', () => {
    expect(getMonthKey(new Date('2026-06-15'))).toBe('2026-06')
  })
})

describe('getDaysInMonth', () => {
  it('6월은 30일', () => {
    expect(getDaysInMonth(2026, 5)).toBe(30)
  })
  it('2월 윤년', () => {
    expect(getDaysInMonth(2024, 1)).toBe(29)
  })
})
