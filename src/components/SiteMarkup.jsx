'use client';

import { useEffect, useState } from 'react';
import { CATEGORIES } from '@/lib/seo';
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
import GuidePage from './pages/GuidePage';
import ServiceDetailPage from './seo/ServiceDetailPage';
import FloatingIcons from './FloatingIcons';
import Chatbot from './Chatbot';
import Footer from './Footer';
import ToastContainer from './ToastContainer';
import LegacyScript from './LegacyScript';

// Only the requested page is in server HTML. Once hydrated, mount the existing
// shopping screens before loading the legacy behaviour script that needs their IDs.
export default function SiteMarkup({ initialPage = 'home', category = '', initialProducts = [], initialProduct = null, service = null, catalogAvailable = true }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const include = page => mounted || initialPage === page;
  return <>
    <a href="#main-content" className="skip-link">Skip to content</a>
    <Navbar initialPage={initialPage} />
    {mounted && <><AuthModal /><ProfileModal /></>}
    <main id="main-content" data-initial-page={initialPage} data-category={category} data-category-matches={JSON.stringify(CATEGORIES[category]?.matches || [])} data-product-id={initialProduct?.id || ''}>
      {include('home') && <HomePage active={initialPage === 'home'} />}
      {include('services') && <ServicesPage active={initialPage === 'services'} />}
      {include('shop') && <ShopPage active={initialPage === 'shop'} category={category} products={initialProducts} catalogAvailable={catalogAvailable} />}
      {include('product-detail') && <ProductDetailPage active={initialPage === 'product-detail'} product={initialProduct} />}
      {include('wishlist') && <WishlistPage active={initialPage === 'wishlist'} />}
      {include('cart') && <CartPage active={initialPage === 'cart'} />}
      {include('orders') && <OrdersPage active={initialPage === 'orders'} />}
      {include('checkout') && <CheckoutPage active={initialPage === 'checkout'} />}
      {include('payment') && <PaymentPage active={initialPage === 'payment'} />}
      {include('guide') && <GuidePage active={initialPage === 'guide'} />}
      {service && <ServiceDetailPage service={service} active={initialPage === 'service-detail'} />}
    </main>
    {mounted && <><FloatingIcons /><Chatbot /><ToastContainer /></>}
    <Footer />
    {mounted && <LegacyScript />}
  </>;
}
