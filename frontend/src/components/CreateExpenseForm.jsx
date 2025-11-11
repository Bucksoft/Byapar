import {
  ArrowLeft,
  Check,
  ChevronDown,
  Delete,
  IndianRupee,
  Plus,
  PlusCircle,
  Settings,
  Trash,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import no_items from "../assets/no_items.jpg";
import CreateExpenseItem from "./Expenses/CreateExpenseItem";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useBusinessStore } from "../store/businessStore";
import { LuIndianRupee } from "react-icons/lu";
import ExpenseItemsTable, { calculateItem } from "./Expenses/ExpenseItemsTable";
import { useNavigate } from "react-router-dom";
import CreateExpenseCategory from "./Expenses/CreateExpenseCategory";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import CustomLoader from "./Loader";

const CreateExpenseForm = ({ setOpenCreateExpense, latestExpenseNumber }) => {
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const { business } = useBusinessStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [addedItems, setAddedItems] = useState([]);

  const [data, setData] = useState({
    expenseDate: new Date().toISOString().split("T")[0],
    paymentMode: "cash",
    note: "",
    expenseWithGST: false,
    expenseCategory: "",
    expenseNumber: latestExpenseNumber + 1,
    items: [],
    totalAmount: 0,
    totalTax: 0,
    totalQuantity: 0,
    additionalCharges: [
      {
        reason: "",
        amount: 0,
        gstRate: "",
        gstAmount: 0,
      },
    ],
    additionalDiscountType: "after_tax",
    additionalDiscountPercent: 0,
    additionalDiscountAmount: 0,
    totalAdditionalChargeAmount: 0,
    totalAdditionalChargeGST: 0,
    totalAmountAfterCharges: 0,
  });

  const { isPending, data: items = [] } = useQuery({
    queryKey: ["expenseItems"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/expense/items/?businessId=${business?._id}`
      );
      return res.data?.expenseItems;
    },
  });

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    return items?.filter((item) =>
      item?.itemName?.toLowerCase().includes(searchQuery?.toLowerCase())
    );
  });

  // fetch all categories
  const { data: expenseCategories = [] } = useQuery({
    queryKey: ["expenseCategory"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/expense/category/?businessId=${business?._id}`
      );
      return res.data?.expenseCategories;
    },
  });

  // CREATE EXPENSE
  const mutation = useMutation({
    mutationFn: async () => {
      if (!Array.isArray(data?.items) || data?.items?.length === 0) {
        throw new Error("Please add at least 1 item");
      }

      if (!data?.expenseCategory) {
        throw new Error("Please select an expense category");
      }

      console.log("Final updated items", data);
      const res = await axiosInstance.post(
        `/expense/?businessId=${business?._id}`,
        data
      );
      return res.data?.expense;
    },
    onSuccess: (data) => {
      setOpenCreateExpense(false);
      toast.success("Expense created successfully");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      items: addedItems,
    }));
  }, [addedItems]);

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(
        `/expense/item/${id}/?businessId=${business?._id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseItems"] });
    },
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  return (
    <main className="h-screen w-full flex">
      <section className="w-full h-full ">
        <div className=" h-full">
          {/* navigation div */}
          <motion.div
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
            className="flex items-center justify-between p-3 border-b-gray-200"
          >
            <div className="flex items-center justify-center">
              <ArrowLeft onClick={() => setOpenCreateExpense(false)} />
              <p className="font-medium ml-2">Create Expenses</p>
            </div>
            <div className="flex gap-3 items-center">
              {/* <div className="border p-[6.9px] border-zinc-200 rounded-sm">
                <Settings size={16} className="text-zinc-500" />
              </div> */}
              <div>
                <button
                  onClick={() => setOpenCreateExpense(false)}
                  className="btn rounded-xl text-sm  btn-sm"
                >
                  Cancel
                </button>
              </div>
              <div>
                <button
                  onClick={() => mutation.mutate()}
                  className="btn rounded-xl btn-sm bg-[var(--primary-btn)] text-sm "
                >
                  {mutation.isPending ? (
                    <CustomLoader text={"Saving"} />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* content div */}
          <div className="w-full bg-gray-50 h-80 grid grid-cols-2 gap-4 p-3">
            {/* first card */}
            <motion.div
              initial={{
                translateX: -100,
                opacity: 0,
              }}
              animate={{
                translateX: 0,
                opacity: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
              }}
              className="border border-zinc-200 bg-white rounded-md  px-2"
            >
              {/* first field */}
              <div className="border flex justify-between p-1 rounded-md mt-5 mx-2 border-zinc-200">
                <p className="text-xs text-zinc-800 p-1">Expense With GST</p>
                <input
                  checked={checked}
                  onChange={() => {
                    setChecked(!checked);
                    setData((prev) => ({
                      ...prev,
                      expenseWithGST: !checked,
                    }));
                  }}
                  type="checkbox"
                  className="toggle text-zinc-800 toggle-sm"
                />
              </div>

              {/* second field - CATEGORY */}
              <div className=" w-full px-2 pt-4 rounded-md border-zinc-300 flex flex-col">
                <p className="text-xs text-zinc-800">
                  Expense Category <span className="text-red-500">*</span>
                </p>
                <div
                  onClick={() => setOpen((prev) => !prev)}
                  className="dropdown dropdown-center w-full "
                >
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-sm mt-1 w-full text-sm flex items-center justify-between bg-white"
                  >
                    <span className="text-xs font-normal text-zinc-500">
                      {data?.expenseCategory
                        ? expenseCategories?.find(
                            (category) =>
                              category?._id === data?.expenseCategory
                          )?.categoryName
                        : "Select Category"}
                    </span>
                    <ChevronDown size={16} />
                  </div>

                  {open && (
                    <ul
                      role="menu"
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100  rounded-bl-box rounded-br-box border-zinc-200 z-1 w-full p-2 shadow-md text-xs  text-zinc-600"
                    >
                      {expenseCategories.length > 0 &&
                        expenseCategories?.map((category) => (
                          <li
                            onClick={(e) => {
                              setData((prev) => ({
                                ...prev,
                                expenseCategory: category?._id,
                              }));
                            }}
                            key={category?._id}
                          >
                            <a>{category?.categoryName}</a>
                          </li>
                        ))}

                      <div>
                        <>
                          <button
                            onClick={() =>
                              document
                                .getElementById("expense_category_modal")
                                .showModal()
                            }
                            className="btn mt-1 btn-xs rounded-xl btn-dash btn-info w-full"
                          >
                            Add Category
                          </button>
                        </>
                      </div>
                    </ul>
                  )}
                </div>
              </div>
              {/* third field */}
              <div className=" w-full p-2 flex flex-col">
                <p className="text-xs text-zinc-800">Expense Number</p>
                <input
                  type="text"
                  value={data.expenseNumber}
                  readOnly
                  className="input input-sm mt-1 w-full"
                />
              </div>
            </motion.div>

            {/* second card */}
            <motion.div
              initial={{
                translateX: 100,
                opacity: 0,
              }}
              animate={{
                translateX: 0,
                opacity: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
              }}
              className="border border-zinc-200 rounded-md bg-white mx-4 p-3 "
            >
              <div className="grid grid-cols-2 gap-4 ">
                {/* first field */}

                {/* second field */}
                <div className="">
                  <p className="text-xs text-zinc-800">Expense Date</p>
                  <input
                    type="date"
                    value={data.expenseDate}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        expenseDate: e.target.value,
                      }))
                    }
                    className="input input-sm mt-1 text-xs text-zinc-800 mt"
                  />
                </div>

                {/* Payment mode third field */}
                <div className="w-full rounded-md flex flex-col">
                  <p className="text-xs text-zinc-800">Payment Mode</p>
                  <select
                    value={data.paymentMode}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        paymentMode: e.target.value,
                      }))
                    }
                    className="w-full select select-sm mt-1"
                  >
                    <option value={"cash"}>Cash</option>
                    <option value={"upi"}>UPI</option>
                    <option value={"cheque"}>Cheque</option>
                    <option value={"card"}>Card</option>
                    <option value={"net_banking"}>Net Banking</option>
                    <option value={"bank_transfer"}>Bank Transfer</option>
                  </select>
                </div>
              </div>
              {/*Note TextArea */}

              <div>
                <p className="text-xs text-zinc-800 mt-5">Note</p>
                <textarea
                  value={data.note}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, note: e.target.value }))
                  }
                  placeholder="Note"
                  className="w-full textarea textarea-sm mt-1 rounded-md"
                ></textarea>
              </div>
            </motion.div>
          </div>
          {checked !== undefined && (
            <div className="border-b border-[var(--primary-border)] p-2">
              <button
                onClick={() =>
                  document.getElementById("add_item_modal").showModal()
                }
                className={`w-full btn btn-info`}
              >
                <Plus size={15} />
                Add Item
              </button>
            </div>
          )}
          {/* DISPLAYING LIST OF ADDED ITEMS IN A TABULAR FORMAT FOR CALCULATION */}
          <div>
            <ExpenseItemsTable
              addedItems={addedItems}
              checked={checked}
              setAddedItems={setAddedItems}
              setData={setData}
              data={data}
            />
          </div>

          {/* bottom section */}
        </div>
      </section>

      {/* MODAL TO ADD ITEM */}
      <dialog id="add_item_modal" className="modal">
        <div className="modal-box w-1/2 max-w-5xl">
          <h3 className="font-bold text-lg">Add Items</h3>

          {items?.length > 0 ? (
            <div className="mt-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  className="input input-sm"
                  placeholder="Search by Item Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => {
                    document.getElementById("create_item_modal").showModal();
                    document.getElementById("add_item_modal").close();
                  }}
                  className="btn btn-info btn-sm btn-dash rounded-xl"
                >
                  Create Item
                </button>
              </div>

              <div className="overflow-x-auto mt-3 h-80 overflow-y-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table table-sm text-xs ">
                  {/* head */}
                  <thead className="bg-zinc-100 ">
                    <tr>
                      <th>Sr.</th>
                      <th>Item Name</th>
                      <th>HSN/SAC</th>
                      <th>Purchase Price</th>
                      <th>Action</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems?.length > 0 ? (
                      filteredItems?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.itemName}</td>
                          <td>{item?.hsnSac || "-"}</td>
                          <td>
                            <div className="flex items-center">
                              <LuIndianRupee size={12} />
                              {item?.purchasePrice?.toLocaleString("en-IN") ||
                                "-"}
                            </div>
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                const exists = addedItems.find(
                                  (i) => i._id === item._id
                                );

                                if (exists) {
                                  // Remove item if it already exists
                                  setAddedItems((prev) =>
                                    prev.filter((i) => i._id !== item._id)
                                  );
                                } else {
                                  const newItem = calculateItem(
                                    { ...item, quantity: 1 },
                                    checked
                                  );
                                  setAddedItems((prev) => [...prev, newItem]);
                                }
                              }}
                              className={`${
                                addedItems.find((i) => i._id === item._id)
                                  ? "btn-error"
                                  : "btn-success"
                              } btn btn-xs rounded-full btn-soft`}
                            >
                              {addedItems.find((i) => i._id === item._id) ? (
                                <>Remove</>
                              ) : (
                                <>Add</>
                              )}
                            </button>
                          </td>
                          <td>
                            <Trash
                              onClick={() => handleDelete(item?._id)}
                              size={15}
                              className="text-error"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">
                          <div className="flex flex-col gap-2 items-center justify-center">
                            <img src={no_items} alt="no_items" width={150} />
                            <span>No items found.</span>
                            <button
                              onClick={() => setSearchQuery("")}
                              className="btn btn-dash rounded-xl btn-neutral btn-xs"
                            >
                              Clear Search
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center py-4 flex-col gap-2">
              <img src={no_items} alt="no_items" width={100} />
              <p className="text-zinc-500">No items added yet.</p>
              <button
                onClick={() => {
                  document.getElementById("create_item_modal").showModal();
                  document.getElementById("add_item_modal").close();
                }}
                className="btn btn-info btn-sm btn-dash rounded-xl"
              >
                Create Item
              </button>
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm rounded-xl">Close</button>
            </form>
            <button
              disabled={addedItems.length === 0}
              onClick={() => {
                document.getElementById("add_item_modal").close();
                setData((prev) => ({
                  ...prev,
                  items: addedItems,
                }));
              }}
              className="btn bg-[var(--primary-btn)] btn-sm rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      </dialog>

      {/* MODAL TO ADD EXPENSE CATEGORY */}
      <CreateExpenseCategory />

      <CreateExpenseItem />
    </main>
  );
};

export default CreateExpenseForm;
