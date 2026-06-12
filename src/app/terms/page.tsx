export default function TermsPage() {
  return (
    <div className="min-h-screen bg-staxx-warm-bg py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6 text-sm leading-relaxed text-staxx-indigo">
        <h1 className="text-3xl font-bold font-display">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: June 12, 2026</p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">1. What Staxx Is</h2>
          <p>Staxx is a financial data organization tool for independent content creators. We help you import, categorize, and export your earnings and expenses for tax preparation purposes.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">2. Not Legal or Tax Advice</h2>
          <p><strong>Staxx does not provide legal advice, tax advice, or financial advice.</strong> All information, AI-generated insights, tax estimates, and reports are for informational purposes only. You should always consult a licensed CPA or tax professional before filing taxes or making financial decisions. Staxx is not responsible for any errors, omissions, or inaccuracies in the data you provide or the AI-generated analysis.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">3. Your Account</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information and to not use Staxx for any illegal purpose. We reserve the right to terminate accounts that violate these terms.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">4. Your Data</h2>
          <p>You retain all rights to the financial data you upload. By using Staxx, you grant us a limited license to process and store your data solely for the purpose of providing the service. We do not sell, share, or use your financial data for any other purpose. See our Privacy Policy for details.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">5. Subscription & Payment</h2>
          <p>Staxx offers 3 free analyzes for new users. After that, continued use requires a Pro subscription at $19.99/month or $199/year. Payments are processed through PayPal. You may cancel at any time — cancellation takes effect at the end of your current billing period. No refunds for partial months.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">6. Limitation of Liability</h2>
          <p>Staxx is provided &ldquo;as is&rdquo; without warranties of any kind. To the fullest extent permitted by law, Staxx shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service, including but not limited to tax penalties, audit costs, or lost revenue.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">7. Changes</h2>
          <p>We may update these terms from time to time. Continued use of Staxx after changes means you accept the new terms.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">8. Contact</h2>
          <p>Questions? Email us at <a href="mailto:hello@staxx.app" className="text-staxx-purple underline">hello@staxx.app</a>.</p>
        </section>
      </div>
    </div>
  );
}
