import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import AppHeader from '../../components/AppHeader'
import KnowledgeCard from '../../components/KnowledgeCard'
import LoginButton from '../../components/LoginButton'
import { checkLoginStatus, loginWithWeChat } from '../../utils/auth'
import { getDailyFact, ICHFact } from '../../utils/dailyCard'
import './index.scss'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dailyFact, setDailyFact] = useState<ICHFact | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check login status on mount
  useEffect(() => {
    checkLoginStatus().then(loggedIn => {
      setIsLoggedIn(loggedIn)
      if (!loggedIn) {
        setLoading(false)
      }
    })
  }, [])

  // Load daily fact when logged in
  useEffect(() => {
    if (!isLoggedIn) return

    setLoading(true)
    setError(null)

    getDailyFact()
      .then(fact => {
        if (fact) {
          setDailyFact(fact)
        } else {
          setError('今日知识待解锁')
        }
        setLoading(false)
      })
      .catch(() => {
        setError('网络开小差了，请稍后重试')
        setLoading(false)
      })
  }, [isLoggedIn])

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  return (
    <View className='home-page'>
      <AppHeader />

      {isLoggedIn ? (
        <KnowledgeCard
          fact={dailyFact}
          loading={loading}
          error={error}
        />
      ) : (
        <View className='login-prompt'>
          <Text className='prompt-text'>登录后查看今日非遗知识</Text>
        </View>
      )}

      <LoginButton onLoginSuccess={handleLoginSuccess} />

      <View className='home-footer'>
        <View className='footer-divider' />
      </View>
    </View>
  )
}
