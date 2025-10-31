import { motion } from "framer-motion";

const DashboardLoanPage = () => {
  return (
    <main className="h-screen w-full flex">
      <motion.section
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        transition={{
          ease: "easeInOut",
        }}
        className="h-full w-full bg-gray-200 p-2 "
      >
        <div className=" border border-zinc-300 h-full rounded-md bg-gray-100 flex items-center justify-center">
          <div className=" border border-zinc-300 h-75 rounded-md bg-white w-110">
            <p className="font-bold text-3xl text-center mt-15">
              Get Instant Business Loan
            </p>
            <p className="text-gray-500 m-5">
              Please enter Phone number
              <input
                type="number"
                className="border border-zinc-400 rounded-sm w-full h-10 mt-2"
              />
            </p>
            <button className="border  border-zinc-400 rounded-sm w-100 h-10 ml-5 bg-[var(--primary-btn)] text-white hover:text-white font-bold">
              Next
            </button>
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default DashboardLoanPage;
