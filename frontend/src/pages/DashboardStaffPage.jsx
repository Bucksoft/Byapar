import mes from "../assets/Message.png";
import calcal from "../assets/CalenderCal.png";
import calclo from "../assets/CalenderClock.jpg";
import { PlusIcon } from "lucide-react";

const DashboardStaffPage = () => {
  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}

      {/* Main Content */}
      <section className="w-full p-4">
        <div className="border-2 border-zinc-100 shadow-2xl rounded-md bg-white p-4 h-full">
          {/* Title */}
          <p className="font-medium text-lg mb-4 border-b border-zinc-300 pb-2">
            Staff Attendance & Payroll
          </p>

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-20">
            {/* Card 1 */}
            <div className="border border-zinc-300 rounded-md">
              <div className="flex items-center justify-center p-4">
                <img
                  src={calclo}
                  alt="Calculator With Clock"
                  className="w-full max-w-[150px] object-contain"
                />
              </div>
              <p className="text-center text-sm border-t border-gray-300 p-3">
                Mark your staff's attendance digitally
              </p>
            </div>

            {/* Card 2 */}
            <div className="border border-zinc-300 rounded-md">
              <div className="flex items-center justify-center p-4">
                <img
                  src={calcal}
                  alt="Calculator with Calendar"
                  className="w-full max-w-[150px] object-contain"
                />
              </div>
              <p className="text-center text-sm border-t border-gray-300 p-3">
                Simplify payroll by adding salary, advance & pending payments
              </p>
            </div>

            {/* Card 3 */}
            <div className="border border-zinc-300 rounded-md">
              <div className="flex items-center justify-center p-4 mt-5">
                <img
                  src={mes}
                  alt="Message Icon"
                  className="w-full max-w-[150px] object-contain"
                />
              </div>
              <p className="text-center text-sm border-t border-gray-300 p-4">
                Set custom reminders to mark attendance timely
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex items-center justify-center flex-col mt-8 text-center px-4">
            <span className="font-semibold text-lg">
              Mark attendance and manage payroll
            </span>
            <span className="text-sm mt-3">
              Add staff to mark attendance and manage payroll with ease!
            </span>
            <button className="mt-4 px-6 py-2 bg-info text-white flex items-center gap-2 rounded transition-all">
              <PlusIcon size={18} />
              Add Staff
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardStaffPage;
