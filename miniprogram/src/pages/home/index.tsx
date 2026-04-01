import { View } from '@tarojs/components'
import { useState, useEffect } from 'react'
import AppHeader from '../../components/AppHeader'
import KnowledgeCard from '../../components/KnowledgeCard'
import LoginButton from '../../components/LoginButton'
import { checkLoginStatus } from '../../utils/auth'
import './index.scss'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    checkLoginStatus().then(setIsLoggedIn)
  }, [])

  return (
    <View className='home-page'>
      <AppHeader />
      <KnowledgeCard />
      <LoginButton onLoginSuccess={() => setIsLoggedIn(true)} />
    </View>
  )
}
