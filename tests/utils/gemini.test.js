import { describe, it, expect, vi } from 'vitest'
import { parseWithGemini, buildGeminiPrompt } from '../../src/utils/gemini'

describe('buildGeminiPrompt', () => {
  it('오늘 날짜가 프롬프트에 포함됨', () => {
    const prompt = buildGeminiPrompt('스타벅스 6100원', '2026-06-06')
    expect(prompt).toContain('2026-06-06')
    expect(prompt).toContain('스타벅스 6100원')
  })
})

describe('parseWithGemini', () => {
  it('Gemini 응답에서 JSON 파싱', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        candidates: [{
          content: { parts: [{ text: '{"type":"expense","amount":6100,"category":"카페","emoji":"☕","memo":"스타벅스","date":"2026-06-06"}' }] }
        }]
      })
    })

    const result = await parseWithGemini('스타벅스 6100원', 'fake-key', '2026-06-06')
    expect(result.amount).toBe(6100)
    expect(result.category).toBe('카페')
    expect(result.type).toBe('expense')
  })

  it('API 오류 시 Error throw', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: { message: 'Invalid API key' } })
    })

    await expect(parseWithGemini('test', 'bad-key', '2026-06-06')).rejects.toThrow('Invalid API key')
  })
})
