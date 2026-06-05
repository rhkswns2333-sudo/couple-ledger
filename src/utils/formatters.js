export function formatAmount(amount) {
  return amount.toLocaleString('ko-KR') + '원'
}

export function getMonthKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function toDateString(date = new Date()) {
  return date.toISOString().split('T')[0]
}

export function getTodayString() {
  return toDateString(new Date())
}

export function getYesterdayString() {
  return toDateString(new Date(Date.now() - 86400000))
}
