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
    <div className="min-h-screen text-black">
      {/* Header */}
      <header className=" text-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <Zap className="h-6 w-6 text-accent" />
              <span>EnergyStack</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/products" className="hover:text-accent transition-colors">
                Products
              </Link>
              <Link to="/cart" className="flex items-center gap-2 hover:text-accent transition-colors">
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
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
              {mobileMenuOpen ? <X className="h-6 w-6 text-accent" /> : <Menu className="h-6 w-6 text-accent" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-secondary">
              <div className="flex flex-col gap-4">
                <Link
                  to="/products"
                  className="hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center gap-2 hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <span className="bg-accent text-primary text-xs font-bold px-2 py-1 rounded-full">
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
      <main className="flex-1 w-full">{children}</main>

    <footer className="bg-gray-900 text-white py-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
      
      {/* Logo & Description */}
      <div className="md:w-1/3">
        <div className="flex items-center gap-2 text-2xl font-bold mb-4 text-accent">
          <Zap className="h-6 w-6" />
          <span>EnergyStack</span>
        </div>
        <p className="text-gray-300">
          Premium solar equipment and financing solutions for your renewable energy needs.
        </p>
      </div>

      {/* Products */}
      <div className="md:w-1/3">
        <h3 className="font-semibold mb-4 text-white">Products</h3>
        <ul className="space-y-2 text-gray-300">
          <li>Solar Panels</li>
          <li>Inverters</li>
          <li>Batteries</li>
          <li>Accessories</li>
        </ul>
      </div>

      {/* Support */}
      <div className="md:w-1/3">
        <h3 className="font-semibold mb-4 text-white">Support</h3>
        <ul className="space-y-2 text-gray-300">
          <li>Installation Guide</li>
          <li>Warranty</li>
          <li>Contact Us</li>
          <li>FAQ</li>
        </ul>
      </div>

    </div>

    {/* Divider & Copyright */}
    <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
      <p>&copy; 2025 EnergyStack. All rights reserved.</p>
    </div>
  </div>
</footer>

    </div>
  )
}

export default Layout
