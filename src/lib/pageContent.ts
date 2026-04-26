import { supabaseAdmin } from '@/lib/supabase'

export type PageKey =
  | 'page_home'
  | 'page_story'
  | 'page_shipping'
  | 'page_commission'
  | 'page_contact'

export type PageContent = {
  en: Record<string, unknown>
  pt: Record<string, unknown>
}

export async function getPageContent(key: PageKey): Promise<PageContent> {
  try {
    const db = supabaseAdmin()
    const { data } = await db
      .from('site_config')
      .select('value')
      .eq('key', key)
      .single()

    if (data?.value && typeof data.value === 'object') {
      const v = data.value as Record<string, unknown>
      return {
        en: (v.en as Record<string, unknown>) ?? {},
        pt: (v.pt as Record<string, unknown>) ?? {},
      }
    }
  } catch {
    // Not found or error — fall through to empty defaults
  }
  return { en: {}, pt: {} }
}

export async function savePageContent(
  key: PageKey,
  content: PageContent,
): Promise<void> {
  const db = supabaseAdmin()
  await db
    .from('site_config')
    .upsert({ key, value: content }, { onConflict: 'key' })
}
