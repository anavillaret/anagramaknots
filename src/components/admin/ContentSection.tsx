'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Props {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function ContentSection({ title, children, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-[13px] font-semibold text-ink tracking-[0.05em] uppercase">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`text-stone transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-6 flex flex-col gap-5 border-t border-gray-100">
          <div className="pt-5 flex flex-col gap-5">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
