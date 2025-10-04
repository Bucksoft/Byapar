import mes from "../assets/Message.png";
import calcal from "../assets/CalenderCal.png";
import calclo from "../assets/CalenderClock.jpg";
import { PlusIcon } from "lucide-react";
import { delay, motion } from "framer-motion";

const DashboardStaffPage = () => {
  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-zinc-100">
      {/* Sidebar */}

      {/* Main Content */}
      <section className="w-full p-4">
        <div className="border border-zinc-200 shadow-2xl rounded-md bg-white p-4 h-full">
          {/* Title */}
          <motion.p
            initial={{
              translateY: -100,
              opacity: 0,
            }}
            animate={{
              translateY: 0,
              opacity: 1,
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="text-lg mb-4 border-b border-zinc-300 pb-2"
          >
            Staff Attendance & Payroll
          </motion.p>

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-20">
            {/* Card 1 */}
            <motion.div
              initial={{
                opacity: 0,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
              }}
              className="border border-zinc-300 bg-gradient-to-b from-zinc-200 rounded-md"
            >
              <div className="flex items-center justify-center p-4">
                <img
                  src={calclo}
                  alt="Calculator With Clock"
                  className="w-full max-w-[150px] object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-center text-sm border-t border-[var(--primary-border)] p-3">
                Mark your staff's attendance digitally
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{
                opacity: 0,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
                delay: 0.3,
              }}
              className="border border-zinc-300 bg-gradient-to-b from-zinc-200 rounded-md"
            >
              <div className="flex items-center justify-center p-4">
                <img
                  src={calcal}
                  alt="Calculator with Calendar"
                  className="w-full max-w-[150px] object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-center text-sm border-t border-[var(--primary-border)] p-3">
                Simplify payroll by adding salary, advance & pending payments
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{
                opacity: 0,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
                delay: 0.6,
              }}
              className="border border-zinc-300 bg-gradient-to-b from-zinc-200 rounded-md"
            >
              <div className="flex items-center justify-center p-4 mt-5">
                <img
                  src={mes}
                  alt="Message Icon"
                  className="w-full max-w-[150px] object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-center text-sm border-t border-[var(--primary-border)] p-4">
                Set custom reminders to mark attendance timely
              </p>
            </motion.div>
          </div>

          {/* CTA Section */}
          <div className="flex items-center justify-center flex-col mt-8 text-center px-4">
            <motion.span
              initial={{
                translateY: -100,
                opacity: 0,
              }}
              animate={{
                translateY: 0,
                opacity: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
              }}
              className="font-semibold text-lg"
            >
              Mark attendance and manage payroll
            </motion.span>
            <motion.span
              initial={{
                translateY: -100,
                opacity: 0,
              }}
              animate={{
                translateY: 0,
                opacity: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
                delay: 0.3,
              }}
              className="text-sm mt-3"
            >
              Add staff to mark attendance and manage payroll with ease!
            </motion.span>
            <motion.button
              initial={{
                translateY: 100,
                opacity: 0,
              }}
              animate={{
                translateY: 0,
                opacity: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
              }}
              className="btn btn-[var(--primary-btn)] btn-sm mt-5"
            >
              <PlusIcon size={18} />
              Add Staff
            </motion.button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardStaffPage;
