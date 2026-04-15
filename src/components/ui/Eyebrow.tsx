import BrandSymbol from './BrandSymbol'

export default function Eyebrow({ children, className = '' }: { children: string; className?: string }) {
  const text = typeof children === 'string' ? children.replace(/^※\s*/, '') : String(children)
  return (
    <p className={`flex items-center gap-2 ${className}`}>
      <BrandSymbol size={10} className="shrink-0" />
      {text}
    </p>
  )
}
