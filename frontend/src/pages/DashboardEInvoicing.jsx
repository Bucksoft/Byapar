import { MessageCircle } from "lucide-react";
import { dashboardEInvoicingCardDetails } from "../lib/dashboardEInvoicing";
import { color, motion, scale } from "framer-motion";

export const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export const childCards = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    filter: "blur(0)",
  },
};

const DashboardEInvoicing = () => {
  return (
    <main className="h-screen w-full flex bg-gray-100">
      <section className=" p-2 w-full flex ">
        <div className="w-full h-full  rounded-lg bg-white">
          {/* header */}
          <motion.div
            initial={{
              opacity: 0,
              translateY: -100,
            }}
            animate={{
              opacity: 1,
              translateY: 0,
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
            }}
            className=" border-gray-300  flex items-center justify-between  p-2  "
          >
            <div className="flex justify-between items-center mr-16 space-x-5">
              <div className="font-semibold text-lg pl-2">E-Invoicing</div>

              <button className="btn btn-outline btn-info btn-sm">
                What is e-Invoicing
              </button>
            </div>
            <div className="pr-10">
              <button className="btn btn-soft btn-info btn-sm">
                <MessageCircle size={16} /> Chat Support
              </button>
            </div>
          </motion.div>

          {/* card */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-3  gap-5 my-5 mx-20 "
          >
            {/* Card 1 */}
            {dashboardEInvoicingCardDetails?.map((detail) => (
              <motion.div
                variants={childCards}
                className="border border-zinc-200 hover:-translate-y-1 flex flex-col items-center justify-center  transition-all ease-in-out rounded-md hover:shadow-md"
                key={detail.id}
              >
                <div className="flex flex-col items-center justify-center h-[80%] ">
                  <img
                    src={detail.img}
                    alt="invoDel"
                    width={250}
                    className=""
                  />
                </div>
                <p className="mt-4 p-3 text-slate-600 border-t w-full text-sm border-t-zinc-200 text-center pt-2">
                  {detail.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
          <div className="flex items-center justify-center mt-5">
            <motion.p
              initial={{
                scaleX: 0,
              }}
              animate={{
                scaleX: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.2,
              }}
              className="font-medium text-sm text-zinc-600 py-4"
            >
              Try India's easiest and fastest e-invoicing solution today
            </motion.p>
          </div>
          <div className="flex items-center justify-center ">
            <motion.button
              initial={{
                scaleY: 0,
              }}
              animate={{
                scaleY: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.2,
              }}
              className="btn btn-info"
            >
              Start Generating e-invoices
            </motion.button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardEInvoicing;
