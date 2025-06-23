// src/app/privacy/page.js
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Shield, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 21, 2025";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/"
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
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Privacy Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <Lock className="w-8 h-8 text-[#0CCE68] mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data Security</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your data is encrypted and protected with industry-standard security measures
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <Eye className="w-8 h-8 text-[#0CCE68] mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Transparency</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We're clear about what data we collect and how we use it
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <Database className="w-8 h-8 text-[#0CCE68] mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Your Control</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You can access, update, or delete your personal information anytime
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 lg:p-12">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                TechHub ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our recruitment platform located at techhub.co.ke (the "Platform"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access or use the Platform.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                This policy applies to all users of our Platform, including job seekers, employers, and visitors. We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Information We Collect
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.1 Personal Information You Provide</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    We collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Create an account:</strong> Name, email address, password, phone number, and account type (job seeker or employer)</li>
                    <li><strong>Complete your profile:</strong> Professional experience, education, skills, certifications, career preferences, salary expectations, and availability</li>
                    <li><strong>Upload documents:</strong> Resume, cover letters, portfolio items, and other supporting documents</li>
                    <li><strong>Post job listings:</strong> Job descriptions, requirements, company information, and compensation details</li>
                    <li><strong>Communicate on the platform:</strong> Messages, comments, and other communications with other users</li>
                    <li><strong>Make payments:</strong> Payment information for premium services (processed securely through third-party payment processors)</li>
                    <li><strong>Contact support:</strong> Information provided in support requests and feedback</li>
                    <li><strong>Participate in surveys:</strong> Responses to optional surveys and research studies</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.2 Information Automatically Collected</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    When you access and use our Platform, we automatically collect certain information about your device and usage patterns:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Device Information:</strong> Device type, operating system, browser type and version, screen resolution, and device identifiers</li>
                    <li><strong>Usage Data:</strong> Pages visited, time spent on pages, clicks, search queries, and navigation patterns</li>
                    <li><strong>Log Information:</strong> IP address, access times, referring URLs, and error logs</li>
                    <li><strong>Location Data:</strong> Approximate location based on IP address (precise location only with your explicit consent)</li>
                    <li><strong>Performance Data:</strong> Platform performance metrics and crash reports to improve our services</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.3 Information from Third Parties</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    We may receive information about you from third parties, including:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Social Media Platforms:</strong> Profile information when you connect your LinkedIn, Google, or other social media accounts</li>
                    <li><strong>Professional Networks:</strong> Publicly available professional information from platforms like LinkedIn</li>
                    <li><strong>Background Check Providers:</strong> Verification information (only with your explicit consent and for specific job applications)</li>
                    <li><strong>Educational Institutions:</strong> Degree and certification verification data</li>
                    <li><strong>Previous Employers:</strong> Reference information and employment verification (with your consent)</li>
                    <li><strong>Data Enrichment Services:</strong> Additional professional information to enhance your profile (with your consent)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.4 Cookies and Tracking Technologies</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    We use various tracking technologies to collect information:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for basic platform functionality, security, and user authentication</li>
                    <li><strong>Functional Cookies:</strong> Remember your preferences, settings, and login status</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
                    <li><strong>Marketing Cookies:</strong> Used for targeted advertising and measuring campaign effectiveness (with your consent)</li>
                    <li><strong>Web Beacons:</strong> Small graphics that help us track email open rates and user engagement</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. How We Use Your Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.1 Core Platform Services</h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Account Management:</strong> Creating, maintaining, and securing your user account</li>
                    <li><strong>Job Matching:</strong> Connecting job seekers with relevant opportunities based on skills, experience, and preferences</li>
                    <li><strong>Application Processing:</strong> Facilitating job applications and managing the hiring workflow</li>
                    <li><strong>Communication:</strong> Enabling messaging between employers and job seekers</li>
                    <li><strong>Profile Display:</strong> Showing your profile to relevant employers (job seekers) or displaying job postings (employers)</li>
                    <li><strong>Search and Discovery:</strong> Helping users find jobs, candidates, or companies</li>
                    <li><strong>Verification:</strong> Verifying user identities and professional credentials</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.2 Platform Improvement and Analytics</h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Usage Analysis:</strong> Understanding how users interact with our platform to improve user experience</li>
                    <li><strong>Performance Monitoring:</strong> Tracking platform performance and identifying technical issues</li>
                    <li><strong>Feature Development:</strong> Developing new features based on user behavior and feedback</li>
                    <li><strong>Security Monitoring:</strong> Detecting and preventing fraud, abuse, and security threats</li>
                    <li><strong>Quality Assurance:</strong> Ensuring the accuracy and relevance of job matches and recommendations</li>
                    <li><strong>Research and Development:</strong> Conducting research to improve our algorithms and services</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.3 Communication and Marketing</h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Platform Notifications:</strong> Sending alerts about job matches, application updates, and platform activities</li>
                    <li><strong>Promotional Communications:</strong> Marketing emails about new features, premium services, and platform updates (with your consent)</li>
                    <li><strong>Customer Support:</strong> Responding to your inquiries and providing technical assistance</li>
                    <li><strong>Important Updates:</strong> Communicating changes to our terms, policies, or services</li>
                    <li><strong>Educational Content:</strong> Providing career advice, industry insights, and professional development resources</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.4 Legal and Compliance</h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Legal Compliance:</strong> Complying with applicable laws, regulations, and legal processes</li>
                    <li><strong>Safety and Security:</strong> Protecting the safety and security of our users and platform</li>
                    <li><strong>Dispute Resolution:</strong> Resolving disputes and investigating potential violations of our terms</li>
                    <li><strong>Record Keeping:</strong> Maintaining records as required by law or for business purposes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Information Sharing and Disclosure
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.1 With Your Explicit Consent</h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Job Applications:</strong> Sharing your profile and application materials with employers when you apply for positions</li>
                    <li><strong>Profile Visibility:</strong> Making your profile visible to employers based on your privacy settings</li>
                    <li><strong>Reference Checks:</strong> Sharing contact information with potential employers for reference verification</li>
                    <li><strong>Background Checks:</strong> Facilitating background verification services with your explicit consent</li>
                    <li><strong>Third-Party Integrations:</strong> Connecting with external services you choose to integrate</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.2 Service Providers and Business Partners</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    We work with trusted third-party service providers who assist us in operating our platform:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Cloud Hosting Providers:</strong> Storing and processing data securely in the cloud</li>
                    <li><strong>Payment Processors:</strong> Processing payments for premium services (they handle payment data separately)</li>
                    <li><strong>Email Service Providers:</strong> Sending platform notifications and communications</li>
                    <li><strong>Analytics Providers:</strong> Analyzing platform usage and performance</li>
                    <li><strong>Security Services:</strong> Monitoring for fraud and security threats</li>
                    <li><strong>Customer Support Tools:</strong> Providing customer service and technical support</li>
                    <li><strong>Background Check Services:</strong> Conducting employment verification (with your consent)</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                    All service providers are bound by strict confidentiality agreements and are only permitted to use your information for the specific services they provide to us.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.3 Legal Requirements and Safety</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    We may disclose your information when required by law or to protect safety:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Legal Process:</strong> Responding to court orders, subpoenas, or other legal requests</li>
                    <li><strong>Law Enforcement:</strong> Cooperating with law enforcement investigations</li>
                    <li><strong>Safety Protection:</strong> Protecting the safety of our users, employees, or the public</li>
                    <li><strong>Rights Protection:</strong> Protecting our rights, property, or security</li>
                    <li><strong>Terms Enforcement:</strong> Investigating violations of our Terms of Service</li>
                    <li><strong>Fraud Prevention:</strong> Preventing fraud, abuse, or illegal activities</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.4 Business Transfers</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    In the event of a merger, acquisition, bankruptcy, or sale of all or a portion of our assets, your information may be transferred as part of the business transaction. We will provide notice before your personal information is transferred and becomes subject to a different privacy policy.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.5 Aggregated and De-identified Data</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We may share aggregated, de-identified, or anonymized data that cannot be used to identify you for research, analytics, or business purposes. This includes industry reports, market analysis, and platform statistics.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Data Security and Protection
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">5.1 Security Measures</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    We implement comprehensive security measures to protect your personal information:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Encryption:</strong> All data is encrypted in transit using TLS/SSL and at rest using industry-standard encryption</li>
                    <li><strong>Access Controls:</strong> Strict access controls ensure only authorized personnel can access personal data</li>
                    <li><strong>Multi-Factor Authentication:</strong> Optional MFA for enhanced account security</li>
                    <li><strong>Regular Security Audits:</strong> Comprehensive security assessments and penetration testing</li>
                    <li><strong>Secure Infrastructure:</strong> Hosting on secure, compliant cloud infrastructure</li>
                    <li><strong>Data Backup:</strong> Regular encrypted backups to prevent data loss</li>
                    <li><strong>Incident Response:</strong> Established procedures for responding to security incidents</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">5.2 Employee Training and Access</h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Privacy Training:</strong> All employees receive regular privacy and security training</li>
                    <li><strong>Need-to-Know Access:</strong> Employees only have access to data necessary for their job functions</li>
                    <li><strong>Confidentiality Agreements:</strong> All staff sign comprehensive confidentiality agreements</li>
                    <li><strong>Background Checks:</strong> Security screening for employees with access to sensitive data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">5.3 Data Breach Response</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    In the unlikely event of a data breach, we have established procedures to contain the incident, assess the impact, and notify affected users and relevant authorities as required by law, typically within 72 hours of discovery.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">5.4 Your Security Responsibilities</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    While we implement strong security measures, you also play a role in protecting your account:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li>Use a strong, unique password for your TechHub account</li>
                    <li>Enable two-factor authentication when available</li>
                    <li>Log out of your account when using shared or public computers</li>
                    <li>Report suspicious activity or potential security issues immediately</li>
                    <li>Keep your contact information up to date for security notifications</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Your Privacy Rights and Choices
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.1 Access and Control</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    You have several rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate personal information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                    <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                    <li><strong>Objection:</strong> Object to processing based on legitimate interests or for marketing purposes</li>
                    <li><strong>Portability:</strong> Request your data in a portable, machine-readable format</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.2 Profile Visibility Settings</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    Job seekers can control how their profiles are displayed:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Public Profile:</strong> Visible to all employers on the platform</li>
                    <li><strong>Limited Visibility:</strong> Visible only to employers you've interacted with</li>
                    <li><strong>Anonymous Browsing:</strong> Browse jobs without revealing your identity to employers</li>
                    <li><strong>Blocked Companies:</strong> Prevent specific employers from viewing your profile</li>
                    <li><strong>Contact Preferences:</strong> Control how employers can contact you</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.3 Communication Preferences</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    You can control the communications you receive:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Job Alerts:</strong> Customize frequency and types of job recommendations</li>
                    <li><strong>Marketing Emails:</strong> Opt out of promotional communications</li>
                    <li><strong>Platform Notifications:</strong> Control in-app and email notifications</li>
                    <li><strong>SMS Notifications:</strong> Manage text message preferences</li>
                    <li><strong>Newsletter:</strong> Subscribe or unsubscribe from our newsletter</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.4 Data Portability</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    You can request a copy of your personal data in a commonly used, machine-readable format. This includes your profile information, job application history, and communication records.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.5 Account Deletion</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    You can request deletion of your account and associated data through your account settings or by contacting support. Please note:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li>Some information may be retained for legal compliance or business purposes</li>
                    <li>Anonymized data may be retained for analytics and research</li>
                    <li>Backup copies may take up to 90 days to be fully removed</li>
                    <li>Information shared with employers may remain in their systems</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.6 Exercising Your Rights</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    To exercise your privacy rights:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    <li>Log into your account and visit the Privacy Settings page</li>
                    <li>Contact our Data Protection Officer at dpo@techhub.co.ke</li>
                    <li>Submit a request through our support center</li>
                    <li>Send a written request to our physical address</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                    We will respond to your request within 30 days and may require identity verification to protect your privacy.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Cookies and Tracking Technologies
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">7.1 Types of Cookies We Use</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Essential Cookies (Always Active)</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        Required for basic platform functionality, security, and user authentication. These cannot be disabled.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Functional Cookies</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        Remember your preferences, settings, language choices, and login status to enhance your experience.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Marketing Cookies (Optional)</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Used for targeted advertising, measuring campaign effectiveness, and personalizing marketing content. Requires your consent.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">7.2 Other Tracking Technologies</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li><strong>Web Beacons:</strong> Small graphics in emails that help us track open rates and engagement</li>
                <li><strong>Pixel Tags:</strong> Used to measure the effectiveness of our advertising campaigns</li>
                <li><strong>Local Storage:</strong> Stores data locally on your device to improve platform performance</li>
                <li><strong>Session Replay:</strong> Records user interactions to identify and fix usability issues (anonymized)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">7.3 Managing Cookie Preferences</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                You can control cookies through:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li><strong>Cookie Consent Manager:</strong> Update your preferences through our cookie banner</li>
                <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies</li>
                <li><strong>Account Settings:</strong> Manage tracking preferences in your account privacy settings</li>
                <li><strong>Opt-out Tools:</strong> Use industry opt-out tools for advertising cookies</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                Note that disabling certain cookies may affect platform functionality and your user experience.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">7.4 Third-Party Cookies</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Some cookies are set by third-party services we use, such as Google Analytics, social media plugins, and advertising networks. These third parties have their own privacy policies governing their use of cookies.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            8. Data Retention
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">8.1 Retention Periods</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                We retain your personal information for different periods depending on the type of data and purpose:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li><strong>Active Account Data:</strong> Retained while your account is active and for a reasonable period after deactivation</li>
                <li><strong>Job Application Records:</strong> Retained for 7 years for legal compliance and dispute resolution</li>
                <li><strong>Communication Records:</strong> Retained for 3 years or as required by law</li>
                <li><strong>Payment Information:</strong> Retained as required by tax and financial regulations (typically 7 years)</li>
                <li><strong>Marketing Data:</strong> Retained until you withdraw consent or for 3 years of inactivity</li>
                <li><strong>Analytics Data:</strong> Aggregated data may be retained indefinitely in anonymized form</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">8.2 Secure Deletion</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                When data reaches the end of its retention period, we securely delete it using industry-standard data destruction methods. Backup copies are also securely deleted according to our backup retention schedules.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">8.3 Legal Holds</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                In some cases, we may need to retain data longer than usual due to legal holds, ongoing investigations, or pending litigation. We will notify you if this affects your data deletion request.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            9. International Data Transfers
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">9.1 Global Operations</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                TechHub operates globally, and your information may be transferred to, stored, and processed in countries other than your own, including Kenya, European Union countries, and the United States. These countries may have different data protection laws than your home country.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">9.2 Transfer Safeguards</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                When transferring your personal information internationally, we implement appropriate safeguards:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li><strong>Adequacy Decisions:</strong> Transfers to countries recognized as providing adequate protection</li>
                <li><strong>Standard Contractual Clauses:</strong> Using EU-approved contractual terms for data transfers</li>
                <li><strong>Binding Corporate Rules:</strong> Internal rules ensuring consistent protection across our global operations</li>
                <li><strong>Certification Programs:</strong> Participating in recognized data protection certification schemes</li>
                <li><strong>Privacy Shield (where applicable):</strong> Adhering to privacy frameworks between countries</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">9.3 Data Localization</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Where required by local laws, we maintain data within specific geographical boundaries. For example, certain employee data may be stored within the European Economic Area to comply with GDPR requirements.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            10. Special Categories of Personal Data
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">10.1 Sensitive Personal Information</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                We generally do not collect sensitive personal information (such as race, religion, political opinions, health data, or sexual orientation) unless specifically required for legitimate purposes and with your explicit consent. When we do process such information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li>We obtain your explicit consent before collection</li>
                <li>We implement additional security measures</li>
                <li>We limit access to authorized personnel only</li>
                <li>We provide clear information about the purpose and legal basis</li>
                <li>We allow you to withdraw consent at any time</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">10.2 Diversity and Inclusion Data</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Some employers may request diversity information for equal opportunity monitoring. This information is always optional, collected separately from your main profile, and used only for legitimate diversity and inclusion purposes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">10.3 Background Check Information</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Background checks are conducted only with your explicit consent and for specific job applications. We work with certified providers and ensure all checks comply with applicable employment laws and regulations.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            11. Children's Privacy
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our Platform is not intended for individuals under 18 years of age. We do not knowingly collect, use, or disclose personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take immediate steps to delete such information.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you are a parent or guardian and believe your child has provided personal information to us, please contact our Data Protection Officer immediately at dpo@techhub.co.ke.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              In jurisdictions where the age of consent is higher than 18, we comply with those local requirements.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            12. Changes to This Privacy Policy
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will:
            </p>
            
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
              <li>Update the "Last Updated" date at the top of this policy</li>
              <li>Notify you via email if you have an account with us</li>
              <li>Display a prominent notice on our Platform</li>
              <li>Provide a summary of key changes</li>
              <li>In some cases, request your renewed consent</li>
            </ul>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information. Your continued use of the Platform after changes become effective constitutes acceptance of the updated policy.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Previous versions of this Privacy Policy are archived and available upon request.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            13. Complaints and Dispute Resolution
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">13.1 Internal Complaints Process</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                If you have concerns about our privacy practices, please contact us first. We are committed to resolving privacy concerns promptly and fairly:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li>Contact our Data Protection Officer at dpo@techhub.co.ke</li>
                <li>Provide detailed information about your concern</li>
                <li>We will acknowledge your complaint within 48 hours</li>
                <li>We will investigate and respond within 30 days</li>
                <li>We will provide clear information about any actions taken</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">13.2 Regulatory Authorities</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                You have the right to lodge a complaint with relevant data protection authorities:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <li><strong>Kenya:</strong> Office of the Data Protection Commissioner</li>
                <li><strong>European Union:</strong> Your local data protection authority</li>
                <li><strong>United States:</strong> Federal Trade Commission or state attorneys general</li>
                <li><strong>Other Countries:</strong> Relevant national or regional privacy regulators</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">13.3 Alternative Dispute Resolution</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We participate in alternative dispute resolution programs where available and may offer binding arbitration for certain privacy disputes as an alternative to court proceedings.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            14. Contact Information
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              For questions, concerns, or requests related to this Privacy Policy or our data practices, please contact us:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">General Privacy Inquiries</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                  <strong>Email:</strong> privacy@techhub.co.ke<br />
                  <strong>Response Time:</strong> Within 48 hours<br />
                  <strong>Languages:</strong> English, Swahili
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Data Protection Officer</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                  <strong>Email:</strong> dpo@techhub.co.ke<br />
                  <strong>Phone:</strong> +254 700 000 000<br />
                  <strong>Hours:</strong> Monday-Friday, 9 AM-5 PM EAT
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Mailing Address</h4>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>TechHub Privacy Team</strong><br />
                Nairobi, Kenya<br />
                <em>Please mark correspondence "PRIVACY INQUIRY" for faster processing</em>
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Emergency Privacy Issues:</strong> For urgent privacy matters involving potential data breaches or security incidents, please call our 24/7 security hotline at +254 700 000 001 or email security@techhub.co.ke.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>

    {/* Footer Navigation */}
    <div className="mt-12 flex flex-col sm:flex-row justify-between items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="mb-4 sm:mb-0">
        <Link
          href="/terms"
          className="text-[#0CCE68] hover:text-[#364187] transition-colors font-medium"
        >
          View Terms of Service →
        </Link>
      </div>
      <div className="text-center sm:text-right">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Questions about privacy?
        </p>
        <a
          href="mailto:privacy@techhub.co.ke"
          className="text-[#0CCE68] hover:text-[#364187] transition-colors font-medium"
        >
          Contact our privacy team
        </a>
      </div>
    </div>

    {/* Quick Links */}
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Link
        href="/privacy/cookies"
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-[#0CCE68] transition-colors"
      >
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Cookie Policy</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Learn about our use of cookies and tracking technologies
        </p>
      </Link>
      
      <Link
        href="/privacy/data-requests"
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-[#0CCE68] transition-colors"
      >
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Data Requests</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Submit requests to access, update, or delete your data
        </p>
      </Link>
      
      <Link
        href="/privacy/security"
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-[#0CCE68] transition-colors"
      >
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Security Practices</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Learn about our security measures and best practices
        </p>
      </Link>
    </div>
  </main>
    </div>
);
}