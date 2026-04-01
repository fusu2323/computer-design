import Taro from '@tarojs/taro'
import { STORAGE_SESSION } from '../constants'

/**
 * Perform WeChat login via wx.login()
 * Stores the login code as session in WeChat storage
 */
export async function loginWithWeChat(): Promise<string> {
  const loginResult = await Taro.login()
  if (!loginResult.code) {
    throw new Error('wx.login failed')
  }
  await Taro.setStorage({ key: STORAGE_SESSION, data: loginResult.code })
  return loginResult.code
}

/**
 * Check if user has an existing WeChat session
 */
export async function checkLoginStatus(): Promise<boolean> {
  try {
    const session = await Taro.getStorage({ key: STORAGE_SESSION })
    return !!session.data
  } catch {
    return false
  }
}
