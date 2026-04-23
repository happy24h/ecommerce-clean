import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useIsAuthenticated } from '@/hooks/useAuth'
import { ROUTES } from '@/constants'
import { Spinner } from '@/components/ui'

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useIsAuthenticated()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}
