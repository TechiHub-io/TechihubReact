// src/components/settings/BillingSettings.jsx
import React from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { CreditCard, Package, Calendar, TrendingUp, Mail } from 'lucide-react';

export default function BillingSettings() {
  const { company } = useStore(state => ({ company: state.company }));

  // Template data - will be replaced with actual API data when available
  const billingData = {
    currentPlan: 'Professional',
    price: '$99',
    billingCycle: 'monthly',
    nextBillingDate: '2025-02-06',
    jobPostings: { used: 15, limit: 50 },
    teamMembers: { used: 5, limit: 10 },
    features: [
      '50 Active Job Postings',
      '10 Team Members',
      'Advanced Analytics',
      'Priority Support',
      'API Access'
    ]
  };

  const plans = [
    {
      name: 'Starter',
      price: '$49',
      features: ['10 Job Postings', '3 Team Members', 'Basic Analytics']
    },
    {
      name: 'Professional',
      price: '$99',
      features: ['50 Job Postings', '10 Team Members', 'Advanced Analytics'],
      current: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited Job Postings', 'Unlimited Team Members', 'Custom Features']
    }
  ];

  return (
    <div className="space-y-6 opacity-50 pointer-events-none">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Billing & Subscription
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-[#0CCE68]" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {billingData.currentPlan} Plan
              </h4>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {billingData.price}
              <span className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                /{billingData.billingCycle}
              </span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Next billing date: {new Date(billingData.nextBillingDate).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
              Active
            </span>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Job Postings</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {billingData.jobPostings.used} / {billingData.jobPostings.limit}
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-[#0CCE68] h-2 rounded-full"
                style={{ width: `${(billingData.jobPostings.used / billingData.jobPostings.limit) * 100}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Team Members</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {billingData.teamMembers.used} / {billingData.teamMembers.limit}
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-[#0CCE68] h-2 rounded-full"
                style={{ width: `${(billingData.teamMembers.used / billingData.teamMembers.limit) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6">
          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Included Features
          </h5>
          <ul className="space-y-2">
            {billingData.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="h-1.5 w-1.5 bg-[#0CCE68] rounded-full mr-2" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
          Available Plans
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-4 border rounded-lg ${
                plan.current
                  ? 'border-[#0CCE68] bg-[#0CCE68]/5'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <h5 className="font-medium text-gray-900 dark:text-white">{plan.name}</h5>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {plan.price}
                {plan.price !== 'Custom' && <span className="text-sm font-normal">/month</span>}
              </p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    • {feature}
                  </li>
                ))}
              </ul>
              {plan.current && (
                <span className="inline-block mt-4 text-xs text-[#0CCE68] font-medium">
                  Current Plan
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          disabled
          className="w-full flex items-center justify-center px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Upgrade Plan (Coming Soon)
        </button>
        
        <button
          disabled
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Update Payment Method (Coming Soon)
        </button>
        
        <button
          disabled
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed"
        >
          <Calendar className="h-4 w-4 mr-2" />
          View Billing History (Coming Soon)
        </button>
      </div>

      {/* Contact Sales */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 p-4 rounded-lg">
        <div className="flex items-start">
          <Mail className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Need a Custom Plan?
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              Contact our sales team for enterprise pricing and custom features.
            </p>
            <button
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => window.location.href = 'mailto:sales@techhub.com'}
            >
              Contact Sales →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}