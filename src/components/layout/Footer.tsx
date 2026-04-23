import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react'

const footerLinks = {
  'Về ShopVN': [
    { label: 'Giới thiệu', href: '/about' },
    { label: 'Tuyển dụng', href: '/careers' },
    { label: 'Tin tức', href: '/news' },
    { label: 'Liên hệ', href: '/contact' },
  ],
  'Hỗ trợ': [
    { label: 'Hướng dẫn mua hàng', href: '/help/buying' },
    { label: 'Phương thức thanh toán', href: '/help/payment' },
    { label: 'Vận chuyển & giao hàng', href: '/help/shipping' },
    { label: 'Đổi trả & hoàn tiền', href: '/help/returns' },
    { label: 'Câu hỏi thường gặp', href: '/help/faq' },
  ],
  'Chính sách': [
    { label: 'Chính sách bảo mật', href: '/privacy' },
    { label: 'Điều khoản sử dụng', href: '/terms' },
    { label: 'Chính sách Cookie', href: '/cookies' },
  ],
}

export const Footer = () => (
  <footer className="border-t border-gray-200 bg-gray-50 mt-16">
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-2">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Shop<span className="text-gray-800">VN</span>
          </Link>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            Nền tảng thương mại điện tử hàng đầu Việt Nam. Mua sắm dễ dàng,
            giao hàng nhanh chóng, đổi trả miễn phí.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0 text-primary-500" />
              123 Nguyễn Huệ, Q.1, TP.HCM
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 flex-shrink-0 text-primary-500" />
              1800 1234 (miễn phí)
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0 text-primary-500" />
              support@shopvn.com
            </span>
          </div>
          <div className="mt-5 flex gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white
                  border border-gray-200 text-gray-500 hover:border-primary-300
                  hover:text-primary-600 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} ShopVN. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          {['Visa', 'MasterCard', 'MoMo', 'ZaloPay', 'COD'].map((method) => (
            <span
              key={method}
              className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </div>
  </footer>
)
