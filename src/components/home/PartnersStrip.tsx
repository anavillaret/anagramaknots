import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import Eyebrow from '@/components/ui/Eyebrow'

type Partner = {
  id: string
  name: string
  description: string
  url: string
  logo_url: string
}

async function getPartners(): Promise<Partner[]> {
  try {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const { data } = await db
      .from('partners')
      .select('id, name, description, url, logo_url')
      .eq('active', true)
      .order('sort_order')
    return (data ?? []) as Partner[]
  } catch {
    return []
  }
}

function externalUrl(url: string) {
  if (!url) return '#'
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

export default async function PartnersStrip() {
  const partners = await getPartners()
  if (partners.length === 0) return null

  return (
    <section className="bg-white border-t border-stone-light py-16">
      <div className="max-w-5xl mx-auto px-6">

        <Eyebrow className="text-[11px] tracking-[0.3em] uppercase text-teal font-semibold justify-center mb-10">
          Partners
        </Eyebrow>

        <div className={`grid gap-8 ${
          partners.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
          partners.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}>
          {partners.map(p => (
            <Link
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center gap-4 p-8 border border-gray-100 hover:border-teal transition-colors duration-300"
            >
              {/* Logo */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                {p.logo_url ? (
                  <Image
                    src={p.logo_url}
                    alt={p.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <span className="text-3xl">🤝</span>
                )}
              </div>

              {/* Name */}
              <p className="text-[13px] font-semibold text-ink tracking-wide group-hover:text-teal transition-colors">
                {p.name}
              </p>

              {/* Description */}
              {p.description && (
                <p className="text-[12px] text-stone leading-relaxed">
                  {p.description}
                </p>
              )}

              {/* Visit link */}
              <span className="text-[10px] tracking-[0.2em] uppercase text-teal border-b border-teal/30 pb-0.5 group-hover:border-teal transition-colors">
                Visit →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
