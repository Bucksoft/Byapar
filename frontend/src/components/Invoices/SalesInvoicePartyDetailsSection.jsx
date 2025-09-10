import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePartyStore } from "../../store/partyStore";
import { IoCloseCircle } from "react-icons/io5";
import { useInvoiceStore } from "../../store/invoicesStore";
import { Search } from "lucide-react";
import { LiaFileInvoiceSolid, LiaRupeeSignSolid } from "react-icons/lia";

const SalesInvoicePartyDetailsSection = ({
  title,
  data,
  setData,
  party,
  setParty,
  invoiceNoRef,
}) => {
  const [searchPartyQuery, setSearchPartyQuery] = useState("");
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [partyInvoices, setPartyInvoices] = useState([]);
  const [showPartyInvoicePopup, setShowPartyInvoicePopup] = useState(false);

  const { parties } = usePartyStore();
  const { invoices } = useInvoiceStore(); // FOR SALES RETURN

  const searchedParties = parties?.filter((party) =>
    party?.partyName.toLowerCase().includes(searchPartyQuery.toLowerCase())
  );

  const searchedInvoices = invoices?.filter(
    (invoice) => invoice?.salesInvoiceNumber === Number(invoiceSearchQuery)
  );
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    const selectedPartyInvoices = invoices.filter(
      (invoice) => invoice?.partyName === party?.partyName
    );
    setPartyInvoices(selectedPartyInvoices);
  }, [party]);

  return (
    <>
      <section className="grid grid-cols-3 h-48 ">
        {/* first block */}
        <div className="border-t border-r border-zinc-300 ">
          <div className="bg-red flex items-center justify-between p-[7.49px] border-b border-b-zinc-300">
            <span className="text-xs">Bill To</span>

            {/* Change and add new party dropdown  ----------------------------------------------*/}

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-xs text-xxs ">
                {!party ? "Add" : "Change"} Party
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
                  <li key={party?._id} onClick={() => setParty(party)}>
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
            <p className="text-sm font-medium ">{party?.partyName}</p>
            <p className="text-xs pt-1 text-zinc-400">
              Phone Number:{" "}
              <span className="text-black">{party?.mobileNumber}</span>{" "}
            </p>
          </div>
        </div>
        {/* second block */}
        <div className="border-t border-r border-zinc-300 ">
          <div className="bg-red flex items-center justify-between p-2 border-b border-b-zinc-300">
            <span className="text-xs">
              Ship{" "}
              {title === "Sales Return" || title === "Credit Note"
                ? "From"
                : "To"}
            </span>
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
        <div className="border-t border-r border-zinc-300 pt-1 relative">
          {/* upper part */}
          <div className=" p-2 flex space-x-2 items-center">
            <div className="">
              <p className="text-xs pb-2">{title} No: </p>
              <input
                type="number"
                placeholder="1"
                value={data?.salesInvoiceNumber}
                ref={invoiceNoRef}
                name="salesInvoiceNumber"
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    salesInvoiceNumber: Number(e.target.value),
                  }))
                }
                className="input input-xs border-none bg-zinc-200 w-30"
              />
            </div>
            <div>
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
                className="input input-xs border-none bg-zinc-200 w-30"
              />
            </div>
          </div>
          {/* lower */}
          {title === "Sales Invoice" ? (
            <>
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
                  <div className="flex justify-end relative">
                    <IoCloseCircle
                      size={25}
                      onClick={() => setOpen(false)}
                      className="text-gray-500 absolute top-0 right-[57px]"
                    />
                  </div>
                  <div className="px-2 py-4 flex space-x-2 border border-dashed w-fit m-2 rounded-md ">
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

                            // calculate new due date = today + days
                            const newDate = new Date();
                            newDate.setDate(newDate.getDate() + days);

                            setData((prev) => ({
                              ...prev,
                              paymentTerms: days,
                              dueDate: newDate.toISOString().split("T")[0], // yyyy-mm-dd format
                            }));
                          }}
                          name="paymentTerms"
                          className="input input-xs w-30"
                        />
                        <span className="text-xs absolute z-50 left-21 top-1 bg-zinc-200 ">
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
                </>
              )}
            </>
          ) : title === "Quotation" ? (
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
          ) : title === "Sales Return" || title === "Credit Note" ? (
            <>
              <div className="px-2 flex flex-col w-full relative">
                <small>
                  Invoice :{" "}
                  {data?.invoiceId && (
                    <span className="font-semibold">
                      #
                      {
                        invoices.filter(
                          (invoice) => invoice?._id === data?.invoiceId
                        )[0]?.salesInvoiceNumber
                      }
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
                      <table className="table table-xs">
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
                                    invoiceId: partyInvoice?._id,
                                  }));
                                  setShowPartyInvoicePopup(false);
                                }}
                              >
                                <td>
                                  {partyInvoice?.salesInvoiceDate.split("T")[0]}
                                </td>
                                <td>{partyInvoice?.salesInvoiceNumber}</td>
                                <td>
                                  <div className="flex items-center">
                                    <LiaRupeeSignSolid />
                                    {Number(
                                      partyInvoice?.totalAmount
                                    ).toLocaleString("en-IN")}
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
