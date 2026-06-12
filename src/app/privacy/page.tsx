export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-staxx-warm-bg py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6 text-sm leading-relaxed text-staxx-indigo">
        <h1 className="text-3xl font-bold font-display">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: June 12, 2026</p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">1. What We Collect</h2>
          <p>To provide Staxx, we collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account information:</strong> Email address and the US state you select for tax estimates. We do not require your real name, phone number, or physical address.</li>
            <li><strong>Financial data you upload:</strong> Screenshots, CSV files, and manually entered transaction data from your creator platform accounts.</li>
            <li><strong>Usage data:</strong> Basic analytics about how you use Staxx (pages visited, features used) to help us improve the product.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">2. What We Don&apos;t Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your real name (unless you choose to provide it)</li>
            <li>Your Social Security Number or tax ID</li>
            <li>Your bank account or payment card details (PayPal handles payments)</li>
            <li>Your creator platform passwords</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">3. How We Use Your Data</h2>
          <p>Your data is used exclusively to provide the Staxx service: analyzing your earnings, categorizing transactions, estimating taxes, and generating reports. We use AI (via DashScope / Alibaba Cloud) to process uploaded images and CSVs. Your data is never sold, rented, or shared with third parties for marketing purposes.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">4. Data Storage & Security</h2>
          <p>Your data is stored on Supabase (PostgreSQL) with encryption at rest. Uploaded images are stored in Supabase Storage. All data transmission uses TLS encryption. We implement reasonable security measures to protect your information, but no system is 100% secure.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">5. Third-Party Services</h2>
          <p>Staxx relies on the following third-party services:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Supabase:</strong> Database, authentication, and file storage</li>
            <li><strong>DashScope (Alibaba Cloud):</strong> AI image recognition and text analysis</li>
            <li><strong>PayPal:</strong> Payment processing for subscriptions</li>
            <li><strong>Vercel:</strong> Web hosting and deployment</li>
          </ul>
          <p>Each of these services has its own privacy policy and data handling practices.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">6. Data Deletion</h2>
          <p>You can delete individual uploads and their associated transactions at any time from the Dashboard. To delete your entire account and all associated data, email us at hello@staxx.app. We will complete the deletion within 7 days.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">7. Cookies</h2>
          <p>Staxx uses essential cookies for authentication (keeping you logged in). We do not use tracking cookies or advertising cookies.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">8. Children&apos;s Privacy</h2>
          <p>Staxx is not intended for users under 18 years of age. We do not knowingly collect data from minors.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">9. Contact</h2>
          <p>For privacy questions or data requests, email <a href="mailto:hello@staxx.app" className="text-staxx-purple underline">hello@staxx.app</a>.</p>
        </section>
      </div>
    </div>
  );
}
