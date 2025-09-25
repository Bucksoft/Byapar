import DashboardNavbar from "../components/DashboardNavbar";
import { FaFileInvoice } from "react-icons/fa6";
import SalesNavigationMenus from "../components/SalesNavigationMenus";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useBusinessStore } from "../store/businessStore";
import { useChallanStore } from "../store/challanStore";
import CustomLoader from "../components/Loader";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { BsTrash3 } from "react-icons/bs";
import { BiDuplicate } from "react-icons/bi";
import { MdOutlineHistory } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import dayjs from "dayjs";

const DashboardDeliveryChallanPage = () => {
  const { business } = useBusinessStore();
  const { setDeliveryChallans, setTotalDeliveryChallans } = useChallanStore();
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [type, setType] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [invoiceId, setInvoiceId] = useState();

  const { isLoading, data: deliveryChallans } = useQuery({
    queryKey: ["deliveryChallan"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/delivery-challan/${business?._id}`);
      setTotalDeliveryChallans(res.data?.totalDeliveryChallans);
      setDeliveryChallans(res.data?.deliveryChallans);
      return res.data?.deliveryChallans;
    },
  });

  const mutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/delivery-challan/${invoiceId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      queryClient.invalidateQueries({ queryKey: ["deliveryChallan"] });
    },
  });

  const filteredChallans =
    deliveryChallans &&
    deliveryChallans.filter((challan) => {
      const challanDate = dayjs(
        challan?.deliveryChallanDate || challan?.createdAt
      );

      // --- Date filter ---
      switch (filterDate) {
        case "today":
          if (!challanDate.isSame(dayjs(), "day")) return false;
          break;
        case "yesterday":
          if (!challanDate.isSame(dayjs().subtract(1, "day"), "day"))
            return false;
          break;
        case "thisWeek":
          if (
            !challanDate.isBetween(
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
          if (!challanDate.isBetween(startLastWeek, endLastWeek, null, "[]"))
            return false;
          break;
        default:
          break;
      }

      // --- Search filter ---
      if (searchedQuery.trim()) {
        const query = searchedQuery.toLowerCase();
        const matchesText =
          challan?.deliveryChallanNumber
            ?.toString()
            .toLowerCase()
            .includes(query) ||
          challan?.partyId?.partyName?.toLowerCase().includes(query);
        return matchesText;
      }

      // FILTERING BASED ON QUOTATION TYPE
      if (type === "open" || type === "closed") {
        const matchesText = challan?.status
          ?.toLowerCase()
          .includes(type.toLowerCase());
        return matchesText;
      } else {
        return challan;
      }

      return true;
    });

  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-gradient-to-b from-white to-transparent rounded-lg p-3">
        <DashboardNavbar title={"Delivery Challan"} />
        <SalesNavigationMenus
          title={"Delivery Challan"}
          selectText={"Challan"}
          btnText={"Delivery Challan"}
          type={type}
          setType={setType}
          setFilterDate={setFilterDate}
          setSearchedQuery={setSearchedQuery}
        />
        <div className=" mt-5 h-80 rounded-md mx-4 ">
          {isLoading ? (
            <div className="w-full flex justify-center py-16">
              <CustomLoader text={"Loading..."} />
            </div>
          ) : filteredChallans.length > 0 ? (
            <table className="table table-zebra border border-[var(--table-border)]">
              {/* head */}
              <thead>
                <tr className="text-xs bg-[var(--primary-background)]">
                  <th>Date</th>
                  <th>Delivery Challan Number</th>
                  <th>Party Name</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredChallans.map((challan) => (
                  <tr
                    key={challan?._id}
                    onClick={() =>
                      navigate(`/dashboard/delivery-challan/${challan?._id}`)
                    }
                    className="cursor-pointer"
                  >
                    <td>{challan?.deliveryChallanDate.split("T")[0]}</td>
                    <td>{challan?.deliveryChallanNumber}</td>
                    <td>{challan?.partyName}</td>
                    <td>
                      <div className="flex items-center">
                        <LiaRupeeSignSolid />
                        {Number(challan?.totalAmount).toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td>
                      <div className="badge badge-soft badge-sm badge-success">
                        {challan?.status}
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
                                setInvoiceId(challan?._id);
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

export default DashboardDeliveryChallanPage;
