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
          Analytx allows brands to send <strong>sale events</strong> from their frontend or backend to track purchases, calculate commissions, and measure campaign performance.
        </p>
        <p className="text-muted-foreground mb-2">
          <strong>Important:</strong> Sale events are only valid if:
        </p>
        <ul className="list-disc ml-6 text-muted-foreground mb-2">
          <li>The brand has created a campaign in their dashboard.</li>
          <li>The product sold has been added to the campaign with a valid <strong>SKU ID</strong>.</li>
          <li>The creator involved has an assigned <strong>referral code</strong> for the campaign.</li>
        </ul>
        <p className="text-muted-foreground">
          Each brand receives a <strong>unique API key</strong> for authenticating requests.
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
          To record a sale, send a <code>POST</code> request to the Sale Event API endpoint:
        </p>
        <pre className="bg-black text-white rounded-md p-4 text-sm overflow-x-auto">
          {`POST https://analytx.shop/api/event/sale`}
        </pre>

        <p className="text-muted-foreground mb-2">
          The request body must include the following fields:
        </p>
        <ul className="list-disc ml-6 text-muted-foreground mb-4">
          <li>
            <strong>referralCode</strong> – The referral code assigned to the creator for this campaign. Must match an active campaign member's code.
          </li>
          <li>
            <strong>skuId</strong> – The SKU ID of the product sold. This product must have been added to the campaign in the dashboard.
          </li>
          <li>
            <strong>salePrice</strong> – The sale amount in the campaign’s currency. This value is used to calculate commissions and campaign metrics.
          </li>
        </ul>

        <p className="text-muted-foreground mb-2">Example request:</p>
        <pre className="bg-black text-white rounded-md p-4 text-sm overflow-x-auto">
          {`POST https://analytx.shop/api/event/sale
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
          On success, the API will respond with a success message: <code>"Sale Recorded"</code>.
          Requests with invalid referral codes, SKU IDs, or API keys will return an error.
        </p>

      </div>

      {/* Notes & Best Practices */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Notes & Best Practices</h2>
        <ul className="list-disc ml-6 text-muted-foreground">
          <li>Keep your API key secure; do not expose it in client-side code.</li>
          <li>Send sale events immediately after a purchase to ensure accurate reporting.</li>
          <li>Verify that <strong>referralCode</strong> matches the assigned creator for the campaign.</li>
          <li>Ensure <strong>skuId</strong> matches the product added to the campaign.</li>
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
