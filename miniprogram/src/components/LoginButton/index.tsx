import { View, Text, Button } from '@tarojs/components'
import './index.scss'

interface Props {
  onLoginSuccess?: () => void
}

export default function LoginButton({ onLoginSuccess }: Props) {
  const handleClick = () => {
    // Stub — full implementation in Plan 03
    onLoginSuccess?.()
  }

  return (
    <Button className='login-btn' onClick={handleClick}>
      <Text className='btn-text'>微信登录</Text>
    </Button>
  )
}
