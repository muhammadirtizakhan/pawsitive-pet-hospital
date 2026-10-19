// ============================================================
// PAWSITIVE CLINIC — WEBSITE SCRIPT (Dynamic, API-connected)
// ============================================================

const API = '';

// ===== PRODUCTS =====
let PRODUCTS = [];
let CATEGORIES = [];
let productsLoaded = false;
let selectedShopCategoryIds = new Set();
let shopMaxPrice = null;
let shopSort = 'featured';
let initialCategoryApplied = false;
const initialScreen = document.getElementById('main-content');
const publicPagePaths = { home: '/', services: '/services', shop: '/shop', guide: '/guide' };
function escapeProductText(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function loadProductsFromDB(providedData) {
    try {
        const json = providedData ? { ok: true, data: providedData } : await (await fetch(API + '/api/products')).json();
        if (!json.ok) throw new Error(json.error || 'Failed to load products');

        PRODUCTS = json.data.map(p => {
            const descriptionPoints = [p.desc1, p.desc2, p.desc3, p.desc4, p.desc5]
                .map(point => String(point || '').trim()).filter(Boolean).slice(0, 5);
            const description = descriptionPoints.length > 0
                ? descriptionPoints.join(' ')
                : 'High-quality pet product for your furry friend.';
            const rawVariants = Array.isArray(p.variants) ? p.variants : [];
            const flavorRows = rawVariants.filter(variant =>
                variant.variant_type === 'flavor' && String(variant.variant_value || '').trim().toLowerCase() !== 'none'
            );
            let variantType = null;
            let variants = [];
            if (flavorRows.length) {
                variantType = 'flavor';
                variants = flavorRows.map(variant => ({
                    id: String(variant.id),
                    label: variant.variant_value,
                    weight: String(variant.weight || '').trim() || String(p.weight || '').trim(),
                    price: parseFloat(variant.price ?? p.price ?? 0),
                    description_mode: variant.description_mode || (variant.description_override ? 'change' : 'same'),
                    description_override: String(variant.description_override || '').split(/\r?\n/).filter(Boolean).join('\n'),
                    image_url: variant.image_url || '',
                    is_primary: Boolean(variant.is_primary)
                }));
            } else if (rawVariants.length) {
                const firstType = rawVariants[0].variant_type;
                if (firstType === 'weight' || firstType === 'default') {
                    variantType = firstType === 'default' ? null : (rawVariants.length > 1 ? 'weight' : null);
                    variants = rawVariants.map(variant => ({
                        id: String(variant.id), label: variant.variant_value,
                        weight: String(variant.weight || (firstType === 'weight' ? variant.variant_value : '') || p.weight || '').trim(),
                        price: parseFloat(variant.price ?? p.price ?? 0),
                        description_mode: variant.description_mode || (variant.description_override ? 'change' : 'same'),
                        description_override: String(variant.description_override || '').split(/\r?\n/).filter(Boolean).join('\n'),
                        image_url: variant.image_url || '', is_primary: Boolean(variant.is_primary)
                    }));
                } else if (firstType === 'color') {
                    variantType = 'color';
                    variants = rawVariants.map(variant => ({
                        id: String(variant.id), label: variant.variant_value,
                        weight: String(variant.weight || (firstType === 'weight' ? variant.variant_value : '') || p.weight || '').trim(),
                        hex: variant.variant_value, price: parseFloat(variant.price || 0),
                        image_url: variant.image_url || ''
                    }));
                }
            }
            const mainImage = p.main_image_url || p.images?.[0] || 'https://via.placeholder.com/600x600?text=No+Image';
            const images = [...new Set([mainImage, ...(p.images || [])].filter(Boolean))];
            const primaryFlavor = variants.find(variant => variant.is_primary) || null;
            return {
                id: String(p.id), name: p.name, category: p.category || CATEGORIES.find(c => String(c.id) === String(p.category_id))?.name || 'Uncategorized',
                categoryId: p.category_id ? String(p.category_id) : '', tag: p.tag || '',
                price: parseFloat(p.price ?? p.variants?.[0]?.price ?? 0), createdAt: p.created_at || '',
                weight: String(p.weight || '').trim(), soldCount: Number(p.sold_count || 0), mainImage, images, description,
                descriptionPoints, variantType, variants, primaryFlavor
            };
        });

        productsLoaded = true;
    renderShopFilters();
    updateShopPriceRange();
    if (document.getElementById('page-shop')?.classList.contains('active')) renderShopProducts();
        console.log(`✅ ${PRODUCTS.length} products loaded`);
    } catch (err) {
        console.error('❌ Products load failed:', err.message);
        showToast('Products load nahi ho paye. Server check karo.', 'error');
        PRODUCTS = [];
        productsLoaded = false;
    }
}

async function loadCategoriesFromDB(providedData) {
    try {
        const json = providedData ? { ok: true, data: providedData } : await (await fetch(API + '/api/categories')).json();
        if (!json.ok) throw new Error(json.error);
        CATEGORIES = json.data || [];
        if (!initialCategoryApplied && initialScreen?.dataset.category) {
            const matches = JSON.parse(initialScreen.dataset.categoryMatches || '[]');
            CATEGORIES.filter(c => matches.includes(String(c.name).trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ')))
                .forEach(c => selectedShopCategoryIds.add(String(c.id)));
            initialCategoryApplied = true;
        }
        renderShopFilters();
        console.log(`✅ ${CATEGORIES.length} categories loaded`);
    } catch (err) {
        console.error('❌ Categories load failed:', err.message);
        CATEGORIES = [];
    }
}

function renderShopFilters() {
    const container = document.getElementById('shopCategoryFilters');
    if (!container) return;
    container.replaceChildren();

    if (!CATEGORIES.length) {
        const empty = document.createElement('span');
        empty.className = 'filter-empty';
        empty.textContent = 'No categories added yet.';
        container.appendChild(empty);
        return;
    }

    CATEGORIES.forEach(category => {
        const categoryId = String(category.id);
        const count = PRODUCTS.filter(product => product.categoryId === categoryId).length;
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = categoryId;
        checkbox.checked = selectedShopCategoryIds.has(categoryId);
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) selectedShopCategoryIds.add(categoryId);
            else selectedShopCategoryIds.delete(categoryId);
            renderShopProducts();
        });
        const name = document.createElement('span');
        name.textContent = category.name;
        const countLabel = document.createElement('span');
        countLabel.className = 'count';
        countLabel.textContent = `(${count})`;
        label.append(checkbox, name, countLabel);
        container.appendChild(label);
    });
}

function updateShopPriceRange() {
    const range = document.getElementById('shopPriceRange');
    const maximumLabel = document.getElementById('priceRangeMax');
    const currentLabel = document.getElementById('priceFilterValue');
    if (!range) return;

    const catalogMaximum = Math.max(0, ...PRODUCTS.map(product => Number(product.price) || 0));
    const sliderMaximum = catalogMaximum || 1;
    range.max = String(sliderMaximum);
    if (shopMaxPrice === null || shopMaxPrice > catalogMaximum) shopMaxPrice = catalogMaximum;
    range.value = String(Math.min(shopMaxPrice, sliderMaximum));

    const formattedMaximum = `Rs ${catalogMaximum.toFixed(2)}`;
    const formattedCurrent = `Rs ${Number(range.value).toFixed(2)}`;
    if (maximumLabel) maximumLabel.textContent = formattedMaximum;
    if (currentLabel) currentLabel.textContent = formattedCurrent;
}

const shopPriceRange = document.getElementById('shopPriceRange');
if (shopPriceRange) {
    shopPriceRange.addEventListener('input', () => {
        shopMaxPrice = Number(shopPriceRange.value);
        const currentLabel = document.getElementById('priceFilterValue');
        if (currentLabel) currentLabel.textContent = `Rs ${shopMaxPrice.toFixed(2)}`;
        renderShopProducts();
    });
}

const shopSortSelect = document.getElementById('shopSortSelect');
if (shopSortSelect) {
    shopSortSelect.addEventListener('change', () => {
        shopSort = shopSortSelect.value;
        renderShopProducts();
    });
}

// ============================================================
// USER STATE
// ============================================================
let isLoggedIn = false;
let currentUser = null;
let userName = 'Guest';
let userEmail = '';

function showToast(message, type = 'success', duration = 3500) {
    const container = document.getElementById('siteToastContainer');
    if (!container) return;
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-circle-exclamation',
        warning: 'fa-triangle-exclamation',
        info: 'fa-circle-info'
    };
    const toast = document.createElement('div');
    toast.className = `site-toast ${type}`;
    toast.innerHTML = `<i class="site-toast-icon fa-solid ${icons[type] || icons.info}"></i><span class="site-toast-message"></span><button class="site-toast-close" type="button" aria-label="Close notification"><i class="fa-solid fa-xmark"></i></button>`;
    toast.querySelector('.site-toast-message').textContent = message;
    toast.querySelector('.site-toast-close').addEventListener('click', () => removeToast(toast));
    container.appendChild(toast);
    window.setTimeout(() => removeToast(toast), duration);
}

function removeToast(toast) {
    if (!toast.isConnected) return;
    toast.style.animation = 'siteToastOut 0.25s ease both';
    window.setTimeout(() => toast.remove(), 250);
}

// ===== CART =====
let cart = JSON.parse(localStorage.getItem('pawsitive_cart') || '[]');
let cartSyncTimer = null;

function getCartStorageKey() {
    return currentUser ? `pawsitive_cart_${currentUser.id}` : 'pawsitive_cart';
}

function saveCart(syncDatabase = true) {
    localStorage.setItem(getCartStorageKey(), JSON.stringify(cart));
    if (!currentUser || !syncDatabase) return;
    clearTimeout(cartSyncTimer);
    cartSyncTimer = setTimeout(() => syncCartToDatabase(), 300);
}

function cartLineId(productId, variantId) {
    return `${productId}--${variantId || 'default'}`;
}

function normalizeCartItems(items) {
    const normalized = [];
    for (const item of items || []) {
        const itemId = String(item.id || '');
        const product = PRODUCTS.find(candidate => {
            const productId = String(candidate.id);
            return String(item.product_id || '') === productId
                || itemId === productId
                || itemId.startsWith(`${productId}-`)
                || itemId.startsWith(`${productId}--`);
        });
        if (!product) continue;

        const variants = product.variants || [];
        const variant = variants.find(candidate => String(candidate.id) === String(item.variant_id || ''))
            || variants.find(candidate => itemId.startsWith(`${product.id}-${candidate.label}`))
            || variants.find(candidate => String(item.name || '').endsWith(`(${candidate.label})`));
        const variantId = variant ? String(variant.id) : null;
        normalized.push({
            ...item,
            id: cartLineId(String(product.id), variantId),
            product_id: String(product.id),
            variant_id: variantId,
            name: variant ? `${product.name} (${variant.label})` : product.name,
            price: Number(product.price || 0),
            image: variant?.image_url || product.mainImage || product.images?.[0] || '',
            quantity: Math.max(1, Math.floor(Number(item.quantity) || 1))
        });
    }
    return normalized;
}

async function syncCartToDatabase(items = cart) {
    if (!currentUser) return;
    try {
        const normalizedItems = normalizeCartItems(items);
        if (normalizedItems.length < items.length) {
            showToast('Unavailable cart items were removed before syncing.', 'warning');
        }
        if (items === cart) {
            cart = normalizedItems;
            saveCart(false);
        }
        const response = await fetch(`/api/cart/${encodeURIComponent(currentUser.id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: normalizedItems.map(item => ({
                    product_id: item.product_id,
                    variant_id: item.variant_id,
                    quantity: item.quantity
                }))
            })
        });
        const json = await response.json();
        if (!json.ok) throw new Error(json.error || 'Cart could not be saved');
    } catch (err) {
        showToast(`Cart sync failed: ${err.message}`, 'error');
    }
}

async function syncCartWithDatabase() {
    if (!currentUser) return;
    if (!productsLoaded) await loadProductsFromDB();
    if (!productsLoaded) return;

    const savedGuestCart = JSON.parse(localStorage.getItem('pawsitive_cart') || '[]');
    const savedUserCart = JSON.parse(localStorage.getItem(getCartStorageKey()) || '[]');
    const guestCart = normalizeCartItems(savedGuestCart);
    const userCart = normalizeCartItems(savedUserCart);
    if (guestCart.length < savedGuestCart.length || userCart.length < savedUserCart.length) {
        showToast('Unavailable saved cart items were removed.', 'warning');
    }

    try {
        const response = await fetch(`/api/cart/${encodeURIComponent(currentUser.id)}`);
        const json = await response.json();
        if (!json.ok) throw new Error(json.error || 'Cart could not be loaded');

        const databaseCart = (json.data || []).map(item => {
            const product = item.product;
            if (!product) return null;
            const variant = item.variant || (product.variants || []).find(value => value.id === item.variant_id);
            const images = [...(product.images || [])].sort((a, b) =>
                (Number(b.is_primary) - Number(a.is_primary)) || (a.sort_order - b.sort_order)
            );
            return {
                id: cartLineId(product.id, item.variant_id),
                product_id: String(product.id),
                variant_id: item.variant_id ? String(item.variant_id) : null,
                name: variant?.variant_value ? `${product.name} (${variant.variant_value})` : product.name,
                variant_name: variant?.variant_value || null,
                price: Number(variant?.price || product.variants?.[0]?.price || 0),
                image: images.find(image => String(image.variant_id || '') === String(item.variant_id || ''))?.image_url
                    || images.find(image => image.is_primary)?.image_url
                    || images[0]?.image_url || '',
                quantity: Number(item.quantity) || 1
            };
        }).filter(Boolean);

        const baseCart = databaseCart.length ? databaseCart : userCart;
        cart = baseCart.map(item => ({ ...item }));
        for (const guestItem of guestCart) {
            const existing = cart.find(item => item.id === guestItem.id);
            if (existing) existing.quantity += Number(guestItem.quantity) || 1;
            else cart.push({ ...guestItem });
        }

        saveCart(false);
        await syncCartToDatabase();
        localStorage.removeItem('pawsitive_cart');
    } catch (err) {
        cart = [...userCart, ...guestCart];
        saveCart(false);
        showToast(`Cart could not sync: ${err.message}`, 'error');
    }

    updateCartBadge();
    updateCartUI();
}

// ===== WISHLIST =====
function getWishlistStorageKey() {
    return currentUser ? `pawsitive_wishlist_${currentUser.id}` : 'pawsitive_wishlist';
}

let wishlist = new Set(JSON.parse(localStorage.getItem('pawsitive_wishlist') || '[]'));
function saveWishlist() {
    localStorage.setItem(getWishlistStorageKey(), JSON.stringify([...wishlist]));
}

async function syncWishlistWithDatabase() {
    if (!currentUser) return;
    if (!productsLoaded) await loadProductsFromDB();
    if (!productsLoaded) return;

    const userWishlistKey = getWishlistStorageKey();
    const validProductIds = new Set(PRODUCTS.map(product => String(product.id)));
    const guestWishlist = new Set(JSON.parse(localStorage.getItem('pawsitive_wishlist') || '[]').map(String));
    const savedUserWishlist = new Set(JSON.parse(localStorage.getItem(userWishlistKey) || '[]').map(String));
    const allSavedIds = new Set([...guestWishlist, ...savedUserWishlist]);
    const validSavedIds = new Set([...allSavedIds].filter(id => validProductIds.has(id)));
    if (validSavedIds.size < allSavedIds.size) {
        showToast('Unavailable saved wishlist items were removed.', 'warning');
    }

    try {
        const response = await fetch(`/api/wishlist/${encodeURIComponent(currentUser.id)}`);
        const json = await response.json();
        if (!json.ok) throw new Error(json.error || 'Wishlist could not be loaded');

        const productIds = new Set(json.data.map(String));
        for (const productId of validSavedIds) {
            if (productIds.has(String(productId))) continue;
            const saveResponse = await fetch(`/api/wishlist/${encodeURIComponent(currentUser.id)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId })
            });
            const saveJson = await saveResponse.json();
            if (!saveJson.ok) throw new Error(saveJson.error || 'Wishlist item could not be saved');
            productIds.add(String(productId));
        }

        wishlist = productIds;
        saveWishlist();
        localStorage.removeItem('pawsitive_wishlist');
        updateWishlistBadge();
        renderShopProducts();
        renderWishlistPage();
    } catch (err) {
        wishlist = new Set([...savedUserWishlist, ...guestWishlist]);
        updateWishlistBadge();
        showToast(`Wishlist sync failed: ${err.message}`, 'error');
    }
}

// ===== PRODUCT DETAIL STATE =====
let currentProduct = null;
let selectedVariant = null;
let pdQtyVal = 1;
let selectedImageIndex = 0;

// ============================================================
// PAGE NAVIGATION
// ============================================================
const navLinks = document.getElementById('navLinks');
const menuBtn = document.getElementById('menuBtn');
const allPages = document.querySelectorAll('.page-content');

function showPage(pageId) {
    const target = publicPagePaths[pageId];
    // Public pages use document navigation so their server metadata and content
    // always match their URL. Private checkout screens retain the existing flow.
    if (target && (window.location.pathname !== target || (pageId === 'shop' && initialScreen?.dataset.category))) {
        window.location.assign(target);
        return;
    }
    if (['about', 'contact'].includes(pageId) && window.location.pathname !== '/') {
        window.location.assign('/#' + (pageId === 'about' ? 'about-section' : 'contact-section'));
        return;
    }
    if (pageId === 'orders' && !currentUser) {
        openAuth();
        return;
    }

    if (pageId === 'about') {
        allPages.forEach(page => {
            page.classList.remove('active');
            if (page.id === 'page-home') page.classList.add('active');
        });
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === 'home') link.classList.add('active');
        });
        setTimeout(() => {
            const aboutSection = document.getElementById('about-section');
            if (aboutSection) {
                const targetPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset - 78;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        }, 100);
        if (navLinks) navLinks.classList.remove('show');
        return;
    }

    if (pageId === 'contact') {
        allPages.forEach(page => {
            page.classList.remove('active');
            if (page.id === 'page-home') page.classList.add('active');
        });
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === 'home') link.classList.add('active');
        });
        setTimeout(() => {
            const contactSection = document.getElementById('contact-section');
            if (contactSection) {
                const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - 78;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        }, 100);
        if (navLinks) navLinks.classList.remove('show');
        return;
    }

    allPages.forEach(page => {
        page.classList.remove('active');
        if (page.id === 'page-' + pageId) page.classList.add('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) link.classList.add('active');
    });

    if (pageId === 'shop') {
        renderShopFilters();
        updateShopPriceRange();
        renderShopProducts();
    }
    if (pageId === 'wishlist') renderWishlistPage();
    if (pageId === 'cart') updateCartUI();
    if (pageId === 'orders') loadMyOrders();

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (navLinks) navLinks.classList.remove('show');
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Real href links support crawlers, new tabs and browser back/forward.
        if (this.getAttribute('href') !== '#') return;
        e.preventDefault();
        showPage(this.dataset.page);
    });
});

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        if (navLinks) navLinks.classList.toggle('show');
    });
}

// ============================================================
// AUTH MODAL
// ============================================================
const authOverlay = document.getElementById('authOverlay');
const loginBtn = document.getElementById('loginBtn');
const dashboardBtn = document.getElementById('dashboardBtn');
const closeAuth = document.getElementById('closeAuth');

function openAuth() {
    if (authOverlay) {
        authOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAuthModal() {
    if (authOverlay) {
        authOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (closeAuth) closeAuth.addEventListener('click', closeAuthModal);
if (authOverlay) {
    authOverlay.addEventListener('click', (e) => {
        if (e.target === authOverlay) closeAuthModal();
    });
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAuthModal();
});

// ============================================================
// PROFILE OVERLAY
// ============================================================
const profileOverlay = document.getElementById('profileOverlay');
const closeProfile = document.getElementById('closeProfile');

function closeProfileModal() {
    if (profileOverlay) {
        profileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (closeProfile) closeProfile.addEventListener('click', closeProfileModal);
if (profileOverlay) {
    profileOverlay.addEventListener('click', (e) => {
        if (e.target === profileOverlay) closeProfileModal();
    });
}

// ============================================================
// AUTH TABS
// ============================================================
const tabButtons = document.querySelectorAll('.auth-tabs button');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authTitle = document.getElementById('authTitle');
const authSubtitle = document.getElementById('authSubtitle');

tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        const tab = this.dataset.tab;
        if (tab === 'login') {
            if (loginForm) loginForm.classList.add('active');
            if (registerForm) registerForm.classList.remove('active');
            if (authTitle) authTitle.textContent = 'Welcome Back!';
            if (authSubtitle) authSubtitle.textContent = 'Sign in to continue to your account';
        } else {
            if (loginForm) loginForm.classList.remove('active');
            if (registerForm) registerForm.classList.add('active');
            if (authTitle) authTitle.textContent = 'Create Account!';
            if (authSubtitle) authSubtitle.textContent = 'Join us and start your journey with us';
        }
    });
});

const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

if (switchToRegister) {
    switchToRegister.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabButtons[1].classList.add('active');
        if (loginForm) loginForm.classList.remove('active');
        if (registerForm) registerForm.classList.add('active');
        if (authTitle) authTitle.textContent = 'Create Account!';
        if (authSubtitle) authSubtitle.textContent = 'Join us and start your journey with us';
    });
}

if (switchToLogin) {
    switchToLogin.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabButtons[0].classList.add('active');
        if (loginForm) loginForm.classList.add('active');
        if (registerForm) registerForm.classList.remove('active');
        if (authTitle) authTitle.textContent = 'Welcome Back!';
        if (authSubtitle) authSubtitle.textContent = 'Sign in to continue to your account';
    });
}

// ============================================================
// LOGIN
// ============================================================
const loginSubmit = document.getElementById('loginSubmit');
if (loginSubmit) {
    loginSubmit.addEventListener('click', async function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            showToast('Please enter email and password.', 'error');
            return;
        }

        loginSubmit.disabled = true;
        const originalText = loginSubmit.innerHTML;
        loginSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const json = await res.json();
            if (!json.ok) throw new Error(json.error);

            userLogin(json.data);
            await syncUserSavedData();
            closeAuthModal();
            document.getElementById('loginPassword').value = '';
            showToast(`Welcome back, ${json.data.name}! 🐾`);
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            loginSubmit.disabled = false;
            loginSubmit.innerHTML = originalText;
        }
    });
}

// ============================================================
// REGISTER
// ============================================================
const registerSubmit = document.getElementById('registerSubmit');
if (registerSubmit) {
    registerSubmit.addEventListener('click', async function(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const pass = document.getElementById('registerPassword').value;
        const confirm = document.getElementById('registerConfirmPassword').value;

        if (!name || !email || !pass || !confirm) {
            showToast('Please fill in all fields.', 'error');
            return;
        }
        if (pass !== confirm) {
            showToast('Passwords do not match.', 'error');
            return;
        }
        if (pass.length < 6) {
            showToast('Password must be at least 6 characters.', 'error');
            return;
        }

        registerSubmit.disabled = true;
        const originalText = registerSubmit.innerHTML;
        registerSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password: pass })
            });
            const json = await res.json();
            if (!json.ok) throw new Error(json.error);

            userLogin(json.data);
            await syncUserSavedData();
            closeAuthModal();
            document.getElementById('registerPassword').value = '';
            document.getElementById('registerConfirmPassword').value = '';
            showToast(`Account created! Welcome, ${json.data.name}! 🎉`);
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            registerSubmit.disabled = false;
            registerSubmit.innerHTML = originalText;
        }
    });
}

// ============================================================
// USER LOGIN HELPER
// ============================================================
async function syncUserSavedData() {
    if (!productsLoaded) await loadProductsFromDB();
    if (!productsLoaded) {
        showToast('Cart and wishlist sync paused because products did not load.', 'warning');
        return;
    }
    await Promise.all([syncWishlistWithDatabase(), syncCartWithDatabase()]);
}

function userLogin(userData) {
    isLoggedIn = true;
    currentUser = userData;
    localStorage.setItem('pawsitive_user', JSON.stringify(userData));

    userName = userData.name;
    userEmail = userData.email;

    if (loginBtn) loginBtn.style.display = 'none';
    if (dashboardBtn) dashboardBtn.style.display = 'flex';

    const initial = userName.charAt(0).toUpperCase();
    document.getElementById('dropdownName').textContent = userName;
    document.getElementById('dropdownEmail').textContent = userEmail;
    document.getElementById('profileDisplayName').textContent = userName;
    document.getElementById('profileDisplayEmail').textContent = userEmail;
    document.getElementById('profileDisplayAvatar').textContent = initial;
    document.getElementById('currentNameDisplay').value = userName;
    document.getElementById('dashboardName').textContent = userName.split(' ')[0] || userName;
    updateCartBadge();
}

// ============================================================
// USER LOGOUT
// ============================================================
async function logoutUser() {
    try { const r = await fetch('/api/auth/logout', { method: 'POST' }); if (!r.ok) throw new Error(); }
    catch { showToast('Logout failed. Please try again.', 'error'); return; }
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('pawsitive_user');
    wishlist = new Set(JSON.parse(localStorage.getItem('pawsitive_wishlist') || '[]'));
    cart = JSON.parse(localStorage.getItem('pawsitive_cart') || '[]');

    if (loginBtn) loginBtn.style.display = 'flex';
    if (dashboardBtn) dashboardBtn.style.display = 'none';

    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) dropdown.classList.remove('active');
    const arrow = document.getElementById('dashboardArrow');
    if (arrow) arrow.classList.remove('open');
    updateWishlistBadge();
    updateCartBadge();
    updateCartUI();

    showToast('Logged out successfully.');
}

// ============================================================
// PROFILE DROPDOWN
// ============================================================
function handleDashboardClick() {
    if (isLoggedIn) toggleDropdown();
    else openAuth();
}

function showOrders() {
    const dropdown = document.getElementById('profileDropdown');
    const arrow = document.getElementById('dashboardArrow');
    if (dropdown) dropdown.classList.remove('active');
    if (arrow) arrow.classList.remove('open');
    showPage('orders');
}

function toggleDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    const arrow = document.getElementById('dashboardArrow');
    if (dropdown) dropdown.classList.toggle('active');
    if (arrow) arrow.classList.toggle('open');
}

document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('profileWrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        const dropdown = document.getElementById('profileDropdown');
        const arrow = document.getElementById('dashboardArrow');
        if (dropdown) dropdown.classList.remove('active');
        if (arrow) arrow.classList.remove('open');
    }
});

// ============================================================
// PROFILE SECTIONS
// ============================================================
function showProfileSection(section) {
    const dropdown = document.getElementById('profileDropdown');
    const arrow = document.getElementById('dashboardArrow');
    if (dropdown) dropdown.classList.remove('active');
    if (arrow) arrow.classList.remove('open');

    const profileSection = document.getElementById('profileSection');
    const changeNameSection = document.getElementById('changeNameSection');
    const changePasswordSection = document.getElementById('changePasswordSection');

    if (profileSection) profileSection.style.display = 'none';
    if (changeNameSection) changeNameSection.style.display = 'none';
    if (changePasswordSection) changePasswordSection.style.display = 'none';

    const titles = {
        'profile': ['My Profile', 'Manage your account details'],
        'change-name': ['Change Name', 'Update your display name'],
        'change-password': ['Change Password', 'Update your account password']
    };

    if (section === 'profile' && profileSection) profileSection.style.display = 'block';
    else if (section === 'change-name' && changeNameSection) {
        changeNameSection.style.display = 'block';
        const cur = document.getElementById('currentNameDisplay');
        if (cur) cur.value = userName;
    } else if (section === 'change-password' && changePasswordSection) {
        changePasswordSection.style.display = 'block';
    }

    const overlayTitle = document.getElementById('profileOverlayTitle');
    const overlaySub = document.getElementById('profileOverlaySub');
    if (overlayTitle) overlayTitle.textContent = titles[section]?.[0] || 'My Profile';
    if (overlaySub) overlaySub.textContent = titles[section]?.[1] || '';

    if (profileOverlay) {
        profileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

async function updateName() {
    const newNameInput = document.getElementById('newNameInput');
    if (!newNameInput) return;
    const newName = newNameInput.value.trim();
    if (!newName) {
        showToast('Please enter a new name.', 'error');
        return;
    }
    if (!currentUser) {
        showToast('Please login first.', 'error');
        return;
    }

    try {
        const res = await fetch(`/api/auth/update/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        });
        const json = await res.json();
        if (!json.ok) throw new Error(json.error);

        currentUser = { ...currentUser, ...json.data };
        localStorage.setItem('pawsitive_user', JSON.stringify(currentUser));
        userName = currentUser.name;
        const initial = userName.charAt(0).toUpperCase();

        document.getElementById('dropdownName').textContent = userName;
        document.getElementById('profileDisplayName').textContent = userName;
        document.getElementById('profileDisplayAvatar').textContent = initial;
        document.getElementById('dashboardName').textContent = userName.split(' ')[0] || userName;
        const cur = document.getElementById('currentNameDisplay');
        if (cur) cur.value = userName;

        newNameInput.value = '';
        showToast('Name updated successfully.');
        closeProfileModal();
    } catch (err) {
        showToast('Update failed: ' + err.message, 'error');
    }
}

function updatePassword() {
    // Filhal simple message (baad mein proper password change)
    showToast('Password change feature coming soon.', 'info');
    closeProfileModal();
}

// ============================================================
// FAQ ACCORDION
// ============================================================
const faqs = [
    { question: 'Where is Pawsitive Clinic?', answer: 'Model Colony Block 19, near Malir Cantt Check Post No 2, Karachi. Call +92 334 3601699 to confirm current hours and appointments.' },
    { question: 'Which services can I ask about?', answer: 'Veterinary treatment, surgery consultations, laboratory testing, X-ray, cat grooming and boarding. Confirm availability and charges with the clinic.' },
    { question: 'When should I pay for a shop order?', answer: 'Wait for availability confirmation, then follow the payment instructions. Send payment proof and the order ID to Maaz. Read the Guide for full steps.' }
];

const faqContainer = document.getElementById('faqContainer');
if (faqContainer && !faqContainer.children.length) {
    faqs.forEach(function(faq, index) {
        const item = document.createElement('div');
        item.className = 'faq-item';
        const header = document.createElement('div');
        header.className = 'faq-header';
        header.innerHTML = `
            <h3>${faq.question}</h3>
            <div class="faq-icon">
                <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2" stroke="#1D293D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        `;
        const answer = document.createElement('p');
        answer.className = 'faq-answer';
        answer.textContent = faq.answer;
        item.appendChild(header);
        item.appendChild(answer);
        faqContainer.appendChild(item);
        header.addEventListener('click', function() {
            const allAnswers = document.querySelectorAll('.faq-answer');
            const allIcons = document.querySelectorAll('.faq-icon');
            allAnswers.forEach((el, i) => {
                if (i === index) {
                    el.classList.toggle('open');
                    allIcons[i].classList.toggle('rotated');
                } else {
                    el.classList.remove('open');
                    allIcons[i].classList.remove('rotated');
                }
            });
        });
    });
}

// ============================================================
// PRODUCT CARDS
// ============================================================
function renderProductCard(p) {
    const isWishlisted = wishlist.has(p.id);
    const id = encodeURIComponent(p.id);
    const name = escapeProductText(p.name);
    const href = '/products/' + id;
    const priceLabel = p.variantType ? 'Starting from' : 'Price';
    return `
        <article class="product-card-v2 seo-product-card">
            <div class="product-card-v2-img">
                ${p.tag ? `<span class="product-card-v2-tag">${escapeProductText(p.tag)}</span>` : ''}
                <a href="${href}"><img loading="lazy" decoding="async" src="${escapeProductText(p.images[0])}" alt="${name}"></a>
                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${id}')" aria-label="${isWishlisted ? 'Remove from' : 'Add to'} wishlist">
                    <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
                </button>
            </div>
            <div class="product-card-v2-body">
                ${p.category ? `<div class="product-card-v2-category">${escapeProductText(p.category)}</div>` : ''}
                <h3><a href="${href}">${name}</a></h3>
                <div class="product-card-v2-footer">
                    <div class="product-card-v2-price-wrap"><span class="product-card-v2-price-label">${priceLabel}</span><span class="product-card-v2-price">Rs ${p.price.toFixed(2)}</span></div>
                    <a class="product-card-v2-view" href="${href}" aria-label="View ${name}"><i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>
        </article>`;
}

function renderShopProducts() {
    const container = document.getElementById('shopProductsRow');
    if (!container) return;
    const countLabel = document.getElementById('shopProductCount');
    if (PRODUCTS.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#6B7280;">
            <i class="fa-solid fa-box-open" style="font-size:48px;color:#FF7A00;margin-bottom:16px;display:block;"></i>
            <h3 style="font-size:20px;color:#1a1a2e;margin-bottom:8px;">No products available</h3>
            <p>Contact the clinic for product availability.</p>
        </div>`;
        if (countLabel) countLabel.textContent = '0 products';
        return;
    }

    let filteredProducts = PRODUCTS.filter(product => {
        const categoryMatch = initialScreen?.dataset.category && !selectedShopCategoryIds.size ? false : (!selectedShopCategoryIds.size || selectedShopCategoryIds.has(product.categoryId));
        const priceMatch = shopMaxPrice === null || Number(product.price) <= shopMaxPrice;
        return categoryMatch && priceMatch;
    });

    if (shopSort === 'featured') filteredProducts.sort((a, b) => Number(/featured/i.test(b.tag)) - Number(/featured/i.test(a.tag)));
    else if (shopSort === 'price-asc') filteredProducts.sort((a, b) => a.price - b.price);
    else if (shopSort === 'price-desc') filteredProducts.sort((a, b) => b.price - a.price);
    else if (shopSort === 'newest') filteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    else if (shopSort === 'best-selling') filteredProducts.sort((a, b) => b.soldCount - a.soldCount);

    if (countLabel) {
        countLabel.textContent = `Showing ${filteredProducts.length} of ${PRODUCTS.length} products`;
    }
    if (!filteredProducts.length) {
        container.innerHTML = `<div class="shop-empty-results"><h3>No products match these filters</h3><p>Try another category or price range.</p></div>`;
        return;
    }
    container.innerHTML = filteredProducts.map(renderProductCard).join('');
}

// ============================================================
// WISHLIST
// ============================================================
async function toggleWishlist(id) {
    const removing = wishlist.has(id);
    if (removing) wishlist.delete(id);
    else wishlist.add(id);
    saveWishlist();
    updateWishlistBadge();
    renderShopProducts();
    if (currentProduct && currentProduct.id === id) renderProductDetail();
    const wishlistPage = document.getElementById('page-wishlist');
    if (wishlistPage && wishlistPage.classList.contains('active')) renderWishlistPage();

    if (!currentUser) return;

    try {
        const response = await fetch(
            `/api/wishlist/${encodeURIComponent(currentUser.id)}${removing ? `/${encodeURIComponent(id)}` : ''}`,
            {
                method: removing ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: removing ? undefined : JSON.stringify({ product_id: id })
            }
        );
        const json = await response.json();
        if (!json.ok) throw new Error(json.error || 'Wishlist update failed');
    } catch (err) {
        if (removing) wishlist.add(id);
        else wishlist.delete(id);
        saveWishlist();
        updateWishlistBadge();
        renderShopProducts();
        if (currentProduct && currentProduct.id === id) renderProductDetail();
        if (wishlistPage && wishlistPage.classList.contains('active')) renderWishlistPage();
        showToast(`Wishlist could not be saved: ${err.message}`, 'error');
    }
}

function updateWishlistBadge() {
    const badge = document.getElementById('wishlistBadge');
    if (badge) {
        badge.textContent = wishlist.size;
        badge.style.display = wishlist.size > 0 ? 'flex' : 'none';
    }
}

function renderWishlistPage() {
    const container = document.getElementById('wishlistItems');
    const countLabel = document.getElementById('wishlistCount');
    if (!container) return;
    const items = PRODUCTS.filter(p => wishlist.has(p.id));
    if (countLabel) countLabel.textContent = items.length === 1 ? '1 item' : `${items.length} items`;
    if (items.length === 0) {
        container.innerHTML = `
            <div class="cart-empty" style="grid-column:1/-1;">
                <i class="fa-solid fa-heart"></i>
                <h3>Your wishlist is empty</h3>
                <p>Save products you love and find them here anytime!</p>
                <button onclick="showPage('shop')" class="btn-primary">Browse Products</button>
            </div>
        `;
        return;
    }
    container.innerHTML = items.map(renderProductCard).join('');
}

// ============================================================
// PRODUCT DETAIL PAGE
// ============================================================
function openProductDetail(id) {
    const path = '/products/' + encodeURIComponent(id);
    if (window.location.pathname !== path) {
        window.location.assign(path);
        return;
    }
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    currentProduct = p;
    selectedVariant = p.variantType === 'flavor' ? (p.primaryFlavor || null) : ((p.variants && p.variants.length) ? p.variants[0] : null);
    pdQtyVal = 1;
    const initialImageIndex = selectedVariant?.image_url ? p.images.indexOf(selectedVariant.image_url) : -1;
    selectedImageIndex = initialImageIndex >= 0 ? initialImageIndex : 0;
    renderProductDetail();
    showPage('product-detail');
}

function selectImage(index) {
    if (!currentProduct || !currentProduct.images[index]) return;
    selectedImageIndex = index;
    const imageUrl = currentProduct.images[index];
    const matchingVariant = currentProduct.variants.find(variant => variant.image_url === imageUrl);
    if (matchingVariant) selectedVariant = matchingVariant;
    else if (index === 0 && currentProduct.variantType === 'flavor') {
        selectedVariant = currentProduct.primaryFlavor || null;
    }
    renderProductDetail();
}

function renderProductDetail() {
    const p = currentProduct;
    if (!p) return;
    document.getElementById('pdImage').src = p.images[selectedImageIndex] || selectedVariant?.image_url || p.mainImage;
    document.getElementById('pdImage').alt = p.name;
    document.getElementById('pdTag').textContent = p.tag || '';
    document.getElementById('pdName').textContent = p.name;
    document.getElementById('pdCategory').textContent = p.category;
    const descriptionList = document.getElementById('pdDesc');
    const descriptionText = selectedVariant?.description_override;
    const points = descriptionText
        ? descriptionText.split(/\r?\n|\|/).map(point => point.trim()).filter(Boolean).slice(0, 5)
        : p.descriptionPoints;
    descriptionList.replaceChildren(...points.map(point => {
        const item = document.createElement('li');
        item.textContent = point;
        return item;
    }));
    document.getElementById('pdQty').textContent = pdQtyVal;

    const thumbsContainer = document.getElementById('pdThumbnails');
    if (thumbsContainer) {
        if (p.images.length > 1) {
            thumbsContainer.style.display = 'flex';
            thumbsContainer.innerHTML = p.images.map((img, i) => `
                <button class="pd-thumb ${i === selectedImageIndex ? 'active' : ''}" onclick="selectImage(${i})">
                    <img loading="lazy" decoding="async" src="${img}" alt="${p.name} thumbnail ${i + 1}">
                </button>
            `).join('');
        } else {
            thumbsContainer.style.display = 'none';
            thumbsContainer.innerHTML = '';
        }
    }

    const priceVal = (selectedVariant && selectedVariant.price) ? selectedVariant.price : p.price;
    document.getElementById('pdPrice').textContent = `Rs ${priceVal.toFixed(2)}`;
    const weightEl = document.getElementById('pdWeight');
    if (weightEl) {
        const weightVal = (selectedVariant && selectedVariant.weight) || p.weight || '';
        weightEl.textContent = weightVal ? `Weight: ${weightVal}` : '';
        weightEl.style.display = weightVal ? 'inline-flex' : 'none';
    }

    const wishBtn = document.getElementById('pdWishlistBtn');
    if (wishBtn) {
        const active = wishlist.has(p.id);
        wishBtn.classList.toggle('active', active);
        wishBtn.innerHTML = `<i class="fa-${active ? 'solid' : 'regular'} fa-heart"></i> ${active ? 'Wishlisted' : 'Add to Wishlist'}`;
    }

    const variantsContainer = document.getElementById('pdVariants');
    if (!p.variantType || !p.variants.length) {
        variantsContainer.innerHTML = '';
    } else if (p.variantType === 'weight') {
        variantsContainer.innerHTML = `
            <div class="pd-variant-label">Select Size</div>
            <div class="pd-variant-pills">
                ${p.variants.map(v => `<button class="pd-pill ${selectedVariant.label === v.label ? 'active' : ''}" onclick="selectVariant('${v.label}')">${v.label}</button>`).join('')}
            </div>
        `;
    } else if (p.variantType === 'color') {
        variantsContainer.innerHTML = `
            <div class="pd-variant-label">Select Color: <span>${selectedVariant.label}</span></div>
            <div class="pd-variant-swatches">
                ${p.variants.map(v => `<button class="pd-swatch ${selectedVariant.label === v.label ? 'active' : ''}" style="background:${v.hex}" onclick="selectVariant('${v.label}')" title="${v.label}"></button>`).join('')}
            </div>
        `;
    } else if (p.variantType === 'flavor') {
        const label = document.createElement('div');
        label.className = 'pd-variant-label';
        label.append('Select Flavor / Variant: ');
        const selectedLabel = document.createElement('span');
        selectedLabel.textContent = selectedVariant?.label || '';
        label.appendChild(selectedLabel);

        const options = document.createElement('div');
        options.className = 'pd-variant-pills';
        p.variants.forEach(variant => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `pd-pill ${selectedVariant?.id === variant.id ? 'active' : ''}`;
            button.textContent = variant.label;
            button.addEventListener('click', () => selectVariant(variant.id));
            options.appendChild(button);
        });
        variantsContainer.replaceChildren(label, options);
    }
}

function selectVariant(labelOrId) {
    if (!currentProduct) return;
    selectedVariant = currentProduct.variants.find(v => v.label === labelOrId || v.id === labelOrId);
    const imageIndex = selectedVariant?.image_url ? currentProduct.images.indexOf(selectedVariant.image_url) : -1;
    selectedImageIndex = imageIndex >= 0 ? imageIndex : 0;
    renderProductDetail();
}

function pdChangeQty(delta) {
    pdQtyVal = Math.max(1, pdQtyVal + delta);
    document.getElementById('pdQty').textContent = pdQtyVal;
}

function pdToggleWishlist() {
    if (!currentProduct) return;
    toggleWishlist(currentProduct.id);
}

function pdAddToCart() {
    const p = currentProduct;
    if (!p) return;
    if (p.variantType === 'flavor' && p.variants.length && !selectedVariant) {
        showToast('Select a flavor / variant first.', 'warning');
        return;
    }
    const variantLabel = selectedVariant ? selectedVariant.label : null;
    const variantId = selectedVariant ? selectedVariant.id : null;
    const price = (selectedVariant && selectedVariant.price) ? selectedVariant.price : p.price;
    const cartId = cartLineId(p.id, variantId);
    const name = variantLabel ? `${p.name} (${variantLabel})` : p.name;
    for (let i = 0; i < pdQtyVal; i++) {
        addToCart({
            id: cartId,
            product_id: p.id,
            variant_id: variantId,
            name,
            price,
            image: selectedVariant?.image_url || p.images[selectedImageIndex] || p.mainImage,
            variant_name: variantLabel
        }, true);
    }
    showToast('Added to cart.');
}

// ============================================================
// CART FUNCTIONS
// ============================================================
function addToCart(product, silent) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    saveCart();
    updateCartUI();
    updateCartBadge();
    if (!silent) showToast('Added to cart.');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    updateCartBadge();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    saveCart();
    updateCartUI();
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const count = getCartCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    const subtotal = document.getElementById('cartSubtotal');
    const total = document.getElementById('cartTotal');
    const countBadge = document.getElementById('cartItemCount');
    if (!container) return;
    if (countBadge) {
        const c = getCartCount();
        countBadge.textContent = c === 1 ? '1 item' : `${c} items`;
    }
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <i class="fa-solid fa-cart-plus"></i>
                <h3>Your cart is empty</h3>
                <p>Start shopping for your pet's needs today!</p>
                <button onclick="showPage('shop')" class="btn-primary">Shop Now</button>
            </div>
        `;
        if (subtotal) subtotal.textContent = 'Rs 0.00';
        if (total) total.textContent = 'Rs 0.00';
        return;
    }
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img loading="lazy" decoding="async" src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="price">Rs ${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-qty">
                <button onclick="updateQuantity('${item.id}', -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
            <div class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                <i class="fa-solid fa-trash-can"></i>
            </div>
        </div>
    `).join('');
    const totalAmount = getCartTotal();
    if (subtotal) subtotal.textContent = `Rs ${totalAmount.toFixed(2)}`;
    if (total) total.textContent = `Rs ${totalAmount.toFixed(2)}`;
}

function getOrderHistoryKey() {
    return currentUser ? `pawsitive_orders_${currentUser.id}` : null;
}

function getOrderHistory() {
    const key = getOrderHistoryKey();
    if (!key) return [];
    try {
        const history = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(history) ? history : [];
    } catch {
        return [];
    }
}

function saveOrderHistory(order) {
    const key = getOrderHistoryKey();
    if (!key) return;
    try {
        localStorage.setItem(key, JSON.stringify([order, ...getOrderHistory()]));
    } catch {
        showToast('Order placed, but it could not be saved to this browser\'s order history.', 'warning');
    }
}

async function loadMyOrders() {
    if (!currentUser) {
        openAuth();
        return;
    }

    const tableBody = document.getElementById('ordersTableBody');
    if (tableBody) tableBody.innerHTML = '<tr><td colspan="5">Loading orders...</td></tr>';

    try {
        const response = await fetch(`/api/orders/user/${encodeURIComponent(currentUser.id)}`);
        const json = await response.json();
        if (!json.ok) throw new Error(json.error || 'Orders could not be loaded');

        const databaseOrders = Array.isArray(json.data) ? json.data : [];
        renderMyOrders(databaseOrders);
        const key = getOrderHistoryKey();
        if (key) { try { localStorage.setItem(key, JSON.stringify(databaseOrders)); } catch {} }
    } catch (err) {
        renderMyOrders([]);
        if (tableBody) {
            document.getElementById('ordersTableShell').style.display = 'block';
            document.getElementById('ordersEmpty').style.display = 'none';
            tableBody.innerHTML = '<tr><td colspan="5">Orders could not be loaded. Please try again.</td></tr>';
        }
        showToast(`Orders could not be loaded: ${err.message}`, 'error');
    }
}

function renderMyOrders(history = getOrderHistory()) {
    const tableBody = document.getElementById('ordersTableBody');
    const tableShell = document.getElementById('ordersTableShell');
    const emptyState = document.getElementById('ordersEmpty');
    const count = document.getElementById('ordersCount');
    if (!tableBody || !tableShell || !emptyState) return;

    if (count) count.textContent = history.length === 1 ? '1 order' : `${history.length} orders`;
    tableBody.replaceChildren();
    tableShell.style.display = history.length ? 'block' : 'none';
    emptyState.style.display = history.length ? 'none' : 'grid';

    history.forEach(order => {
        const row = document.createElement('tr');
        const orderCell = document.createElement('td');
        const orderReference = document.createElement('strong');
        orderReference.className = 'orders-reference';
        orderReference.textContent = `ORD-${String(order.id || '').slice(0, 6).toUpperCase()}`;
        orderCell.appendChild(orderReference);

        const dateCell = document.createElement('td');
        const orderDate = new Date(order.created_at);
        dateCell.textContent = Number.isNaN(orderDate.getTime())
            ? '—'
            : orderDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

        const itemsCell = document.createElement('td');
        itemsCell.className = 'orders-items-cell';
        itemsCell.textContent = (order.items || [])
            .map(item => `${item.product_name} × ${item.quantity}`)
            .join(', ') || '—';

        const totalCell = document.createElement('td');
        totalCell.className = 'orders-total-cell';
        totalCell.textContent = `Rs ${Number(order.total || 0).toFixed(2)}`;

        const statusCell = document.createElement('td');
        const status = order.order_status === 'cancelled' ? 'cancelled' : order.payment_status === 'paid' ? 'paid' : String(order.order_status || 'pending').toLowerCase();
        const knownStatuses = ['checking', 'pending', 'paid', 'cancelled'];
        const statusBadge = document.createElement('span');
        statusBadge.className = `orders-status ${knownStatuses.includes(status) ? status : 'pending'}`;
        statusBadge.textContent = knownStatuses.includes(status)
            ? (status === 'checking' ? 'Checking Availability' : status === 'pending' ? 'Pending Payment' : status.charAt(0).toUpperCase() + status.slice(1))
            : 'Pending';
        if (String(order.payment_status || '').toLowerCase() === 'paid' && status !== 'cancelled') {
            statusBadge.className = 'orders-status paid';
            statusBadge.textContent = 'Paid';
        }
        statusCell.appendChild(statusBadge);

        row.append(orderCell, dateCell, itemsCell, totalCell, statusCell);
        tableBody.appendChild(row);
    });
}

function createOrderFromHistory() {
    if (cart.length) {
        showPage('cart');
        return;
    }
    showPage('shop');
    showToast('Choose products to start a new order.', 'info');
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty.', 'warning');
        return;
    }
    showPage('checkout');
    renderCheckoutItems();
    prefillCheckout();
}

function renderCheckoutItems() {
    const container = document.getElementById('checkoutItems');
    if (!container) return;
    container.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <img loading="lazy" decoding="async" src="${item.image || 'https://via.placeholder.com/52'}" alt="${item.name}">
            <div class="checkout-item-info">
                <span class="checkout-item-name">${item.name} × ${item.quantity}</span>
                <span class="checkout-item-price">Rs ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        </div>
    `).join('');
    document.getElementById('checkoutTotal').textContent = `Rs ${getCartTotal().toFixed(2)}`;
}

function prefillCheckout() {
    if (currentUser) {
        const nameEl = document.getElementById('checkoutName');
        const emailEl = document.getElementById('checkoutEmail');
        const phoneEl = document.getElementById('checkoutPhone');
        const cityEl = document.getElementById('checkoutCity');
        const addressEl = document.getElementById('checkoutAddress');
        if (nameEl) nameEl.value = currentUser.name || '';
        if (emailEl) emailEl.value = currentUser.email || '';
        if (phoneEl) phoneEl.value = currentUser.phone || '';
        if (cityEl) cityEl.value = currentUser.city || '';
        if (addressEl) addressEl.value = currentUser.address || '';
    }
}

// ============================================================
// PLACE ORDER
// ============================================================
async function placeOrder(e) {
    e.preventDefault();
    const name = document.getElementById('checkoutName').value.trim();
    const email = document.getElementById('checkoutEmail').value.trim();
    const phone = document.getElementById('checkoutPhone').value.trim();
    const city = document.getElementById('checkoutCity').value.trim();
    const address = document.getElementById('checkoutAddress').value.trim();

    if (!name || !email || !phone || !city || !address) {
        showToast('Please fill in all required fields.', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('.place-order-btn');
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Placing order...';

    try {
        const total = getCartTotal();
        const fullAddress = `${address}, ${city}`;

        if (currentUser) {
            const profileResponse = await fetch(`/api/auth/update/${encodeURIComponent(currentUser.id)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, address, city })
            });
            const profileJson = await profileResponse.json();
            if (!profileJson.ok) throw new Error(`Profile details could not be saved: ${profileJson.error}`);
            currentUser = { ...currentUser, ...profileJson.data };
            localStorage.setItem('pawsitive_user', JSON.stringify(currentUser));
        }

        const orderItems = cart.map(item => ({
            product_id: item.product_id || null,
            variant_id: item.variant_id || null,
            variant_name: item.variant_name || null,
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            line_total: item.price * item.quantity
        }));

        const orderPayload = {
            user_id: currentUser ? currentUser.id : null,
            customer_name: name,
            customer_email: email,
            phone: phone,
            address: fullAddress,
            subtotal: total,
            delivery_fee: 0,
            total: total,
            items: orderItems
        };

        const res = await fetch(API + '/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        });
        const json = await res.json();
        if (!json.ok) throw new Error(json.error);

        if (currentUser) {
            saveOrderHistory({
                id: json.data.id,
                created_at: json.data.created_at || new Date().toISOString(),
                items: orderItems,
                total,
                order_status: json.data.order_status || 'checking'
            });
        }

        const orderId = 'ORD-' + String(json.data.id).slice(0, 6).toUpperCase();
        document.getElementById('paymentOrderId').textContent = orderId;
        document.getElementById('refOrderId').textContent = orderId;
        document.getElementById('paymentAmount').textContent = `Rs ${total.toFixed(2)}`;

        cart = [];
        saveCart();
        updateCartUI();
        updateCartBadge();

        showPage('payment');
        showToast('Order placed successfully! ✅');
    } catch (err) {
        showToast('Order failed: ' + err.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function sendWhatsApp() {
    const orderId = document.getElementById('paymentOrderId').textContent;
    const total = document.getElementById('paymentAmount').textContent;
    const message = `Hi! I've sent payment for Order ${orderId} (${total}).`;
    window.open(`https://wa.me/923343601699?text=${encodeURIComponent(message)}`, '_blank');
}

function openWhatsAppContact() {
    const message = 'Hello Pawsitive Clinic, I would like to know more about your services.';
    window.open(`https://wa.me/923343601699?text=${encodeURIComponent(message)}`, '_blank');
}

// ============================================================
// CHATBOT
// ============================================================
const chatbotModal = document.getElementById('chatbotModal');
const chatbotBody = document.getElementById('chatbotBody');
const chatbotInput = document.getElementById('chatbotInput');

function getChatTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function openChatbot() {
    if (chatbotModal) {
        chatbotModal.classList.add('active');
        const welcomeTime = document.getElementById('chatbotWelcomeTime');
        if (welcomeTime && !welcomeTime.textContent) welcomeTime.textContent = getChatTime();
        if (chatbotInput) chatbotInput.focus();
    }
}

function closeChatbot() {
    if (chatbotModal) chatbotModal.classList.remove('active');
}

function escapeChatHtml(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\n/g, '<br>');
}

function appendChatMessage(text, sender) {
    if (!chatbotBody) return null;
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender}`;
    msg.innerHTML = `
        <div class="chat-avatar"><i class="fa-solid ${sender === 'user' ? 'fa-user' : 'fa-paw'}"></i></div>
        <div class="chat-bubble">
            <p>${escapeChatHtml(text)}</p>
            <span class="chat-time">${getChatTime()}</span>
        </div>
    `;
    chatbotBody.appendChild(msg);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    return msg;
}

// The reply comes from the server (/api/chatbot -> Gemini), which answers only from chatbotData.js
const chatHistory = [];
let chatBusy = false;

async function getBotReply(history) {
    const controller = new AbortController();
   const timer = setTimeout(() => controller.abort(), 55000);
    try {
        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: history.slice(-10) }),
            signal: controller.signal
        });
        const payload = await response.json().catch(() => ({}));
        if (response.ok && payload.ok && payload.reply) return payload.reply;
        return payload.reply || 'Sorry, I could not reply right now. Please try again in a moment.';
    } catch {
        return 'Sorry, I could not connect right now. Please check your internet and try again.';
    } finally {
        clearTimeout(timer);
    }
}

async function sendChatMessage() {
    if (!chatbotInput || chatBusy) return;
    const text = chatbotInput.value.trim();
    if (!text) return;
    appendChatMessage(text, 'user');
    chatbotInput.value = '';
    chatHistory.push({ role: 'user', text });
    chatBusy = true;
    const typing = appendChatMessage('Typing…', 'bot');
    const reply = await getBotReply(chatHistory);
    if (typing) typing.remove();
    appendChatMessage(reply, 'bot');
    chatHistory.push({ role: 'bot', text: reply });
    chatBusy = false;
}

// ============================================================
// SERVICES CAROUSEL
// ============================================================
let surgeryCardIndex = 0;

function moveSurgeryCards(direction) {
    const track = document.querySelector('#surgeryCarousel .surgery-track');
    const cards = document.querySelectorAll('#surgeryCarousel .surgery-card');
    if (!track || cards.length < 2) return;
    const visibleCards = window.matchMedia('(max-width: 700px)').matches ? 1 : 3;
    const maxIndex = Math.max(0, cards.length - visibleCards);
    surgeryCardIndex = Math.min(maxIndex, Math.max(0, surgeryCardIndex + direction));
    const cardWidth = cards[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${surgeryCardIndex * (cardWidth + 15)}px)`;
}

// ============================================================
// INIT — Load everything from Supabase
// ============================================================
(async function init() {
    console.log('🐾 Pawsitive Clinic website starting...');

    // Restore session
    const savedUser = localStorage.getItem('pawsitive_user');
    if (savedUser) {
        try {
            const u = JSON.parse(savedUser);
            const res = await fetch(`/api/auth/me/${u.id}`);
            const json = await res.json();
            if (json.ok) userLogin(json.data);
            else localStorage.removeItem('pawsitive_user');
        } catch (e) {
            localStorage.removeItem('pawsitive_user');
        }
    }

    await loadCategoriesFromDB();
    await loadProductsFromDB();
    if (initialScreen?.dataset.productId && productsLoaded) {
        openProductDetail(initialScreen.dataset.productId);
    }
    if (currentUser) await syncUserSavedData();
    if (initialScreen?.dataset.initialPage === 'orders' && currentUser) loadMyOrders();
    if (window.location.hash && document.getElementById(window.location.hash.slice(1))) {
        document.getElementById(window.location.hash.slice(1)).scrollIntoView();
    }
    updateCartBadge();
    updateWishlistBadge();
    updateCartUI();
    console.log('✅ Website ready!');
})();
// Poll visible pages without reloading the browser or overlapping requests.
(() => {
    let busy = false;
    let catalogSignature = null;
    let orderSignature = null;
    const get = async path => {
        const response = await fetch(API + path, { cache: 'no-store' });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || 'Refresh failed');
        return result.data || [];
    };
    async function refresh() {
        if (busy || document.hidden) return;
        busy = true;
        try {
            await Promise.allSettled([
                (async () => {
                    if (!['page-shop','page-product-detail'].some(id => document.getElementById(id)?.classList.contains('active'))) return;
                    const [categories, products] = await Promise.all([get('/api/categories'), get('/api/products')]);
                    const signature = JSON.stringify([categories, products]);
                    if (signature === catalogSignature) return;
                    await loadCategoriesFromDB(categories);
                    await loadProductsFromDB(products);
                    if (!productsLoaded) return;
                    catalogSignature = signature;
                    if (currentProduct && document.getElementById('page-product-detail')?.classList.contains('active')) {
                        const updated = PRODUCTS.find(p => p.id === currentProduct.id);
                        if (!updated) { showPage('shop'); return; }
                        const previousVariant = selectedVariant;
                        currentProduct = updated;
                        selectedVariant = updated.variants.find(v => v.id === previousVariant?.id)
                            || updated.variants.find(v => v.label === previousVariant?.label)
                            || updated.primaryFlavor || (updated.variantType === 'flavor' ? null : updated.variants[0]) || null;
                        if (selectedImageIndex >= updated.images.length) selectedImageIndex = 0;
                        renderProductDetail();
                    }
                })(),
                (async () => {
                    if (!currentUser || !document.getElementById('page-orders')?.classList.contains('active')) return;
                    const userId = currentUser.id;
                    const orders = await get(`/api/orders/user/${encodeURIComponent(userId)}`);
                    if (currentUser?.id !== userId) return;
                    const signature = JSON.stringify([userId, orders]);
                    if (signature === orderSignature) return;
                    renderMyOrders(orders);
                    const key = getOrderHistoryKey();
                    if (key) { try { localStorage.setItem(key, JSON.stringify(orders)); } catch {} }
                    orderSignature = signature;
                })()
            ]);
        } finally { busy = false; }
    }
    window.setInterval(refresh, 4000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
})();
