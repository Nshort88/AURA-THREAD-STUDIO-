let products = [];
let cart = JSON.parse(localStorage.getItem('cart_items') || '[]');

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const closeDrawer = document.getElementById('close-drawer');
const drawerItems = document.getElementById('drawer-items');
const drawerTotal = document.getElementById('drawer-total');
const cartCount = document.getElementById('cart-count');
const drawerCount = document.getElementById('drawer-count');
const checkoutBtn = document.getElementById('checkout-btn');

// Fetch Products & Config
async function initStore() {
  try {
    const res = await fetch('/api/products');
    products = await res.json();
    renderProducts();
    updateCartUI();
  } catch (err) {
    console.error('Error loading catalog:', err);
    productsGrid.innerHTML = '<p class="error-msg">Failed to load catalog. Please check server.</p>';
  }
}

// Render Products Grid
function renderProducts() {
  if (!products || !products.length) {
    productsGrid.innerHTML = '<p>No products available.</p>';
    return;
  }

  productsGrid.innerHTML = products.map(prod => `
    <div class="product-card" id="card-${prod.id}">
      <div class="product-img-wrap">
        <img src="${prod.image}" alt="${prod.name}" loading="lazy">
      </div>
      <div class="product-body">
        <div class="product-tagline">${prod.tagline}</div>
        <h3 class="product-title">${prod.name}</h3>
        <div class="product-price">$${(prod.price / 100).toFixed(2)}</div>

        <div class="product-options">
          ${prod.sizes && prod.sizes.length > 1 ? `
            <div>
              <div class="option-label">Size</div>
              <div class="pill-group" data-type="size" data-product="${prod.id}">
                ${prod.sizes.map((s, idx) => `
                  <button type="button" class="pill-btn ${idx === 0 ? 'active' : ''}" onclick="selectOption('${prod.id}', 'size', '${s}', this)">${s}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${prod.colors && prod.colors.length > 1 ? `
            <div>
              <div class="option-label">Color</div>
              <div class="pill-group" data-type="color" data-product="${prod.id}">
                ${prod.colors.map((c, idx) => `
                  <button type="button" class="pill-btn ${idx === 0 ? 'active' : ''}" onclick="selectOption('${prod.id}', 'color', '${c}', this)">${c}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <button class="add-to-cart-btn" onclick="addToCart('${prod.id}')">
          Add to Bag • $${(prod.price / 100).toFixed(2)}
        </button>
      </div>
    </div>
  `).join('');
}

// State for active selections
const selections = {};

window.selectOption = function(productId, optionType, value, buttonEl) {
  if (!selections[productId]) selections[productId] = {};
  selections[productId][optionType] = value;

  const parent = buttonEl.closest('.pill-group');
  parent.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
  buttonEl.classList.add('active');
};

// Add to Cart
window.addToCart = function(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  const currentSelection = selections[productId] || {};
  const size = currentSelection.size || (prod.sizes ? prod.sizes[0] : 'Standard');
  const color = currentSelection.color || (prod.colors ? prod.colors[0] : 'Default');

  const cartItemId = `${productId}-${size}-${color}`;
  const existing = cart.find(item => item.cartItemId === cartItemId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      cartItemId,
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      size,
      color,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
};

window.removeFromCart = function(cartItemId) {
  cart = cart.filter(item => item.cartItemId !== cartItemId);
  saveCart();
  updateCartUI();
};

function saveCart() {
  localStorage.setItem('cart_items', JSON.stringify(cart));
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  cartCount.textContent = totalCount;
  drawerCount.textContent = totalCount;
  drawerTotal.textContent = `$${(totalPrice / 100).toFixed(2)}`;

  if (cart.length === 0) {
    drawerItems.innerHTML = '<div style="text-align: center; color: #888; padding: 40px 0;">Your shopping bag is empty.</div>';
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = '0.5';
    return;
  }

  checkoutBtn.disabled = false;
  checkoutBtn.style.opacity = '1';

  drawerItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-meta">${item.color} • ${item.size} • Qty: ${item.quantity}</div>
        <div class="cart-item-price">$${((item.price * item.quantity) / 100).toFixed(2)}</div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.cartItemId}')">Remove</button>
      </div>
    </div>
  `).join('');
}

function openCartDrawer() {
  cartDrawer.classList.add('open');
}

function closeCartDrawer() {
  cartDrawer.classList.remove('open');
}

// Event Listeners
cartBtn.addEventListener('click', openCartDrawer);
closeDrawer.addEventListener('click', closeCartDrawer);
drawerOverlay.addEventListener('click', closeCartDrawer);

// Checkout Action
checkoutBtn.addEventListener('click', async () => {
  if (!cart.length) return;

  checkoutBtn.textContent = 'Preparing Secure Stripe Checkout...';
  checkoutBtn.disabled = true;

  try {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map(i => ({
          id: i.id,
          quantity: i.quantity,
          size: i.size,
          color: i.color
        }))
      })
    });

    const data = await res.json();

    if (data.url) {
      // Redirect to real Stripe Hosted Checkout
      window.location.href = data.url;
    } else if (data.demoMode) {
      // Demo simulated checkout
      alert(`[DEMO MODE ACTIVATED]\n\n${data.message}\nTotal: $${data.orderSummary.totalAmount} ${data.orderSummary.currency}\n\nRedirecting to order confirmation...`);
      localStorage.removeItem('cart_items');
      window.location.href = data.successUrl;
    } else {
      throw new Error(data.error || 'Failed to initialize checkout');
    }
  } catch (err) {
    alert(`Checkout failed: ${err.message}`);
    checkoutBtn.textContent = 'Proceed to Secure Checkout';
    checkoutBtn.disabled = false;
  }
});

// Init
initStore();
