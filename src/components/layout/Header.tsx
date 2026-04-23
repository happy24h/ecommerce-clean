import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Search, User, Menu, X,
  Heart, Package, LogOut, ChevronDown,
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useIsAuthenticated, useLogout } from '@/hooks/useAuth'
import { ROUTES } from '@/constants'
import { cn } from '@/utils'

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  const totalItems = useCartStore((s) => s.totalItems())
  const { isAuthenticated, user } = useIsAuthenticated()
  const { mutate: logout } = useLogout()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex-shrink-0">
            <span className="text-xl font-bold text-primary-600">Shop<span className="text-gray-800">VN</span></span>
          </Link>

          {/* Search bar — desktop */}
          <form onSubmit={handleSearch} className="hidden flex-1 md:flex">
            <div className="relative w-full max-w-xl">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm
                  focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1">
            {/* Search — mobile */}
            <button
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
              onClick={() => navigate(ROUTES.SEARCH)}
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/account/wishlist"
              className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 sm:block"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <Link to={ROUTES.CART} className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center
                  rounded-full bg-primary-600 text-[10px] font-bold text-white">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm
                    font-medium text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:block">{user?.name?.split(' ').pop()}</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-gray-100
                      bg-white py-1 shadow-lg">
                      <Link
                        to={ROUTES.PROFILE}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" /> Tài khoản của tôi
                      </Link>
                      <Link
                        to={ROUTES.ORDERS}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4" /> Đơn hàng
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => { setUserMenuOpen(false); logout() }}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" /> Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="hidden rounded-lg border border-primary-600 px-3 py-1.5 text-sm
                  font-medium text-primary-600 hover:bg-primary-50 sm:block"
              >
                Đăng nhập
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {menuOpen && (
          <div className="border-t border-gray-100 py-3 md:hidden">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm
                    focus:border-primary-500 focus:outline-none"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
            {!isAuthenticated && (
              <div className={cn('mt-3 flex gap-2')}>
                <Link to={ROUTES.LOGIN} className="flex-1 rounded-lg border border-primary-600 py-2
                  text-center text-sm font-medium text-primary-600">
                  Đăng nhập
                </Link>
                <Link to={ROUTES.REGISTER} className="flex-1 rounded-lg bg-primary-600 py-2
                  text-center text-sm font-medium text-white">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
