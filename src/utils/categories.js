export const CATEGORIES = [
  { key: '식비',  emoji: '🍽️', color: '#ffb8c6' },
  { key: '카페',  emoji: '☕',  color: '#ffd89b' },
  { key: '쇼핑',  emoji: '🛍️', color: '#d4b8e0' },
  { key: '교통',  emoji: '🚗',  color: '#b8e0d4' },
  { key: '여가',  emoji: '🎮',  color: '#b8d4e0' },
  { key: '의료',  emoji: '🏥',  color: '#e0b8b8' },
  { key: '주거',  emoji: '🏠',  color: '#c8e0b8' },
  { key: '기타',  emoji: '💰',  color: '#e0d4b8' },
]

export const INCOME_CATEGORY = { key: '수입', emoji: '💰', color: '#b8e0c8' }

export function getCategoryByKey(key) {
  return CATEGORIES.find(c => c.key === key) || INCOME_CATEGORY
}

export const WRITERS = [
  { key: '🐰', label: '나' },
  { key: '🐻', label: '상대' },
]
