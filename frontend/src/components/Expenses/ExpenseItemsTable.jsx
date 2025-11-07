import { LuIndianRupee } from "react-icons/lu";
import { getTotalTaxRate } from "../../../helpers/getGSTTaxRate";
import { useEffect } from "react";
import { useMemo } from "react";
import { LucideAlertTriangle } from "lucide-react";

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

const ExpenseItemsTable = ({ addedItems, checked, setAddedItems, setData }) => {
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

    setData((prev) => ({
      ...prev,
      totalAmount,
      totalQuantity,
      totalTax,
    }));

    return {
      totalAmount,
      totalQuantity,
      totalTax,
    };
  }, [addedItems, checked]);

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
    </>
  );
};

export default ExpenseItemsTable;
