import { View, Text, Image } from '@tarojs/components'
import './index.scss'

interface Props {
  imageUrl?: string
  category?: string
  title?: string
  factText?: string
}

export default function KnowledgeCard({ imageUrl = '', category = '', title = '', factText = '' }: Props) {
  return (
    <View className='knowledge-card card-enter'>
      {imageUrl && (
        <Image className='card-image' src={imageUrl} mode='aspectFill' lazy-load />
      )}
      <View className='card-content'>
        <Text className='card-title'>{title}</Text>
        {category && (
          <View className='card-tag'>
            <Text className='tag-text'>{category}</Text>
          </View>
        )}
        <Text className='card-fact'>{factText}</Text>
      </View>
    </View>
  )
}
