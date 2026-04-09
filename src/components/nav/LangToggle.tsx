'use client'

import { useLang } from '@/lib/i18n/context'

export default function LangToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang()

  const base = 'flex items-center border border-stone-light text-[10px] tracking-[0.1em] uppercase overflow-hidden'
  const btn = (code: 'en' | 'pt', border = false) =>
    `${compact ? 'px-2.5 py-1.5' : 'px-2 py-1'} transition-colors ${border ? 'border-l border-stone-light' : ''} ${
      lang === code ? 'bg-teal text-white' : 'text-stone hover:text-ink'
    }`

  return (
    <div className={`${base}${compact ? ' w-fit' : ''}`}>
      <button onClick={() => setLang('en')} className={btn('en')} aria-label="Switch to English">EN</button>
      <button onClick={() => setLang('pt')} className={btn('pt', true)} aria-label="Switch to Portuguese">PT</button>
    </div>
  )
}
