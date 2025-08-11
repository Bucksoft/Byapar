import { CheckCircle } from "lucide-react";
import one from "../../assets/1.png";
import two from "../../assets/2.png";
import three from "../../assets/3.png";
import four from "../../assets/4.png";
import five from "../../assets/5.png";
import six from "../../assets/6.png";

const HomePageFeature = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to Manage Your Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From automated GST calculations to real-time inventory tracking,
            we've got every aspect of your business covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* cards */}

          <div className="relative ">
            <img src={one} alt="card1" width={500} className="rounded-xl " />
            <div className="absolute top-0 bg-white/10 p-2 backdrop-blur-[3px] h-full w-full rounded-xl">
              <h1 className="bg-white w-fit px-2 text-sm rounded-md">
                Smart GST Calculations
              </h1>
              <h3 className="p-4 font-semibold text-md">
                Auto GST with full compliance.
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 px-4">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Multi-rate GST support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Reverse charge mechanism
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  HSN code integration
                </li>
              </ul>
            </div>
          </div>
          <div className="relative ">
            <img src={two} alt="card1" width={500} className="rounded-xl " />
            <div className="absolute top-0 bg-white/10 p-2 backdrop-blur-[3px] h-full w-full rounded-xl">
              <h1 className="bg-white w-fit px-2 text-sm rounded-md">
                Inventory Management
              </h1>
              <h3 className="p-4 font-semibold text-md">
                Real-time inventory with notifications
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 px-4">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Real-time stock updates
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Low stock alerts
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Batch & expiry tracking
                </li>
              </ul>
            </div>
          </div>
          <div className="relative ">
            <img src={three} alt="card1" width={500} className="rounded-xl " />
            <div className="absolute top-0 bg-white/10 p-2 backdrop-blur-[3px] h-full w-full rounded-xl">
              <h1 className="bg-white w-fit px-2 text-sm rounded-md">
                Business Analytics
              </h1>
              <h3 className="p-4 font-semibold text-md">
                Sales and performance tracking reports
              </h3>
              <ul className="px-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Sales & profit reports
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Tax liability tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Performance insights
                </li>
              </ul>
            </div>
          </div>
          <div className="relative ">
            <img src={four} alt="card1" width={500} className="rounded-xl " />
            <div className="absolute top-0 bg-white/10 p-2 backdrop-blur-[3px] h-full w-full rounded-xl">
              <h1 className="bg-white w-fit px-2 text-sm rounded-md">
                Professional Billing
              </h1>
              <h3 className="p-4 font-semibold text-md">
                Custom invoices, quotes, and challans
              </h3>
              <ul className="px-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Custom invoice templates
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Multi-language support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Digital signatures
                </li>
              </ul>
            </div>
          </div>
          <div className="relative ">
            <img src={five} alt="card1" width={500} className="rounded-xl " />
            <div className="absolute top-0 bg-white/10 p-2 backdrop-blur-[3px] h-full w-full rounded-xl">
              <h1 className="bg-white w-fit px-2 text-sm rounded-md">
                Data Security
              </h1>
              <h3 className="p-4 font-semibold text-md">
                {" "}
                Bank-level data protection system
              </h3>
              <ul className="px-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  256-bit encryption
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Daily backups
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Role-based access
                </li>
              </ul>
            </div>
          </div>
          <div className="relative ">
            <img src={six} alt="card1" width={500} className="rounded-xl " />
            <div className="absolute top-0 bg-white/10 p-2 backdrop-blur-[3px] h-full w-full rounded-xl">
              <h1 className="bg-white w-fit px-2 text-sm rounded-md">
                Time-Saving Automation
              </h1>
              <h3 className="p-4 font-semibold text-md">
                Auto-processing system
              </h3>
              <ul className="px-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Recurring invoices
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Payment reminders
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Auto stock updates
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageFeature;
