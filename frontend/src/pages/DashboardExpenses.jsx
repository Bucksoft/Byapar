import { Calendar, ChevronDown, Plus, Search } from "lucide-react";

import { FaFileInvoice } from "react-icons/fa";
import DashboardNavbar from "../components/DashboardNavbar";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import CreateExpenseForm from "../components/CreateExpenseForm";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useBusinessStore } from "../store/businessStore";
import { LuIndianRupee } from "react-icons/lu";
import CustomLoader from "../components/Loader";

const DashboardExpenses = () => {
  const [openCreateExpense, setOpenCreateExpense] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategoryQuery, setSearchCategoryQuery] = useState("");
  const { business } = useBusinessStore();

  // fetch all expenses
  const { isLoading, data } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/expense/?businessId=${business?._id}`
      );
      return res.data;
    },
  });

  // fetch all expense categories
  const { data: expenseCategories = [] } = useQuery({
    queryKey: ["expenseCategory"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/expense/category/?businessId=${business?._id}`
      );
      return res.data?.expenseCategories;
    },
  });

  const filteredExpenses = useMemo(() => {
    if (!data?.expenses) return [];
    if (searchQuery) {
      return data?.expenses?.filter((expense) => {
        return expense?.expenseCategory?.categoryName
          ?.toLowerCase()
          .includes(searchQuery);
      });
    } else {
      return data?.expenses;
    }
  });

  return (
    <main className="h-screen w-full flex">
      {!openCreateExpense ? (
        <CreateExpenseForm
          setOpenCreateExpense={setOpenCreateExpense}
          latestExpenseNumber={data?.latestExpenseNumber || 0}
        />
      ) : (
        <section className="w-full p-3 ">
          <div className="h-full rounded-md  bg-white p-2 flex flex-col">
            <DashboardNavbar title={"Expenses"} />

            <motion.div
              initial={{
                opacity: 0,
                scaleY: 0,
              }}
              animate={{
                opacity: 1,
                scaleY: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.2,
              }}
              className="flex justify-between  mt-10"
            >
              <div className="flex gap-3 px-3">
                {/* search box */}
                <div className="">
                  <label className="input input-sm">
                    <Search size={16} className="text-zinc-400" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      type="search"
                      required
                      placeholder="Search by Category"
                    />
                  </label>
                </div>
                {/* calender */}
                <div className="dropdown dropdown-center w-50">
                  <div
                    tabIndex={0}
                    role="button"
                    className="flex items-center justify-between btn btn-wide btn-sm w-full text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-zinc-400" />
                      Last 365 days
                    </div>
                    <ChevronDown size={16} />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm text-xs"
                  >
                    <li>
                      <a>Today</a>
                    </li>
                    <li>
                      <a>Yesterday</a>
                    </li>
                    <li>
                      <a>This week</a>
                    </li>
                    <li>
                      <a>Last week</a>
                    </li>
                  </ul>
                </div>
                {/* all expense */}
                <div className="dropdown dropdown-center ">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-wide btn-sm w-full text-xs font-medium flex items-center justify-between"
                  >
                    All Expenses Categories
                    <ChevronDown size={16} />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm text-xs"
                  >
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchCategoryQuery}
                      onChange={(e) => setSearchCategoryQuery(e.target.value)}
                      className="input input-xs mb-1"
                    />
                    {searchCategoryQuery
                      ? expenseCategories
                          ?.filter((category) =>
                            category?.categoryName
                              ?.toLowerCase()
                              ?.includes(searchCategoryQuery)
                          )
                          .map((category) => (
                            <li key={category?._id}>
                              <a>{category?.categoryName}</a>
                            </li>
                          ))
                      : expenseCategories?.map((category) => (
                          <li key={category?._id}>
                            <a>{category?.categoryName}</a>
                          </li>
                        ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="h-full">
                  <button
                    onClick={() => setOpenCreateExpense(true)}
                    className="btn rounded-xl bg-[var(--primary-btn)] btn-sm"
                  >
                    <Plus size={14} /> Create Expense
                  </button>
                </div>
              </div>
            </motion.div>

            {/* table */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.2,
              }}
              className="overflow-x-auto border border-zinc-200 rounded-lg  mt-10 max-h-full w-full overflow-y-auto"
            >
              <table className="table table-zebra">
                {/* head */}
                <thead>
                  <tr className="bg-zinc-200">
                    <th>Date</th>
                    <th>Expense Number</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Payment Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="flex items-center justify-center py-20">
                          <CustomLoader text={"Loading..."} />
                        </div>
                      </td>
                    </tr>
                  ) : filteredExpenses?.length > 0 ? (
                    filteredExpenses?.map((expense) => (
                      <tr key={expense?._id}>
                        <td>{expense?.expenseDate}</td>
                        <td>{expense?.expenseNumber}</td>
                        <td>{expense?.expenseCategory?.categoryName}</td>
                        <td>
                          <div className="flex items-center">
                            <LuIndianRupee />
                            {Number(expense?.totalAmount).toLocaleString(
                              "en-IN"
                            )}
                          </div>
                        </td>
                        <td>{expense?.paymentMode}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className=" text-center text-zinc-400">
                        <div className="flex flex-col py-20 items-center justify-center gap-3">
                          <FaFileInvoice size={40} />
                          <span>
                            No transactions matching the current filter
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
};

export default DashboardExpenses;
