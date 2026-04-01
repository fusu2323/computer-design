import { View, Text } from '@tarojs/components'
import './index.scss'

export default function AppHeader() {
  return (
    <View className='app-header'>
      <Text className='app-title'>数字传承人</Text>
      <Text className='app-subtitle'>每日非遗知识</Text>
    </View>
  )
}
