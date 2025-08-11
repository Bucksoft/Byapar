import React from "react";
import { Calculator } from "lucide-react";

const HomePageFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-6">
              <Calculator className="w-8 h-8 text-indigo-400 mr-3" />
              <span className="text-2xl font-bold">BYAPAR</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Complete GST billing and inventory management solution designed
              for Indian businesses.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition-colors">
                <span className="text-sm font-semibold">f</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition-colors">
                <span className="text-sm font-semibold">t</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition-colors">
                <span className="text-sm font-semibold">in</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg">Product</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Mobile App
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Video Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Community Forum
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  System Status
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Press Kit
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Partner Program
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 BYAPAR. All rights reserved. Made with ❤️ for Indian
            businesses.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default HomePageFooter;
