"use client"

import React, { type ReactNode } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Zap, Menu, X } from "lucide-react"
import { useCart } from "../contexts/CartContext"

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { cart } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <Zap className="h-6 w-6 text-amber-400" />
              <span>EnergyStack</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/products" className="hover:text-amber-400 transition-colors">
                Products
              </Link>
              <Link to="/cart" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="bg-amber-400 text-slate-800 text-xs font-bold px-2 py-1 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-slate-700">
              <div className="flex flex-col gap-4">
                <Link
                  to="/products"
                  className="hover:text-amber-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <span className="bg-amber-400 text-slate-800 text-xs font-bold px-2 py-1 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 text-xl font-bold mb-4">
                <Zap className="h-6 w-6 text-amber-400" />
                <span>EnergyStack</span>
              </div>
              <p className="text-gray-300">
                Premium solar equipment and financing solutions for your renewable energy needs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Solar Panels</li>
                <li>Inverters</li>
                <li>Batteries</li>
                <li>Accessories</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Installation Guide</li>
                <li>Warranty</li>
                <li>Contact Us</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 EnergyStack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
