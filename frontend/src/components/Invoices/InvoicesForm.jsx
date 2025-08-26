import { ArrowLeft, CircleX, Keyboard, Percent, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { FaCirclePlus, FaPlus } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import scanner from "../../assets/scanner.png";
import BankAccountPopup from "../BankAccountPopup";
import { Link, useNavigate } from "react-router-dom";
import { usePartyStore } from "../../store/partyStore";
import { useItemStore } from "../../store/itemStore";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { BsTrash3 } from "react-icons/bs";

const InvoicesForm = ({ title, party }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [notes, setNotes] = useState(false);
  const [termCondition, setTermCondition] = useState(false);
  const [charges, setCharges] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [selectCheckBox, setSelectCheckBox] = useState(false);
  const [searchPartyQuery, setSearchPartyQuery] = useState("");
  const [searchItemQuery, setSearchItemQuery] = useState("");
  const [showCounterId, setShowCounterId] = useState();
  const [quantities, setQuantities] = useState({});
  const [addedItems, setAddedItems] = useState([]);
  const [gstAmount, setGstAmount] = useState(0);
  const [basePrice, setBasePrice] = useState(0);

  const { parties } = usePartyStore();
  const { items } = useItemStore();

  const searchedParties = parties?.filter((party) =>
    party?.partyName.toLowerCase().includes(searchPartyQuery.toLowerCase())
  );

  const searchedItems = items?.filter((item) =>
    item?.itemName.toLowerCase().includes(searchItemQuery.toLowerCase())
  );

  useEffect(() => {
    if (!addedItems?.length || !quantities) return;

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

      if (item?.salesPriceType === "without tax") {
        gstAmount = (price * gstRate) / 100;
        basePrice = price;
        finalPrice = basePrice + gstAmount;
        setGstAmount(gstAmount);
        setBasePrice(basePrice);
      } else if (item?.salesPriceType === "with tax") {
        basePrice = price * (100 / (100 + gstRate));
        gstAmount = price - basePrice;
        finalPrice = price;
        setGstAmount(gstAmount);
        setBasePrice(basePrice);
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

    setAddedItems(updatedItems);
  }, [addedItems.length, quantities]);

  return (
    <main className="max-h-screen w-full">
      {/* navbar */}
      <header className="p-2 w-full flex items-center justify-between ">
        <div className="flex items-center justify-center">
          <ArrowLeft size={18} onClick={() => navigate(-1)} />
          <span className="pl-3">Create {title}</span>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button className="btn btn-sm">Settings</button>
          <button className="btn bg-[var(--primary-btn)] btn-sm">
            Save {title}
          </button>
        </div>
      </header>

      <section className="grid grid-cols-3  h-48">
        {/* first block */}
        <div className="border-t border-r border-zinc-300 ">
          <div className="bg-red flex items-center justify-between p-2 border-b border-b-zinc-300">
            <span className="text-xs">Bill To</span>

            {/* Change and add new party dropdown  ----------------------------------------------*/}

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-xs text-xxs ">
                Change Party
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <input
                  type="text"
                  className="input input-sm"
                  placeholder="Search parties"
                  onChange={(e) => setSearchPartyQuery(e.target.value)}
                />
                {searchedParties.map((party) => (
                  <li>
                    <a>{party?.partyName}</a>
                  </li>
                ))}
                <li>
                  <Link
                    to={"/dashboard/add-party"}
                    className="btn btn-sm btn-dash btn-info"
                  >
                    Create party
                  </Link>
                </li>
              </ul>
            </div>

            {/* Change and add new party dropdown ends  ----------------------------------------------*/}
          </div>

          <div className=" p-2 ">
            <p className="text-sm font-medium ">Cash Sale</p>
            <p className="text-xs pt-1 text-zinc-400">
              Phone Number:{" "}
              <span className="text-black">{party?.mobileNumber}</span>{" "}
            </p>
          </div>
        </div>
        {/* second block */}
        <div className="border-t border-r border-zinc-300 ">
          <div className="bg-red flex items-center justify-between p-2 border-b border-b-zinc-300">
            <span className="text-xs">Ship To</span>
            <button className="btn btn-xs text-xxs border">
              Change Shipping Address
            </button>
          </div>
          <div className="p-2">
            <p className="text-sm font-medium ">Business Name</p>
            <p className="text-xs pt-1 text-zinc-400">
              Phone Number:{" "}
              <span className="text-black">{party?.mobileNumber}</span>
            </p>
          </div>
        </div>
        {/* third block */}
        <div className="border-t border-r border-zinc-300 pt-1">
          {/* upper part */}
          <div className=" p-2 flex space-x-2 items-center">
            <div className="">
              <p className="text-xs pb-2">Sales Invoice No: </p>
              <input
                type="number"
                placeholder="1"
                className="input input-xs border-none bg-zinc-200 w-30"
              />
            </div>
            <div>
              <p className="text-xs pb-2 ">Sales Invoice Date: </p>
              <input
                type="date"
                placeholder=""
                defaultValue={new Date().toISOString().split("T")[0]}
                className="input input-xs border-none bg-zinc-200 w-30"
              />
            </div>
          </div>
          {/* lower */}

          <div className="p-2">
            <button
              onClick={() => setOpen(true)}
              className={`btn btn-info btn-sm btn-dash px-20 w-fit ${
                open ? "hidden" : ""
              }`}
            >
              +Add Due Date
            </button>
          </div>

          {open && (
            <>
              <div className="flex justify-end  relative">
                <IoCloseCircle
                  size={25}
                  onClick={() => setOpen(false)}
                  className="text-gray-500 absolute top-0 right-57"
                />
              </div>
              <div className="px-2 py-4 flex space-x-2 border border-dashed w-fit m-2 rounded-md ">
                <div>
                  <p className="text-xs pb-2">Payment Terms: </p>
                  <div className="relative rounded-sm">
                    <input
                      type="number"
                      placeholder=""
                      className="input input-xs w-30"
                    />
                    <span className="text-xs absolute z-50 left-21 top-1 bg-zinc-200 ">
                      Days
                    </span>
                  </div>
                </div>
                <div className="">
                  <p className="text-xs pb-2">Due Date: </p>
                  <input
                    type="date"
                    placeholder=""
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="input input-xs border-none bg-zinc-200 w-30"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* third  */}
      <div className="w-full grid grid-cols-11 text-xs">
        <span className="border-t p-2 border-[var(--primary-border)]  uppercase bg-[var(--primary-background)]">
          NO
        </span>
        <span className="border-t border-l  p-2 border-[var(--primary-border)] col-span-3 uppercase bg-[var(--primary-background)]">
          Items/ Services
        </span>
        <span className="border-t border-l p-2 border-[var(--primary-border)]  uppercase bg-[var(--primary-background)]">
          HSN/ SAC
        </span>
        <span className="border-t border-l p-2 border-[var(--primary-border)]  uppercase bg-[var(--primary-background)]">
          Qty
        </span>
        <span className="border-l text-nowrap  border-t p-2 border-[var(--primary-border)]  uppercase bg-[var(--primary-background)]">
          Price/Item (₹)
        </span>
        <span className="border-l border-t p-2 border-[var(--primary-border)]  uppercase bg-[var(--primary-background)]">
          Discount
        </span>
        <span className="border-l border-t p-2 border-[var(--primary-border)] uppercase bg-[var(--primary-background)]">
          Tax
        </span>
        <span className="border-l border-t p-2 border-[var(--primary-border)] uppercase bg-[var(--primary-background)]">
          Amount (₹)
        </span>
        <span className="border-l border-t border-r p-2 border-[var(--primary-border)]  text-gray-500 uppercase bg-[var(--primary-background)]">
          {/* <FaCirclePlus size={24} /> */}
        </span>
      </div>

      {addedItems.map((addedItem, index) => (
        <div className="w-full grid grid-cols-11 text-xs" key={addedItem?._id}>
          <span className="border-t p-2 border-[var(--primary-border)] ">
            {index + 1}
          </span>
          <span className="border-t border-l  p-2 border-[var(--primary-border)] col-span-3">
            {addedItem?.itemName}
          </span>
          <span className="border-t border-l p-2 border-[var(--primary-border)] ">
            {addedItem?.HSNCode || "-"}
          </span>
          <span className="border-t border-l p-2 border-[var(--primary-border)] ">
            <input
              className="input input-xs bg-zinc-100 text-right"
              value={addedItem?.quantity}
            />
          </span>
          <span className="border-l text-nowrap  border-t p-2 border-[var(--primary-border)] ">
            <input
              className="input input-xs bg-zinc-100 text-right"
              value={addedItem?.basePrice}
            />
          </span>

          <span className="border-l relative border-t p-2 border-[var(--primary-border)] ">
            <input
              className="input input-xs bg-zinc-100 text-right"
              // value={addedItem?.salesPrice}
            />
            <Percent size={10} className="absolute top-[14.3px] left-3 z-10" />
            <input
              className="input input-xs bg-zinc-100 text-right mt-1"
              // value={addedItem?.salesPrice}
            />
            <LiaRupeeSignSolid className="absolute top-[41.3px] left-3 z-10" />
          </span>

          <p className="border-l  border-t p-2 border-[var(--primary-border)] ">
            <input
              className="input input-xs bg-zinc-100 text-right"
              value={addedItem?.gstAmount}
            />
            <h5 className="text-zinc-500 mt-1">({addedItem?.gstTaxRate})</h5>
            <small className="text-[var(--secondary-text-color)]">
              {addedItem?.salesPriceType}
            </small>
          </p>

          <span className="relative border-l border-t p-2 border-[var(--primary-border)] ">
            <input
              className="input input-xs bg-zinc-100 text-right"
              value={addedItem?.totalAmount}
            />
            <LiaRupeeSignSolid className="absolute top-[14.3px] left-3 z-10" />
          </span>

          <span className="border-l grid place-items-center border-t border-r p-2 border-[var(--primary-border)]  text-[var(--error-text-color)]">
            <BsTrash3
              size={20}
              className="cursor-pointer"
              onClick={() => {
                const filteredItems = addedItems.filter(
                  (item) => item?._id !== addedItem?._id
                );
                setAddedItems(filteredItems);
              }}
            />
          </span>
        </div>
      ))}

      {/* button barcode div */}
      <div className="p-2 flex border-t border-r border-[var(--primary-border)]">
        {/* Add Item dialog box -------------------------------------------------------- */}

        <div className="w-7/10">
          <button
            onClick={() => document.getElementById("my_modal_1").showModal()}
            className="btn btn-info btn-sm btn-dash w-full hover:bg-none"
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
                          <tr>
                            <td>{item?.itemName || "-"}</td>
                            <td>{item?.itemCode || "-"}</td>
                            <td className="flex items-center">
                              <LiaRupeeSignSolid /> {item?.salesPrice || "-"}
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

        <div className="px-2 ml-2 border border-[var(--primary-border)] w-3/10 rounded-sm">
          <div className="flex items-center gap-10 justify-center">
            <img src={scanner} alt="qrcode_scanner" className="size-6" />
            <span className="font-medium">Scan Barcode</span>
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-11 text-sm">
        <span className="border-t border-b border-r p-2 border-[var(--primary-border)] col-span-8 text-end font-semibold">
          SUBTOTAL
        </span>
        <span className="border-t border-r border-b p-2 border-[var(--primary-border)] ">
          ₹ 0
        </span>
        <span className="border-t border-b p-2 border-[var(--primary-border)]">
          ₹{" "}
          {addedItems
            .reduce((acc, item) => acc + Number(item?.gstAmount || 0), 0)
            .toFixed(2)}
        </span>

        <span className="border p-2 border-[var(--primary-border)] ">
          ₹{" "}
          {addedItems
            .reduce((acc, item) => acc + Number(item?.totalAmount || 0), 0)
            .toFixed(2)}
        </span>
      </div>

      {/* bottom grid part */}
      <div className="grid grid-cols-2 w-full ">
        {/* left grid part */}
        <div className=" border-l-zinc-300 py-2">
          {/* add notes */}
          <div>
            <span
              onClick={() => setNotes(true)}
              className={`px-2 w-fit text-info text-xs cursor-pointer  ${
                notes ? "hidden" : ""
              }`}
            >
              +Add Notes
            </span>
            {notes && (
              <div className="p-2">
                <div className="flex justify-end  relative">
                  <IoCloseCircle
                    size={20}
                    onClick={() => setNotes(false)}
                    className="text-gray-500 absolute top-0 right-0 z-10"
                  />
                </div>
                <label htmlFor="" className="text-xs">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Notes"
                  className="input border-none w-full text-xs bg-zinc-200"
                />
              </div>
            )}
          </div>

          {/* add term & condition */}

          <div className="border-b border-b-zinc-300 py-2">
            <span
              onClick={() => setTermCondition(true)}
              className={`px-2 w-fit text-info text-xs cursor-pointer ${
                termCondition ? "hidden" : ""
              }`}
            >
              +Add Terms & Conditions
            </span>
            {termCondition && (
              <div className="p-2">
                <div className="flex justify-end  relative">
                  <IoCloseCircle
                    size={20}
                    onClick={() => setTermCondition(false)}
                    className="text-gray-500 absolute top-0 right-0 z-10"
                  />
                </div>
                <label htmlFor="" className="text-xs">
                  Terms and Conditions
                </label>
                <input
                  type="text"
                  placeholder="Enter your terms and conditions"
                  className="input border-none w-full text-xs bg-zinc-200"
                />
              </div>
            )}
          </div>

          {/* add new account */}
          <BankAccountPopup />
        </div>

        {/* Right Grid Part */}
        <div className="border-l border-l-zinc-300 py-2">
          {/* add additional charges */}
          <div>
            {charges && (
              <div className="px-2">
                <div className="flex justify-end  relative">
                  <IoCloseCircle
                    size={20}
                    onClick={() => setCharges(false)}
                    className="text-gray-500 absolute top-0 right-0 z-10"
                  />
                </div>
                <div className=" relative">
                  <input
                    type="text"
                    placeholder="Enter charge (ex. Transport Charge)"
                    className="input input-xs border-none text-xs bg-zinc-200"
                  />
                  <span className="absolute top-0 right-57 z-60 px-1 pt-1 text-xs">
                    ₹
                  </span>
                  <input
                    type="text"
                    placeholder=""
                    className="input input-xs  text-xs bg-zinc-200 w-20 absolute top-0 right-41"
                  />
                  <select
                    defaultValue="No Tax Applicable"
                    className="select select-xs absolute top-0 right-5 w-fit"
                  >
                    <option>No Tax Applicable</option>
                  </select>
                </div>
              </div>
            )}
            <div className="flex justify-between py-2 ">
              <span
                onClick={() => setCharges(true)}
                className={`px-2 w-fit text-info text-xs cursor-pointer`}
              >
                + Add Another Charge
              </span>
              <span className=" text-xs pr-5 ">₹ 0</span>
            </div>
          </div>
          {/* taxable amount */}
          <div className="flex justify-between py-2">
            <span className={`px-2 w-fit text-xs`}>Taxable Amount</span>
            <span className=" text-xs pr-5">
              ₹ {addedItems.length > 0 ? basePrice.toFixed(2) : 0}
            </span>
          </div>
          {addedItems.length > 0 && (
            <>
              <div className="flex justify-between py-2">
                <span className={`px-2 w-fit text-xs`}>SGST</span>
                <span className=" text-xs pr-5">
                  ₹ {(gstAmount / 2).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className={`px-2 w-fit text-xs`}>CGST</span>
                <span className=" text-xs pr-5">
                  ₹ {(gstAmount / 2).toFixed(2)}
                </span>
              </div>
            </>
          )}

          {/* add discount */}
          <div className="border-b border-b-zinc-300 pb-2">
            <span
              onClick={() => setDiscount(true)}
              className={`px-2 w-fit text-info text-xs cursor-pointer ${
                discount ? "hidden" : ""
              }`}
            >
              + Add Discount
            </span>
            {discount && (
              <div className="p-2">
                <div className="flex justify-end items-center relative">
                  <IoCloseCircle
                    size={20}
                    onClick={() => setDiscount(false)}
                    className="text-gray-500 absolute top-0 right-0 z-10"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <select
                      defaultValue="Discount After Tax"
                      className="select w-fit select-xs"
                    >
                      <option>Discount After Tax</option>
                      <option>Discount Before Tax</option>
                    </select>
                  </div>
                  <div className="flex space-x-1 relative">
                    <span className="absolute top-0 right-98 z-60 px-1 pt-1 text-xs">
                      %
                    </span>
                    <input
                      type="text"
                      placeholder=""
                      className="input input-xs border-none w-fit text-xs bg-zinc-200 items-center px-5"
                    />
                    <span>/</span>
                    <span className="absolute top-0 right-51 z-70 px-1 pt-1 text-xs">
                      ₹
                    </span>
                    <input
                      type="text"
                      placeholder=""
                      className="input input-xs border-none w-fit text-xs bg-zinc-200 mr-10 items-center px-5 "
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* check box round-off section*/}
          <div className="border-b border-b-zinc-300 pb-2">
            <div className="pt-2 px-2 flex items-center justify-between">
              <div className="flex items-center justify-center py-2">
                <input
                  type="checkbox"
                  onChange={(e) => setSelectCheckBox(e.target.checked)}
                  className="checkbox checkbox-sm mr-2"
                />
                <span className="text-xs">Auto Round Off</span>
              </div>
              {!selectCheckBox && ( // ✅ will render only when checkbox is not checked
                <div className="relative">
                  <select
                    defaultValue="Discount After Tax"
                    className="select w-fit select-xs"
                  >
                    <option>+Add</option>
                    <option>-Reduce</option>
                  </select>
                  <span className="absolute top-0 right-44 z-90 px-1 pt-1 text-xs">
                    ₹
                  </span>
                  <input
                    type="text"
                    className="input input-xs border-none w-fit text-xs bg-zinc-200 mr-2 items-center px-5"
                  />
                </div>
              )}
            </div>
            <div className="p-2 flex justify-between">
              <span className="text-sm font-semibold">Total Amount</span>
              {addedItems.length > 0 ? (
                <>
                  ₹{" "}
                  {Number(basePrice.toFixed(2)) + Number(gstAmount.toFixed(2))}
                </>
              ) : (
                <input
                  type="text"
                  placeholder="Enter Payment Amount"
                  className="input input-xs border-none w-fit text-xs bg-zinc-200 mr-2 items-center px-5 "
                />
              )}
            </div>
          </div>
          {/* balance amount */}
          {(title === "Sales Invoice" || title === "Sales Return") && (
            <div className="p-2 border-b border-b-zinc-300 pb-2">
              <div className="flex justify-end p-2 pr-5 space-x-2">
                <span className="text-xs">Mark as fully paid</span>
                <input type="checkbox" className="checkbox checkbox-sm" />
              </div>
              <div className="text-xs text-[var(--badge)] flex justify-between items-center">
                <span>Balance Amount</span>
                <span className="mr-4">
                  {addedItems.length > 0 ? (
                    <>
                      ₹ Number(basePrice.toFixed(2)) +
                      Number(gstAmount.toFixed(2))
                    </>
                  ) : (
                    <span>₹ 0</span>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* add signature */}
          <div className="p-2 flex flex-col items-end mr-2">
            <p className="text-xs pb-2">
              Authorized signatory for{" "}
              <span className="font-bold"> Business Name</span>
            </p>
            <div className="border border-dashed w-fit p-10 text-info">
              +Add Signature
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InvoicesForm;
