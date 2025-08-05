import { FiRefreshCw } from "react-icons/fi";
import { features } from "../utils/constants";

const DashboardBills = () => {
  return (
    <div className="min-h-screen bg-white px-6 py-10 md:px-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Automated Bills
        </h2>
        <button className="btn btn-outline btn-info">
          {" "}
          <FiRefreshCw />
          What is Automated Bills
        </button>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-md p-6 bg-white hover:shadow-2xl transition-all text-center"
          >
            <img
              src={feature.img}
              alt={feature.title}
              className="w-62 h-62 mx-auto object-contain"
            />
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-4">
          Schedule your repeated bills hassle-free
        </p>
        <button className="btn btn-outline btn-info">
          Create Automated Bill
        </button>
      </div>
    </div>
  );
};

export default DashboardBills;
