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

const DashboardPartyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("transactions");
  const { invoices } = useInvoiceStore();
  const [partyInvoices, setPartyInvoices] = useState();

  function handleSelectedMenu(menu) {
    setSelectedMenu(menu.toLowerCase());
  }

  const { isLoading, data: party } = useQuery({
    queryFn: async () => {
      const res = await axiosInstance.get(`/parties/${id}`);
      return res.data.party;
    },
  });

  useEffect(() => {
    const partyInvoices = invoices?.filter(
      (invoice) => invoice?.partyId?._id === id
    );
    setPartyInvoices(partyInvoices);
  }, [id, invoices]);

  const handleSelectChange = (e) => {
    if (e.target.value === "Sales Invoice") {
      navigate("/dashboard/parties/sales-invoice", { state: { id: id } });
    }
    if (e.target.value === "Quotation") {
      navigate("/dashboard/parties/create-quotation", { state: { id: id } });
    }
    if (e.target.value === "Proforma Invoice") {
      navigate("/dashboard/parties/proforma-invoice", { state: { id: id } });
    }
    if (e.target.value === "Sales Return") {
      navigate("/dashboard/parties/sales-return", { state: { id: id } });
    }
  };

  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        {/* Header section */}
        <header>
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
              <Link to={`/dashboard/edit-party/${party?._id}`}>
                <button className="btn btn-sm ">
                  <FaRegEdit />
                  Edit
                </button>
              </Link>
            </div>
          </nav>
        </header>

        <section className="flex items-center gap-8 border-b border-zinc-200 text-zinc-600">
          {dashboardSinglePartyMenus.map((menu) => (
            <button
              key={menu.id}
              className={`flex items-center text-xs mt-5 gap-3 p-3 cursor-pointer ${
                selectedMenu === menu.title.toLowerCase() &&
                "text-[var(--secondary-text-color)]  border-b"
              } `}
              onClick={() => handleSelectedMenu(menu.title)}
            >
              {menu.icon} {menu.title}
            </button>
          ))}
        </section>

        <section className="flex flex-col">
          <fieldset className="fieldset">
            <select className="select select-sm w-1/5 my-4">
              <option disabled hidden>
                Select Transaction Type
              </option>
              <option value="sales_invoice">Sales</option>
              <option value="quotation">Purchase</option>
              <option value="proforma_invoice">Payment In</option>
              <option value="sales_return">Payment Out</option>
              <option value="sales_return">Quotation</option>
              <option value="sales_return">Sales Return</option>
              <option value="sales_return">Purchase Return</option>
              <option value="sales_return">Credit Note</option>
              <option value="sales_return">Debit Note</option>
              <option value="sales_return">All Transactions</option>
            </select>
          </fieldset>
        </section>

        {selectedMenu === "transactions" && (
          <PartyTransactions party={party} partyInvoices={partyInvoices} />
        )}

        {selectedMenu === "profile" && <PartyProfile party={party} />}

        {selectedMenu === "ledger (statement)" && (
          <PartyLedgerStatement party={party} />
        )}

        {selectedMenu === "item wise report" && (
          <PartyItemWiseReport party={party} />
        )}
      </div>
    </main>
  );
};

export default DashboardPartyPage;
