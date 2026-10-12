# AURA & THREAD STUDIO — Production-Ready Dropship & Print-on-Demand Store

A high-converting, responsive eCommerce storefront engineered to start taking live payments and fulfilling print-on-demand orders **today**.

---

## ⚡ Quick Start (Launch in 2 Minutes)

### 1. Install Dependencies
```bash
cd /Users/nickolasshort/.gemini/antigravity/scratch/live-store
npm install
```

### 2. Configure Your Stripe Keys (To Make Money Today)
Create a `.env` file from the provided `.env.example`:
```bash
cp .env.example .env
```
Open `.env` and fill in your keys from your [Stripe Dashboard](https://dashboard.stripe.com/apikeys):
```env
PORT=3000
STORE_NAME="AURA & THREAD STUDIO"

# For LIVE real money sales, use your live keys:
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```
*(Note: If you leave keys unset or use test keys `pk_test_...`, the store seamlessly runs in Interactive Demo/Test Mode so you can preview the full cart-to-checkout flow without charging real cards).*

### 3. Launch Store
```bash
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🏗️ Architecture & What Was Built

| File | Purpose |
| :--- | :--- |
| [`server.js`](file:///Users/nickolasshort/.gemini/antigravity/scratch/live-store/server.js) | Express backend managing the catalog API and Stripe Checkout Session creation. |
| [`products.json`](file:///Users/nickolasshort/.gemini/antigravity/scratch/live-store/products.json) | Product catalog with retail pricing, variants (sizes, colors), specs, and image assets. |
| [`public/index.html`](file:///Users/nickolasshort/.gemini/antigravity/scratch/live-store/public/index.html) | High-converting storefront featuring collection hero, trust badges, and slide-out cart drawer. |
| [`public/style.css`](file:///Users/nickolasshort/.gemini/antigravity/scratch/live-store/public/style.css) | Modern typography and responsive layout optimized for desktop and mobile shoppers. |
| [`public/app.js`](file:///Users/nickolasshort/.gemini/antigravity/scratch/live-store/public/app.js) | Client cart engine with variant selectors, local storage persistence, and Stripe redirect handler. |
| [`public/success.html`](file:///Users/nickolasshort/.gemini/antigravity/scratch/live-store/public/success.html) | Branded post-purchase confirmation page with fulfillment status. |

---

## 📦 How to Fulfill Orders via Printify (Zero Inventory Required)

When a customer buys an item:
1. **Payment arrives instantly** into your Stripe account balance.
2. In Printify (or Printful):
   - **Option A (Manual 2-click fulfillment for Day 1)**: Go to **Printify > Orders > Create Order**, select the ordered item/size/color, paste the customer's shipping address from Stripe, and click **Submit Order**. Printify charges the wholesale cost to your card and ships tracking directly to your customer.
   - **Option B (Fully Automated via Shopify/Webhook)**: Connect Printify to automatically auto-approve and fulfill incoming orders without touching anything.

### Product Profit Margins Configured:
- **Heavyweight Tee**: Retail **$38.00** | Wholesale Printify: ~$14.00 | **Net Margin: ~$24.00 (63%)**
- **Embroidered CloudFleece Hoodie**: Retail **$68.00** | Wholesale Printify: ~$29.00 | **Net Margin: ~$39.00 (57%)**
- **Ceramic Coffee Tumbler**: Retail **$24.00** | Wholesale Printify: ~$8.50 | **Net Margin: ~$15.50 (64%)**
- **Heavy Canvas Utility Tote**: Retail **$29.00** | Wholesale Printify: ~$11.00 | **Net Margin: ~$18.00 (62%)**

---

## 🌐 Deploying to the Public Internet Today

To let customers outside your local computer purchase right away:

### Option 1: Instant Tunnel (Zero deploy required)
Run Cloudflare Tunnel or ngrok to get a secure public URL immediately:
```bash
npx localtunnel --port 3000
# or
cloudflared tunnel --url http://localhost:3000
```

### Option 2: 1-Click Free Cloud Deployment (Vercel / Render / Railway)
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Launch dropship storefront"
   ```
2. Link your repo on [Render.com](https://render.com) or [Railway.app](https://railway.app), set `npm start`, and add your `STRIPE_SECRET_KEY` in their environment variables.

---

## 🚀 Day-1 Traffic Strategy to Make Money Today

1. **Short-Form Video (TikTok / IG Reels / YouTube Shorts)**:
   - Record an aesthetic 7-second clip or screen recording showcasing the product styling.
   - Add text hook: *"Found the cleanest minimalist heavyweight tee"* with link in bio.
2. **Reddit / Subreddit Showcases**:
   - Post in niche communities (e.g., streetwear, productivity setups, coffee enthusiasts) asking for genuine design feedback with the live link.
3. **Direct DM / Outreach**:
   - Share directly with friends, colleagues, or community groups offering a launch discount code.
