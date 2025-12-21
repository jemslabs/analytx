"use client";

export default function BrandDocsPage() {
  return (
    <section className="py-28 px-28 bg-muted">
      {/* Header */}
      <div className="mb-12 text-left">
        <h1 className="text-4xl font-bold mb-2">Brand Integration Docs</h1>
        <p className="text-lg text-muted-foreground">
          Track sales accurately by sending sale events to Analytx after creating campaigns and assigning products.
        </p>
      </div>

      {/* Overview */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-muted-foreground mb-2">
          Analytx allows brands to track sales from creators and campaigns. To ensure accurate tracking and security, sale events must be sent from your <strong>backend</strong>, never directly from the frontend.
        </p>
        <p className="text-muted-foreground mb-2">
          Each creator receives a referral link with a referral code, for example:
        </p>
        <pre className="bg-black text-white rounded-md p-4 text-sm overflow-x-auto">
{`https://yourbrand.com/product-page?ref=CREATOR123`}
        </pre>
        <p className="text-muted-foreground mb-2">
          Your backend should capture the <strong>referralCode</strong> and send verified sale events to Analytx securely.
        </p>
      </div>

      {/* Authorization */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
        <p className="text-muted-foreground mb-2">
          Analytx uses a <strong>custom API key header</strong> for authentication.
        </p>
        <p className="text-muted-foreground mb-2">
          Include your API key using the following request header:
        </p>
        <pre className="bg-black text-white rounded-md p-4 text-sm overflow-x-auto">
{`x-analytx-api-key: YOUR_API_KEY_HERE`}
        </pre>
        <p className="text-muted-foreground mt-2">
          Replace <code>YOUR_API_KEY_HERE</code> with the API key generated in your brand dashboard.
        </p>
        <p className="text-muted-foreground mt-2">
          <strong>Do not use the Authorization header.</strong> Requests using <code>Authorization</code> will be rejected.
        </p>
      </div>

      {/* Sending a Sale Event */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Sending a Sale Event</h2>
        <p className="text-muted-foreground mb-2">
          To record a sale, your backend must send a <code>POST</code> request to:
        </p>
        <pre className="bg-black text-white rounded-md p-4 text-sm overflow-x-auto">
{`POST https://tryanalytx.com/api/event/sale`}
        </pre>

        <p className="text-muted-foreground mb-2">
          Required request body fields:
        </p>
        <ul className="list-disc ml-6 text-muted-foreground mb-4">
          <li>
            <strong>referralCode</strong> – The creator’s referral code captured from the URL.
          </li>
          <li>
            <strong>skuId</strong> – SKU of the sold product (must belong to the campaign).
          </li>
          <li>
            <strong>salePrice</strong> – Final sale amount used for commission calculation.
          </li>
        </ul>

        <p className="text-muted-foreground mb-2">Example request:</p>
        <pre className="bg-black text-white rounded-md p-4 text-sm overflow-x-auto">
{`POST https://tryanalytx.com/api/event/sale
Headers:
  x-analytx-api-key: YOUR_API_KEY_HERE
  Content-Type: application/json

Body:
{
  "referralCode": "CREATOR123",
  "skuId": "SKU-001",
  "salePrice": 499
}`}
        </pre>

        <p className="text-muted-foreground">
          On success, the API responds with <code>"Sale recorded"</code>. Invalid API keys, referral codes, or SKUs will return an error.
        </p>
      </div>

      {/* Recommended Flow */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Recommended Flow</h2>
        <p className="text-muted-foreground mb-2">
          1. Creator shares a referral link: <code>https://yourbrand.com?ref=REFERRAL_CODE</code>
        </p>
        <p className="text-muted-foreground mb-2">
          2. Frontend captures the <strong>referralCode</strong> during checkout.
        </p>
        <p className="text-muted-foreground mb-2">
          3. Backend validates the purchase and sends the sale event to Analytx.
        </p>
        <p className="text-muted-foreground mb-2">
          4. Analytx tracks attribution, commissions, and analytics in real time.
        </p>
      </div>

      {/* Notes & Best Practices */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Notes & Best Practices</h2>
        <ul className="list-disc ml-6 text-muted-foreground">
          <li>Always send events from your backend.</li>
          <li>Never expose your API key in frontend code.</li>
          <li>Use custom headers only; avoid Authorization.</li>
          <li>Send sale events immediately after successful payment.</li>
          <li>Ensure products and referral codes belong to active campaigns.</li>
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
