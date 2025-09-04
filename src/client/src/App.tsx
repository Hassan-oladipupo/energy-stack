import { Routes, Route } from "react-router-dom"
import { CartProvider } from "./contexts/CartContext"
import Layout from "./components/Layout"
import ProductCatalog from "./pages/ProductCatalog"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import OrderConfirmation from "./pages/OrderConfirmation"
import NotFound from "./pages/NotFound"

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
