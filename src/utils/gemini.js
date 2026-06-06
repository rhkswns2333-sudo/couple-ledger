import { getTodayString, getYesterdayString } from './formatters'

export function buildGeminiPrompt(text, today) {
  const yesterday = getYesterdayString()
  return `너는 가계부 입력 파서야. 사용자의 자연어 입력을 JSON으로 변환해줘.

오늘 날짜: ${today}
"어제": ${yesterday}

카테고리 (이 중에서만):
식비(밥/마트/배달), 카페(커피/음료), 쇼핑(옷/쿠팡), 교통(버스/택시/주유), 여가(영화/여행/운동), 의료(병원/약), 주거(월세/공과금), 수입(월급/용돈/입금), 기타

수입이면 type="income", 지출이면 type="expense"
금액은 숫자로 (4만5천→45000, 5천5백→5500)

입력: "${text}"

JSON만 반환 (다른 말 없이):
{"type":"expense","amount":6100,"category":"카페","emoji":"☕","memo":"스타벅스 아아","date":"${today}"}`
}

export async function parseWithGemini(text, apiKey, today = getTodayString()) {
  const prompt = buildGeminiPrompt(text, today)

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 200 },
      }),
    }
  )

  const data = await res.json()
  if (!res.ok) {
    const msg = data.error?.message || ''
    const status = data.error?.status || ''
    if (res.status === 401 || status === 'UNAUTHENTICATED' || msg.includes('API_KEY_INVALID')) throw new Error('API 키가 유효하지 않아요')
    if (res.status === 429 || status === 'RESOURCE_EXHAUSTED') throw new Error('할당량을 초과했어요. 잠시 후 다시 시도해주세요')
    throw new Error(`오류 ${res.status}: ${msg || status || '알 수 없는 오류'}`)
  }

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('응답 파싱 실패')

  return JSON.parse(match[0])
}
