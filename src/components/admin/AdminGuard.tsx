'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    fetch('/api/admin/session')
      .then(res => {
        if (res.ok) {
          setVerified(true)
        } else {
          router.replace('/admin/login')
        }
      })
      .catch(() => router.replace('/admin/login'))
  }, [router])

  if (!verified) return null

  return <>{children}</>
}
