import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

export default function Layout({children}:{children:React.ReactNode}) {
  return (
    <ProtectedRoute>
        {children}
    </ProtectedRoute>
  )
}
