import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from './products'

export type CartItem = {
  product: Product
  personalisation: string
}

type CartStore = {
  items: CartItem[]
  addItem: (product: Product, personalisation?: string) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  hasItem: (productId: string) => boolean
  total: () => number
  count: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, personalisation = '') => {
        set(state => {
          if (state.items.find(i => i.product.id === product.id)) return state
          return { items: [...state.items, { product, personalisation }] }
        })
      },

      removeItem: (productId) =>
        set(state => ({ items: state.items.filter(i => i.product.id !== productId) })),

      clearCart: () => set({ items: [] }),

      hasItem: (productId) => get().items.some(i => i.product.id === productId),

      total: () => get().items.reduce((sum, i) => sum + i.product.price, 0),

      count: () => get().items.length,
    }),
    { name: 'anagrama-cart' }
  )
)
