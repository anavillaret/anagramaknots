export type Product = {
  id: string
  name: string
  species: string
  fact: string
  price: number
  category: 'amigurumis'
  image: string
  badge?: 'new' | 'bestseller' | 'soldout' | 'sale'
  slug: string
  details?: string      // Materials, size, weight
  careTips?: string     // How to care for the piece
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cockatoo',
    species: 'Cacatua-de-crista-amarela',
    fact: 'Wild cockatoo numbers are decreasing due to loss of habitat to logging and mining. Another major threat is the illegal pet trade.',
    price: 65,
    category: 'amigurumis',
    image: '/images/cockatoo.jpeg',
    badge: 'soldout',
    slug: 'cockatoo',
    details: 'Handcrocheted in 100% natural cotton yarn. Approx. 20cm tall. Polyfill stuffed. Safety eyes. Made entirely by hand in Portugal.',
    careTips: 'Spot clean with a damp cloth. Do not machine wash. Keep away from direct sunlight to preserve colours. Not suitable for children under 3.',
  },
  {
    id: '2',
    name: 'Penguin',
    species: 'Pinguim-de-Magalhães',
    fact: 'Penguins are monogamous. Male penguins search long and hard for the perfect pebble to gift their partner — and will even fight others for the one they have set their hearts on.',
    price: 58,
    category: 'amigurumis',
    image: '/images/penguin.jpeg',
    badge: 'soldout',
    slug: 'penguin',
    details: 'Handcrocheted in 100% natural cotton yarn. Approx. 18cm tall. Polyfill stuffed. Safety eyes. Made entirely by hand in Portugal.',
    careTips: 'Spot clean with a damp cloth. Do not machine wash. Keep away from direct sunlight to preserve colours. Not suitable for children under 3.',
  },
  {
    id: '3',
    name: 'Patagonian Bumblebee',
    species: 'Bombus dahlbomii',
    fact: 'Known as the "Flying Mouse", this giant among bumblebees can grow as large as 3cm. Majestic and iconic — and sadly in human-caused decline.',
    price: 72,
    category: 'amigurumis',
    image: '/images/bumblebee.jpeg',
    badge: 'soldout',
    slug: 'patagonian-bumblebee',
    details: 'Handcrocheted in 100% natural cotton yarn. Approx. 15cm long. Polyfill stuffed. Safety eyes. Wire-reinforced wings. Made entirely by hand in Portugal.',
    careTips: 'Spot clean with a damp cloth. Do not machine wash. Handle wings with care. Not suitable for children under 3.',
  },
  {
    id: '4',
    name: 'Grizzly Bear',
    species: 'Ursus arctos horribilis',
    fact: 'Grizzly bears can smell food from 29 km away — the most powerful nose of any land animal on Earth.',
    price: 60,
    category: 'amigurumis',
    image: '/images/bear.jpeg',
    badge: 'soldout',
    slug: 'grizzly-bear',
    details: 'Handcrocheted in 100% natural cotton yarn. Approx. 22cm tall. Polyfill stuffed. Safety eyes. Made entirely by hand in Portugal.',
    careTips: 'Spot clean with a damp cloth. Do not machine wash. Keep away from direct sunlight to preserve colours. Not suitable for children under 3.',
  },
]

export const FEATURED_PRODUCTS = PRODUCTS.filter(p =>
  ['1', '2', '4'].includes(p.id)
)
