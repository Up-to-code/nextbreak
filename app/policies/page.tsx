"use client";
import React from "react";
import { useRouter } from "next/navigation";

const PoliciesPage = () => {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center min-h-[calc(100vh-80px)] px-4 py-12 sm:px-6 lg:px-8 ">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Main content container */}
      <div className="relative w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-black px-6 py-4">
          <h1 className="text-2xl font-semibold text-white text-center">
            Policies & Terms
          </h1>
        </div>

        {/* Content with tabs */}
        <div className="p-6 sm:p-8">
          <div className="flex border-b border-gray-200 mb-6">
            <button className="px-4 py-2 font-medium text-gray-900 border-b-2 border-black">
              Privacy Policy
            </button>
            <button className="px-4 py-2 font-medium text-gray-500 hover:text-gray-700">
              Terms of Service
            </button>
          </div>

          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-lg font-medium text-gray-900">
                1. Information We Collect
              </h2>
              <p>
                We collect information you provide directly, including name,
                email, and payment details when you make a purchase. We
                automatically collect usage data through cookies and similar
                technologies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900">
                2. How We Use Information
              </h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide and maintain our services</li>
                <li>Process transactions</li>
                <li>Improve user experience</li>
                <li>Communicate with you</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900">
                3. Data Sharing
              </h2>
              <p>
                We do not sell your personal data. We may share information
                with:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Payment processors</li>
                <li>Service providers (hosting, analytics)</li>
                <li>Legal authorities when required</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900">
                4. Your Rights
              </h2>
              <p>
                You may request access, correction, or deletion of your personal
                data by contacting us at privacy@yourcompany.com.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900">
                5. Changes to This Policy
              </h2>
              <p>
                We may update this policy periodically. The updated version will
                be posted on this page with a new effective date.
              </p>
            </section>

            <div className="pt-6 mt-6 border-t border-gray-200 text-sm">
              <p>
                <strong>Effective Date:</strong>{" "}
                {new Date().toLocaleDateString()}
              </p>
              <p>
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Contact for Questions
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </p>
    </div>
  );
};

export default PoliciesPage;
