import { View, Text, Image } from '@tarojs/components'
import { ICHFact } from '../../utils/dailyCard'
import './index.scss'

interface Props {
  fact: ICHFact | null
  loading: boolean
  error?: string | null
}

function SkeletonCard() {
  return (
    <View className='knowledge-card skeleton-card'>
      <View className='card-image-placeholder skeleton' />
      <View className='card-content'>
        <View className='skeleton' style='height: 36rpx; width: 70%; margin-bottom: 16rpx;' />
        <View className='skeleton' style='height: 24rpx; width: 40%; margin-bottom: 20rpx;' />
        <View className='skeleton' style='height: 80rpx; width: 100%;' />
      </View>
    </View>
  )
}

function ErrorCard({ message }: { message: string }) {
  return (
    <View className='knowledge-card error-card'>
      <View className='card-content error-content'>
        <Text className='error-title'>{message}</Text>
        <Text className='error-body'>登录后即可每日获取非遗知识</Text>
      </View>
    </View>
  )
}

function LoadedCard({ fact }: { fact: ICHFact }) {
  return (
    <View className='knowledge-card card-enter'>
      {fact.imageUrl ? (
        <Image
          className='card-image'
          src={fact.imageUrl}
          mode='aspectFill'
          lazy-load
        />
      ) : (
        <View className='card-image-placeholder empty-image'>
          <Text className='placeholder-text'>非遗</Text>
        </View>
      )}
      <View className='card-content'>
        <Text className='card-title'>{fact.title}</Text>
        <View className='card-tag'>
          <Text className='tag-text'>{fact.category}</Text>
        </View>
        <Text className='card-fact'>{fact.fact}</Text>
      </View>
    </View>
  )
}

export default function KnowledgeCard({ fact, loading, error }: Props) {
  if (loading) {
    return <SkeletonCard />
  }

  if (error || !fact) {
    return <ErrorCard message={error || '今日知识待解锁'} />
  }

  return <LoadedCard fact={fact} />
}
