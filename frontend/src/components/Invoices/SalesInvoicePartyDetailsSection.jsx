import { useState } from "react";
import { Link } from "react-router-dom";
import { usePartyStore } from "../../store/partyStore";
import { IoCloseCircle } from "react-icons/io5";

const SalesInvoicePartyDetailsSection = ({
  title,
  data,
  setData,
  party,
  setParty,
}) => {
  const [searchPartyQuery, setSearchPartyQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { parties } = usePartyStore();

  const searchedParties = parties?.filter((party) =>
    party?.partyName.toLowerCase().includes(searchPartyQuery.toLowerCase())
  );
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
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
              <p className="text-xs pb-2">{title} No: </p>
              <input
                type="number"
                placeholder="1"
                value={data?.salesInvoiceNumber}
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
                value={data.salesInvoiceDate}
                onChange={handleInputChange}
                name="salesInvoiceDate"
                className="input input-xs border-none bg-zinc-200 w-30"
              />
            </div>
          </div>
          {/* lower */}

          {title !== "Quotation" && (
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
                          placeholder="0"
                          value={data.paymentTerms}
                          onChange={(e) =>
                            setData((prev) => ({
                              ...prev,
                              paymentTerms: Number(e.target.value),
                            }))
                          }
                          name="paymentTerms"
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
                        value={data.dueDate}
                        onChange={handleInputChange}
                        name="dueDate"
                        defaultValue={new Date().toISOString().split("T")[0]}
                        className="input input-xs border-none bg-zinc-200 w-30"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default SalesInvoicePartyDetailsSection;
