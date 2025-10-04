import { BsCartXFill } from "react-icons/bs";
import DashboardNavbar from "../components/DashboardNavbar";
import SalesNavigationMenus from "../components/SalesNavigationMenus";
import { useBusinessStore } from "../store/businessStore";
import { useDebitNoteStore } from "../store/debitNoteStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../components/Loader";
import { LiaRupeeSignSolid } from "react-icons/lia";

const DashboardDebitNotePage = () => {
  const { business } = useBusinessStore();
  const { setTotalDebitNotes, setDebitNotes } = useDebitNoteStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [invoiceId, setInvoiceId] = useState();
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // MUTATION TO DELETE INVOICE
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/debit-note/${invoiceId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      queryClient.invalidateQueries({ queryKey: ["debitNotes"] });
      document.getElementById("my_modal_2").close();
    },
  });

  // QUERY TO FETCH ALL DEBIT NOTES
  const { isLoading, data: debitNotes } = useQuery({
    queryKey: ["debitNotes"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/debit-note/${business?._id}`);
      setDebitNotes(res.data?.debitNotes);
      setTotalDebitNotes(res.data?.totalDebitNotes);
      return res.data?.debitNotes;
    },
  });

  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        <DashboardNavbar title={"Debit Note"} />
        <SalesNavigationMenus title={"Debit Note"} btnText={"Debit Note"} />
        <div className="mt-5 h-80 rounded-md mx-4 ">
          {isLoading ? (
            <div>
              <CustomLoader text={"Loading..."} />
            </div>
          ) : debitNotes.length > 0 ? (
            <table className="table table-zebra border border-[var(--table-border)]">
              {/* head */}
              <thead>
                <tr className="bg-[var(--primary-background)]">
                  <th>Date</th>
                  <th>Debit Note Number</th>
                  <th>Party Name</th>
                  <th>Purchase No</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {debitNotes.map((debitNote) => (
                  <tr
                    key={debitNote?._id}
                    onClick={() =>
                      navigate(`/dashboard/debit-note/${debitNote?._id}`)
                    }
                    className="cursor-pointer"
                  >
                    <td>{debitNote?.debitNoteDate.split("T")[0]}</td>
                    <td>{debitNote?.debitNoteNumber}</td>
                    <td>{debitNote?.partyId?.partyName}</td>
                    <td>{"-"}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <LiaRupeeSignSolid />
                        {Number(debitNote?.totalAmount).toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td>
                      <div
                        className={` badge badge-soft badge-sm ${
                          debitNote?.status === "unpaid" ? "badge-error" : ""
                        }`}
                      >
                        {debitNote?.status}
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
    </main>
  );
};

export default DashboardDebitNotePage;
