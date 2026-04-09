import { unstable_noStore as noStore } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { dbProductToProduct, type Product } from '@/lib/products'
import type { DbProduct } from '@/lib/supabase'

export async function getHeroProducts(): Promise<Product[]> {
  noStore()
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

    const { data: config } = await db
      .from('site_config')
      .select('value')
      .eq('key', 'hero_products')
      .single()

    const slugs: string[] = config?.value ?? ['cockatoo', 'penguin', 'bee']

    const { data: products } = await db
      .from('products')
      .select('*')
      .in('slug', slugs)

    if (!products || products.length === 0) return []

    const productMap = new Map((products as DbProduct[]).map(p => [p.slug, p]))
    return slugs
      .map(slug => productMap.get(slug))
      .filter(Boolean)
      .map(p => dbProductToProduct(p as DbProduct))
  } catch (err) {
    console.error('[getHeroProducts] failed:', err)
    return []
  }
}
