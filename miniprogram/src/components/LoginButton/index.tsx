import { View, Text, Button } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { loginWithWeChat } from '../../utils/auth'
import './index.scss'

interface Props {
  onLoginSuccess?: () => void
}

export default function LoginButton({ onLoginSuccess }: Props) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (loading) return

    setLoading(true)
    try {
      await loginWithWeChat()
      onLoginSuccess?.()
    } catch (e) {
      Taro.showToast({
        title: '登录失败，请重试',
        icon: 'none',
        duration: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      className={`login-btn ${loading ? 'login-btn--loading' : ''}`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <View className='btn-loading'>
          <View className='spinner' />
          <Text className='btn-text'>登录中...</Text>
        </View>
      ) : (
        <View className='btn-content'>
          <Text className='btn-text'>微信登录</Text>
        </View>
      )}
    </Button>
  )
}
