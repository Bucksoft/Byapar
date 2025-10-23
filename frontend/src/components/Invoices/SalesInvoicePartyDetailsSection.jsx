import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { IoCloseCircle } from "react-icons/io5";
import { useInvoiceStore } from "../../store/invoicesStore";
import { Search } from "lucide-react";
import { LiaFileInvoiceSolid, LiaRupeeSignSolid } from "react-icons/lia";
import { usePurchaseInvoiceStore } from "../../store/purchaseInvoiceStore";
import { FaPen } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { useMutation, useQuery } from "@tanstack/react-query";
import { states } from "../../utils/constants";
import { axiosInstance } from "../../config/axios";
import { useBusinessStore } from "../../store/businessStore";
import toast from "react-hot-toast";
import { queryClient } from "../../main";

const SalesInvoicePartyDetailsSection = ({
  title,
  data,
  setData,
  parties,
  party,
  setParty,
  invoiceNoRef,
  isEditing,
  invoiceToUpdate,
}) => {
  const [searchPartyQuery, setSearchPartyQuery] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [partyInvoices, setPartyInvoices] = useState([]);
  const [showPartyInvoicePopup, setShowPartyInvoicePopup] = useState(false);

  const [editShippingAddress, setEditShippingAddress] = useState(0);
  const [shippingData, setShippingData] = useState({
    shippingName: party?.partyName,
    streetAddress: "",
    state: "",
    pincode: "",
    city: "",
  });

  //  FOR EDITING THE SHIPPING ADDRESS
  useEffect(() => {
    const shippingAddress = party?.fullShippingAddress.filter(
      (address) => address?.id === editShippingAddress
    );
    setShippingData({
      shippingName: shippingAddress?.[0]?.shippingName,
      streetAddress: shippingAddress?.[0]?.streetAddress,
      state: shippingAddress?.[0]?.state,
      city: shippingAddress?.[0]?.city,
      pincode: shippingAddress?.[0]?.pincode,
    });
  }, [editShippingAddress]);

  // const { parties } = usePartyStore();
  const { invoices } = useInvoiceStore(); // FOR SALES RETURN
  const { purchaseInvoices } = usePurchaseInvoiceStore(); //  FOR PURCHASE RETURN
  const { business } = useBusinessStore();

  // Filter parties based on search input
  const filteredParties = useMemo(() => {
    if (!parties?.length) return [];

    return parties
      .filter((p) => p.businessId === business?._id)
      .filter((p) =>
        p?.partyName?.toLowerCase().includes(searchPartyQuery.toLowerCase())
      )
      .sort((a, b) => a.partyName.localeCompare(b.partyName));
  }, [searchPartyQuery, parties, business?._id]);

  const searchedInvoices =
    invoices &&
    invoices.invoices?.filter(
      (invoice) => invoice?.salesInvoiceNumber === Number(invoiceSearchQuery)
    );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // this use effect fetches all the invoices of the selected party
  useEffect(() => {
    if (title === "Sales Return" || title === "Credit Note") {
      const selectedPartyInvoices = invoices?.invoices?.filter(
        (invoice) => invoice?.partyName === party?.partyName
      );
      setPartyInvoices(selectedPartyInvoices);
    } else if (title === "Purchase Return" || title === "Debit Note") {
      const selectedPartyInvoices = purchaseInvoices.filter(
        (invoice) => invoice?.partyName === party?.partyName
      );
      setPartyInvoices(selectedPartyInvoices);
    }
  }, [party]);

  // SHIPPING ADDRESS CHANGE MUTATION
  const shippingMutation = useMutation({
    mutationFn: async () => {
      if (Number(editShippingAddress) > 0) {
        const res = await axiosInstance.patch(
          `/parties/shipping-address/update/${business?._id}?id=${party?._id}&addressId=${editShippingAddress}`,
          {
            shippingData,
          }
        );
        return res.data;
      } else {
        const res = await axiosInstance.patch(
          `/parties/shipping-address/${business?._id}?id=${party?._id}`,
          {
            shippingData,
          }
        );
        return res.data;
      }
    },

    onSuccess: (data) => {
      toast.success(data?.msg);
      queryClient.invalidateQueries({
        queryKey: ["parties", "allParties", business?._id],
        refetchType: "active",
      });
      document.getElementById("my_modal_1").close();
      document.getElementById("my_modal_2").close();
    },
  });

  useEffect(() => {
    if (isEditing) {
      setParty(invoiceToUpdate?.partyId);
    }
  }, [isEditing, invoiceToUpdate]);

  return (
    <>
      <section className="grid grid-cols-3 h-48">
        {/* first block */}
        <div
          className={`border-t border-r border-zinc-300 ${
            !party && "col-span-2"
          } `}
        >
          <div className="bg-red flex items-center justify-between p-[7.49px] border-b border-b-zinc-300">
            <span className="text-xs">
              Bill {title === "Purchase Invoice" ? "From" : "To"}
            </span>

            {/* Change and add new party dropdown  ----------------------------------------------*/}
            <div className="relative w-60">
              {/* Select Button */}
              <button
                onClick={() => setSelectOpen(!selectOpen)}
                className="w-full truncate  flex justify-between items-center btn btn-xs btn-outline btn-neutral text-xs shadow"
              >
                {party ? party?.partyName : "Select Party"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${
                    selectOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Content */}
              {selectOpen && (
                <div className="absolute z-10 mt-2 w-full bg-base-100 border border-gray-200 rounded-lg shadow-lg p-2">
                  {/* Search Input */}
                  <input
                    type="text"
                    className="input input-sm w-full mb-2"
                    placeholder="Search parties..."
                    value={searchPartyQuery}
                    onChange={(e) => setSearchPartyQuery(e.target.value)}
                  />

                  {/* Party List */}
                  <ul className="max-h-60 overflow-y-auto">
                    {filteredParties.length > 0 ? (
                      filteredParties.map((p) => (
                        <li
                          key={p._id}
                          className="p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm truncate"
                          onClick={() => {
                            setParty(p);
                            setData((prev) => ({
                              ...prev,
                              partyName: p?.partyName,
                              partyId: p?._id,
                            }));
                            setSelectOpen(false);
                            setSearchPartyQuery("");
                          }}
                        >
                          {p?.partyName}
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-sm text-gray-500">
                        No parties found
                      </li>
                    )}
                  </ul>

                  <div className="border-t border-zinc-100 mt-2 pt-2 flex justify-center">
                    <Link
                      to="/dashboard/add-party"
                      className="btn btn-sm btn-info text-xs w-full"
                      onClick={() => setSelectOpen(false)}
                    >
                      Create Party
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Change and add new party dropdown ends  ----------------------------------------------*/}
          </div>

          <div className=" p-2 ">
            <p className="text-sm font-medium ">{party?.partyName}</p>
            {party?.mobileNumber && (
              <p className="text-xs pt-1 text-zinc-400">
                Phone Number:{" "}
                <span className="text-black">{party?.mobileNumber}</span>{" "}
              </p>
            )}
            {party?.billingAddress && (
              <p className="text-xs pt-1 text-zinc-400">
                Address:{" "}
                <span className="text-black">{party?.billingAddress}</span>{" "}
              </p>
            )}
          </div>
        </div>

        {/* second block SHIPPING ADDRESS */}
        {party && (
          <div className="border-t border-r border-zinc-300 ">
            <div className="bg-red flex items-center justify-between p-2 border-b border-b-zinc-300">
              <span className="text-xs">
                Ship{" "}
                {title === "Sales Return" ||
                title === "Credit Note" ||
                title === "Purchase Invoice" ||
                title === "Purchase Order"
                  ? "From"
                  : "To"}
              </span>
              {/* // SHIPPING ADDRESS MODAL */}
              <>
                <button
                  onClick={() =>
                    document.getElementById("my_modal_1").showModal()
                  }
                  className="btn btn-xs text-xxs border btn-neutral btn-outline"
                >
                  Change Shipping Address
                </button>
                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">
                      {party?.shippingAddress > 0 ? "Change" : "Add"} Shipping
                      Address
                    </h3>

                    {/* SHIPPING ADDRESS TABLE */}
                    {party?.fullShippingAddress && (
                      <div className="overflow-x-auto">
                        {party?.fullShippingAddress.length > 0 && (
                          <table className="table table-zebra table-sm mt-5">
                            {/* head */}
                            <thead>
                              <tr className="bg-zinc-100">
                                <th>Address</th>
                                <th className="text-center">Edit</th>
                                <th className="text-right">Select</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* row 1 */}
                              {party.fullShippingAddress.map((address) => (
                                <tr key={address?.id}>
                                  <td className="py-2">
                                    {address?.streetAddress || "-"}
                                  </td>
                                  <td className="w-full flex justify-center py-2">
                                    <FaPen
                                      onClick={() => {
                                        setEditShippingAddress(address?.id);
                                        document
                                          .getElementById("my_modal_2")
                                          .showModal();
                                        document
                                          .getElementById("my_modal_1")
                                          .close();
                                      }}
                                      size={12}
                                      className="text-zinc-500 text-center hover:text-zinc-600 cursor-pointer"
                                    />
                                  </td>
                                  <td className="text-right">
                                    <input
                                      type="radio"
                                      name="radio-2"
                                      className="radio radio-xs"
                                      value={address?.id}
                                      checked={
                                        party?.shippingAddress ===
                                        address?.streetAddress
                                      }
                                      onChange={() => {
                                        setParty((prev) => ({
                                          ...prev,
                                          shippingAddress:
                                            address?.streetAddress,
                                        }));
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                    <>
                      <button
                        onClick={() => {
                          document.getElementById("my_modal_2").showModal();
                          document.getElementById("my_modal_1").close();
                        }}
                        className="btn btn-sm mt-3 btn-dash btn-info"
                      >
                        <GoPlus />
                        Add New Shipping Address
                      </button>
                      {/* MAIN DIALOG BOX TO CHANGE/ADD SHIPPING ADDRESS */}
                      <dialog id="my_modal_2" className="modal">
                        <div className="modal-box">
                          <h3 className="font-bold text-lg">
                            Add Shipping Address
                          </h3>
                          <div className="flex flex-col mt-2">
                            <label
                              htmlFor="name"
                              className="text-zinc-700 text-sm mb-1"
                            >
                              Shipping Name
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Shipping Name"
                              className="input input-sm w-full"
                              value={shippingData?.shippingName}
                              onChange={(e) =>
                                setShippingData((prev) => ({
                                  ...prev,
                                  shippingName: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="flex flex-col mt-2">
                            <label
                              htmlFor="address"
                              className="text-zinc-700 text-sm mb-1"
                            >
                              Street Address
                            </label>
                            <textarea
                              type="text"
                              className="textarea w-full"
                              value={shippingData?.streetAddress}
                              placeholder="Enter Street Address"
                              onChange={(e) =>
                                setShippingData((prev) => ({
                                  ...prev,
                                  streetAddress: e.target.value,
                                }))
                              }
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            {/* STATE */}
                            <div>
                              <div className="flex flex-col mt-2">
                                <label
                                  htmlFor="state"
                                  className="text-zinc-700 text-sm "
                                >
                                  State
                                </label>

                                <fieldset className="fieldset ">
                                  <select
                                    name="state"
                                    value={shippingData?.state}
                                    onChange={(e) =>
                                      setShippingData((prev) => ({
                                        ...prev,
                                        state: e.target.value,
                                      }))
                                    }
                                    className="select select-sm "
                                  >
                                    <option value="" disabled>
                                      --Select-state--
                                    </option>
                                    {states?.map((state) => (
                                      <option
                                        key={state}
                                        hidden={state === "Enter state"}
                                      >
                                        {state}
                                      </option>
                                    ))}
                                  </select>
                                </fieldset>
                              </div>
                            </div>
                            {/* PINCODE */}
                            <div>
                              <label
                                htmlFor="state"
                                className="text-zinc-700 text-sm mb-1"
                              >
                                Pincode
                              </label>
                              <input
                                type="number"
                                className="input input-sm w-full"
                                value={shippingData?.pincode}
                                placeholder="Enter Pincode"
                                onChange={(e) =>
                                  setShippingData((prev) => ({
                                    ...prev,
                                    pincode: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </div>

                          {/* CITY */}
                          <div>
                            <label
                              htmlFor="state"
                              className="text-zinc-700 text-sm mb-1"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              placeholder="Enter City"
                              className="input input-sm w-full"
                              value={shippingData?.city}
                              onChange={(e) =>
                                setShippingData((prev) => ({
                                  ...prev,
                                  city: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="divider"></div>
                          {/* BUTTONS */}
                          <div className=" w-full flex justify-end">
                            <button
                              onClick={() => shippingMutation.mutate()}
                              className="btn btn-sm bg-[var(--primary-btn)]"
                            >
                              {editShippingAddress ? "Save" : "Add"}{" "}
                            </button>
                          </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                          <button>close</button>
                        </form>
                      </dialog>
                    </>

                    <div className="modal-action">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm bg-[var(--primary-btn)]">
                          Close
                        </button>
                      </form>
                      {/* {party?.shippingAddress?.length > 0 && (
                          <button className="btn btn-sm bg-[var(--primary-btn)]">
                            Change
                          </button>
                        )} */}
                    </div>
                  </div>
                </dialog>
              </>
            </div>
            <div className="p-2">
              <p className="text-sm font-medium ">{party?.partyName}</p>
              {party?.mobileNumber && (
                <p className="text-xs pt-1 text-zinc-400">
                  Phone Number:{" "}
                  <span className="text-black">{party?.mobileNumber}</span>
                </p>
              )}
              {party?.fullShippingAddress.length > 0 && (
                <p className="text-xs pt-1 text-zinc-400">
                  Address:{" "}
                  <span className="text-black">{party?.shippingAddress}</span>{" "}
                </p>
              )}
            </div>
          </div>
        )}

        {/* third block - PAYMENT TERMS AND INVOICE NUMBER GENERATION */}
        <div className="border-t border-r border-zinc-300  pt-1 relative">
          {/* upper part */}
          <div className=" p-2 flex space-x-2 items-center ">
            <div className="w-1/2">
              <p className="text-xs pb-2">{title} No: </p>
              <input
                type="number"
                placeholder="1"
                readOnly
                value={data?.salesInvoiceNumber || 1}
                ref={invoiceNoRef}
                name={"salesInvoiceNumber"}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    salesInvoiceNumber: Number(e.target.value),
                  }))
                }
                className="input w-full input-xs border-none bg-zinc-200 "
              />
            </div>
            <div className="w-1/2">
              <p className="text-xs pb-2 ">{title} Date: </p>
              <input
                type="date"
                value={
                  data?.salesInvoiceDate
                    ? new Date(data.salesInvoiceDate)
                        .toISOString()
                        .split("T")[0]
                    : new Date().toISOString().split("T")[0] // today's date
                }
                onChange={handleInputChange}
                name="salesInvoiceDate"
                className="input input-xs border-none bg-zinc-200 w-full"
              />
            </div>
          </div>
          {/* lower */}
          {title === "Sales Invoice" ||
          title === "Proforma Invoice" ||
          title === "Purchase Invoice" ? (
            <>
              <div className="p-2 ">
                <button
                  onClick={() => setOpen(true)}
                  className={`btn w-full btn-info btn-sm btn-dash px-20  ${
                    open ? "hidden" : ""
                  }`}
                >
                  + Add Due Date
                </button>
              </div>

              {open && (
                <div className="relative p-2 border border-dashed rounded-md w-fit m-2 ">
                  {/* Close Button */}
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
                  >
                    <IoCloseCircle size={22} />
                  </button>

                  {/* Content */}
                  <div className="flex space-x-2 mt-6">
                    {/* Payment Terms */}
                    <div>
                      <p className="text-xs pb-2">Payment Terms: </p>
                      <div className="relative rounded-sm">
                        <input
                          type="number"
                          placeholder="0"
                          value={data.paymentTerms}
                          onChange={(e) => {
                            const days = Number(e.target.value);
                            const newDate = new Date();
                            newDate.setDate(newDate.getDate() + days);
                            setData((prev) => ({
                              ...prev,
                              paymentTerms: days,
                              dueDate: newDate.toISOString().split("T")[0],
                            }));
                          }}
                          name="paymentTerms"
                          className="input input-xs w-30"
                        />
                        <span className="text-xs absolute left-20 top-1 bg-zinc-200 px-1">
                          Days
                        </span>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div>
                      <p className="text-xs pb-2">Due Date: </p>
                      <input
                        type="date"
                        value={
                          data.dueDate || new Date().toISOString().split("T")[0]
                        }
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            dueDate: e.target.value,
                          }))
                        }
                        name="dueDate"
                        className="input input-xs border-none bg-zinc-200 w-30"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : title === "Quotation" || title === "Purchase Order" ? (
            <>
              {" "}
              <div className="px-2 py-4 flex space-x-2 border border-dashed w-fit m-2 rounded-md ">
                {/* Valid For */}
                <div>
                  <p className="text-xs pb-2">Valid For: </p>
                  <div className="relative rounded-sm">
                    <input
                      type="number"
                      placeholder="0"
                      value={data?.validFor}
                      onChange={(e) => {
                        const days = Number(e.target.value);

                        const newDate = new Date();
                        newDate.setDate(newDate.getDate() + days);

                        setData((prev) => ({
                          ...prev,
                          validFor: days,
                          validityDate: newDate.toISOString().split("T")[0], // yyyy-mm-dd format
                        }));
                      }}
                      name="validFor"
                      className="input input-xs w-30"
                    />
                    <span className="text-xs absolute z-50 left-21 top-1 bg-zinc-200 ">
                      Days
                    </span>
                  </div>
                </div>

                {/* Validity Date */}
                <div>
                  <p className="text-xs pb-2">Validity Date: </p>
                  <input
                    type="date"
                    value={
                      data?.validityDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        validityDate: e.target.value,
                      }))
                    }
                    name="validityDate"
                    className="input input-xs border-none bg-zinc-200 w-30"
                  />
                </div>
              </div>
            </>
          ) : title === "Sales Return" ||
            title === "Credit Note" ||
            title === "Purchase Return" ||
            title === "Debit Note" ? (
            <>
              <div className="px-2 flex flex-col w-full relative">
                <small>
                  Invoice :{" "}
                  {data?.invoiceId && (
                    <span className="font-semibold">
                      #
                      {title === "Sales Return" || title === "Credit Note"
                        ? invoices.filter(
                            (invoice) => invoice?._id === data?.invoiceId
                          )[0]?.salesInvoiceNumber
                        : title === "Purchase Return" || title === "Debit Note"
                        ? purchaseInvoices.filter(
                            (invoice) => invoice?.partyName === party?.partyName
                          )[0]?.purchaseInvoiceNumber
                        : ""}
                    </span>
                  )}
                  {!party && (
                    <span className="text-red-500">Please select a party</span>
                  )}{" "}
                </small>
                <Search
                  size={15}
                  className="absolute top-7 left-4 z-10 text-zinc-500"
                />
                <input
                  type="text"
                  className="input input-sm px-7"
                  placeholder="Search invoices by invoice number"
                  disabled={!party}
                  value={invoiceSearchQuery}
                  onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                  onClick={() => setShowPartyInvoicePopup((prev) => !prev)}
                />
              </div>
              {showPartyInvoicePopup && (
                <>
                  <div className="absolute text-xs mt-1 mx-2 rounded-sm shadow-md z-100 bg-white shadow-zinc-500 w-3/4 ">
                    <div className="overflow-x-auto">
                      <table className="table table-xs table-zebra">
                        {/* head */}
                        <thead>
                          <tr className="text-xs bg-zinc-100">
                            <th>Date</th>
                            <th>Invoice no.</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {partyInvoices?.length > 0 ? (
                            (invoiceSearchQuery
                              ? searchedInvoices
                              : partyInvoices
                            )?.map((partyInvoice) => (
                              <tr
                                key={partyInvoice._id}
                                className="hover:bg-zinc-100 cursor-pointer"
                                onClick={() => {
                                  setData((prev) => ({
                                    ...prev,
                                    ...partyInvoice,
                                    invoiceId: partyInvoice?._id, // SET THE SELECTED INVOICE ID
                                  }));
                                  setShowPartyInvoicePopup(false);
                                }}
                              >
                                <td>
                                  {title === "Sales Return" ||
                                  title === "Credit Note"
                                    ? partyInvoice?.salesInvoiceDate.split(
                                        "T"
                                      )[0]
                                    : title === "Purchase Return" ||
                                      title === "Debit Note"
                                    ? partyInvoice?.purchaseInvoiceDate.split(
                                        "T"
                                      )[0]
                                    : ""}
                                </td>
                                <td>
                                  {title === "Sales Return" ||
                                  title === "Credit Note"
                                    ? partyInvoice?.salesInvoiceNumber
                                    : title === "Purchase Return" ||
                                      title === "Debit Note"
                                    ? partyInvoice?.purchaseInvoiceNumber
                                    : ""}
                                </td>
                                <td>
                                  <div className="flex items-center">
                                    <LiaRupeeSignSolid />
                                    {title === "Sales Return" ||
                                    title === "Credit Note"
                                      ? Number(
                                          partyInvoice?.totalAmount
                                        ).toLocaleString("en-IN")
                                      : title === "Purchase Return" ||
                                        title === "Debit Note"
                                      ? Number(
                                          partyInvoice?.totalAmount
                                        ).toLocaleString("en-IN")
                                      : ""}
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="3"
                                className="text-center p-3 text-xs"
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <LiaFileInvoiceSolid size={16} />
                                  No invoices
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : null}
        </div>
      </section>
    </>
  );
};

export default SalesInvoicePartyDetailsSection;
