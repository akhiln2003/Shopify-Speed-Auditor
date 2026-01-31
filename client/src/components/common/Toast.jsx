import React, { useEffect } from 'react'

/**
 * Toast notification component
 * Shows messages in the top right corner
 */
const Toast = ({ message, type = 'success', visible = false, onClose, autoClose = 4000 }) => {
  useEffect(() => {
    if (visible && autoClose) {
      const timer = setTimeout(onClose, autoClose)
      return () => clearTimeout(timer)
    }
  }, [visible, autoClose, onClose])

  if (!visible || !message) return null

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }[type]

  const textColor = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700'
  }[type]

  const iconColor = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  }[type]

  const icon = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ℹ'
  }[type]

  return (
    <div className={`fixed top-4 right-4 max-w-sm w-full ${bgColor} border rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-right-4 z-50`}>
      <div className={`flex-shrink-0 font-bold text-lg ${iconColor}`}>
        {icon}
      </div>
      <div className={`flex-1 ${textColor} text-sm font-medium`}>
        {message}
      </div>
      <button
        onClick={onClose}
        className={`flex-shrink-0 ml-2 ${textColor} hover:opacity-70 transition-opacity`}
      >
        ✕
      </button>
    </div>
  )
}

export default Toast
