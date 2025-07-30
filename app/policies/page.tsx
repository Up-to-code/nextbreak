'use client'

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f9] text-black py-12 px-6 md:px-16 font-mono">
      <section className="max-w-5xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-6 md:p-12 space-y-12">

        <h1 className="text-4xl md:text-6xl font-bold uppercase border-b-4 border-black pb-4">
          Policies
        </h1>

        {/* Privacy Policy */}
        <div>
          <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-2">Privacy Policy</h2>
          <p className="text-base leading-relaxed">
            We value your privacy. Any data you share with us is securely stored and never sold or shared with third parties. 
            We use cookies for basic site functionality and analytics.
          </p>
        </div>

        {/* Return Policy */}
        <div>
          <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-2">Return Policy</h2>
          <p className="text-base leading-relaxed">
            Returns are accepted within 14 days of delivery. Items must be in original condition with all tags and packaging.
            Buyer is responsible for return shipping unless the item is defective.
          </p>
        </div>

        {/* Shipping Policy */}
        <div>
          <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-2">Shipping Policy</h2>
          <p className="text-base leading-relaxed">
            We ship within 2–3 business days from order confirmation. Free shipping is available for orders over EGP 1000.
            You will receive tracking details by email once the item ships.
          </p>
        </div>

        {/* Terms and Conditions */}
        <div>
          <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-2">Terms & Conditions</h2>
          <p className="text-base leading-relaxed">
            By using this site, you agree to all terms including but not limited to use of information, intellectual property, 
            and order compliance. We reserve the right to update terms at any time without prior notice.
          </p>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-gray-500 pt-6 border-t-4 border-black">
          Last updated: July 2025. For questions, contact support@example.com.
        </p>
      </section>
    </main>
  )
}
