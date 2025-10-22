import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../config/axios";

import { ArrowLeft } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import { dashboardSinglePartyMenus } from "../utils/constants";
import { useEffect, useState } from "react";
import PartyTransactions from "../components/Party/PartyTransactions";
import PartyProfile from "../components/Party/PartyProfile";
import PartyLedgerStatement from "../components/Party/PartyLedgerStatement";
import PartyItemWiseReport from "../components/Party/PartyItemWiseReport";
import { useInvoiceStore } from "../store/invoicesStore";
import { useBusinessStore } from "../store/businessStore";

const DashboardPartyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices } = useInvoiceStore();
  const [selectedMenu, setSelectedMenu] = useState("transactions");
  // const { invoices } = useInvoiceStore();
  const [partyInvoices, setPartyInvoices] = useState([]);
  const { business } = useBusinessStore();
  const [filter, setFilter] = useState("all_transactions");

  function handleSelectedMenu(menu) {
    setSelectedMenu(
      typeof menu === "string" ? menu.toLowerCase() : selectedMenu
    );
  }

  const { isLoading, data: party } = useQuery({
    queryKey: ["party", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/parties/${id}`);
      return res?.data?.party ?? null;
    },
    enabled: Boolean(id),
    retry: 1,
    // staleTime: 1000 * 60 * 5,
  });

  const { data } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/sales-invoice/party/${id}?businessId=${business?._id}`
      );
      setPartyInvoices(res.data?.invoices);
      return res.data?.invoices || [];
    },
  });

  // FILTER OUT THE INVOICES OF THE PARTY
  // useEffect(() => {
  //   if (!id) {
  //     setPartyInvoices([]);
  //     return;
  //   }
  //   const allInvoices = Array.isArray(invoices) ? invoices : [];
  //   const filtered = allInvoices.filter((invoice) => {
  //     const partyIdFromInvoice =
  //       invoice?.partyId && typeof invoice.partyId === "object"
  //         ? invoice?.partyId._id
  //         : invoice?.partyId;

  //     return String(partyIdFromInvoice) === String(id);
  //   });
  //   console.log(filtered);
  //   setPartyInvoices(filtered);
  // }, []);

  const handleSelectChange = (e) => {
    const value = e?.target?.value;
    if (!value) return;

    if (value === "Sales Invoice") {
      navigate("/dashboard/parties/sales-invoice", { state: { id: id } });
      return;
    }
    if (value === "Quotation") {
      navigate("/dashboard/parties/create-quotation", { state: { id: id } });
      return;
    }
    if (value === "Proforma Invoice") {
      navigate("/dashboard/parties/proforma-invoice", { state: { id: id } });
      return;
    }
    if (value === "Sales Return") {
      navigate("/dashboard/parties/sales-return", { state: { id: id } });
      return;
    }
  };

  return (
    <main className="h-screen p-2">
      <div className=" w-full bg-white rounded-lg p-3">
        {/* Header section */}
        <header className="sticky top-0 bg-white z-10 py-3">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-md">
              <ArrowLeft
                onClick={() => navigate(-1)}
                size={20}
                className="cursor-pointer"
              />
              <h1>Cash Sale</h1>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <fieldset className="fieldset">
                <select
                  onChange={handleSelectChange}
                  defaultValue="Sales Invoice"
                  className="select select-sm"
                >
                  <option value="Sales Invoice" disabled className="hidden">
                    Create Sales Invoice
                  </option>
                  <option value="Sales Invoice">Sales Invoice</option>
                  <option value="Quotation">Quotation</option>
                  <option value="Proforma Invoice">Proforma Invoice</option>
                  <option value="Sales Return">Sales Return</option>
                </select>
              </fieldset>

              {party?._id && (
                <Link to={`/dashboard/edit-party/${party._id}`}>
                  <button className="btn btn-sm">
                    <FaRegEdit />
                    Edit
                  </button>
                </Link>
              )}
            </div>
          </nav>
        </header>

        {/* Menu Section */}
        <section className="flex items-center gap-8 border-b border-zinc-200 text-zinc-600">
          {Array.isArray(dashboardSinglePartyMenus) &&
            dashboardSinglePartyMenus.map((menu) => (
              <button
                key={menu.id}
                className={`flex items-center text-xs mt-5 gap-3 p-3 cursor-pointer ${
                  selectedMenu === menu.title?.toLowerCase() &&
                  "text-[var(--secondary-text-color)]  border-b"
                }`}
                onClick={() => handleSelectedMenu(menu.title)}
              >
                {menu.icon} {menu.title}
              </button>
            ))}
        </section>

        {/* Filter Dropdown */}
        {selectedMenu !== "ledger (statement)" && (
          <section className="flex flex-col">
            <fieldset className="fieldset">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="select select-sm w-1/5 my-4"
              >
                <option disabled hidden>
                  Select Transaction Type
                </option>
                <option value="sales_invoice">Sales</option>
                <option value="payment_in">Payment In</option>
                <option value="payment_out">Payment Out</option>
                <option value="quotation">Quotation</option>
                <option value="sales_return">Sales Return</option>
                <option value="purchase_return">Purchase Return</option>
                <option value="credit_note">Credit Note</option>
                <option value="debit_note">Debit Note</option>
                <option value="all_transactions">All Transactions</option>
              </select>
            </fieldset>
          </section>
        )}

        {/* Content Sections */}
        {selectedMenu === "transactions" && (
          <PartyTransactions
            party={party ?? null}
            partyInvoices={Array.isArray(partyInvoices) ? partyInvoices : []}
            filter={filter}
          />
        )}

        {selectedMenu === "profile" && <PartyProfile party={party ?? null} />}

        {selectedMenu === "ledger (statement)" && (
          <PartyLedgerStatement party={party ?? null} filter={filter} />
        )}

        {selectedMenu === "item wise report" && (
          <PartyItemWiseReport party={party ?? null} filter={filter} />
        )}
      </div>
    </main>
  );
};

export default DashboardPartyPage;
