import { FaFileInvoice } from "react-icons/fa6";
import DashboardNavbar from "../components/DashboardNavbar";
import SalesNavigationMenus from "../components/SalesNavigationMenus";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useBusinessStore } from "../store/businessStore";
import { axiosInstance } from "../config/axios";
import { useSalesReturnStore } from "../store/salesReturnStore";
import CustomLoader from "../components/Loader";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import { BiDuplicate } from "react-icons/bi";
import { MdOutlineHistory } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const DashboardSalesReturnPage = () => {
  const { business } = useBusinessStore();
  const { setSaleReturns } = useSalesReturnStore();
  const [searchedQuery, setSearchedQuery] = useState("");
  const [saleReturnId, setSaleReturnId] = useState();
  const [filterDate, setFilterDate] = useState("");
  const navigate = useNavigate();

  // Mutation to delete a sale return
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/sales-return/${saleReturnId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      document.getElementById("my_modal_2").close();
      queryClient.invalidateQueries(["salesReturn"]);
    },
    onError: (err) => {
      toast.error(err.response.data.msg || "Something went wrong");
      document.getElementById("my_modal_2").close();
    },
  });

  const { isLoading, data: salesReturn } = useQuery({
    queryKey: ["salesReturn"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/sales-return/${business?._id}`);
      setSaleReturns(res.data?.salesReturn);
      return res.data?.salesReturn;
    },
  });

  const searchedSaleReturns = salesReturn?.filter((saleReturn) => {
    if (searchedQuery.trim() !== "") {
      const matchesSearch =
        saleReturn?.salesReturnNumber
          ?.toString()
          ?.toLowerCase()
          .includes(searchedQuery.toLowerCase()) ||
        saleReturn?.partyName
          ?.toLowerCase()
          .includes(searchedQuery.toLowerCase());
      if (!matchesSearch) return false;
    }

    if (filterDate) {
      const today = dayjs();
      const saleReturnDate = dayjs(
        saleReturn?.salesReturnDate || saleReturn?.createdAt
      );

      switch (filterDate) {
        case "today":
          if (!saleReturnDate.isSame(today, "day")) return false;
          break;

        case "yesterday":
          if (!saleReturnDate.isSame(today.subtract(1, "day"), "day"))
            return false;
          break;

        case "thisWeek":
          if (
            !saleReturnDate.isSameOrAfter(today.startOf("week")) ||
            !saleReturnDate.isSameOrBefore(today.endOf("week"))
          )
            return false;
          break;

        case "lastWeek":
          const lastWeekStart = today.subtract(1, "week").startOf("week");
          const lastWeekEnd = today.subtract(1, "week").endOf("week");
          if (
            !saleReturnDate.isSameOrAfter(lastWeekStart) ||
            !saleReturnDate.isSameOrBefore(lastWeekEnd)
          )
            return false;
          break;
        default:
          break;
      }
    }
    return true;
  });

  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        <DashboardNavbar title={"Sales Return"} />
        <SalesNavigationMenus
          btnText={"Sales Return"}
          setSearchedQuery={setSearchedQuery}
          setFilterDate={setFilterDate}
          title={"Sales Return"}
          filterDate={filterDate}
        />
        <div className=" mt-5 h-80 rounded-md mx-4">
          {isLoading ? (
            <div className="w-full flex justify-center py-5">
              <CustomLoader text={"Loading..."} />
            </div>
          ) : searchedSaleReturns?.length > 0 ? (
            <table className="table table-zebra">
              {/* head */}
              <thead>
                <tr className="text-xs bg-zinc-100">
                  <th>Date</th>
                  <th>Sales Return Number</th>
                  <th>Party Name</th>

                  <th>Due In</th>
                  <th>Invoice Number</th>

                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {searchedSaleReturns.map((saleReturn) => (
                  <tr
                    onClick={() =>
                      navigate(`/dashboard/sales-return/${saleReturn?._id}`)
                    }
                    key={saleReturn?._id}
                    className="cursor-pointer hover:bg-zinc-50"
                  >
                    <td>{(saleReturn?.salesReturnDate).split("T")[0]}</td>
                    <td>{saleReturn?.salesReturnNumber}</td>
                    <td>{saleReturn?.partyName}</td>
                    <td>{saleReturn?.dueIn || "-"}</td>
                    <td>{saleReturn?.invoiceId?.salesInvoiceNumber || "-"}</td>
                    <td>
                      <div className="flex items-center">
                        <LiaRupeeSignSolid />
                        {Number(saleReturn?.totalAmount).toLocaleString(
                          "en-IN"
                        ) || "-"}
                      </div>
                    </td>
                    <td>
                      <div className="badge badge-sm badge-secondary badge-soft">
                        {saleReturn?.status}
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
                                setSaleReturnId(saleReturn?._id);
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
          ) : (
            <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
              <FaFileInvoice size={40} />
              <span className="text-sm">No Sales Return found</span>
            </div>
          )}
          {!salesReturn && (
            <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
              <FaFileInvoice size={40} />
              <span className="text-sm">
                No transactions matching the current filter
              </span>
            </div>
          )}
        </div>
      </div>
      {/* {!showDeletePopup && ( */}
      <>
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4 text-sm">
              Are you sure you want to delete the selected item(s)? This action
              cannot be undone.
            </p>
            <div className="flex w-full">
              <button
                onClick={() => mutation.mutate()}
                className="btn btn-sm btn-ghost ml-auto text-[var(--error-text-color)]"
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
      {/* )} */}
    </main>
  );
};

export default DashboardSalesReturnPage;
