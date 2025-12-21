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
          Analytx allows brands to track sales from creators and campaigns. To ensure accurate tracking and security, sale events must be sent from your <strong>backend</strong> rather than directly from the frontend.
        </p>
        <p className="text-muted-foreground mb-2">
          Each creator receives a referral link with a referral code, e.g.:
        </p>
        <pre className="bg-black text-white rounded-md p-4 text-sm overflow-x-auto">
          {`https://yourbrand.com/product-page?ref=CREATOR123`}
        </pre>
        <p className="text-muted-foreground mb-2">
          Your backend should capture the <strong>referralCode</strong> from incoming requests and forward sale events to Analytx securely.
        </p>
      </div>

      {/* Authorization */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Authorization</h2>
        <p className="text-muted-foreground mb-2">
          Include your API key in the request header using the <code>Authorization</code> field:
        </p>
        <pre className="bg-black text-white rounded-md p-4 text-sm overflow-x-auto">
          {`Authorization: Bearer YOUR_API_KEY_HERE`}
        </pre>
        <p className="text-muted-foreground mt-2">
          Replace <code>YOUR_API_KEY_HERE</code> with the key provided in your brand dashboard. Requests without a valid API key will be rejected.
        </p>
      </div>

      {/* Sending a Sale Event */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Sending a Sale Event</h2>
        <p className="text-muted-foreground mb-2">
          To record a sale, your backend should send a <code>POST</code> request to the Sale Event API endpoint:
        </p>
        <pre className="bg-black text-white rounded-md p-4 text-sm overflow-x-auto">
          {`POST https://tryanalytx.com/api/event/sale`}
        </pre>

        <p className="text-muted-foreground mb-2">
          The request body must include the following fields:
        </p>
        <ul className="list-disc ml-6 text-muted-foreground mb-4">
          <li>
            <strong>referralCode</strong> – The referral code assigned to the creator. Capture this code from the referral URL when the user lands on your site.
          </li>
          <li>
            <strong>skuId</strong> – The SKU ID of the product sold. This product must have been added to the campaign in your dashboard.
          </li>
          <li>
            <strong>salePrice</strong> – The sale amount in the campaign’s currency. Used to calculate commissions and campaign metrics.
          </li>
        </ul>

        <p className="text-muted-foreground mb-2">
          Example request:
        </p>
        <pre className="bg-black text-white rounded-md p-4 text-sm overflow-x-auto">
          {`POST https://tryanalytx.com/api/event/sale
            Headers:
              Authorization: Bearer YOUR_API_KEY_HERE
              Content-Type: application/json

            Body:
            {
              "referralCode": "CREATOR123",
              "skuId": "SKU-001",
              "salePrice": 499
            }`}
        </pre>

        <p className="text-muted-foreground">
          On success, the API will respond with: <code>"Sale Recorded"</code>. Requests with invalid referral codes, SKU IDs, or API keys will return an error.
        </p>
      </div>

      {/* Recommended Flow */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Recommended Flow</h2>
        <p className="text-muted-foreground mb-2">
          1. Creator shares their referral link: <code>https://yourbrand.com?ref=REFERRAL_CODE</code>
        </p>
        <p className="text-muted-foreground mb-2">
          2. Your frontend captures the <strong>referralCode</strong> from the URL when a purchase is initiated.
        </p>
        <p className="text-muted-foreground mb-2">
          3. Your backend validates the sale (product, price, inventory, etc.) and sends the sale event to Analytx API securely.
        </p>
        <p className="text-muted-foreground mb-2">
          4. Analytx tracks the sale, calculates commissions, and updates analytics in real-time.
        </p>
      </div>

      {/* Notes & Best Practices */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Notes & Best Practices</h2>
        <ul className="list-disc ml-6 text-muted-foreground">
          <li>Never send API requests directly from frontend; always use your backend.</li>
          <li>Keep your API key secure; do not expose it in client-side code.</li>
          <li>Send sale events immediately after purchase for accurate reporting.</li>
          <li>Verify that <strong>referralCode</strong> matches the assigned creator.</li>
          <li>Ensure <strong>skuId</strong> matches the product in the campaign.</li>
          <li>All sale amounts should be in the currency defined for the campaign (default is INR).</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center text-muted-foreground">
        <p>
          For further details, visit your dashboard or contact support at{" "}
          <a href="mailto:jems.analytx@gmail.com" className="text-primary">
            jems.analytx@gmail.com
          </a>.
        </p>
      </div>
    </section>
  );
}
