import { useEffect, useMemo, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { CircleX, Percent, Plus } from "lucide-react";
import { HiMiniMinusSmall, HiOutlinePlus } from "react-icons/hi2";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import DashboardItemsSidebar from "../../pages/Items/DashboardItemsSidebar";
import not_found from "../../assets/not-found.png";
import { useBusinessStore } from "../../store/businessStore";
import { FaBarcode } from "react-icons/fa6";
import { getTotalTaxRate } from "../../../helpers/getGSTTaxRate";

const SalesInvoiceItemTableTesting = ({
  title,
  data,
  setData,
  invoiceTotals,
}) => {
  const { business } = useBusinessStore();
  const [searchItemQuery, setSearchItemQuery] = useState("");
  const [showCounterId, setShowCounterId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [basePrices, setBasePrices] = useState({});

  // FETCH ITEMS
  const { data: items = [] } = useQuery({
    queryKey: ["items", business?._id],
    queryFn: async () => {
      if (!business?._id) return [];
      const res = await axiosInstance.get(`/item/all/${business._id}`);
      return res.data.items;
    },
    enabled: !!business?._id,
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.itemName.toLowerCase().includes(searchItemQuery.toLowerCase())
    );
  }, [items, searchItemQuery]);

  //   FUNCTION TO HANDLE QUANTITY CHANGE
  const handleQuantityChange = (itemId, type, value) => {
    setQuantities((prev) => {
      const currentQty = prev[itemId] || 1;

      if (type === "increment") {
        return { ...prev, [itemId]: currentQty + 1 };
      } else if (type === "decrement") {
        return { ...prev, [itemId]: Math.max(currentQty - 1, 0) };
      } else if (type === "manual") {
        const newQty = Number(value);
        return { ...prev, [itemId]: newQty < 0 ? 0 : newQty };
      }
      return prev;
    });
  };

  // FUNCTION WHICH HANDLES DONE
  const handleDone = () => {
    if (!items?.length) return;

    const isPurchaseType = [
      "Purchase Invoice",
      "Purchase Return",
      "Purchase Order",
    ].includes(title);

    setData((prev) => {
      const existingIds = new Set(prev.items?.map((item) => item._id));

      const selectedItems = items
        .filter(
          (item) =>
            (quantities[item._id] || 0) > 0 && !existingIds.has(item._id)
        )
        .map((item) => {
          const quantity = quantities[item._id];
          const basePrice = isPurchaseType
            ? item.purchasePrice
            : item.salesPrice;
          const gstTaxRate = isPurchaseType
            ? item.purchaseGstTaxRate || item.gstTaxRate
            : item.gstTaxRate;
          const gstTaxRateType = isPurchaseType
            ? item?.purchasePriceType || "with tax"
            : item?.salesPriceType || "with tax";

          return {
            ...item,
            quantity,
            priceType: isPurchaseType ? "purchase" : "sales",
            basePrice,
            purchasePrice: isPurchaseType ? item.purchasePrice : undefined,
            salesPrice: !isPurchaseType ? item.salesPrice : undefined,
            gstTaxRate,
            gstTaxRateType,
            discountPercent: 0,
            discountAmount: 0,
          };
        });

      return {
        ...prev,
        items: [...(prev.items || []), ...selectedItems],
      };
    });

    // Close modal and reset counter
    document.getElementById("add_items_modal").close();
    setShowCounterId(false);
  };

  // HANDLING DISCOUNT CHANGE
  const handleDiscountChange = (index, value, type) => {
    setData((prevData) => {
      const updatedItems = [...prevData.items];
      const currentItem = { ...updatedItems[index] };

      const numericValue = parseFloat(value) || 0;

      if (type === "percent") {
        currentItem.discountPercent = numericValue;

        const base = currentItem.basePrice || currentItem.salesPrice || 0;
        const qty = currentItem.quantity || 1;

        // Calculate discountAmount only for totals, keep input flexible
        currentItem.discountAmount = (base * qty * numericValue) / 100;
      } else if (type === "amount") {
        currentItem.discountAmount = numericValue;

        const base = currentItem.basePrice || currentItem.salesPrice || 0;
        const qty = currentItem.quantity || 1;

        currentItem.discountPercent =
          base * qty ? (numericValue / (base * qty)) * 100 : 0;
      }

      updatedItems[index] = currentItem;

      return {
        ...prevData,
        items: updatedItems,
      };
    });
  };

  // HANDLING GST TAX RATE TYPE CHANGE
  const handleGstTypeChange = (itemId, newType) => {
    setData((prev) => {
      const updatedItems = prev.items.map((item) =>
        item._id === itemId ? { ...item, gstTaxRateType: newType } : item
      );
      return { ...prev, items: updatedItems };
    });
  };

  useEffect(() => {
    if (!data?.items?.length) return;

    let totalDiscount = 0;
    let totalTaxableValue = 0;
    let totalTax = 0;
    let totalAmount = 0; // final total including charges and GST
    let totalAdditionalDiscount = 0;
    let subtotalAmount = 0; // sum of items before discounts and GST

    const updatedItems = data.items.map((item) => {
      const isPurchaseType = [
        "Purchase Invoice",
        "Purchase Return",
        "Purchase Order",
      ].includes(title);

      const quantity = quantities[item._id] || item?.quantity || 0;
      const discountPercent = item?.discountPercent || 0;
      const discountAmount = item?.discountAmount || 0;
      const gstRate = getTotalTaxRate(item?.gstTaxRate || "0");

      const rawPrice = isPurchaseType
        ? item.purchasePrice || 0
        : item.salesPrice || 0;
      const manualBasePrice = basePrices[item._id];

      let basePrice;
      if (manualBasePrice !== undefined) {
        basePrice = manualBasePrice;
      } else if (item.gstTaxRateType === "with tax") {
        basePrice = rawPrice / (1 + gstRate / 100);
      } else {
        basePrice = rawPrice;
      }

      const finalDiscountAmount = discountPercent
        ? (basePrice * quantity * discountPercent) / 100
        : discountAmount;

      const gstAmount =
        (basePrice * quantity - finalDiscountAmount) * (gstRate / 100);

      let totalItemAmount =
        basePrice * quantity - finalDiscountAmount + gstAmount;

      let additionalDiscountAmount = 0;
      if (data?.additionalDiscountPercent > 0) {
        if (data?.additionalDiscountType === "before tax") {
          additionalDiscountAmount =
            ((basePrice * quantity - finalDiscountAmount) *
              data.additionalDiscountPercent) /
            100;
          totalItemAmount -= additionalDiscountAmount;
        } else if (data?.additionalDiscountType === "after tax") {
          additionalDiscountAmount =
            (totalItemAmount * data.additionalDiscountPercent) / 100;
          totalItemAmount -= additionalDiscountAmount;
        }
      }

      totalDiscount += finalDiscountAmount;
      totalTaxableValue += basePrice * quantity - finalDiscountAmount;
      totalTax += gstAmount;
      totalAdditionalDiscount += additionalDiscountAmount;
      subtotalAmount += basePrice * quantity; // before discounts and GST
      totalAmount += totalItemAmount;

      return {
        ...item,
        quantity,
        basePrice,
        discountAmount: finalDiscountAmount,
        gstAmount,
        totalAmount: totalItemAmount,
        additionalDiscountAmount,
      };
    });

    // Additional charges
    const additionalCharge = Number(data?.additionalChargeAmount || 0);
    const additionalChargeGSTRate = getTotalTaxRate(
      data?.additionalChargeTax || "0"
    );
    const additionalChargeGST =
      (additionalCharge * additionalChargeGSTRate) / 100;

    totalAmount += additionalCharge + additionalChargeGST;

    setData((prev) => {
      const updatedData = {
        ...prev,
        items: updatedItems,
        discountSubtotal: Number(totalDiscount.toFixed(2)),
        taxableAmount: Number(totalTaxableValue.toFixed(2)),
        cgst: Number((totalTax / 2).toFixed(2)),
        sgst: Number((totalTax / 2).toFixed(2)),
        balanceAmount: Number(totalAmount.toFixed(2)), // final total including charges and GST
        totalAmount: Number(totalAmount.toFixed(2)), // explicit totalAmount field
        amountSubTotal: Number(subtotalAmount.toFixed(2)), // sum of base prices before discounts/GST
        additionalChargeAmount: Number(additionalCharge.toFixed(2)),
        additionalChargeTax: prev.additionalChargeTax || "",
        additionalDiscountPercent: prev.additionalDiscountPercent || 0,
        additionalDiscountType: prev.additionalDiscountType || "after tax",
        additionalDiscountAmount: Number(totalAdditionalDiscount.toFixed(2)),
      };

      if (JSON.stringify(prev) === JSON.stringify(updatedData)) return prev;
      return updatedData;
    });
  }, [
    data?.items,
    quantities,
    basePrices,
    data?.additionalDiscountPercent,
    data?.additionalDiscountType,
    data?.additionalChargeAmount,
    data?.additionalChargeTax,
    title,
  ]);

  return (
    <>
      <div className="w-full grid grid-cols-11 text-xs ">
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

      {/* RENDEING THE ITEMS HERE */}
      {data?.items?.map((item, index) => (
        <div className="w-full grid grid-cols-11 text-xs" key={item?._id}>
          {/* Row Number */}
          <span className="border-t p-2 border-[var(--primary-border)]">
            {index + 1}
          </span>

          {/* Item Name */}
          <span className="border-t flex flex-col  border-l p-2 border-[var(--primary-border)] col-span-3">
            {item?.itemName}
            {item?.description.length > 0 && (
              <p className="text-xs mt-2 text-zinc-600">
                ({item?.description})
              </p>
            )}
          </span>

          {/* HSN */}
          <span className="border-t border-l p-2 border-[var(--primary-border)]">
            {item?.HSNCode || "-"}
          </span>

          {/* Quantity */}
          <span className="border-t border-l p-2 border-[var(--primary-border)]">
            <input
              type="number"
              min={1}
              value={quantities[item._id] || item?.quantity}
              onChange={(e) => {
                const newQty = Number(e.target.value);
                setQuantities((prev) => ({
                  ...prev,
                  [item._id]: newQty,
                }));
                setData((prev) => ({
                  ...prev,
                  items: prev.items.map((i) =>
                    i._id === item._id ? { ...i, quantity: newQty } : i
                  ),
                }));
              }}
              placeholder="0"
              className="input input-xs bg-zinc-100 text-right w-full"
            />
          </span>

          {/* Price */}
          <span className="border-l text-nowrap border-t p-2 border-[var(--primary-border)]">
            <input
              type="number"
              min={0}
              value={
                basePrices[item._id] ??
                (item?.basePrice ? Number(item?.basePrice).toFixed(2) : 0)
              }
              className="input input-xs bg-zinc-100 text-right"
              onChange={(e) => {
                const newPrice = Number(e.target.value);

                // Update local basePrices state
                setBasePrices((prev) => ({
                  ...prev,
                  [item._id]: newPrice,
                }));

                // Update the data items array for instant reflection
                setData((prev) => ({
                  ...prev,
                  items: prev.items.map((i) =>
                    i._id === item._id ? { ...i, basePrice: newPrice } : i
                  ),
                }));
              }}
            />
          </span>

          {/* Discount */}
          <span className="border-l relative border-t p-2 border-[var(--primary-border)]">
            {/* Discount % */}
            <input
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={
                item?.discountPercent !== undefined
                  ? Number(item.discountPercent.toFixed(2))
                  : ""
              }
              onChange={(e) =>
                handleDiscountChange(index, e.target.value, "percent")
              }
              className="input input-xs bg-zinc-100 text-right"
            />

            <Percent size={10} className="absolute top-[14.3px] left-3 z-10" />

            {/* Discount Amount */}
            <input
              type="number"
              min={0}
              step="0.01"
              value={
                item?.discountAmount !== undefined
                  ? Number(item.discountAmount.toFixed(2))
                  : ""
              }
              onChange={(e) =>
                handleDiscountChange(index, e.target.value, "amount")
              }
              className="input input-xs bg-zinc-100 text-right mt-1"
            />

            <LiaRupeeSignSolid className="absolute top-[41.3px] left-3 z-10" />
          </span>

          {/* Tax */}
          <div className="border-l border-t p-2 border-[var(--primary-border)]">
            <input
              value={Number(item?.gstAmount).toLocaleString("en-IN")}
              className="input input-xs bg-zinc-100 text-right"
              readOnly
            />
            <small className="text-zinc-500 mt-1 text-xs text-nowrap">
              {item?.gstTaxRate && <span>({item?.gstTaxRate})</span>}
            </small>
            <select
              value={item?.gstTaxRateType || "with tax"}
              onChange={(e) => handleGstTypeChange(item._id, e.target.value)}
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
              value={Number(item?.totalAmount).toLocaleString("en-IN") ?? 0}
              className="input input-xs bg-zinc-100 text-right"
              readOnly
            />
            <LiaRupeeSignSolid className="absolute top-[14.3px] left-3 z-10" />
          </span>

          {/* Delete */}
          <span className="border-l grid place-items-center border-t border-r p-2 border-[var(--primary-border)] text-[var(--error-text-color)]">
            <BsTrash3
              onClick={() => {
                setData((prev) => ({
                  ...prev,
                  items: prev.items.filter((i) => i._id !== item?._id),
                }));
                setQuantities((prev) => {
                  const updated = { ...prev };
                  delete updated[item?._id];
                  return updated;
                });
                setBasePrices((prev) => {
                  const updated = { ...prev };
                  delete updated[item?._id];
                  return updated;
                });
              }}
              size={20}
              className="cursor-pointer"
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
        {/* ADD ITEMS DIALOG BOX -------------------------------------------------------- */}
        <div className="w-7/10 ">
          <button
            onClick={() =>
              document.getElementById("add_items_modal").showModal()
            }
            className="btn btn-info w-full hover:btn-dash"
          >
            + Add Item
          </button>

          <dialog id="add_items_modal" className="modal">
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
                      onClick={() => {
                        document.getElementById("add_items_modal").close();
                        document.getElementById("my_modal_3").showModal();
                      }}
                      className="btn btn-sm btn-outline btn-info"
                    >
                      <Plus size={14} /> Create Item
                    </button>

                    {/* MODAL TO CREATE AN ITEM ---------------------------------------- */}
                    <dialog id="my_modal_3" className="modal">
                      <div className="modal-box w-11/12 max-w-5xl h-3/4">
                        <DashboardItemsSidebar modalId={"my_modal_3"} />
                      </div>
                    </dialog>
                    {/* MODAL TO CREATE AN ITEM ENDS ---------------------------------------- */}
                  </div>
                </div>

                {/* MAIN TABLE WHERE THE ITEMS LIST GETS RENDERED----------------------------------------------------------------------- */}
                <div className="overflow-x-auto mt-4 h-[450px] max-h-[80vh] overflow-y-auto rounded-lg border border-base-content/5">
                  <table className="table table-zebra bg-zinc-200 w-full">
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
                      {filteredItems.length > 0 ? (
                        filteredItems?.map((item) => (
                          <tr key={item?._id}>
                            <td>{item?.itemName || "-"}</td>
                            <td>{item?.itemCode || "-"}</td>
                            <td>
                              <div className="flex items-center gap-0">
                                <LiaRupeeSignSolid />
                                {Number(item?.salesPrice ?? 0).toLocaleString(
                                  "en-IN"
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-0">
                                <LiaRupeeSignSolid />
                                {Number(
                                  item?.purchasePrice ?? 0
                                ).toLocaleString("en-IN")}
                              </div>
                            </td>
                            <td>{Math.max(item?.currentStock ?? 0, 0)}</td>

                            {/*  THIS IS WHERE THE ITEMS QUANTITY GETS UPDATED------------------------------------------------------------------- */}
                            <td>
                              {showCounterId === item?._id ? (
                                <div className="flex items-center justify-center space-x-2">
                                  {/* Counter Box */}
                                  <div className="flex rounded-md  items-center bg-white  shadow-sm overflow-hidden">
                                    {/* Minus Button */}
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(
                                          item._id,
                                          "decrement"
                                        )
                                      }
                                      className="px-1 py-0 bg-[var(--primary-btn)] hover:bg-[var(--primary-btn)]/90 transition-colors text-white"
                                    >
                                      <HiMiniMinusSmall className="w-4 h-4" />
                                    </button>

                                    {/* Input */}
                                    <input
                                      type="number"
                                      min={0}
                                      value={quantities[item._id] || 1}
                                      onChange={(e) =>
                                        handleQuantityChange(
                                          item?._id,
                                          "manual",
                                          e.target.value
                                        )
                                      }
                                      placeholder="0"
                                      className="w-10 text-center text-xs font-medium outline-none "
                                    />

                                    {/* Plus Button */}
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(
                                          item._id,
                                          "increment"
                                        )
                                      }
                                      className="px-1 py-0 bg-[var(--primary-btn)] hover:bg-[var(--primary-btn)]/90 transition-colors text-white"
                                    >
                                      <HiOutlinePlus className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {/* Remove Icon */}
                                  <button
                                    onClick={() => {
                                      setShowCounterId(false);
                                      setQuantities((prev) => {
                                        const updated = { ...prev };
                                        delete updated[item._id]; // remove quantity entry
                                        return updated;
                                      });
                                    }}
                                    className="p-2 rounded-full hover:bg-red-100 transition-colors"
                                  >
                                    <BsTrash3
                                      size={13}
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
                                  className="btn btn-xs w-full btn-dash btn-neutral"
                                >
                                  Add
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-6">
                            <div className="flex flex-col items-center justify-center gap-2 py-12">
                              <img
                                src={not_found}
                                alt="No items"
                                width={60}
                                height={60}
                                className="object-contain"
                                loading="lazy"
                              />
                              <span className="text-gray-600 text-sm font-medium">
                                No items found
                              </span>
                              <button
                                onClick={() => setSearchItemQuery("")}
                                className="btn btn-xs btn-neutral btn-outline"
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
                {/* MAIN TABLE WHERE THE ITEMS LIST ENDS----------------------------------------------------------------------- */}
              </div>
              <div className="modal-action p-4 ">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm w-32">Cancel</button>
                </form>
                <button
                  className="btn btn-sm w-32 bg-[var(--primary-btn)]"
                  onClick={handleDone}
                >
                  Done
                </button>
              </div>
            </div>
          </dialog>
        </div>
        {/* ADD ITEMS DIALOG BOX ENDS HERE -------------------------------------------------------- */}

        <div className="btn  w-3/10 ml-2 btn-soft btn-info">
          <FaBarcode />
          <span className="font-medium">Scan Barcode</span>
        </div>
      </div>

      {/* SUBTOTAL SECTION ----------------------------------------------------------------------------------------------------------- */}
      <div className="w-full grid grid-cols-11 text-sm">
        {/* Label */}
        <span className="border-t border-b border-r p-2 border-[var(--primary-border)] col-span-8 text-end font-semibold">
          SUBTOTAL
        </span>

        {/* Total Discount */}
        <span className="border-t border-r border-b p-2 border-[var(--primary-border)] text-right">
          ₹{" "}
          {(invoiceTotals?.totalDiscount ?? 0)
            .toFixed(2)
            .toLocaleString("en-IN")}
        </span>

        {/* Total GST */}
        <span className="border-t border-b p-2 border-[var(--primary-border)] text-right">
          ₹{" "}
          {Number((invoiceTotals?.totalTax ?? 0).toFixed(2)).toLocaleString(
            "en-IN"
          )}
        </span>

        {/* Total Amount */}
        <span className="border p-2 border-[var(--primary-border)] text-right">
          ₹{" "}
          {Number((invoiceTotals?.totalAmount ?? 0).toFixed(2)).toLocaleString(
            "en-IN"
          )}
        </span>
      </div>

      {/* SUBTOTAL SECTION ENDS ----------------------------------------------------------------------------------------------------------- */}
    </>
  );
};

export default SalesInvoiceItemTableTesting;
