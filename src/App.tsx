import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { queryClient } from '@/lib/queryClient'

import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

import { HomePage }         from '@/pages/HomePage'
import { ProductsPage }     from '@/pages/ProductsPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CartPage }         from '@/pages/CartPage'
import { CheckoutPage }     from '@/pages/CheckoutPage'
import { LoginPage }        from '@/pages/LoginPage'
import { RegisterPage }     from '@/pages/RegisterPage'
import { OrdersPage }          from '@/pages/OrdersPage'
import { NewsPage }            from '@/pages/NewsPage'
import { ContactPage }         from '@/pages/ContactPage'
import { WishlistPage }        from '@/pages/WishlistPage'
import { PaymentSuccessPage }  from '@/pages/PaymentSuccessPage'
import { PaymentCancelPage }   from '@/pages/PaymentCancelPage'
import { OrderDetailPage }     from '@/pages/OrderDetailPage'
import { ProfilePage }         from '@/pages/ProfilePage'
import { PostDetailPage }      from '@/pages/PostDetailPage'


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Public routes */}
            <Route path="/"                   element={<HomePage />} />
            <Route path="/products"           element={<ProductsPage />} />
            <Route path="/products/:id"        element={<ProductDetailPage />} />
            <Route path="/news"               element={<NewsPage />} />
            <Route path="/news/:id"           element={<PostDetailPage />} />
            <Route path="/contact"            element={<ContactPage />} />
            <Route path="/category/:slug"     element={<ProductsPage />} />
            <Route path="/search"             element={<ProductsPage />} />
            <Route path="/cart"               element={<CartPage />} />
            <Route path="/login"              element={<LoginPage />} />
            <Route path="/register"           element={<RegisterPage />} />

            {/* Protected routes — yêu cầu đăng nhập */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout"           element={<CheckoutPage />} />
              <Route path="/account/wishlist"   element={<WishlistPage />} />
              <Route path="/account/orders"     element={<OrdersPage />} />
              <Route path="/account/orders/:id" element={<OrderDetailPage />} />
              <Route path="/account/profile"    element={<ProfilePage />} />
            </Route>

            {/* Payment result pages (PayOS return/cancel URLs) */}
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/cancel"  element={<PaymentCancelPage />} />

            {/* Order success (non-PAYOS) */}
            <Route
              path="/order/success/:orderId"
              element={
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="text-5xl">🎉</div>
                  <h1 className="text-xl font-bold text-gray-800">Đặt hàng thành công!</h1>
                  <p className="text-gray-500">Cảm ơn bạn đã mua sắm tại ShopVN</p>
                  <a href="/account/orders" className="text-primary-600 hover:underline text-sm">
                    Xem đơn hàng của tôi
                  </a>
                </div>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* DevTools — chỉ hiển thị trong development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  )
}

export default App
