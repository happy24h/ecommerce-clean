/**
 * Cart Store — dùng Zustand (client-side state)
 *
 * Tại sao không dùng TanStack Query cho cart?
 * → Cart là state LOCAL, không cần server round-trip mỗi lần thêm/xóa.
 * → Zustand + localStorage = instant update, persist qua refresh.
 * → Nếu backend có server-side cart thì mới cần thêm TanStack Query.
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'
import { MAX_QUANTITY } from '@/constants'
import toast from 'react-hot-toast'

interface CartStore {
  items: CartItem[]

  // Actions
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void

  // Computed (selectors)
  totalItems: () => number
  totalPrice: () => number
  getItem: (productId: string) => CartItem | undefined
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const items = get().items
        const existing = items.find((i) => i.productId === product._id)

        if (existing) {
          const newQty = Math.min(existing.quantity + quantity, MAX_QUANTITY)
          if (newQty > product.stock) {
            toast.error(`Chỉ còn ${product.stock} sản phẩm trong kho`)
            return
          }
          set({
            items: items.map((i) =>
              i.productId === product._id ? { ...i, quantity: newQty } : i
            ),
          })
        } else {
          if (quantity > product.stock) {
            toast.error(`Chỉ còn ${product.stock} sản phẩm trong kho`)
            return
          }
          set({
            items: [...items, { productId: product._id, product, quantity }],
          })
        }

        toast.success('Đã thêm vào giỏ hàng 🛒')
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, MAX_QUANTITY) }
              : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      // Selectors
      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        ),

      getItem: (productId) =>
        get().items.find((i) => i.productId === productId),
    }),
    {
      name: 'shopvn-cart',          // key trong localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
)
