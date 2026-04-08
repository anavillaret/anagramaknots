'use client'

import { useEffect, useState } from 'react'

const PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'anagrama2024'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    setAuthed(localStorage.getItem('admin_auth') === 'true')
  }, [])

  if (authed === null) return null

  if (!authed) {
    return (
      <div className="min-h-screen bg-linen flex items-center justify-center px-4">
        <div className="bg-white p-10 max-w-sm w-full shadow-sm">
          <p className="text-[11px] tracking-[0.3em] uppercase text-teal mb-2">※ Anagrama</p>
          <h1 className="text-2xl font-semibold text-ink mb-8">Backoffice</h1>
          <form onSubmit={e => {
            e.preventDefault()
            if (input === PASSWORD) {
              localStorage.setItem('admin_auth', 'true')
              setAuthed(true)
            } else {
              setError(true)
              setInput('')
            }
          }}>
            <input
              type="password"
              value={input}
              onChange={e => { setInput(e.target.value); setError(false) }}
              placeholder="Password"
              autoFocus
              className={`w-full border px-4 py-3 text-[13px] outline-none mb-4 ${error ? 'border-red-400' : 'border-stone-light'}`}
            />
            {error && <p className="text-[11px] text-red-500 mb-3">Incorrect password.</p>}
            <button type="submit" className="w-full bg-ink text-white py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-stone transition-colors">
              Enter
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
