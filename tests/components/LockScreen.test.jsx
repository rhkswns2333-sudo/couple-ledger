import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LockScreen from '../../src/components/LockScreen/LockScreen'

describe('LockScreen', () => {
  it('숫자 버튼 6개 누르면 onUnlock 호출', () => {
    const onUnlock = vi.fn()
    render(<LockScreen correctPin="123456" onUnlock={onUnlock} />)

    '123456'.split('').forEach(n => {
      fireEvent.click(screen.getByRole('button', { name: n }))
    })

    expect(onUnlock).toHaveBeenCalledOnce()
  })

  it('틀린 비밀번호는 onUnlock 호출 안 함', () => {
    const onUnlock = vi.fn()
    render(<LockScreen correctPin="123456" onUnlock={onUnlock} />)

    '999999'.split('').forEach(n => {
      fireEvent.click(screen.getByRole('button', { name: n }))
    })

    expect(onUnlock).not.toHaveBeenCalled()
  })

  it('⌫ 버튼으로 마지막 숫자 삭제', () => {
    render(<LockScreen correctPin="123456" onUnlock={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: '⌫' }))
    const dots = document.querySelectorAll('[data-filled="true"]')
    expect(dots).toHaveLength(0)
  })
})
