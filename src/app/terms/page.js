// src/app/terms/page.js
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Scale, Shield } from 'lucide-react';

export default function TermsOfServicePage() {
  const lastUpdated = "January 21, 2025";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/auth/register"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-[#0CCE68] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to TechHub
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0CCE68] rounded-full mb-6">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 lg:p-12">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                By accessing and using TechHub (the "Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Platform Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                TechHub is a professional recruitment platform that connects technology professionals with employers. Our platform provides:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li>Job posting and application services</li>
                <li>Professional profile creation and management</li>
                <li>Communication tools between job seekers and employers</li>
                <li>Company profile and branding services</li>
                <li>Analytics and reporting tools</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. User Accounts and Registration
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">3.1 Account Creation</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">3.2 Account Types</h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-1">
                    <li><strong>Job Seeker Accounts:</strong> For individuals seeking employment opportunities</li>
                    <li><strong>Employer Accounts:</strong> For companies and organizations seeking to hire talent</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">3.3 Verification</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We may require verification of your identity or business credentials. Failure to provide accurate information may result in account suspension or termination.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. User Conduct and Content
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">4.1 Prohibited Content</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                    Users agree not to post, upload, or transmit content that:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-1">
                    <li>Is false, misleading, or fraudulent</li>
                    <li>Violates any laws or regulations</li>
                    <li>Infringes on intellectual property rights</li>
                    <li>Contains discriminatory language or content</li>
                    <li>Includes spam or unsolicited communications</li>
                    <li>Contains malicious code or security threats</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">4.2 Content Ownership</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    You retain ownership of content you submit but grant TechHub a license to use, display, and distribute such content for platform operations.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Services and Fees
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">5.1 Service Availability</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We strive to maintain platform availability but do not guarantee uninterrupted service. Scheduled maintenance and updates may temporarily affect access.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">5.2 Premium Services</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Certain premium features may require payment. All fees are non-refundable unless otherwise specified. We reserve the right to modify pricing with reasonable notice.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Privacy and Data Protection
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Your privacy is important to us. Please review our <Link href="/privacy" className="text-[#0CCE68] hover:text-[#364187] transition-colors">Privacy Policy</Link> to understand how we collect, use, and protect your personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Limitation of Liability
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                TechHub is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you have paid us in the past twelve months.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Termination
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We may terminate or suspend your account at any time for violations of these terms. You may terminate your account at any time by contacting support or using account deletion features.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. Modifications to Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notifications. Continued use of the platform constitutes acceptance of modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Governing Law and Disputes
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                These terms are governed by the laws of Kenya. Any disputes shall be resolved through binding arbitration in accordance with the Arbitration Act of Kenya.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. Contact Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> legal@techhub.co.ke<br />
                  <strong>Address:</strong> Nairobi, Kenya<br />
                  <strong>Phone:</strong> +254 700 000 000
                </p>
              </div>
            </section>

          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="mb-4 sm:mb-0">
            <Link
              href="/privacy"
              className="text-[#0CCE68] hover:text-[#364187] transition-colors font-medium"
            >
              View Privacy Policy →
            </Link>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Questions about these terms?
            </p>
            <a
              href="mailto:legal@techhub.co.ke"
              className="text-[#0CCE68] hover:text-[#364187] transition-colors font-medium"
            >
              Contact our legal team
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}