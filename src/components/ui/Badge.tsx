'use client'

import { clsx } from 'clsx'
import { useLang } from '@/lib/i18n/context'

type BadgeType = 'new' | 'bestseller' | 'soldout' | 'sale'

const styles: Record<BadgeType, string> = {
  new: 'bg-teal text-white',
  bestseller: 'bg-ink text-white',
  soldout: 'bg-stone text-white',
  sale: 'bg-rose text-white',
}

export default function Badge({ type }: { type: BadgeType }) {
  const { t } = useLang()
  const labels: Record<BadgeType, string> = {
    new: t.product.badges.new,
    bestseller: t.product.badges.bestseller,
    soldout: t.product.badges.soldout,
    sale: t.product.badges.sale,
  }

  return (
    <span
      className={clsx(
        'inline-block text-[9px] tracking-[0.18em] uppercase px-2 py-0.5',
        styles[type]
      )}
    >
      {labels[type]}
    </span>
  )
}
