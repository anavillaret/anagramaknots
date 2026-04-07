import { clsx } from 'clsx'

type BadgeType = 'new' | 'bestseller' | 'soldout' | 'sale'

const labels: Record<BadgeType, string> = {
  new: 'New',
  bestseller: 'Best Seller',
  soldout: 'Sold Out',
  sale: 'On Sale',
}

const styles: Record<BadgeType, string> = {
  new: 'bg-teal text-white',
  bestseller: 'bg-ink text-white',
  soldout: 'bg-stone text-white',
  sale: 'bg-rose text-white',
}

export default function Badge({ type }: { type: BadgeType }) {
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
