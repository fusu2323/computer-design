import Taro from '@tarojs/taro'
import { API_BASE } from '../constants'

/**
 * Taro request wrapper for API calls
 */
export function request<T = any>(options: {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
}): Promise<T> {
  return Taro.request({
    url: `${API_BASE}${options.url}`,
    method: options.method || 'GET',
    data: options.data,
  }).then(res => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data
    }
    throw new Error(`Request failed with status ${res.statusCode}`)
  })
}
