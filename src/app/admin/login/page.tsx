'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { LogoSymbol } from '@/components/ui/Logo'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') ?? '/admin'

  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push(next)
        router.refresh()
      } else {
        setError(true)
        setPassword('')
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linen flex items-center justify-center px-4">
      <div className="bg-white p-10 max-w-sm w-full shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <LogoSymbol size={20} />
          <p className="text-[11px] tracking-[0.3em] uppercase text-teal">Anagrama</p>
        </div>
        <h1 className="text-2xl font-semibold text-ink mb-8">Backoffice</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            placeholder="Password"
            autoFocus
            className={`w-full border px-4 py-3 text-[13px] outline-none mb-4 transition-colors ${error ? 'border-red-400' : 'border-stone-light focus:border-teal'}`}
          />
          {error && <p className="text-[11px] text-red-500 mb-3">Incorrect password.</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal text-white py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-teal-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
