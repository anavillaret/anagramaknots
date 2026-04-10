import { unstable_noStore as noStore } from 'next/cache'
import type { DbProduct } from '@/lib/supabase'

export type Product = {
  id: string
  name: string
  species: string
  fact: string
  factPt?: string
  price: number
  category: 'amigurumis'
  image: string
  badge?: 'new' | 'bestseller' | 'soldout' | 'sale'
  slug: string
  details?: string
  detailsPt?: string
  size?: string
  sizePt?: string
  careTips?: string
  careTipsPt?: string
  availableOnRequest?: boolean  // true = commission only, no stock
}

/** Map a Supabase row to the frontend Product shape */

export function dbProductToProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: row.name,
    species: row.species ?? '',
    fact: row.fact ?? '',
    factPt: row.fact_pt ?? undefined,
    price: row.price,
    category: 'amigurumis',
    image: row.image,
    badge: row.badge ?? undefined,
    slug: row.slug,
    details: row.details ?? undefined,
    detailsPt: row.details_pt || undefined,
    size: row.size ?? undefined,
    sizePt: row.size_pt || undefined,
    careTips: row.care_tips ?? undefined,
    careTipsPt: row.care_tips_pt || undefined,
    availableOnRequest: row.available_on_request ?? false,
  }
}

/** Fetch live products from Supabase for the public store.
 *  Uses the service-role key (server-only) to bypass RLS.
 *  Falls back to static PRODUCTS if the DB is unreachable or empty. */
export async function getProducts(): Promise<Product[]> {
  noStore() // Opt out of Next.js data cache — always fetch fresh from Supabase
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) throw new Error('Missing Supabase env vars')

    // Service-role key bypasses RLS entirely — safe here because this runs
    // server-side only (called from server components, never from the browser)
    const supabase = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .not('active', 'eq', false)          // exclude explicitly hidden (active=false)
      .not('image', 'ilike', '%placeholder%') // exclude products without a real photo
      .order('sort_order', { ascending: true })

    if (error) throw error
    if (!data || data.length === 0) throw new Error('No products in DB')

    return (data as DbProduct[]).map(dbProductToProduct)
  } catch (err) {
    console.error('[getProducts] Supabase fetch failed, falling back to static data:', err)
    return PRODUCTS.filter(p => !p.image.includes('placeholder'))
  }
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Humpback Whale',
    species: '',
    fact: 'Each whale has a specific role, and they often use unique calls to signal the attack. It\'s teamwork at a scale you can barely imagine — like an underwater flash mob with bubble art!',
    price: 129,
    category: 'amigurumis',
    image: '/images/products/B41D4A5C.jpeg',
    slug: 'humpback-whale',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 48 cm / 19 inches long.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '2',
    name: 'Giraffe',
    species: '',
    fact: 'Giraffes are seen by some as a symbol of connection with the future and the unknown, on account of their ability to see further than most animals.',
    price: 129,
    category: 'amigurumis',
    image: '/images/products/8EC6E752.jpeg',
    slug: 'giraffe',
    availableOnRequest: true,
    details: 'Materials: 100% cotton and hypoallergenic fiber stuffing. Size: 50 cm / 19.5 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '3',
    name: 'Cow',
    species: '',
    fact: 'Cows are smart, social, and remarkably complex creatures, worthy of our care and respect.',
    price: 96,
    category: 'amigurumis',
    image: '/images/products/D9FE13DA.jpeg',
    slug: 'cow',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 35 cm / 14 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '4',
    name: 'Alpaca',
    species: '',
    fact: 'Alpacas, native to the Andes, are happy living at altitudes up to 4800 meters. They hum for everything and each hum can have a slightly different meaning, almost like a secret alpaca language.',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/06B28B2C.jpeg',
    slug: 'alpaca',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 35.5 cm / 14 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '5',
    name: 'Bee',
    species: '',
    fact: 'Bees are essential to our planet, pollinating plants that provide food, supporting biodiversity, and maintaining healthy ecosystems — be a guardian for bees!',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/IMG_7241.jpeg',
    slug: 'bee',
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 18 cm / 7 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '6',
    name: 'Cat',
    species: '',
    fact: 'Cats are amazing creatures — they communicate with their tails, purr to heal themselves, use whiskers to sense the world, and even have unique nose fingerprints while napping up to 16 hours a day.',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/IMG_20240228_211045.jpeg',
    slug: 'cat',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 31 cm / 12.5 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '7',
    name: 'Grizzly Bear',
    species: 'Ursus arctos horribilis',
    fact: 'Grizzly bears are powerful, intelligent, and solitary animals that play a crucial role in maintaining healthy ecosystems by dispersing seeds, controlling prey populations, and shaping their habitats.',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/IMG_0438.jpeg',
    slug: 'grizzly-bear',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 30 cm / 12 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '8',
    name: 'Penguin',
    species: 'Pinguim-de-Magalhães',
    fact: 'There are virtually no penguins in the Northern Hemisphere, with the only exception being the Galápagos penguin, which lives right on the equator — and this one right here.',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/IMG_0452.jpeg',
    slug: 'penguin',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 23 cm / 9 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '9',
    name: 'Cockatoo',
    species: 'Cacatua-de-crista-amarela',
    fact: 'Wild cockatoo numbers are decreasing due to loss of habitat to logging and mining. Another major threat is the illegal pet trade. Protect wild life!',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/IMG_0466.jpeg',
    slug: 'cockatoo',
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 19 cm / 7.5 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '10',
    name: 'Polar Bear',
    species: '',
    fact: 'With only about 25,000 polar bears left, these Arctic hunters face shrinking sea ice and a survival crisis due to climate change.',
    price: 96,
    category: 'amigurumis',
    image: '/images/products/IMG_0473_2.jpeg',
    slug: 'polar-bear',
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 31 cm / 12.5 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '11',
    name: 'Monkey',
    species: '',
    fact: 'These clever, playful primates remind us that protecting forests is protecting their families too.',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/placeholder.jpeg',
    slug: 'monkey',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 34 cm / 13.5 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '12',
    name: 'Gazelle',
    species: '',
    fact: 'Gazelles are graceful, fast, and alert animals that play a key role in their ecosystems — protecting their habitats ensures the balance of the savannah and the survival of countless species.',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/IMG_6927.jpeg',
    slug: 'gazelle',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 37 cm / 14.5 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '13',
    name: 'Pig',
    species: '',
    fact: 'Pigs are clever, social, and capable of strong human bonds, inspiring us to treat all animals with respect and care.',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/IMG_7272.jpeg',
    slug: 'pig',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 28 cm / 11 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '14',
    name: 'White Stork',
    species: '',
    fact: 'The elegant white stork, commonly found on Portugal\'s Alentejo coast, stands out with its white plumage and black-tipped wings. Storks only nest on sea cliffs in this region.',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/IMG_7273.jpeg',
    slug: 'white-stork',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 25 cm / 10 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '15',
    name: 'Dinosaur',
    species: '',
    fact: 'Gentle yet colossal, herbivorous dinosaurs wandered Earth\'s greenery — a testament to nature\'s balance and beauty.',
    price: 129,
    category: 'amigurumis',
    image: '/images/products/IMG_7537.jpeg',
    slug: 'dinosaur',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 34 cm / 13.5 inches tall and 36 cm / 14.2 inches long.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '16',
    name: 'Red Fox',
    species: '',
    fact: 'The red fox, common in Portugal\'s Alentejo region, is known for its cleverness and adaptability. It travels up to 10 km daily in search of food, reflecting its resourcefulness.',
    price: 96,
    category: 'amigurumis',
    image: '/images/products/placeholder.jpeg',
    slug: 'red-fox',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 28 cm / 11 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '17',
    name: 'Fox',
    species: '',
    fact: 'Foxes, with their keen minds and gentle steps, remind us of nature\'s quiet magic.',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/IMG_7659_2.jpeg',
    slug: 'fox',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 34 cm / 13.5 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '18',
    name: 'Rabbit',
    species: '',
    fact: 'Hop into wonder — your own little fairytale begins here, as this little rabbit leads the way.',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/IMG20231204104143.jpeg',
    slug: 'rabbit',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 20 cm / 7.8 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '19',
    name: 'Zebra',
    species: '',
    fact: '"Have they been painted with a brush?" — Yann Martel, Life of Pi.',
    price: 96,
    category: 'amigurumis',
    image: '/images/products/IMG_8284.jpeg',
    slug: 'zebra',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 35 cm / 14 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '20',
    name: 'Duck',
    species: '',
    fact: 'With soft feathers and steady grace, ducks drift between sky and water — a peaceful dance of nature.',
    price: 96,
    category: 'amigurumis',
    image: '/images/products/IMG_8355.jpeg',
    slug: 'duck',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 37 cm / 14.5 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '21',
    name: 'Caiman',
    species: '',
    fact: 'As powerful and adaptable predators, caimans play a key role in balancing freshwater ecosystems and supporting the diversity of life within them.',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/IMG_8805.jpeg',
    slug: 'caiman',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 25 cm / 10 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '22',
    name: 'Dachshund',
    species: '',
    fact: 'The official mascot of the 1972 Munich Olympic Games was a colorful Dachshund named Waldi — the first time the Olympics had a mascot. Officials even plotted that year\'s marathon in the shape of a Dachshund.',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/IMG_9181.jpeg',
    slug: 'dachshund',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 20 cm / 8 inches tall and 30 cm / 12 inches long.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '23',
    name: 'Snail',
    species: '',
    fact: 'To grass, or leaf, or fruit, or wall — the snail sticks close, nor fears to fall, as if he grew there, house and all together.',
    price: 96,
    category: 'amigurumis',
    image: '/images/products/IMG_0431.jpeg',
    slug: 'snail',
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 29 cm / 11.5 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '24',
    name: 'Ostrich',
    species: '',
    fact: 'Contrary to popular myth, ostriches do not bury their heads in the sand to hide. They may lie down flat on the ground to conceal themselves, which can look like they are burying their heads.',
    price: 129,
    category: 'amigurumis',
    image: '/images/products/IMG_9026.jpeg',
    slug: 'ostrich',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 40 cm / 16 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '25',
    name: 'Panda',
    species: '',
    fact: 'Wild pandas live about 20 years and usually prefer solitude. Scientists are still unsure why they have their distinctive black-and-white coloring.',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/IMG_6020.jpeg',
    slug: 'panda',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 24 cm / 9.4 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '26',
    name: 'Parakeet',
    species: '',
    fact: 'Parakeets are native to Australia\'s open forests and plains. Social and intelligent, they form strong bonds both with their flock and with humans.',
    price: 66,
    category: 'amigurumis',
    image: '/images/products/IMG_9157.jpeg',
    slug: 'parakeet',
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 10 cm / 4 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
  {
    id: '27',
    name: 'Lamb',
    species: '',
    fact: 'Lambs are incredibly smart and have wonderful memories. They can remember up to 50 different individuals. They are also able to recognize faces, and mothers can identify their lamb\'s bleat.',
    price: 81,
    category: 'amigurumis',
    image: '/images/products/IMG_9129.jpeg',
    slug: 'lamb',
    availableOnRequest: true,
    details: 'Materials: 100% cotton, hypoallergenic fiber stuffing and eyes locked for safety. Size: 20 cm / 8 inches tall.',
    careTips: 'Hand wash with care and let air dry.',
  },
]

export const FEATURED_PRODUCTS = PRODUCTS.filter(p =>
  ['9', '5', '10', '23'].includes(p.id)
)
