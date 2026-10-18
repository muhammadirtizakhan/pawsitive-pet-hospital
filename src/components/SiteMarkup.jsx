import Navbar from './Navbar';
import AuthModal from './AuthModal';
import ProfileModal from './ProfileModal';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import FloatingIcons from './FloatingIcons';
import Chatbot from './Chatbot';
import Footer from './Footer';
import ToastContainer from './ToastContainer';
import LegacyScript from './LegacyScript';
import GuidePage from './pages/GuidePage';
export default function SiteMarkup() {
  return (
    <>
      <Navbar />
      <AuthModal />
      <ProfileModal />
      <HomePage />
      <ServicesPage />
      <ShopPage />
      <ProductDetailPage />
      <WishlistPage />
      <CartPage />
      <OrdersPage />
      <CheckoutPage />
      <PaymentPage />
        <GuidePage />
      <FloatingIcons />
      <Chatbot />
      <Footer />
      <ToastContainer />
      <LegacyScript />
    
    </>
  );
}
