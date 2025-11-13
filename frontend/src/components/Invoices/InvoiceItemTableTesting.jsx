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
import { gstRates } from "../../utils/constants";

const SalesInvoiceItemTableTesting = ({
  title,
  data,
  setData,
  invoiceTotals,
  invoiceToUpdate,
  party,
}) => {
  const { business } = useBusinessStore();
  const [searchItemQuery, setSearchItemQuery] = useState("");
  const [showCounterId, setShowCounterId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [basePrices, setBasePrices] = useState({});
  const [manualBasePriceRaw, setManualBasePriceRaw] = useState({});
  const [openCounters, setOpenCounters] = useState({});

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
            salesPrice: !isPurchaseType
              ? party?.partyType === "Dealer"
                ? item?.salesPriceForDealer
                : item.salesPrice
              : undefined,
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

  // MAIN USE EFFECT FOR CALCULATION
  useEffect(() => {
    if (!data?.items?.length) return;

    let totalDiscount = 0;
    let totalTaxableValue = 0;
    let totalTax = 0;
    let totalAmount = 0;
    let totalAdditionalDiscount = 0;
    let subtotalAmount = 0;

    const isPurchaseType = [
      "Purchase Invoice",
      "Purchase Return",
      "Purchase Order",
    ].includes(title);

    const addDiscPercent = Number(data?.additionalDiscountPercent ?? 0);
    const addDiscType = data?.additionalDiscountType ?? "after tax";

    const updatedItems = data.items.map((item) => {
      const quantity = Number(quantities[item._id] ?? item?.quantity ?? 0);
      const discountPercent = Number(item?.discountPercent ?? 0);
      const discountAmount = Number(item?.discountAmount ?? 0);
      const gstRate = Number(getTotalTaxRate(item?.gstTaxRate ?? "0"));
      const gstType = item?.gstTaxRateType ?? "with tax";

      const rawPrice = isPurchaseType
        ? Number(item?.purchasePrice ?? 0)
        : Number(item?.salesPrice ?? 0);

      const manualRaw = manualBasePriceRaw[item._id] ?? 0;

      const effectivePrice = manualRaw > 0 ? manualRaw : rawPrice;
      const basePriceExclusive =
        gstType === "with tax"
          ? effectivePrice / (1 + gstRate / 100)
          : effectivePrice;

      const finalDiscountAmount = discountPercent
        ? (basePriceExclusive * quantity * discountPercent) / 100
        : discountAmount;

      const grossValue = basePriceExclusive;
      let taxableAfterDiscount = grossValue - finalDiscountAmount / quantity;

      // add additional charge as well as discount
      let additionalDiscountAmount = 0;
      if (addDiscPercent > 0 && addDiscType === "before tax") {
        additionalDiscountAmount =
          (taxableAfterDiscount * addDiscPercent) / 100;
        taxableAfterDiscount -= additionalDiscountAmount;
      }

      const gstAmount = Math.max(
        ((taxableAfterDiscount * gstRate) / 100) * quantity,
        0
      );

      let totalItemAmount = taxableAfterDiscount * quantity + gstAmount;

      if (addDiscPercent > 0 && addDiscType === "after tax") {
        const afterTaxDisc = (totalItemAmount * addDiscPercent) / 100;
        additionalDiscountAmount = afterTaxDisc;
        totalItemAmount -= afterTaxDisc;
      }

      totalDiscount += finalDiscountAmount;
      totalTaxableValue += taxableAfterDiscount * quantity;
      totalTax += gstAmount;
      totalAdditionalDiscount += additionalDiscountAmount;
      subtotalAmount += basePriceExclusive * quantity;
      totalAmount += totalItemAmount;

      return {
        ...item,
        quantity,
        basePrice: Number(basePriceExclusive.toFixed(2)),
        discountAmount: finalDiscountAmount,
        taxableAmount: Number((taxableAfterDiscount * quantity).toFixed(2)),
        gstAmount,
        totalAmount: totalItemAmount,
        additionalDiscountAmount,
      };
    });

    // --- handle multiple additional charges ---
    let totalAdditionalCharges = 0;
    let totalAdditionalChargeGST = 0;

    if (
      Array.isArray(data?.additionalCharges) &&
      data.additionalCharges.length > 0
    ) {
      data.additionalCharges.forEach((charge) => {
        const amount = Number(charge.amount ?? 0);
        const gstRate = Number(getTotalTaxRate(charge.tax ?? "0"));
        const gstAmount = (amount * gstRate) / 100;

        totalAdditionalCharges += amount;
        totalAdditionalChargeGST += gstAmount;
      });
    }

    totalAmount += totalAdditionalCharges + totalAdditionalChargeGST;

    setData((prev) => {
      let changed = false;
      const newItems = prev.items.map((item, idx) => {
        const updatedItem = updatedItems[idx];
        if (JSON.stringify(item) !== JSON.stringify(updatedItem)) {
          changed = true;
          return updatedItem;
        }
        return item;
      });

      if (!changed) return prev;

      return {
        ...prev,
        items: newItems,
        discountSubtotal: Number(totalDiscount.toFixed(2)),
        taxableAmount: Number(totalTaxableValue.toFixed(2)),
        cgst: Number((totalTax / 2).toFixed(2)),
        sgst: Number((totalTax / 2).toFixed(2)),
        balanceAmount: Number(totalAmount.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2)),
        amountSubTotal: Number(subtotalAmount.toFixed(2)),
        additionalCharges: data.additionalCharges,
        totalAdditionalChargeAmount: Number(totalAdditionalCharges.toFixed(2)),
        totalAdditionalChargeGST: Number(totalAdditionalChargeGST.toFixed(2)),
        additionalDiscountPercent: addDiscPercent,
        additionalDiscountType: addDiscType,
        additionalDiscountAmount: Number(totalAdditionalDiscount.toFixed(2)),
      };
    });
  }, [
    data.items,
    quantities,
    basePrices,
    manualBasePriceRaw,
    title,
    data.additionalDiscountPercent,
    data.additionalDiscountType,
    data.additionalChargeAmount,
    data.additionalChargeTax,
    data.additionalCharges,
    JSON.stringify(data.items.map((i) => i.gstTaxRateType)),
    JSON.stringify(data.items.map((i) => i.gstTaxRate)),
  ]);

  return (
    <>
      <div className="w-full grid grid-cols-12 text-xs ">
        <span className="border-t p-2 border-[var(--primary-border)] uppercase bg-[var(--primary-background)]">
          NO
        </span>
        <span className="border-t border-l p-2 border-[var(--primary-border)] col-span-2 uppercase bg-[var(--primary-background)]">
          Items/ Services
        </span>
        <span className="border-t border-l p-2 border-[var(--primary-border)] col-span-2 uppercase bg-[var(--primary-background)]">
          Description
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

      {/* RENDERING THE ITEMS HERE */}
      {data?.items?.map((item, index) => (
        <div className="w-full grid grid-cols-12 text-xs" key={item?._id}>
          {/* Row Number */}
          <span className="border-t p-2 border-[var(--primary-border)]">
            {index + 1}
          </span>

          {/* Item Name */}
          <span className="border-t flex flex-col border-l p-2 border-[var(--primary-border)] col-span-2">
            {item?.itemName}
          </span>

          {/* Description */}
          <span className="border-t border-l p-2 border-[var(--primary-border)] col-span-2">
            <textarea
              type="text"
              value={item?.description || ""}
              placeholder="description"
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  items: prev.items.map((i) =>
                    i._id === item._id
                      ? { ...i, description: e.target.value }
                      : i
                  ),
                }));
              }}
              className="p-2 border border-zinc-300 rounded-md bg-zinc-100 text-left w-full"
            />
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
              value={quantities[item._id] || item?.quantity || 1}
              onChange={(e) => {
                let newQty = Number(e.target.value);
                if (isNaN(newQty) || newQty < 1) newQty = 1;
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
              placeholder="1"
              className="input input-xs bg-zinc-100 text-right w-full"
            />
          </span>

          {/* Price */}
          <span className="border-l text-nowrap border-t p-2 border-[var(--primary-border)]">
            <input
              type="number"
              min={0}
              value={
                basePrices[item._id] !== undefined
                  ? basePrices[item._id]
                  : item?.basePrice
                  ? Number(item.basePrice).toFixed(2)
                  : ""
              }
              className="input input-xs bg-zinc-100 text-right"
              onChange={(e) => {
                const newPrice =
                  e.target.value === "" ? "" : Number(e.target.value);

                setBasePrices((prev) => ({ ...prev, [item._id]: newPrice }));

                setManualBasePriceRaw((prev) => ({
                  ...prev,
                  [item._id]: newPrice,
                }));

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
                item.discountPercent !== undefined
                  ? String(item.discountPercent)
                  : ""
              }
              onChange={(e) => {
                let value = parseFloat(e.target.value);
                if (isNaN(value)) value = 0;

                if (value > 100) value = 100;
                if (value < 0) value = 0;

                handleDiscountChange(index, value, "percent");
              }}
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
            {/* <small className="text-zinc-500 mt-1 text-xs text-nowrap">
              {item?.gstTaxRate && <span>({item?.gstTaxRate})</span>}
            </small> */}

            <select
              value={item?.gstTaxRate || "0"}
              onChange={(e) => {
                const newRate = e.target.value;
                setData((prev) => ({
                  ...prev,
                  items: prev.items.map((i) =>
                    i._id === item._id ? { ...i, gstTaxRate: newRate } : i
                  ),
                }));
              }}
              className="select select-xs bg-zinc-100 text-left mt-1"
            >
              {gstRates.map((rate) => (
                <option value={rate.label}>{rate.label}</option>
              ))}
            </select>

            <select
              value={item?.gstTaxRateType || "with tax"}
              onChange={(e) => {
                const newType = e.target.value;
                setData((prev) => ({
                  ...prev,
                  items: prev.items.map((i) =>
                    i._id === item._id ? { ...i, gstTaxRateType: newType } : i
                  ),
                }));
              }}
            >
              <option value="with tax">with tax</option>
              <option value="without tax">without tax</option>
            </select>
          </div>

          {/* Amount */}
          <span className="relative border-l border-t p-2 border-[var(--primary-border)]">
            <input
              value={
                item?.totalAmount !== undefined && item?.totalAmount !== null
                  ? Math.round(Number(item.totalAmount)).toLocaleString("en-IN")
                  : 0
              }
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
          {/* ADD ITEMS BUTTON SHOULD NOT BE VISIBLE FOR SALES RETURN AND PURCHASE RETURN */}

          <button
            onClick={() =>
              document.getElementById("add_items_modal").showModal()
            }
            className={`${
              title === "Sales Return" || title === "Purchase Return"
                ? "hidden"
                : "btn btn-info w-full hover:btn-dash rounded-xl"
            }`}
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
                      className="btn btn-sm btn-outline btn-info rounded-xl"
                    >
                      <Plus size={14} /> Create Item
                    </button>

                    {/* MODAL TO CREATE AN ITEM ---------------------------------------- */}
                    <dialog id="my_modal_3" className="modal">
                      <div className="modal-box w-11/12 max-w-5xl h-3/4">
                        <DashboardItemsSidebar
                          modalId={"my_modal_3"}
                          isOpen={true}
                        />
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
                        <th>Sales Price (Customer)</th>
                        <th>Sales Price (Dealer)</th>
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
                                  item?.salesPriceForDealer ?? 0
                                ).toLocaleString("en-IN")}
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
                            <td className="w-44">
                              {openCounters[item._id] ? (
                                <div className="flex items-center justify-center space-x-1">
                                  <div className="flex rounded-2xl p-1 items-center bg-white shadow-md overflow-hidden">
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(
                                          item._id,
                                          "decrement"
                                        )
                                      }
                                      className="px-1 rounded-xl py-1 bg-[var(--primary-btn)] text-white"
                                    >
                                      <HiMiniMinusSmall className="w-4 h-4" />
                                    </button>

                                    <input
                                      type="number"
                                      min={0}
                                      value={quantities[item._id] || 1}
                                      onChange={(e) =>
                                        handleQuantityChange(
                                          item._id,
                                          "manual",
                                          e.target.value
                                        )
                                      }
                                      className="w-10 text-center text-xs font-medium outline-none"
                                    />

                                    <button
                                      onClick={() =>
                                        handleQuantityChange(
                                          item._id,
                                          "increment"
                                        )
                                      }
                                      className="px-1 rounded-xl py-1 bg-[var(--primary-btn)] text-white"
                                    >
                                      <HiOutlinePlus className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <button
                                    onClick={() =>
                                      setOpenCounters((prev) => {
                                        const updated = { ...prev };
                                        delete updated[item._id];
                                        return updated;
                                      })
                                    }
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
                                    setOpenCounters((prev) => ({
                                      ...prev,
                                      [item._id]: true,
                                    }));
                                    setQuantities((prev) => ({
                                      ...prev,
                                      [item._id]: prev[item._id] ?? 1,
                                    }));
                                  }}
                                  className="btn rounded-xl btn-xs w-full btn-dash btn-neutral"
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
                                className="btn rounded-xl btn-xs btn-neutral btn-outline"
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
                  <button className="btn rounded-xl btn-sm w-32">Cancel</button>
                </form>
                <button
                  className="btn rounded-xl btn-sm w-32 bg-[var(--primary-btn)]"
                  onClick={handleDone}
                >
                  Done
                </button>
              </div>
            </div>
          </dialog>
        </div>
        {/* ADD ITEMS DIALOG BOX ENDS HERE -------------------------------------------------------- */}

        {/* <div className="btn  w-3/10 ml-2 btn-soft btn-info">
          <FaBarcode />
          <span className="font-medium">Scan Barcode</span>
        </div> */}
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
