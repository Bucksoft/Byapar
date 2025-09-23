import { FaFileInvoice } from "react-icons/fa6";
import DashboardNavbar from "../components/DashboardNavbar";
import SalesNavigationMenus from "../components/SalesNavigationMenus";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useBusinessStore } from "../store/businessStore";
import CustomLoader from "../components/Loader";
import { useCreditNoteStore } from "../store/creditNoteStore";
import { useEffect, useState } from "react";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { FaRegEdit } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardCreditNotePage = () => {
  const { business } = useBusinessStore();
  const { setTotalCreditNotes, setCreditNotes } = useCreditNoteStore();
  const [searchedQuery, setSearchedQuery] = useState();
  const navigate = useNavigate();

  const { isLoading, data } = useQuery({
    queryKey: ["creditNote"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/credit-note/${business?._id}`);
      if (res.data.success) {
        setCreditNotes(res.data?.creditNotes);
        setTotalCreditNotes(res.data?.totalCreditNotes);
      }
      return res.data.creditNotes;
    },
  });

  const searchedCreditNotes =
    data && searchedQuery
      ? data.filter(
          (creditNote) =>
            creditNote?.partyName
              ?.toLowerCase()
              .includes(searchedQuery.toLowerCase()) ||
            creditNote?.creditNoteNumber
              .toString()
              .toLowerCase()
              .includes(searchedQuery.toString().toLowerCase())
        )
      : data;

  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        <DashboardNavbar title={"Credit Note"} />
        <SalesNavigationMenus
          btnText={"Credit Note"}
          title={"Credit Note"}
          setSearchedQuery={setSearchedQuery}
        />
        <div className=" mt-5 h-80 rounded-md mx-4 ">
          {isLoading ? (
            <div className="w-full py-3 flex justify-center">
              <CustomLoader text={"Getting all credit notes..."} />
            </div>
          ) : (
            (searchedCreditNotes || data) && (
              <table className="table table-zebra border border-zinc-100">
                {/* head */}
                <thead>
                  <tr className="text-xs bg-zinc-100 ">
                    <th>Date</th>
                    <th>Credit Note Number</th>
                    <th>Party Name</th>
                    <th>Invoice Number</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {searchedCreditNotes.length > 0 ? (
                    searchedCreditNotes.map((creditNote) => (
                      <tr
                        key={creditNote?._id}
                        onClick={(e) => {
                          navigate(`/dashboard/credit-note/${creditNote?._id}`);
                        }}
                        className="cursor-pointer hover:bg-zinc-50"
                      >
                        <td>{creditNote?.creditNoteDate.split("T")[0]}</td>
                        <td>{creditNote?.creditNoteNumber}</td>
                        <td>{creditNote?.partyName}</td>
                        <td>
                          {creditNote?.invoiceId?.salesInvoiceNumber || "-"}
                        </td>
                        <td className="flex items-center gap-1">
                          <LiaRupeeSignSolid />
                          {Number(creditNote?.totalAmount).toLocaleString(
                            "en-IN"
                          )}
                        </td>
                        <td>
                          <p
                            className={`badge badge-soft badge-sm ${
                              creditNote?.status === "unpaid"
                                ? "badge-error"
                                : creditNote?.status === "partially paid"
                                ? "badge-secondary"
                                : creditNote?.status === "cancelled"
                                ? "badge-primary"
                                : "badge-success"
                            }`}
                          >
                            {creditNote?.status}
                          </p>
                        </td>
                        {creditNote?.status !== "cancelled" ? (
                          <td onClick={(e) => e.stopPropagation()}>
                            <div className="dropdown dropdown-end">
                              <div
                                tabIndex={0}
                                role="button"
                                className="btn m-1 btn-xs"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <EllipsisVertical size={13} />
                              </div>
                              <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <li>
                                  <a>
                                    <FaRegEdit /> Edit
                                  </a>
                                </li>
                                <li>
                                  <a
                                    onClick={() => {
                                      document
                                        .getElementById("my_modal_2")
                                        .showModal();
                                      setInvoiceId(creditNote?._id);
                                    }}
                                    className="text-[var(--error-text-color)]"
                                  >
                                    <BsTrash3 />
                                    Delete
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </td>
                        ) : (
                          <td className="text-center">-</td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-4 text-gray-500"
                      >
                        <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
                          <FaFileInvoice size={40} />
                          <span className="text-sm">
                            No transactions matching the current filter
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </main>
  );
};

export default DashboardCreditNotePage;
