import { useEffect, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useItemStore } from "../../store/itemStore";
import { Link } from "react-router-dom";
import { FaBarcode } from "react-icons/fa6";
import { CircleX, Percent } from "lucide-react";
import { useInvoiceStore } from "../../store/invoicesStore";

const SalesInvoiceItemTable = ({ data, setData }) => {
  const [searchItemQuery, setSearchItemQuery] = useState("");
  const [showCounterId, setShowCounterId] = useState();
  const [addedItems, setAddedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { invoices } = useInvoiceStore();
  const { items } = useItemStore();

  const searchedItems = items?.filter((item) =>
    item?.itemName.toLowerCase().includes(searchItemQuery.toLowerCase())
  );

  const handleSetGstTaxRateType = (e, itemId) => {
    const { value } = e.target;
    setAddedItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, gstTaxRateType: value } : item
      )
    );
  };

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

  useEffect(() => {
    if (!addedItems?.length) return;

    const getGSTPercentage = (rateString) => {
      const match = rateString?.match(/(\d+)%/);
      return match ? parseFloat(match[1]) : 0;
    };

    const updatedItems = addedItems.map((item) => {
      const qty = quantities[item._id] || 0;
      const gstRate = getGSTPercentage(item?.gstTaxRate);
      const price = Number(item?.salesPrice) || 0;

      let basePrice = 0;
      let gstAmount = 0;
      let finalPrice = 0;

      if (item?.gstTaxRateType === "without tax") {
        basePrice = price;

        if (item?.discountPercent) {
          basePrice -= (basePrice * item.discountPercent) / 100;
        } else if (item?.discountAmount) {
          basePrice -= item.discountAmount;
        }

        basePrice = Math.max(basePrice, 0);

        gstAmount = (basePrice * gstRate) / 100;
        finalPrice = basePrice + gstAmount;
      } else {
        basePrice = price * (100 / (100 + gstRate));

        if (item?.discountPercent) {
          basePrice -= (basePrice * item.discountPercent) / 100;
        } else if (item?.discountAmount) {
          basePrice -= item.discountAmount;
        }

        basePrice = Math.max(basePrice, 0);

        gstAmount = (basePrice * gstRate) / 100;
        finalPrice = basePrice + gstAmount;
      }

      const totalAmount = finalPrice * qty;

      return {
        ...item,
        quantity: qty,
        basePrice: basePrice.toFixed(2),
        gstAmount: gstAmount.toFixed(2),
        finalPrice: finalPrice.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
      };
    });

    // Totals
    const amountSubtotal = updatedItems.reduce(
      (acc, item) => acc + Number(item?.totalAmount || 0),
      0
    );

    const taxSubtotal = updatedItems.reduce(
      (acc, item) => acc + Number(item?.gstAmount || 0) * item.quantity,
      0
    );

    const totalTaxableAmount = updatedItems.reduce(
      (acc, item) => acc + Number(item?.basePrice || 0) * item.quantity,
      0
    );

    const totalGstAmount = updatedItems.reduce(
      (acc, item) => acc + Number(item?.gstAmount || 0) * item.quantity,
      0
    );

    const cgst = Number((totalGstAmount / 2).toFixed(2)).toLocaleString(
      "en-IN"
    );
    const sgst = Number((totalGstAmount / 2).toFixed(2)).toLocaleString(
      "en-IN"
    );

    const balanceAmount = totalTaxableAmount + totalGstAmount;

    setData((prev) => ({
      ...prev,
      items: updatedItems,
      amountSubTotal: parseFloat(amountSubtotal.toFixed(2)),
      taxSubTotal: parseFloat(taxSubtotal.toFixed(2)),
      taxableAmount: parseFloat(totalTaxableAmount.toFixed(2)),
      cgst,
      sgst,
      totalAmount: parseFloat(amountSubtotal.toFixed(2)),
      balanceAmount: parseFloat(balanceAmount.toFixed(2)),
    }));
  }, [addedItems, quantities]);

  // THIS USE EFFECT CALCULATES
  useEffect(() => {
    const invoice = invoices.find(
      (invoice) => invoice?._id === data?.invoiceId
    );

    if (invoice) {
      setData((prev) => ({ ...invoice, invoiceId: invoice?._id }));
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
          <span className="border-t border-l p-2 border-[var(--primary-border)] col-span-3">
            {addedItem?.itemName}
          </span>

          {/* HSN */}
          <span className="border-t border-l p-2 border-[var(--primary-border)]">
            {addedItem?.HSNCode || "-"}
          </span>

          {/* Quantity */}
          <span className="border-t border-l p-2 border-[var(--primary-border)]">
            <input
              className="input input-xs bg-zinc-100 text-right"
              value={addedItem?.quantity}
              // onChange={() =>
              //   setQuantities((prev) => ({
              //     ...prev,
              //     [addedItem._id]: Math.max((prev[addedItem._id] || 0) - 1, 0),
              //   }))
              // }
            />
          </span>

          {/* Price */}
          <span className="border-l text-nowrap border-t p-2 border-[var(--primary-border)]">
            <input
              className="input input-xs bg-zinc-100 text-right"
              value={Number(addedItem?.basePrice || 0).toLocaleString("en-IN")}
              readOnly
            />
          </span>

          {/* Discount */}
          <span className="border-l relative border-t p-2 border-[var(--primary-border)]">
            {/* Discount % */}
            <input
              type="text"
              min={0}
              className="input input-xs bg-zinc-100 text-right"
              value={addedItem?.discountPercent ?? 0}
              onChange={(e) =>
                handleSetDiscountPercent(
                  parseFloat(e.target.value) ?? 0,
                  addedItem._id
                )
              }
            />
            <Percent size={10} className="absolute top-[14.3px] left-3 z-10" />

            {/* Discount Amount */}
            <input
              type="text"
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
              ({addedItem?.gstTaxRate})
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
            onClick={() => document.getElementById("my_modal_1").showModal()}
            className="btn btn-info  btn-dash w-full hover:bg-none"
          >
            + Add Item
          </button>

          <dialog id="my_modal_1" className="modal">
            <div className="modal-box max-w-5xl p-0">
              <h3 className="font-semibold text-lg bg-zinc-100 p-2">
                Add Items
              </h3>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search Items"
                    className="input input-sm w-1/2"
                    value={searchItemQuery}
                    onChange={(e) => setSearchItemQuery(e.target.value)}
                  />
                  <select
                    defaultValue="Select Category"
                    className="select select-sm"
                  >
                    <option disabled={true}>Select Category</option>
                    <option>Crimson</option>
                  </select>
                  <Link
                    to={"/dashboard/items/basic-details"}
                    className="btn btn-dash btn-info btn-sm  w-1/2"
                  >
                    Create New Item
                  </Link>
                </div>

                <div className="overflow-x-auto mt-4  rounded-box border border-base-content/5 bg-base-100">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="text-xs bg-zinc-100">
                        <th>Item Name</th>
                        <th>Item Code</th>
                        <th>Sales Price</th>
                        <th>Purchase Price</th>
                        <th>Current Stock</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items &&
                        searchedItems.map((item) => (
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
                            <td>{item?.openingStock || "-"}</td>
                            <td>
                              {showCounterId === item?._id ? (
                                <div className="flex justify-center">
                                  <button
                                    onClick={() =>
                                      setQuantities((prev) => ({
                                        ...prev,
                                        [item._id]: Math.max(
                                          (prev[item._id] || 0) - 1,
                                          0
                                        ),
                                      }))
                                    }
                                    className="btn btn-xs btn-info"
                                  >
                                    -
                                  </button>

                                  <input
                                    type="number"
                                    min={0}
                                    value={quantities[item._id] || 0}
                                    onChange={(e) =>
                                      setQuantities((prev) => ({
                                        ...prev,
                                        [item._id]: Number(e.target.value),
                                      }))
                                    }
                                    placeholder="0"
                                    className="input input-xs w-15 text-center"
                                  />

                                  <button
                                    onClick={() =>
                                      setQuantities((prev) => ({
                                        ...prev,
                                        [item._id]: (prev[item._id] || 0) + 1,
                                      }))
                                    }
                                    className="btn btn-xs btn-info"
                                  >
                                    +
                                  </button>

                                  <CircleX
                                    size={18}
                                    className="ml-2"
                                    onClick={() => setShowCounterId(false)}
                                  />
                                </div>
                              ) : (
                                <button
                                  onClick={() => setShowCounterId(item?._id)}
                                  className="btn btn-xs w-full "
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
                      .filter((item) => (quantities[item._id] || 0) > 0)
                      .map((item) => ({
                        ...item,
                        quantity: quantities[item._id],
                      }));
                    setAddedItems(selected);
                    setData((prev) => ({ ...prev, items: selected }));
                    document.getElementById("my_modal_1").close();
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
          ₹ {Number(data?.taxableAmount || 0).toLocaleString("en-IN")}
        </span>
        <span className="border-t border-b p-2 border-[var(--primary-border)]">
          ₹ {Number(data?.taxSubTotal || 0).toLocaleString("en-IN")}
        </span>
        <span className="border p-2 border-[var(--primary-border)] ">
          ₹ {Number(data?.amountSubTotal || 0).toLocaleString("en-IN")}
        </span>
      </div>
    </>
  );
};

export default SalesInvoiceItemTable;
