import { useEffect, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useItemStore } from "../../store/itemStore";
import { Link } from "react-router-dom";
import { FaBarcode } from "react-icons/fa6";
import { CircleX, Percent, Plus } from "lucide-react";
import { useInvoiceStore } from "../../store/invoicesStore";
import { usePurchaseInvoiceStore } from "../../store/purchaseInvoiceStore";
import DashboardItemsSidebar from "../../pages/Items/DashboardItemsSidebar";
import { HiMiniMinusSmall, HiOutlinePlus } from "react-icons/hi2";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import { useDebounce } from "../../../helpers/useDebounce";
import { useBusinessStore } from "../../store/businessStore";

const SalesInvoiceItemTable = ({
  title,
  data,
  setData,
  isEditing,
  invoiceToUpdate,
}) => {
  const [searchItemQuery, setSearchItemQuery] = useState("");
  const [showCounterId, setShowCounterId] = useState();
  const [addedItems, setAddedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { invoices } = useInvoiceStore();
  const { business } = useBusinessStore();
  const { purchaseInvoices } = usePurchaseInvoiceStore();

  const debouncedSearch = useDebounce(searchItemQuery, 400);

  // FETCHING ALL ITEMS FOR THE BUSINESS
  const {
    data: items,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["items", business?._id, debouncedSearch],
    queryFn: async () => {
      if (!business?._id) return [];
      const res = await axiosInstance.get(
        `/item/all/${
          business._id
        }?page=${1}&limit=${100}&search=${encodeURIComponent(
          debouncedSearch || ""
        )}`
      );
      return res.data.items;
    },
    enabled: !!business?._id,
    keepPreviousData: true,
  });

  // handle base price change
  const handleBasePriceChange = (itemId, value) => {
    console.log(value);
    setAddedItems((prev) =>
      prev.map((item) =>
        item._id === itemId
          ? { ...item, basePrice: Number(value), isManualBase: true }
          : item
      )
    );
  };

  // HANDLE GST TYPE CHANGE
  const handleSetGstTaxRateType = (e, itemId) => {
    const { value } = e.target;
    setAddedItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, gstTaxRateType: value } : item
      )
    );
  };

  // HANDLE DISCOUNT CHANGE
  const handleSetDiscountPercent = (percent, itemId) => {
    setAddedItems((prev) =>
      prev.map((item) => {
        const price = Number(item?.salesPrice) || 0;
        const qty = item?.quantity || 1;
        const totalBase = price * qty;

        const discountAmount = (totalBase * percent) / 100;

        return item._id === itemId
          ? {
              ...item,
              discountPercent: percent,
              discountAmount: discountAmount.toFixed(2),
            }
          : item;
      })
    );
  };

  // HANDLE DISCOUNT AMOUNT CHANGE
  const handleSetDiscountAmount = (amount, itemId) => {
    setAddedItems((prev) =>
      prev.map((item) => {
        const price = Number(item?.salesPrice) || 0;
        const qty = item?.quantity || 1;
        const totalBase = price * qty;

        const discountPercent = (amount / totalBase) * 100;

        return item._id === itemId
          ? {
              ...item,
              discountAmount: amount,
              discountPercent: discountPercent.toFixed(2),
            }
          : item;
      })
    );
  };

  // MAIN USE EFFECT WHICH CALCULATES EVERYTHING
  useEffect(() => {
    if (!addedItems?.length) return;

    const getGSTPercentage = (rateString) => {
      const match = rateString?.match(/(\d+)%/);
      return match ? parseFloat(match[1]) : 0;
    };

    let updatedItems = addedItems.map((item) => {
      const qty = quantities[item._id] || 1;
      const price = [
        "Purchase Invoice",
        "Purchase Return",
        "Purchase Order",
        "Debit Note",
      ].includes(title)
        ? Number(item.purchasePrice) || 0
        : Number(item.salesPrice) || 0;

      const gstRate = getGSTPercentage(item?.gstTaxRate);
      let gstType = item?.gstTaxRateType;

      let basePrice = item.isManualBase
        ? Number(item?.basePrice) || 0
        : gstType === "without tax"
        ? Number(price)
        : Number(price) * (100 / (100 + gstRate));

      let discountAmount = 0;
      if (item.discountPercent)
        discountAmount = ((basePrice * item.discountPercent) / 100) * qty;
      else if (item.discountAmount)
        discountAmount = Number(item.discountAmount);

      discountAmount = Math.min(discountAmount, basePrice * qty);

      const taxableValue = basePrice * qty - discountAmount;
      const gstAmount = (taxableValue * gstRate) / 100;
      const finalAmount = taxableValue + gstAmount;

      console.log();

      return {
        ...item,
        quantity: qty,
        basePrice: basePrice.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        gstAmount: gstAmount.toFixed(2),
        taxableValue: taxableValue.toFixed(2),
        totalAmount: finalAmount.toFixed(2),
      };
    });

    // Totals
    let totalTaxableAmount = updatedItems.reduce(
      (acc, i) => acc + Number(i.taxableValue),
      0
    );
    let totalGstAmount = updatedItems.reduce(
      (acc, i) => acc + Number(i.gstAmount),
      0
    );
    let totalAmount = updatedItems.reduce(
      (acc, i) => acc + Number(i.totalAmount),
      0
    );
    let discountTotal = updatedItems.reduce(
      (acc, i) => acc + Number(i.discountAmount),
      0
    );

    const addCharge = Number(data?.additionalChargeAmount || 0);
    if (addCharge > 0) {
      const addChargeTaxRate = getGSTPercentage(data?.additionalChargeTax);
      const addChargeTax = (addCharge * addChargeTaxRate) / 100;
      totalGstAmount += addChargeTax;
      totalAmount += addCharge + addChargeTax;
    }

    const addlDiscPercent = Number(data?.additionalDiscountPercent || 0);
    let balanceAmount = totalAmount;

    if (addlDiscPercent > 0 && data?.additionalDiscountType === "before tax") {
      const discountValue = (totalTaxableAmount * addlDiscPercent) / 100;
      totalTaxableAmount -= discountValue;
      totalGstAmount = (totalTaxableAmount * getGSTPercentage("18%")) / 100;
      totalAmount = totalTaxableAmount + totalGstAmount;
      balanceAmount = totalAmount;
    }

    if (addlDiscPercent > 0 && data?.additionalDiscountType === "after tax") {
      const discountValue = (totalAmount * addlDiscPercent) / 100;
      balanceAmount -= discountValue;
      totalAmount -= discountValue;
    }

    const cgst = Number((totalGstAmount / 2).toFixed(2));
    const sgst = Number((totalGstAmount / 2).toFixed(2));

    setData((prev) => ({
      ...prev,
      items: updatedItems,
      amountSubTotal: parseFloat(totalAmount.toFixed(2)),
      taxableAmount: parseFloat(totalTaxableAmount.toFixed(2)),
      totalGstAmount: parseFloat(totalGstAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      balanceAmount: parseFloat(balanceAmount.toFixed(2)),
      cgst: String(cgst),
      sgst: String(sgst),
    }));
  }, [
    addedItems,
    quantities,
    data?.additionalChargeAmount,
    data?.additionalChargeTax,
    data?.additionalDiscountPercent,
    data?.additionalDiscountType,
  ]);

  // THIS USE EFFECT CALCULATES FOR SALES RETURN AND PURCHASE RETURN
  useEffect(() => {
    if (title === "Sales Return") {
      const invoice = invoices?.invoices.find(
        (invoice) => invoice?._id === data?.invoiceId
      );

      if (invoice) {
        setData((prev) => ({ ...invoice, invoiceId: invoice?._id }));
      }
    } else if (title === "Purchase Return") {
      const invoice = purchaseInvoices.find(
        (invoice) => invoice?._id === data?.invoiceId
      );

      if (invoice) {
        setData((prev) => ({ ...invoice, invoiceId: invoice?._id }));
      }
    }
  }, [data?.invoiceId, invoices]);

  return (
    <>
      <div className="w-full grid grid-cols-11 text-xs">
        <span className="border-t p-2 border-[var(--primary-border)] uppercase bg-[var(--primary-background)]">
          NO
        </span>
        <span className="border-t border-l p-2 border-[var(--primary-border)] col-span-3 uppercase bg-[var(--primary-background)]">
          Items/ Services
        </span>
        <span className="border-t border-l p-2 border-[var(--primary-border)] uppercase bg-[var(--primary-background)]">
          HSN/ SAC
        </span>
        <span className="border-t border-l p-2 border-[var(--primary-border)] uppercase bg-[var(--primary-background)]">
          Qty
        </span>
        <span className="border-l text-nowrap border-t p-2 border-[var(--primary-border)] uppercase bg-[var(--primary-background)]">
          Price/Item (₹)
        </span>
        <span className="border-l border-t p-2 border-[var(--primary-border)] uppercase bg-[var(--primary-background)]">
          Discount
        </span>
        <span className="border-l border-t p-2 border-[var(--primary-border)] uppercase bg-[var(--primary-background)]">
          Tax
        </span>
        <span className="border-l border-t p-2 border-[var(--primary-border)] uppercase bg-[var(--primary-background)]">
          Amount (₹)
        </span>
        <span className="border-l border-t border-r p-2 border-[var(--primary-border)] text-gray-500 uppercase bg-[var(--primary-background)]"></span>
      </div>

      {data?.items?.map((addedItem, index) => (
        <div className="w-full grid grid-cols-11 text-xs" key={addedItem?._id}>
          {/* Row Number */}
          <span className="border-t p-2 border-[var(--primary-border)]">
            {index + 1}
          </span>

          {/* Item Name */}
          <span className="border-t flex flex-col  border-l p-2 border-[var(--primary-border)] col-span-3">
            {addedItem?.itemName}
            {addedItem?.description.length > 0 && (
              <p className="text-xs mt-2 text-zinc-600">
                ({addedItem?.description})
              </p>
            )}
          </span>

          {/* HSN */}
          <span className="border-t border-l p-2 border-[var(--primary-border)]">
            {addedItem?.HSNCode || "-"}
          </span>

          {/* Quantity */}
          <span className="border-t border-l p-2 border-[var(--primary-border)]">
            <input
              type="number"
              min={0}
              value={quantities[addedItem._id] || addedItem?.quantity}
              onChange={(e) =>
                setQuantities((prev) => ({
                  ...prev,
                  [addedItem._id]: Number(e.target.value),
                }))
              }
              placeholder="0"
              className="input input-xs bg-zinc-100 text-right w-full"
            />
          </span>

          {/* Price */}
          <span className="border-l text-nowrap border-t p-2 border-[var(--primary-border)]">
            <input
              type="text"
              className="input input-xs bg-zinc-100 text-right"
              value={addedItem?.basePrice ?? ""}
              onChange={(e) =>
                handleBasePriceChange(addedItem._id, e.target.value)
              }
            />
          </span>

          {/* Discount */}
          <span className="border-l relative border-t p-2 border-[var(--primary-border)]">
            {/* Discount % */}
            <input
              type="number"
              min={0}
              max={100}
              className="input input-xs bg-zinc-100 text-right"
              value={addedItem?.discountPercent ?? 0}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                handleSetDiscountPercent(isNaN(val) ? 0 : val, addedItem._id);
              }}
            />

            <Percent size={10} className="absolute top-[14.3px] left-3 z-10" />

            {/* Discount Amount */}
            <input
              type="number"
              min={0}
              className="input input-xs bg-zinc-100 text-right mt-1"
              value={addedItem?.discountAmount || ""}
              onChange={(e) =>
                handleSetDiscountAmount(
                  parseFloat(e.target.value) || 0,
                  addedItem._id
                )
              }
            />
            <LiaRupeeSignSolid className="absolute top-[41.3px] left-3 z-10" />
          </span>

          {/* Tax */}
          <div className="border-l border-t p-2 border-[var(--primary-border)]">
            <input
              className="input input-xs bg-zinc-100 text-right"
              value={Number(addedItem?.gstAmount || 0).toLocaleString("en-IN")}
              readOnly
            />
            <small className="text-zinc-500 mt-1 text-xs text-nowrap">
              {addedItem?.gstTaxRate && <span>({addedItem?.gstTaxRate})</span>}
            </small>
            <select
              value={addedItem?.gstTaxRateType || "with tax"}
              onChange={(e) => handleSetGstTaxRateType(e, addedItem._id)}
              className="text-[var(--secondary-text-color)]"
            >
              <option value="with tax" className="hidden">
                with tax
              </option>
              <option value="with tax">with tax</option>
              <option value="without tax">without tax</option>
            </select>
          </div>

          {/* Amount */}
          <span className="relative border-l border-t p-2 border-[var(--primary-border)]">
            <input
              className="input input-xs bg-zinc-100 text-right"
              value={Number(addedItem?.totalAmount || 0).toLocaleString(
                "en-IN"
              )}
              readOnly
            />
            <LiaRupeeSignSolid className="absolute top-[14.3px] left-3 z-10" />
          </span>

          {/* Delete */}
          <span className="border-l grid place-items-center border-t border-r p-2 border-[var(--primary-border)] text-[var(--error-text-color)]">
            <BsTrash3
              size={20}
              className="cursor-pointer"
              onClick={() => {
                const filteredItems = addedItems.filter(
                  (item) => item?._id !== addedItem?._id
                );
                setAddedItems(filteredItems);
                setData((prev) => ({ ...prev, items: filteredItems }));
              }}
            />
          </span>
        </div>
      ))}

      {/* ADD ITEMS POPUP */}
      <div
        className={`${
          data?.invoiceId && "hidden"
        } p-2 flex border-t border-r border-[var(--primary-border)]`}
      >
        {/* Add Item dialog box -------------------------------------------------------- */}

        <div className="w-7/10 ">
          <button
            onClick={() => document.getElementById("my_modal_10").showModal()}
            className="btn btn-info w-full hover:btn-dash"
          >
            + Add Item
          </button>

          <dialog id="my_modal_10" className="modal">
            <div className="modal-box max-w-5xl p-0">
              <h3 className="font-semibold text-lg bg-zinc-100 p-2">
                Add Items
              </h3>
              <div className="p-4">
                <div className="flex items-center gap-3 justify-between">
                  <input
                    type="text"
                    placeholder="Search Items"
                    className="input input-sm "
                    value={searchItemQuery}
                    onChange={(e) => setSearchItemQuery(e.target.value)}
                  />
                  {/* <select
                    defaultValue="Select Category"
                    className="select select-sm"
                  >
                    <option disabled={true}>Select Category</option>
                    <option>Crimson</option>
                  </select> */}
                  <div>
                    <button
                      // to={"/dashboard/items/basic-details"}
                      onClick={() =>
                        document.getElementById("my_modal_3").showModal()
                      }
                      className="btn btn-sm btn-outline btn-info"
                    >
                      <Plus size={14} /> Create Item
                    </button>

                    <dialog id="my_modal_3" className="modal">
                      <div className="modal-box w-11/12 max-w-5xl h-3/4">
                        <DashboardItemsSidebar
                          // data={items}
                          modalId={"my_modal_3"}
                        />
                        {/* <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                </div> */}
                      </div>
                    </dialog>
                  </div>
                </div>

                <div className="overflow-x-auto mt-4 h-[450px] overflow-y-scroll rounded-box border border-base-content/5 ">
                  <table className="table table-zebra bg-zinc-300 ">
                    {/* head */}
                    <thead>
                      <tr className="text-xs bg-zinc-100 ">
                        <th>Item Name</th>
                        <th>Item Code</th>
                        <th>Sales Price</th>
                        <th>Purchase Price</th>
                        <th>Current Stock</th>
                        <th className="text-center">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items &&
                        items?.map((item) => (
                          <tr key={item?._id}>
                            <td>{item?.itemName || "-"}</td>
                            <td>{item?.itemCode || "-"}</td>
                            <td className="flex items-center">
                              <LiaRupeeSignSolid />{" "}
                              {Number(item?.salesPrice).toLocaleString(
                                "en-IN"
                              ) || "-"}
                            </td>
                            <td>-</td>
                            <td>{item?.currentStock || "-"}</td>
                            <td>
                              {showCounterId === item?._id ? (
                                <div className="flex items-center justify-center space-x-2">
                                  {/* Counter Box */}
                                  <div className="flex items-center bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
                                    {/* Minus Button */}
                                    <button
                                      onClick={() =>
                                        setQuantities((prev) => ({
                                          ...prev,
                                          [item._id]: Math.max(
                                            (prev[item._id] || 1) - 1,
                                            0
                                          ),
                                        }))
                                      }
                                      className="px-3 py-2 bg-[var(--primary-btn)] hover:bg-[var(--primary-btn)]/90 transition-colors text-white"
                                    >
                                      <HiMiniMinusSmall className="w-4 h-4" />
                                    </button>

                                    {/* Input */}
                                    <input
                                      type="number"
                                      min={0}
                                      value={quantities[item._id] || 1}
                                      onChange={(e) =>
                                        setQuantities((prev) => ({
                                          ...prev,
                                          [item._id]: Number(e.target.value),
                                        }))
                                      }
                                      placeholder="0"
                                      className="w-12 text-center text-sm font-medium outline-none border-x border-gray-200"
                                    />

                                    {/* Plus Button */}
                                    <button
                                      onClick={() =>
                                        setQuantities((prev) => ({
                                          ...prev,
                                          [item._id]: (prev[item._id] || 1) + 1,
                                        }))
                                      }
                                      className="px-3 py-2 bg-[var(--primary-btn)] hover:bg-[var(--primary-btn)]/90 transition-colors text-white"
                                    >
                                      <HiOutlinePlus className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {/* Remove Icon */}
                                  <button
                                    onClick={() => setShowCounterId(false)}
                                    className="p-2 rounded-full hover:bg-red-100 transition-colors"
                                  >
                                    <CircleX
                                      size={18}
                                      className="text-red-500"
                                    />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setShowCounterId(item?._id);
                                    setQuantities((prev) => ({
                                      ...prev,
                                      [item._id]: prev[item._id] ?? 1,
                                    }));
                                  }}
                                  className="btn btn-xs w-full btn-dash"
                                >
                                  Add
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-action p-4 ">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm w-32">Cancel</button>
                </form>
                <button
                  className="btn btn-sm w-32 bg-[var(--primary-btn)]"
                  onClick={() => {
                    const selected = items
                      ?.filter((item) => (quantities[item._id] || 0) > 0)
                      .map((item) => {
                        if (
                          title === "Purchase Invoice" ||
                          title === "Purchase Return" ||
                          title === "Purchase Order"
                        ) {
                          return {
                            ...item,
                            quantity: quantities[item._id],
                            priceType: "purchase",
                            basePrice: item.purchasePrice,
                            purchasePrice: item.purchasePrice,
                            gstTaxRate:
                              item.purchaseGstTaxRate || item.gstTaxRate,
                            gstTaxRateType: "with tax",
                            discountPercent: 0,
                            discountAmount: 0,
                          };
                        } else {
                          // Sales Invoice or Sales Return
                          return {
                            ...item,
                            quantity: quantities[item._id],
                            priceType: "sales",
                            basePrice: item.salesPrice,
                            salesPrice: item.salesPrice,
                            gstTaxRate: item.gstTaxRate,
                            gstTaxRateType: "with tax",
                            discountPercent: 0,
                            discountAmount: 0,
                          };
                        }
                      });
                    setAddedItems(selected);
                    setData((prev) => ({ ...prev, items: selected }));
                    document.getElementById("my_modal_10").close();
                    setShowCounterId(false);
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </dialog>
        </div>

        {/* Add Item dialog box ends -------------------------------------------------------- */}

        <div className="btn  w-3/10 ml-2 btn-soft btn-info">
          <FaBarcode />
          <span className="font-medium">Scan Barcode</span>
        </div>
      </div>

      <div className="w-full grid grid-cols-11 text-sm">
        <span className="border-t border-b border-r p-2 border-[var(--primary-border)] col-span-8 text-end font-semibold">
          SUBTOTAL
        </span>
        <span className="border-t border-r border-b p-2 border-[var(--primary-border)] ">
          ₹{" "}
          {data?.items.reduce(
            (acc, item) => acc + Number(item?.discountAmount),
            0
          )}
        </span>
        <span className="border-t border-b p-2 border-[var(--primary-border)]">
          ₹ {Number(data?.totalGstAmount || 0).toLocaleString("en-IN")}
        </span>
        <span className="border p-2 border-[var(--primary-border)] ">
          ₹ {Number(data?.amountSubTotal || 0).toLocaleString("en-IN")}
        </span>
      </div>
    </>
  );
};

export default SalesInvoiceItemTable;
