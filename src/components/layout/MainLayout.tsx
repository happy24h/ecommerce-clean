import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Header } from './Header'
import { Footer } from './Footer'

export const MainLayout = () => (
  <div className="flex min-h-screen flex-col bg-white">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { fontSize: '14px' },
        success: { iconTheme: { primary: '#0284c7', secondary: '#fff' } },
      }}
    />
  </div>
)
