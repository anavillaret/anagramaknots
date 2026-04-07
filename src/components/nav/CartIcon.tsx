'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart'

export default function CartIcon({ size = 18 }: { size?: number }) {
  const count = useCart(s => s.count())
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <Link
      href="/cart"
      className="relative text-ink hover:text-teal transition-colors duration-200"
      aria-label="Cart"
    >
      <ShoppingBag size={size} strokeWidth={1.5} />
      {mounted && count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-teal text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center leading-none">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}
