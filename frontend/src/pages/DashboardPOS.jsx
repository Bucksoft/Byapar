import { IndianRupee, Plus, Search, Settings, Trash, X } from "lucide-react";
import { motion } from "framer-motion";
import POSTotalSidebar from "../components/POS/POSTotalSidebar";
import { useEffect, useState } from "react";
import noItems from "../assets/no_items.jpg";
import DashboardItemsSidebar from "./Items/DashboardItemsSidebar";
import { useItemStore } from "../store/itemStore";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useBusinessStore } from "../store/businessStore";
import { getTotalTaxRate } from "../../helpers/getGSTTaxRate";

const DashboardPOS = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: itemsList } = useQuery({
    queryKey: ["posItems"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/item/all/${business?._id}`);
      return res.data?.items;
    },
  });

  const { business } = useBusinessStore();
  const [showItemsList, setShowItemsList] = useState(false);

  // DATA OBJECT TO SEND AT THE BACKEND
  const [data, setData] = useState({
    items: [],
    discountPercent: 0,
    discountAmount: 0,
    discountType: "after_tax",
    computedDiscount: 0,
    additionalCharges: [
      {
        charge: "",
        amount: 0,
      },
    ],
    totalAdditionalCharges: 0,
    customerDetails: {
      mobile: "",
      customerName: "",
    },
    subTotal: 0,
    tax: 0,
    totalAmount: 0,
    receivedAmount: 0,
    paymentMode: "cash",
  });

  // CALCULATIONS FOR ITEM
  const calculateItemAmounts = (item, quantity) => {
    const price = Number(item?.salesPrice) || 0;
    const gstRate = getTotalTaxRate(item?.gstTaxRate || "0");
    const taxType = item?.salesPriceType || "with tax";

    let basePrice = 0;
    let taxAmount = 0;

    if (taxType === "with tax") {
      basePrice = price / (1 + gstRate / 100);
      taxAmount = price - basePrice;
    } else if (taxType === "without tax") {
      basePrice = price;
      taxAmount = price * (gstRate / 100);
    }

    const totalBase = basePrice * quantity;
    const totalTax = taxAmount * quantity;

    return {
      quantity,
      basePrice: Number(basePrice),
      taxAmount: Number(taxAmount),
      totalBase: Number(totalBase),
      totalTax: Number(totalTax),
      amount: Number(price * quantity),
    };
  };

  const calculateTotals = (
    items,
    discountType,
    discountPercent,
    discountAmount,
    additionalCharges
  ) => {
    let subtotal = 0;
    let totalTax = 0;

    items.forEach((item) => {
      subtotal += Number(item.totalBase || 0);
      totalTax += Number(item.totalTax || 0);
    });

    const totalAdditionalCharges = additionalCharges.reduce((sum, c) => {
      return sum + Number(c.amount || 0);
    }, 0);

    let computedDiscount = 0;

    if (discountPercent > 0) {
      if (discountType === "before_tax") {
        computedDiscount = (subtotal * discountPercent) / 100;
      } else {
        computedDiscount = ((subtotal + totalTax) * discountPercent) / 100;
      }
    }
    // if (discountAmount > 0) {
    //   computedDiscount = Number(discountAmount);
    // }

    const basePlusTax = subtotal + totalTax;
    const totalBeforeAdditional = basePlusTax - computedDiscount;

    const grandTotal = totalBeforeAdditional + totalAdditionalCharges;
    const receivedAmount = grandTotal;
    return {
      subtotal,
      totalTax,
      totalAdditionalCharges,
      computedDiscount,
      grandTotal,
      receivedAmount,
    };
  };

  // CALCULATE TOTALS
  useEffect(() => {
    const totals = calculateTotals(
      data.items,
      data.discountType,
      data.discountPercent,
      data.discountAmount,
      data.additionalCharges
    );
    setData((prev) => ({
      ...prev,
      subTotal: totals?.subtotal,
      tax: totals?.totalTax,
      totalAdditionalCharges: totals?.totalAdditionalCharges,
      discountAmount: totals?.computedDiscount,
      computedDiscount: totals?.computedDiscount,
      totalAmount: totals?.grandTotal,
      receivedAmount: totals?.receivedAmount,
    }));
  }, [
    data.items,
    data.discountType,
    data.discountPercent,
    data.discountAmount,
    data.additionalCharges,
  ]);

  return (
    <main className="h-full overflow-y-scroll">
      <section className="w-full border-r h-full border-zinc-200  flex flex-col">
        {/* POS Navigation */}
        <motion.header
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
          className="p-2 flex items-center justify-between bg-zinc-100 border-b border-zinc-200"
        >
          <p>POS Billing</p>
          <button className="btn btn-sm rounded-xl">
            <Settings size={16} />
            Settings
          </button>
        </motion.header>

        {/* POS Subheading */}
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
            delay: 0.3,
          }}
          className="flex items-center text-xs border-b border-zinc-200"
        >
          <div className="flex items-center gap-9 bg-amber-100 p-3 border-r border-r-zinc-300">
            <p>Billing Screen 1</p>
            <span>
              <X size={15} className="cursor-pointer" />
            </span>
          </div>
          <div className="flex cursor-pointer items-center gap-9 p-3 border-r text-[var(--badge)] border-r-zinc-300">
            <p>Create another</p>
            <span>
              <Plus size={15} />
            </span>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="w-full flex h-full">
          <section className="w-3/4 border-r h-full border-zinc-200 px-2 py-5">
            <motion.div
              initial={{
                rotateX: -180,
                opacity: 0,
              }}
              animate={{
                rotateX: 0,
                opacity: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
              }}
              className="grid grid-cols-5 gap-5 "
            >
              <button
                onClick={() =>
                  document.getElementById("my_modal_3").showModal()
                }
                className="btn btn-sm rounded-xl btn-neutral"
              >
                <Plus size={15} /> New Item
              </button>

              {/* POPUP TO ADD NEW ITEM */}
              <dialog id="my_modal_3" className="modal">
                <div className="modal-box w-11/12 max-w-5xl h-3/4">
                  <DashboardItemsSidebar
                    modalId={"my_modal_3"}
                    isPOSItem={true}
                    isOpen={true}
                  />
                </div>
              </dialog>

              {/* <button className="btn btn-sm btn-error btn-soft rounded-xl">
                Delete Item
              </button> */}
            </motion.div>

            <motion.div
              initial={{
                width: 0,
                opacity: 0,
              }}
              animate={{
                width: "100%",
                opacity: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.5,
              }}
              className="relative"
              onClick={() => setShowItemsList((prev) => !prev)}
            >
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Item name"
                className="my-3 p-1 border rounded-md border-zinc-200 px-8 w-full"
              />
              <Search
                className="absolute top-5 left-2 text-zinc-500"
                size={15}
              />
            </motion.div>

            <div className="relative overflow-x-auto border border-zinc-200">
              {showItemsList && (
                <table className="absolute table table-xs z-10">
                  <thead className="bg-black">
                    <tr className="text-white">
                      <th className="w-3/4">Item Name</th>
                      <th>Current Stock</th>
                      <th>Sales Price</th>
                      <th>MRP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsList?.length &&
                      itemsList
                        ?.filter((item) => item.isPOSItem)
                        ?.filter((item) =>
                          item.itemName
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        )
                        .map((item, index) => (
                          <tr
                            onClick={() =>
                              setData((prev) => {
                                const existingItem = prev.items.find(
                                  (i) => i._id === item._id
                                );

                                if (existingItem) {
                                  const newQty = existingItem.quantity + 1;
                                  const calc = calculateItemAmounts(
                                    existingItem,
                                    newQty
                                  );

                                  return {
                                    ...prev,
                                    items: prev.items.map((i) =>
                                      i._id === item._id ? { ...i, ...calc } : i
                                    ),
                                  };
                                }

                                // New item with quantity 1
                                const calc = calculateItemAmounts(item, 1);

                                return {
                                  ...prev,
                                  items: [...prev.items, { ...item, ...calc }],
                                };
                              })
                            }
                            key={index}
                            className="cursor-pointer hover:bg-error/10"
                          >
                            <td>{item?.itemName}</td>
                            <td>{item?.currentStock || "-"}</td>
                            <td>{item?.salesPrice || "-"}</td>
                            <td>{item?.mrp || "-"}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* table */}
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
              className="flex-1 overflow-auto mt-5 rounded-box border border-base-content/5 bg-base-100"
            >
              <table className="table table-zebra">
                {/* head */}
                <thead>
                  <tr className="bg-zinc-200">
                    <th>NO</th>
                    <th>ITEMS</th>
                    <th>ITEMS CODE</th>
                    <th>MRP</th>
                    <th className=" flex items-center">
                      SP (<IndianRupee size={10} />)
                    </th>
                    <th>QUANTITY</th>
                    <th className=" flex items-center">
                      AMOUNT (<IndianRupee size={10} />)
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {/* ITEM LIST IS RENDERED HERE */}
                  {data.items.length ? (
                    data.items.map((item, index) => (
                      <tr className="text-sm" key={item?._id}>
                        <td>{index + 1}</td>

                        {/* ITEM NAME */}
                        <td>{item?.itemName}</td>

                        {/* ITEM CODE */}
                        <td>{item?.itemCode}</td>

                        {/* ITEM MRP */}
                        <td>{item?.mrp ? item?.mrp : "-"}</td>

                        {/* ITEM SALES PRICE */}
                        <td>
                          <input
                            value={item?.salesPrice}
                            onChange={(e) => {
                              const updatedPrice = Number(e.target.value);

                              const updatedItem = {
                                ...item,
                                salesPrice: updatedPrice,
                              };

                              const updated = calculateItemAmounts(
                                updatedItem,
                                updatedItem.quantity
                              );

                              setData((prev) => ({
                                ...prev,
                                items: prev.items.map((i) =>
                                  i._id === item._id
                                    ? {
                                        ...updatedItem,
                                        ...updated,
                                      }
                                    : i
                                ),
                              }));
                            }}
                            type="text"
                            className="input input-xs  w-20"
                          />
                        </td>

                        {/* ITEM QUANTITY */}
                        <td>
                          <input
                            value={item?.quantity}
                            onChange={(e) => {
                              const updatedQty = Number(e.target.value);

                              const updatedItem = {
                                ...item,
                                quantity: updatedQty,
                              };

                              const updated = calculateItemAmounts(
                                updatedItem,
                                updatedQty
                              );

                              setData((prev) => ({
                                ...prev,
                                items: prev.items.map((i) =>
                                  i._id === item._id
                                    ? {
                                        ...updatedItem,
                                        ...updated,
                                      }
                                    : i
                                ),
                              }));
                            }}
                            type="text"
                            className="input input-xs  w-20"
                          />
                        </td>
                        {/* ITEM AMOUNT */}
                        <td>
                          <input
                            readOnly
                            value={item?.amount}
                            type="text"
                            className="input input-xs w-20"
                          />
                        </td>

                        {/* DELETE */}
                        <td>
                          <Trash
                            onClick={() =>
                              setData((prev) => ({
                                ...prev,
                                items: prev.items.filter(
                                  (i) => i._id !== item._id
                                ),
                              }))
                            }
                            size={16}
                            className="text-rose-500 cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7}>
                        <div className="flex flex-col items-center py-5 text-zinc-500 text-sm">
                          <img
                            src={noItems}
                            alt="no_items"
                            width={120}
                            loading="lazy"
                          />
                          <h2>No items added yet.</h2>
                          <p>Add by searching item or by scanning QR code.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          </section>

          {/* Right section */}
          <POSTotalSidebar data={data} setData={setData} />
        </div>
      </section>
    </main>
  );
};

export default DashboardPOS;
