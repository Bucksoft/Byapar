import { CheckCircle } from "lucide-react";
import React from "react";

const HomePagePricing = () => {
  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your business. All plans include core
            features with no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ₹999
                <span className="text-lg font-normal text-gray-600">
                  /month
                </span>
              </div>
              <p className="text-gray-600">Perfect for small businesses</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Up to 500 invoices/month</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Basic GST calculations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Inventory tracking</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Email support</span>
              </li>
            </ul>
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              Start Free Trial
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-info relative transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-info text-white px-6 py-2 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Professional
              </h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ₹2,499
                <span className="text-lg font-normal text-gray-600">
                  /month
                </span>
              </div>
              <p className="text-gray-600">Ideal for growing businesses</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Unlimited invoices</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Advanced GST features</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Multi-location inventory</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Priority support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Advanced analytics</span>
              </li>
            </ul>
            <button className="w-full bg-info text-white py-3 rounded-xl font-semibold hover:bg-info transition-colors shadow-lg">
              Start Free Trial
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Enterprise
              </h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ₹4,999
                <span className="text-lg font-normal text-gray-600">
                  /month
                </span>
              </div>
              <p className="text-gray-600">For large enterprises</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Everything in Professional
                </span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Multi-company support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">API access</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">24/7 phone support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Custom integrations</span>
              </li>
            </ul>
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePagePricing;
