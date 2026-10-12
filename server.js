require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stripe if key is provided
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('your_live_or_test_key_here')) {
  try {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  } catch (err) {
    console.error('Failed to initialize Stripe:', err.message);
  }
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Read products
const getProducts = () => {
  const data = fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8');
  return JSON.parse(data);
};

// API: Get products catalog
app.get('/api/products', (req, res) => {
  res.json(getProducts());
});

// API: Store config (stripe public key, mode)
app.get('/api/config', (req, res) => {
  res.json({
    stripeConfigured: !!stripe,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    storeName: process.env.STORE_NAME || 'AURA & THREAD STUDIO',
    currency: 'usd'
  });
});

// API: Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items, customerEmail } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const catalog = getProducts();
    const line_items = [];

    for (const item of items) {
      const product = catalog.find((p) => p.id === item.id);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.id} not found` });
      }

      line_items.push({
        price_data: {
          currency: product.currency,
          product_data: {
            name: `${product.name} (${item.color || 'Default'} / ${item.size || 'Standard'})`,
            images: [product.image],
            description: product.tagline
          },
          unit_amount: product.price
        },
        quantity: item.quantity || 1
      });
    }

    const host = req.get('host');
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    if (!stripe) {
      // Demo / simulated checkout mode when Stripe key isn't provided yet
      return res.json({
        demoMode: true,
        message: 'Stripe API key not yet configured in .env. Running in interactive demo mode!',
        orderSummary: {
          itemsCount: items.reduce((acc, cur) => acc + (cur.quantity || 1), 0),
          totalAmount: (line_items.reduce((acc, cur) => acc + cur.price_data.unit_amount * cur.quantity, 0) / 100).toFixed(2),
          currency: 'USD'
        },
        successUrl: `${baseUrl}/success.html?demo=true`
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR']
      },
      line_items,
      mode: 'payment',
      customer_email: customerEmail || undefined,
      success_url: `${baseUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/index.html?canceled=true`
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Storefront is running live on: http://localhost:${PORT}`);
  console.log(`💳 Stripe Status: ${stripe ? 'CONNECTED (Live/Test Ready)' : 'DEMO MODE (Set STRIPE_SECRET_KEY in .env)'}`);
});
