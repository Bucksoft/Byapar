import { BsCartXFill, BsTrash3 } from "react-icons/bs";
import DashboardNavbar from "../components/DashboardNavbar";
import SalesNavigationMenus from "../components/SalesNavigationMenus";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { usePurchaseReturnStore } from "../store/purchaseReturnStore";
import { queryClient } from "../main";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { useBusinessStore } from "../store/businessStore";
import { EllipsisVertical } from "lucide-react";
import { FaFileInvoice, FaRegEdit } from "react-icons/fa";
import CustomLoader from "../components/Loader";
import { LiaRupeeSignSolid } from "react-icons/lia";

const DashboardPurchaseReturnPage = () => {
  const { business } = useBusinessStore();
  const {
    setPurchaseReturns,
    setTotalPurchaseReturn,
    setLatestPurchaseReturnNumber,
  } = usePurchaseReturnStore();
  const [searchedQuery, setSearchedQuery] = useState("");
  const [purchaseReturnId, setPurchaseReturnId] = useState();
  const [filterDate, setFilterDate] = useState("");
  const navigate = useNavigate();

  // Mutation to delete a sale return
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(
        `/purchase-return/${purchaseReturnId}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      document.getElementById("my_modal_2").close();
      queryClient.invalidateQueries(["purchaseReturn"]);
    },
    onError: (err) => {
      toast.error(err.response.data.msg || "Something went wrong");
      document.getElementById("my_modal_2").close();
    },
  });

  // Query to fetch all the purchase return
  const { isLoading, data: purchaseReturns } = useQuery({
    queryKey: ["purchaseReturn"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/purchase-return/${business?._id}`);
      console.log(res);
      setTotalPurchaseReturn(res.data?.totalPurchaseReturn);
      setLatestPurchaseReturnNumber(res.data?.latestPurchaseReturnNumber);
      setPurchaseReturns(res.data?.purchaseReturn);
      return res.data?.purchaseReturn;
    },
  });

  const searchedPurchaseReturns = purchaseReturns?.filter((purchaseReturn) => {
    if (searchedQuery.trim() !== "") {
      const matchesSearch =
        purchaseReturn?.purchaseReturnNumber
          ?.toString()
          ?.toLowerCase()
          .includes(searchedQuery.toLowerCase()) ||
        purchaseReturn?.partyName
          ?.toLowerCase()
          .includes(searchedQuery.toLowerCase());
      if (!matchesSearch) return false;
    }

    if (filterDate) {
      const today = dayjs();
      const purchaseReturnDate = dayjs(
        purchaseReturn?.purchaseReturnDate || purchaseReturn?.createdAt
      );

      switch (filterDate) {
        case "today":
          if (!purchaseReturnDate.isSame(today, "day")) return false;
          break;

        case "yesterday":
          if (!purchaseReturnDate.isSame(today.subtract(1, "day"), "day"))
            return false;
          break;

        case "thisWeek":
          if (
            !purchaseReturnDate.isSameOrAfter(today.startOf("week")) ||
            !purchaseReturnDate.isSameOrBefore(today.endOf("week"))
          )
            return false;
          break;

        case "lastWeek":
          const lastWeekStart = today.subtract(1, "week").startOf("week");
          const lastWeekEnd = today.subtract(1, "week").endOf("week");
          if (
            !purchaseReturnDate.isSameOrAfter(lastWeekStart) ||
            !purchaseReturnDate.isSameOrBefore(lastWeekEnd)
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
        <DashboardNavbar title={"Purchase Return"} />
        <SalesNavigationMenus
          btnText={"Purchase Return"}
          setSearchedQuery={setSearchedQuery}
          setFilterDate={setFilterDate}
          title={"Purchase Return"}
          filterDate={filterDate}
        />
        <div className=" mt-5 h-80 rounded-md mx-4">
          {isLoading ? (
            <div className="w-full flex justify-center py-5">
              <CustomLoader text={"Loading..."} />
            </div>
          ) : searchedPurchaseReturns?.length > 0 ? (
            <table className="table table-zebra border border-zinc-100">
              {/* head */}
              <thead>
                <tr className="text-xs bg-zinc-100">
                  <th>Date</th>
                  <th>Purchase Return Number</th>
                  <th>Party Name</th>

                  <th>Due In</th>
                  {/* <th>Invoice Number</th> */}

                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {searchedPurchaseReturns.map((purchaseReturn) => (
                  <tr
                    onClick={() =>
                      navigate(
                        `/dashboard/purchase-return/${purchaseReturn?._id}`
                      )
                    }
                    key={purchaseReturn?._id}
                    className="cursor-pointer hover:bg-zinc-50"
                  >
                    <td>
                      {(purchaseReturn?.purchaseReturnDate).split("T")[0]}
                    </td>
                    <td>{purchaseReturn?.purchaseReturnNumber}</td>
                    <td>{purchaseReturn?.partyName}</td>
                    <td>{purchaseReturn?.dueDate.split("T")[0] || "-"}</td>

                    <td>
                      <div className="flex items-center">
                        <LiaRupeeSignSolid />
                        {Number(purchaseReturn?.totalAmount).toLocaleString(
                          "en-IN"
                        ) || "-"}
                      </div>
                    </td>
                    <td>
                      <div
                        className={` ${
                          purchaseReturn?.status === "cancelled"
                            ? "badge-error"
                            : "badge-primary"
                        }  badge badge-sm  badge-soft`}
                      >
                        {purchaseReturn?.status}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/dashboard/update/${purchaseReturn?._id}?type=purchase return`
                            );
                          }}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                document
                                  .getElementById("my_modal_2")
                                  .showModal();
                                setPurchaseReturnId(purchaseReturn?._id);
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
              <span className="text-sm">No Purchase Return found</span>
            </div>
          )}
          {!purchaseReturns && (
            <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
              <FaFileInvoice size={40} />
              <span className="text-sm">
                No transactions matching the current filter
              </span>
            </div>
          )}
        </div>
      </div>
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
                className="btn rounded-xl btn-sm btn-ghost ml-auto text-[var(--error-text-color)]"
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
    </main>
  );
};

export default DashboardPurchaseReturnPage;
