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

const DashboardProformaPage = () => {
  const { business } = useBusinessStore();
  const [invoiceId, setInvoiceId] = useState();
  const { setProformaInvoices } = useProformaInvoiceStore();
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const { isLoading, data: proformaInvoices } = useQuery({
    queryKey: ["proformaInvoice"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/proforma-invoice/${business?._id}`);
      setProformaInvoices(res.data?.proformaInvoices);
      return res.data?.proformaInvoices;
    },
  });

  const mutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/proforma-invoice/${invoiceId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      queryClient.invalidateQueries({ queryKey: ["proformaInvoice"] });
    },
  });

  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-gradient-to-b from-white to-transparent rounded-lg p-3">
        <DashboardNavbar title={"Proforma Invoice"} />
        <SalesNavigationMenus
          title={"Proforma Invoice"}
          btnText={"Proforma Invoice"}
          selectText={"Invoices"}
        />
        <div className="mt-5 h-80 rounded-md mx-4">
          {isLoading ? (
            <div className="w-full flex justify-center py-16">
              <CustomLoader text={"Loading..."} />
            </div>
          ) : proformaInvoices ? (
            <>
              <table className="table table-zebra">
                {/* head */}
                <thead>
                  <tr className="text-xs bg-zinc-100">
                    <th>Date</th>
                    <th>Proforma Invoice Number</th>
                    <th>Party Name</th>
                    <th>Due In</th>
                    <th>Invoice Number</th>
                    <th>Amount</th>
                    <th className="w-60">Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {proformaInvoices.map((proforma) => (
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
                      <td>-</td>
                      <td>-</td>
                      <td>
                        <div className="flex items-center">
                          <LiaRupeeSignSolid />
                          {Number(proforma?.totalAmount).toLocaleString(
                            "en-IN"
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-soft badge-sm badge-primary">
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
                              <a>
                                <FaRegEdit /> Edit
                              </a>
                            </li>
                            <li>
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
                            </li>
                            <li>
                              <a
                                onClick={() => {
                                  document
                                    .getElementById("my_modal_2")
                                    .showModal();
                                  setInvoiceId(invoice?._id);
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
