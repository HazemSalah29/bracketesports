export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Refund Policy
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Our commitment to fair and transparent refund practices
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-slate-300 leading-7">
                At Bracket Esports, we strive to provide excellent service and fair tournament experiences. 
                This refund policy outlines when and how refunds are processed for tournament entry fees, 
                premium services, and other purchases made on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Tournament Entry Fees</h2>
              
              <div className="space-y-6">
                <div className="rounded-lg bg-slate-800 p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Before Tournament Starts</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    <li><strong>24+ hours before:</strong> Full refund (100%)</li>
                    <li><strong>2-24 hours before:</strong> Partial refund (75%)</li>
                    <li><strong>Less than 2 hours:</strong> No refund (tournament preparation costs)</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-slate-800 p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">After Tournament Starts</h3>
                  <p className="text-slate-300 mb-3">
                    Generally, no refunds are available once a tournament has begun. Exceptions include:
                  </p>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    <li>Technical issues preventing participation (full refund)</li>
                    <li>Tournament cancellation by organizers (full refund)</li>
                    <li>Verified cheating by opponents (case-by-case basis)</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-slate-800 p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Tournament Cancellations</h3>
                  <p className="text-slate-300 mb-3">
                    If a tournament is cancelled by the organizers or Bracket Esports:
                  </p>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    <li>Full refund of entry fees</li>
                    <li>Automatic processing within 3-5 business days</li>
                    <li>Email notification of refund status</li>
                    <li>Option to receive platform credits instead</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Premium Services</h2>
              <div className="space-y-4">
                <div className="bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Subscription Services</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Cancel anytime during billing period</li>
                    <li>No partial refunds for unused time</li>
                    <li>Access continues until end of billing period</li>
                    <li>No automatic renewals after cancellation</li>
                  </ul>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">One-time Purchases</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>14-day money-back guarantee</li>
                    <li>Must be unused/unactivated</li>
                    <li>Refund to original payment method</li>
                    <li>Processing time: 5-10 business days</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Refund Process</h2>
              <div className="space-y-4">
                <div className="bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">How to Request a Refund</h3>
                  <ol className="list-decimal list-inside text-slate-300 space-y-2">
                    <li>Contact our support team via email or support ticket</li>
                    <li>Provide your order/transaction ID</li>
                    <li>Specify the reason for your refund request</li>
                    <li>Allow 1-2 business days for review</li>
                    <li>Receive confirmation and processing timeline</li>
                  </ol>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Processing Times</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Credit/Debit Cards</h4>
                      <p className="text-slate-300 text-sm">3-5 business days</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">PayPal</h4>
                      <p className="text-slate-300 text-sm">1-2 business days</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Bank Transfer</h4>
                      <p className="text-slate-300 text-sm">5-10 business days</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Platform Credits</h4>
                      <p className="text-slate-300 text-sm">Instant</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Non-Refundable Items</h2>
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <p className="text-red-200 mb-4">
                  <strong>The following items are not eligible for refunds:</strong>
                </p>
                <ul className="list-disc list-inside text-red-200 space-y-1">
                  <li>Tournament entries where you were disqualified for rule violations</li>
                  <li>Completed tournaments (win or lose)</li>
                  <li>Digital items already consumed or activated</li>
                  <li>Services used beyond the trial period</li>
                  <li>Purchases made using promotional credits</li>
                  <li>Third-party service fees</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Dispute Resolution</h2>
              <p className="text-slate-300 leading-7 mb-4">
                If you disagree with a refund decision, you may:
              </p>
              <div className="space-y-4">
                <div className="bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Appeal Process</h3>
                  <ol className="list-decimal list-inside text-slate-300 space-y-1">
                    <li>Submit an appeal within 30 days of the decision</li>
                    <li>Provide additional evidence or documentation</li>
                    <li>Appeals are reviewed by senior support staff</li>
                    <li>Final decision communicated within 5 business days</li>
                  </ol>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">External Dispute Resolution</h3>
                  <p className="text-slate-300">
                    For unresolved disputes, you may contact your payment provider or pursue resolution 
                    through small claims court in accordance with our Terms of Service.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Special Circumstances</h2>
              <div className="space-y-4">
                <div className="bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Technical Issues</h3>
                  <p className="text-slate-300">
                    If technical problems prevent you from participating in a tournament, we will investigate 
                    and provide appropriate compensation, which may include full refunds or tournament credits.
                  </p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Medical Emergencies</h3>
                  <p className="text-slate-300">
                    We understand that emergencies happen. Contact our support team with documentation, 
                    and we will review each case individually for possible exceptions to our standard policy.
                  </p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Account Violations</h3>
                  <p className="text-slate-300">
                    Users banned for Terms of Service violations forfeit all paid fees and are not eligible 
                    for refunds on any platform services or tournament entries.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p className="text-slate-300 leading-7 mb-4">
                For refund requests or questions about this policy:
              </p>
              <div className="bg-slate-800 p-6 rounded-lg">
                <div className="space-y-2">
                  <p className="text-slate-300"><strong>Email:</strong> refunds@bracketesports.com</p>
                  <p className="text-slate-300"><strong>Support Portal:</strong> Available in your account dashboard</p>
                  <p className="text-slate-300"><strong>Response Time:</strong> Within 24 hours</p>
                  <p className="text-slate-300"><strong>Phone:</strong> +1 (555) 123-4567 (Business hours: 9 AM - 6 PM PST)</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Policy Updates</h2>
              <p className="text-slate-300 leading-7">
                This refund policy may be updated from time to time. Changes will be posted on this page 
                and users will be notified of significant changes via email. Continued use of our platform 
                after changes constitute acceptance of the updated policy.
              </p>
            </section>

            <div className="bg-slate-800 p-6 rounded-lg text-center">
              <p className="text-slate-400 text-sm">
                Last updated: January 10, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
