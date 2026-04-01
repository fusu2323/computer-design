import Taro from '@tarojs/taro'
import { request } from './api'
import { API_KNOWLEDGE_DAILY, STORAGE_USER_ID } from '../constants'

export interface ICHFact {
  id: number
  title: string
  category: string
  imageUrl: string
  fact: string
}

interface DailyResponse {
  facts: ICHFact[]
}

/**
 * Simple string hash function for deterministic daily selection
 * hash(dateStr:userId) -> index in facts array
 */
function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

/**
 * Get the daily ICH fact for today
 * Uses hash(date + userId) to deterministically select one fact
 */
export async function getDailyFact(): Promise<ICHFact | null> {
  try {
    const res = await request<DailyResponse>({
      url: API_KNOWLEDGE_DAILY,
      method: 'GET',
    })

    const facts = res.facts
    if (!facts || facts.length === 0) return null

    // Get date string (YYYY-MM-DD)
    const now = new Date()
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    // Get user ID from storage (anonymous fallback)
    let userId = 'anonymous'
    try {
      const stored = await Taro.getStorage({ key: STORAGE_USER_ID })
      userId = stored.data || 'anonymous'
    } catch { /* use anonymous */ }

    // Deterministic hash
    const hashInput = `${dateStr}:${userId}`
    const index = hashString(hashInput) % facts.length

    return facts[index]
  } catch (e) {
    console.error('Failed to fetch daily fact:', e)
    return null
  }
}
