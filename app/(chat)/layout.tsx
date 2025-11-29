import ProtectedRoute from '@/components/ProtectedRoute'
import { ChatProvider } from '@/context/ChatContext'
import React from 'react'

export default function Layout({children}:{children:React.ReactNode}) {
  return (
    <ProtectedRoute>
      <ChatProvider>

        {children}
      </ChatProvider>
    </ProtectedRoute>
  )
}
