"use client";

export default function BrandDocsPage() {
  return (
    <section className="py-28 px-28 bg-muted">
      {/* Header */}
      <div className="mb-12 text-left">
        <h1 className="text-4xl font-bold mb-2">Brand Integration Docs</h1>
        <p className="text-lg text-muted-foreground">
          Track real sales from creators using Analytx with a simple script integration.
        </p>
      </div>

      {/* Overview */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-muted-foreground mb-2">
          Analytx helps you track which creators actually drive revenue. You do not need complex backend integrations.
        </p>
        <p className="text-muted-foreground mb-2">
          Creators share referral links like:
        </p>
        <pre className="bg-black text-white rounded-md p-4 text-sm overflow-x-auto">
{`https://yourbrand.com/product?ref=CREATOR123`}
        </pre>
        <p className="text-muted-foreground">
          Analytx automatically captures this referral and attributes the sale when a purchase is completed.
        </p>
      </div>

      {/* Step 1 */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Step 1: Add Tracking Script</h2>
        <p className="text-muted-foreground mb-2">
          Add the Analytx script to your website (preferably in the global layout or <code>{"<head>"}</code> section):
        </p>

        <pre className="bg-black text-white rounded-md p-4 text-sm overflow-x-auto">
{`<script src="https://tryanalytx.com/tracker.js" 
        data-api-key="YOUR_API_KEY">
</script>`}
        </pre>

        <p className="text-muted-foreground mt-2">
          Replace <code>YOUR_API_KEY</code> with your API key from the dashboard.
        </p>
      </div>

      {/* Step 2 */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Step 2: Track Sale</h2>
        <p className="text-muted-foreground mb-2">
          Call <code>Analytx.trackSale()</code> only after a successful purchase (on your order confirmation / thank-you page).
        </p>

        <pre className="bg-black text-white rounded-md p-4 text-sm overflow-x-auto">
{`<script>
Analytx.trackSale({
  skuId: "SKU-001",
  salePrice: 499
});
</script>`}
        </pre>

        <p className="text-muted-foreground mt-2">
          Required fields:
        </p>
        <ul className="list-disc ml-6 text-muted-foreground">
          <li><strong>skuId</strong> – Product SKU</li>
          <li><strong>salePrice</strong> – Final amount paid</li>
        </ul>
      </div>

      {/* How It Works */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>

        <p className="text-muted-foreground mb-2">
          1. Creator shares referral link
        </p>
        <p className="text-muted-foreground mb-2">
          2. User visits your site → Analytx stores the referral automatically
        </p>
        <p className="text-muted-foreground mb-2">
          3. User completes purchase
        </p>
        <p className="text-muted-foreground mb-2">
          4. You call <code>Analytx.trackSale()</code>
        </p>
        <p className="text-muted-foreground mb-2">
          5. Analytx attributes the sale to the correct creator and campaign
        </p>
      </div>

      {/* Important Rules */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Important Rules</h2>
        <ul className="list-disc ml-6 text-muted-foreground">
          <li>
            Only call <code>Analytx.trackSale()</code> after a successful payment
          </li>
          <li>
            Do not call it on button click or before order confirmation
          </li>
          <li>
            Call it once per order
          </li>
          <li>
            Ensure correct <code>skuId</code> and <code>salePrice</code>
          </li>
        </ul>
      </div>

      {/* Example Integrations */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Example Integrations</h2>

        <p className="text-muted-foreground mb-2">
          Shopify / WooCommerce / Custom apps all follow the same rule:
        </p>

        <pre className="bg-black text-white rounded-md p-4 text-sm overflow-x-auto">
{`// Call this on order success page
Analytx.trackSale({
  skuId: order.sku,
  salePrice: order.total
});`}
        </pre>
      </div>

      {/* Notes */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Notes</h2>
        <ul className="list-disc ml-6 text-muted-foreground">
          <li>No backend integration required</li>
          <li>No manual referral handling needed</li>
          <li>Analytx automatically manages attribution</li>
          <li>Works across Shopify, WooCommerce, Webflow, and custom sites</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center text-muted-foreground">
        <p>
          For support, contact{" "}
          <a href="mailto:jems.analytx@gmail.com" className="text-primary">
            jems.analytx@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}