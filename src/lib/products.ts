export type Product = {
  id: string
  name: string
  species: string
  fact: string
  price: number
  category: 'amigurumis' | 'acessorios' | 'roupa'
  image: string
  badge?: 'new' | 'bestseller' | 'soldout' | 'sale'
  slug: string
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
    badge: 'bestseller',
    slug: 'cockatoo',
  },
  {
    id: '2',
    name: 'Penguin',
    species: 'Pinguim-de-Magalhães',
    fact: 'Penguins are monogamous. Male penguins search long and hard for the perfect pebble to gift their partner — and will even fight others for the one they have set their hearts on.',
    price: 58,
    category: 'amigurumis',
    image: '/images/penguin.jpeg',
    badge: 'new',
    slug: 'penguin',
  },
  {
    id: '3',
    name: 'Patagonian Bumblebee',
    species: 'Bombus dahlbomii',
    fact: 'Known as the "Flying Mouse", this giant among bumblebees can grow as large as 3cm. Majestic and iconic — and sadly in human-caused decline.',
    price: 72,
    category: 'amigurumis',
    image: '/images/bumblebee.jpeg',
    badge: 'new',
    slug: 'patagonian-bumblebee',
  },
  {
    id: '4',
    name: 'Grizzly Bear',
    species: 'Ursus arctos horribilis',
    fact: 'Grizzly bears can smell food from 29 km away — the most powerful nose of any land animal on Earth.',
    price: 60,
    category: 'amigurumis',
    image: '/images/bear.jpeg',
    slug: 'grizzly-bear',
  },
  {
    id: '5',
    name: 'Rainbow Beanie',
    species: '',
    fact: '',
    price: 35,
    category: 'acessorios',
    image: '/images/beanie.jpeg',
    badge: 'bestseller',
    slug: 'rainbow-beanie',
  },
  {
    id: '6',
    name: 'Cat Bookmarks',
    species: '',
    fact: '',
    price: 18,
    category: 'acessorios',
    image: '/images/bookmarks.jpeg',
    badge: 'new',
    slug: 'cat-bookmarks',
  },
]

export const FEATURED_PRODUCTS = PRODUCTS.filter(p =>
  ['1', '2', '4', '5'].includes(p.id)
)
