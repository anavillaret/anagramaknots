'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [verified, setVerified] = useState(false)

  // Login page renders without a session — it IS the auth entry point
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) {
      setVerified(true)
      return
    }
    fetch('/api/admin/session')
      .then(res => {
        if (res.ok) {
          setVerified(true)
        } else {
          router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`)
        }
      })
      .catch(() => router.replace('/admin/login'))
  }, [isLoginPage, pathname, router])

  if (!verified) return null

  return <>{children}</>
}
