import DashboardNavbar from "../components/DashboardNavbar";
import { FaFileInvoice } from "react-icons/fa6";
import SalesNavigationMenus from "../components/SalesNavigationMenus";
import { useBusinessStore } from "../store/businessStore";
import { useProformaInvoiceStore } from "../store/proformaStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import CustomLoader from "../components/Loader";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { EllipsisVertical } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineHistory } from "react-icons/md";
import { BiDuplicate } from "react-icons/bi";
import { BsTrash3 } from "react-icons/bs";
import dayjs from "dayjs";

const DashboardProformaPage = () => {
  const { business } = useBusinessStore();
  const { setProformaInvoices, setTotalProformaInvoices } =
    useProformaInvoiceStore();
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [invoiceId, setInvoiceId] = useState();
  const [type, setType] = useState("");

  // QUERY TO FETCH ALL THE PROFORMA INVOICES
  const { isLoading, data: proformaInvoices } = useQuery({
    queryKey: ["proformaInvoice"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/proforma-invoice/${business?._id}`);
      setTotalProformaInvoices(res.data.totalProformaInvoices);
      setProformaInvoices(res.data?.proformaInvoices);
      return res.data?.proformaInvoices;
    },
  });

  // DELETING PROFORMA INVOICE
  const mutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/proforma-invoice/${invoiceId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      queryClient.invalidateQueries({ queryKey: ["proformaInvoice"] });
      document.getElementById("my_modal_2").close();
    },
  });

  const filteredProforma =
    proformaInvoices &&
    proformaInvoices.filter((proforma) => {
      const proformaDate = dayjs(
        proforma?.proformaInvoiceDate || proforma?.createdAt
      );

      // --- Date filter ---
      switch (filterDate) {
        case "today":
          if (!proformaDate.isSame(dayjs(), "day")) return false;
          break;
        case "yesterday":
          if (!proformaDate.isSame(dayjs().subtract(1, "day"), "day"))
            return false;
          break;
        case "thisWeek":
          if (
            !proformaDate.isBetween(
              dayjs().startOf("isoWeek"),
              dayjs().endOf("isoWeek"),
              null,
              "[]"
            )
          )
            return false;
          break;
        case "lastWeek":
          const startLastWeek = dayjs().subtract(1, "week").startOf("isoWeek");
          const endLastWeek = dayjs().subtract(1, "week").endOf("isoWeek");
          if (!proformaDate.isBetween(startLastWeek, endLastWeek, null, "[]"))
            return false;
          break;
        default:
          break;
      }

      // --- Search filter ---
      if (searchedQuery.trim()) {
        const query = searchedQuery.toLowerCase();
        const matchesText =
          proforma?.proformaInvoiceNumber
            ?.toString()
            .toLowerCase()
            .includes(query) ||
          proforma?.partyId?.partyName?.toLowerCase().includes(query);
        return matchesText;
      }

      // FILTERING BASED ON QUOTATION TYPE
      if (type === "open" || type === "closed") {
        const matchesText = proforma?.status
          ?.toLowerCase()
          .includes(type.toLowerCase());
        return matchesText;
      } else {
        return proforma;
      }

      return true;
    });

  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-gradient-to-b from-white to-transparent rounded-lg p-3">
        <DashboardNavbar title={"Proforma Invoice"} />
        <SalesNavigationMenus
          title={"Proforma Invoice"}
          btnText={"Proforma Invoice"}
          selectText={"Invoices"}
          type={type}
          setType={setType}
          setFilterDate={setFilterDate}
          setSearchedQuery={setSearchedQuery}
        />
        <div className="mt-5 h-80 rounded-md mx-4">
          {isLoading ? (
            <div className="w-full flex justify-center py-16">
              <CustomLoader text={"Loading..."} />
            </div>
          ) : filteredProforma.length > 0 ? (
            <>
              <table className="table table-zebra border border-[var(--table-border)]">
                {/* head */}
                <thead>
                  <tr className="text-xs bg-[var(--primary-background)]">
                    <th>Date</th>
                    <th>Proforma Invoice Number</th>
                    <th>Party Name</th>
                    <th>Due In</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProforma.map((proforma) => (
                    <tr
                      key={proforma?._id}
                      onClick={() =>
                        navigate(`/dashboard/proforma-invoice/${proforma?._id}`)
                      }
                      className="cursor-pointer"
                    >
                      <td>{proforma?.proformaInvoiceDate.split("T")[0]}</td>
                      <td>{proforma?.proformaInvoiceNumber}</td>
                      <td>{proforma?.partyName}</td>
                      <td>{proforma?.dueDate.split("T")[0]}</td>
                      <td>
                        <div className="flex items-center">
                          <LiaRupeeSignSolid />
                          {Number(proforma?.totalAmount).toLocaleString(
                            "en-IN"
                          )}
                        </div>
                      </td>
                      <td>
                        {" "}
                        <div
                          className={`badge badge-soft badge-sm  ${
                            proforma.status === "expired"
                              ? "badge-error"
                              : "badge-success"
                          } `}
                        >
                          {proforma?.status}
                        </div>
                      </td>
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
                              <button
                                onClick={() =>
                                  navigate(
                                    `/dashboard/update/${proforma?._id}?type=proforma invoice`
                                  )
                                }
                                className="flex items-center gap-2"
                              >
                                <FaRegEdit /> Edit
                              </button>
                            </li>
                            {/* <li>
                              <a>
                                <MdOutlineHistory />
                                Edit History
                              </a>
                            </li>
                            <li>
                              <a>
                                <BiDuplicate />
                                Duplicate
                              </a>
                            </li> */}
                            <li>
                              <a
                                onClick={() => {
                                  document
                                    .getElementById("my_modal_2")
                                    .showModal();
                                  setInvoiceId(proforma?._id);
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
              <FaFileInvoice size={40} />
              <span className="text-sm">
                No transactions matching the current filter
              </span>
            </div>
          )}
        </div>
      </div>
      {!showDeletePopup && (
        <>
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
              <p className="py-4 text-sm">
                Are you sure you want to delete the selected item(s)? This
                action cannot be undone.
              </p>
              <div className="flex w-full">
                <button
                  onClick={() => mutation.mutate()}
                  className="btn btn-sm btn-ghost  ml-auto text-[var(--error-text-color)]"
                >
                  Delete
                </button>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </>
      )}
    </main>
  );
};

export default DashboardProformaPage;
