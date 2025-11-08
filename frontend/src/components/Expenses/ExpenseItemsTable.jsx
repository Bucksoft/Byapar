import { LuIndianRupee } from "react-icons/lu";
import { getTotalTaxRate } from "../../../helpers/getGSTTaxRate";
import { useEffect } from "react";
import { useMemo } from "react";
import { LucideAlertTriangle, X } from "lucide-react";
import { gstRates } from "../../utils/constants";

// CALCULATE ITEM
export const calculateItem = (item, isGST) => {
  const qty = Number(item?.quantity) || 0;
  const price = Number(item?.purchasePrice) || 0;
  const gstRate = getTotalTaxRate(item?.gstRate || "0");
  const taxType = item?.taxType || "without_tax";

  let tax = 0,
    amount = 0,
    basePrice = 0;

  if (!isGST) {
    amount = qty * price;
  } else {
    if (taxType === "without_tax") {
      tax = (price * qty * gstRate) / 100;
      amount = qty * price + tax;
    } else {
      basePrice = (price * 100) / (100 + gstRate);
      tax = qty * (price - basePrice);
      amount = qty * price;
    }
  }

  return {
    ...item,
    tax: parseFloat(tax.toFixed(2)),
    amount: parseFloat(amount.toFixed(2)),
    basePrice: parseFloat(basePrice.toFixed(2)),
  };
};

const ExpenseItemsTable = ({
  addedItems,
  checked,
  setAddedItems,
  setData,
  data,
}) => {
  // IT HANDLES THE INPUT CHANGE
  const handleItemChange = (id, field, value) => {
    setAddedItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? calculateItem(
              { ...item, [field]: value === "" ? "" : value },
              checked
            )
          : item
      )
    );
  };

  // RE TRIGGERS CALCULATION WHENEVER CHECKBOX CHANGES
  useEffect(() => {
    setAddedItems((prev) => prev.map((item) => calculateItem(item, checked)));
  }, [checked]);

  // CALCULATE TOTAL
  const totals = useMemo(() => {
    const totalQuantity = addedItems.reduce(
      (acc, item) => acc + Number(item?.quantity),
      0
    );
    const totalTax = addedItems.reduce(
      (acc, item) => acc + Number(item?.tax),
      0
    );
    const totalAmount = addedItems.reduce(
      (acc, item) => acc + Number(item?.amount),
      0
    );

    const totalAdditionalChargeAmount = data.additionalCharges.reduce(
      (acc, item) => acc + item.amount,
      0
    );

    const totalAdditionalChargeGST = data.additionalCharges.reduce(
      (acc, item) => acc + item.gstAmount,
      0
    );

    const totalAmountAfterCharges = totalAmount + totalAdditionalChargeAmount;

    setData((prev) => ({
      ...prev,
      totalAmount,
      totalQuantity,
      totalTax,
      totalAdditionalChargeAmount,
      totalAdditionalChargeGST,
      totalAmountAfterCharges,
    }));

    return {
      totalAmount,
      totalQuantity,
      totalTax,
    };
  }, [addedItems, checked, data.additionalCharges]);

  const handleChargeChange = (index, field, value) => {
    setData((prev) => {
      const updated = [...prev.additionalCharges];
      updated[index][field] = value;

      const amount = parseFloat(updated[index].amount) || 0;
      const gstRate = getTotalTaxRate(updated[index].gstRate);
      const gstAmount = (amount * gstRate) / 100;

      updated[index].gstAmount = gstAmount;

      return { ...prev, additionalCharges: updated };
    });
  };

  console.log(data);

  return (
    <>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table table-xs table-zebra">
          <thead>
            <tr className="uppercase bg-zinc-200">
              <th className="w-1/12">Sr.</th>
              <th className="w-3/6">Item Name</th>
              <th className="w-1/8">Quantity</th>
              <th className="w-1/8">Price/unit</th>
              {checked && <th className="w-1/8">Tax</th>}
              <th className="w-1/8 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {addedItems.length > 0 ? (
              addedItems.map((item, index) => (
                <tr key={item?._id}>
                  {/* SERIAL NUMBER */}
                  <td className="border-r border-zinc-200">{index + 1}</td>

                  {/* ITEM NAME */}
                  <td className="border-r border-zinc-200">{item?.itemName}</td>

                  {/* ITEM QUANTITY */}
                  <td className="border-r border-zinc-200">
                    <input
                      type="text"
                      min={1}
                      className="input input-bordered input-xs w-full text-right"
                      value={item?.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          item?._id,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>

                  {/* ITEM PRICE */}
                  <td className="border-r border-zinc-200">
                    {" "}
                    <input
                      type="number"
                      className="input input-bordered input-xs w-full text-right"
                      value={
                        item?.taxType === "without_tax"
                          ? item?.purchasePrice
                          : item?.basePrice
                      }
                      onChange={(e) =>
                        handleItemChange(
                          item?._id,
                          "purchasePrice",
                          Number(e.target.value)
                        )
                      }
                    />
                    {checked && (
                      <select
                        value={item?.taxType || "without_tax"}
                        className="select select-xs mt-1 "
                        onChange={(e) =>
                          handleItemChange(item?._id, "taxType", e.target.value)
                        }
                      >
                        <option value="without_tax">without tax</option>
                        <option value="with_tax">with tax</option>
                      </select>
                    )}
                  </td>

                  {/* ITEM TAX */}
                  {checked && (
                    <td className="border-r border-zinc-200">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          className="input input-bordered input-xs w-full text-right"
                          value={getTotalTaxRate(item?.gstRate)}
                          onChange={(e) => {
                            const newValue = Number(e.target.value);
                            const gstString = `GST @ ${newValue}%`;
                            handleItemChange(item?._id, "gstRate", gstString);
                          }}
                        />

                        <span>%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          className="input input-bordered input-xs w-full mt-1 text-right"
                          value={item?.tax}
                          onChange={(e) =>
                            handleItemChange(
                              item?._id,
                              "tax",
                              Number(e.target.value)
                            )
                          }
                        />
                        <span>
                          <LuIndianRupee size={10} />
                        </span>
                      </div>
                    </td>
                  )}

                  {/* ITEM AMOUNT */}
                  <td>
                    {" "}
                    <input
                      type="number"
                      className="input input-bordered input-xs w-full text-right"
                      value={item?.amount}
                      onChange={(e) =>
                        handleItemChange(
                          item?._id,
                          "amount",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>
                </tr>
              ))
            ) : (
              <>
                <tr>
                  <td colSpan={5}>
                    <div className="flex items-center justify-center py-4 gap-2 text-sm text-zinc-600">
                      <LucideAlertTriangle size={20} />
                      Add few items.
                    </div>
                  </td>
                </tr>
              </>
            )}
          </tbody>

          <tfoot>
            <tr className="uppercase bg-zinc-200">
              <th colSpan={2} className="text-right border-r border-zinc-300">
                Total
              </th>

              {/* total quantity */}
              <th className="border-r border-zinc-300">
                <p type="number" className="w-full text-right">
                  {totals?.totalQuantity}
                </p>
              </th>

              {/* total price/unit */}
              <th className="border-r border-zinc-300">
                {/* <p
                  type="number"
                  className="w-full flex items-center justify-end"
                >
                  <LuIndianRupee size={10} />0
                </p> */}
              </th>

              {/* total tax */}
              {checked && (
                <th className="border-r border-zinc-300">
                  <p
                    type="number"
                    className="w-full flex items-center justify-end "
                  >
                    <LuIndianRupee size={10} />
                    {totals?.totalTax.toFixed(2)}
                  </p>
                </th>
              )}

              {/* total amount */}
              <th>
                <p
                  type="number"
                  className="w-full flex items-center justify-end"
                >
                  <LuIndianRupee size={10} />
                  {totals?.totalAmount.toFixed(2)}
                </p>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ADDITIONAL CHARGES & ADDITIONAL DISCOUNT  */}
      <div className="w-full flex items-center ">
        <div className="ml-auto w-1/3 p-2 border border-zinc-200 rounded-xl">
          {/* charges */}
          <div className="flex flex-col items-start">
            <button
              onClick={() => {
                setData((prev) => ({
                  ...prev,
                  additionalCharges: [
                    ...prev.additionalCharges,
                    {
                      reason: "",
                      amount: 0,
                      gstRate: "",
                      gstAmount: 0,
                    },
                  ],
                }));
              }}
              className="text-xs text-info"
            >
              + Additional Charges
            </button>
            {data?.additionalCharges?.map((charge, index) => (
              <div className="flex items-center my-2">
                <input
                  type="text"
                  className="input input-xs"
                  placeholder="Reason"
                  value={charge.reason}
                  onChange={(e) =>
                    handleChargeChange(index, "reason", e.target.value)
                  }
                />
                <input
                  type="number"
                  className="input input-xs"
                  placeholder="Amount"
                  value={charge.amount}
                  onChange={(e) =>
                    handleChargeChange(
                      index,
                      "amount",
                      parseFloat(e.target.value)
                    )
                  }
                />
                <select
                  value={charge.gstRate}
                  onChange={(e) =>
                    handleChargeChange(index, "gstRate", e.target.value)
                  }
                  className="select select-xs bg-zinc-100"
                >
                  {gstRates.map((rate) => (
                    <option value={rate.label}>{rate.label}</option>
                  ))}
                </select>

                <button
                  onClick={() =>
                    setData((prev) => ({
                      ...prev,
                      additionalCharges: prev.additionalCharges.filter(
                        (_, i) => i != index
                      ),
                    }))
                  }
                  className="text-zinc-700 border rounded-full p-1 ml-1"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* discount */}
          <div className="flex flex-col items-start">
            <span className="text-xs text-info">Additional Discount</span>
            <div className="flex w-full my-1">
              <select
                value={data.additionalDicountType}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    additionalDicountType: e.target.value,
                  }))
                }
                className="select select-xs bg-zinc-100"
              >
                <option value="after_tax">After tax</option>
                <option value="before_tax">Before tax</option>
              </select>

              <input
                type="number"
                value={data.additionalDicountPercent}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    additionalDicountPercent: parseFloat(e.target.value),
                  }))
                }
                className="input input-xs"
                placeholder="Percentage"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TOTAL AFTER DISCSOUNT AND ADDITIONAL CHARGES */}
      <div className="ml-auto w-1/3 py-10 px-2 border rounded-xl border-zinc-200 flex items-center justify-between text-zinc-600 font-bold">
        <span>TOTAL AMOUNT</span>
        <p className="flex items-center ">
          <LuIndianRupee size={15} />
          100
        </p>
      </div>
    </>
  );
};

export default ExpenseItemsTable;

// sales invoice mein qty ke basis pr price/item change ho rha hai, jo ki nhi hona chahiye.
