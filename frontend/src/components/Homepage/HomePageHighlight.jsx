import { ArrowRight, CheckCircle } from "lucide-react";
import React from "react";

const HomePageHighlight = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-info to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Ready to Streamline Your Business?
        </h2>
        <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
          Join thousands of businesses that have transformed their operations
          with BYAPAR. Start your free trial today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button className="bg-white  text-info px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105">
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2 inline" />
          </button>
          <button className="border-2  border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-info transition-colors">
            Schedule Demo
          </button>
        </div>
        <div className="flex items-center justify-center space-x-8 text-indigo-200 text-sm">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>No setup fees</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageHighlight;
