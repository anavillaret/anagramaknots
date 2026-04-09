'use client'

import { useEffect, useState } from 'react'
import { LogoSymbol } from '@/components/ui/Logo'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setAuthed(localStorage.getItem('admin_auth') === 'true')
  }, [])

  if (authed === null) return null

  if (!authed) {
    return (
      <div className="min-h-screen bg-linen flex items-center justify-center px-4">
        <div className="bg-white p-10 max-w-sm w-full shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <LogoSymbol size={20} />
            <p className="text-[11px] tracking-[0.3em] uppercase text-teal">Anagrama</p>
          </div>
          <h1 className="text-2xl font-semibold text-ink mb-8">Backoffice</h1>
          <form onSubmit={async e => {
            e.preventDefault()
            setLoading(true)
            setError(false)
            try {
              const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: input }),
              })
              if (res.ok) {
                localStorage.setItem('admin_auth', 'true')
                setAuthed(true)
              } else {
                setError(true)
                setInput('')
              }
            } catch {
              setError(true)
            } finally {
              setLoading(false)
            }
          }}>
            <input
              type="password"
              value={input}
              onChange={e => { setInput(e.target.value); setError(false) }}
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

  return <>{children}</>
}
