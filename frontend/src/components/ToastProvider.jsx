import React, { createContext, useContext, useState, useCallback } from 'react'
import Toast from './Toast'

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((type, message, duration) => {
    const id = Date.now() + Math.random()
    const toastDuration = duration || (type === 'error' ? 5000 : type === 'warning' ? 4000 : 3000)

    setToasts(prev => {
      const newToasts = [...prev, { id, type, message, duration: toastDuration }]
      return newToasts.slice(-3)
    })

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const toast = {
    success: (message, duration) => addToast('success', message, duration),
    error: (message, duration) => addToast('error', message, duration),
    warning: (message, duration) => addToast('warning', message, duration),
    info: (message, duration) => addToast('info', message, duration),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <Toast
            key={t.id}
            id={t.id}
            type={t.type}
            message={t.message}
            duration={t.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
