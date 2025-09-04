import { Routes, Route } from "react-router-dom"
import { CartProvider } from "../client/src/contexts/CartContext"
import Layout from "../client/src/components/Layout"
import ProductCatalog from "../client/src/pages/ProductCatalog"
import ProductDetail from "../client/src/pages/ProductDetail"
import Cart from "../client/src/pages/Cart"
import Checkout from "../client/src/pages/Checkout"
import OrderConfirmation from "../client/src/pages/OrderConfirmation"
import NotFound from "../client/src/pages/NotFound"

function App() {
  return (
    <CartProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<ProductCatalog />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </CartProvider>
  )
}

export default App
