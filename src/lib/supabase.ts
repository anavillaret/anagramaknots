import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, anonKey)

// Server-side client with service role (bypasses RLS) — only use in API routes
export function supabaseAdmin() {
  return createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export type DbProduct = {
  id: string
  name: string
  slug: string
  species: string
  fact: string
  fact_pt: string
  price: number
  details_pt: string
  size_pt: string
  care_tips_pt: string
  category: string
  image: string
  badge: 'new' | 'bestseller' | 'soldout' | 'sale' | null
  available_on_request: boolean
  details: string
  size: string
  care_tips: string
  active: boolean
  sort_order: number
  images: string[]
  created_at: string
  updated_at: string
}

export type DbOrder = {
  id: string
  stripe_session_id: string | null
  customer_email: string | null
  customer_name: string | null
  status: 'paid' | 'stitching' | 'shipped' | 'delivered' | 'cancelled'
  currency: string
  total_amount: number | null
  line_items: Array<{ name: string; quantity: number; price: number }>
  shipping_address: Record<string, string>
  notes: string
  created_at: string
  updated_at: string
}
