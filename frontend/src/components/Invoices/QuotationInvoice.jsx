import { ArrowLeft, Download, EllipsisVertical, Trash2 } from "lucide-react";
import { GiProfit } from "react-icons/gi";
import { TbFileInvoice } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import InvoiceTemplate from "./InvoiceTemplate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import { downloadPDF } from "../../../helpers/downloadPdf";
import { useState } from "react";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import CustomLoader from "../Loader";

const QuotationInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotationIdToDelete, setQuotationIdToDelete] = useState();
  const [invoiceIdToDownload, setInvoiceIdToDownload] = useState("invoice");

  // THIS IS THE QUERY TO GET THE INVOICE BASED ON ID
  const { isLoading, data: quotation } = useQuery({
    queryFn: async () => {
      const res = await axiosInstance.get(`/quotation/${id}`);
      return res.data?.quotation;
    },
  });

  // THIS IS THE MUTATION TO DELETE THE INVOICE
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(
        `/quotation/${quotationIdToDelete}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      navigate(-1);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  return (
    <main className="p-2 h-screen ">
      <div className="h-full w-full bg-white rounded-lg p-4 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowLeft onClick={() => navigate(-1)} />
            <h1 className="font-medium">Quotation </h1>
            <div className="badge badge-success badge-soft">
              {quotation?.status}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-sm">
                <EllipsisVertical size={14} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <li>
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/update/${quotation?._id}?type=quotation`
                      )
                    }
                  >
                    Edit
                  </button>
                </li>
                {/* <li>
                  <button>Edit History</button>
                </li>
                <li>
                  <button>Duplicate</button>
                </li> */}
                <li>
                  <button
                    onClick={() => {
                      document.getElementById("my_modal_3").showModal();
                      setQuotationIdToDelete(quotation?._id);
                    }}
                    className="text-error"
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Subheading */}
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-2 mt-7">
            <button
              onClick={() => downloadPDF(invoiceIdToDownload, "quotation")}
              className="btn btn-sm"
            >
              <Download size={15} /> Download PDF
            </button>
            {/* <select className="select select-sm">
              <option className="hidden">Print PDF</option>
              <option>Print PDF</option>
              <option>Print Thermal</option>
              <option>Print Duplicate</option>
              <option>Print Triplicate</option>
            </select>

            <select className="select select-sm">
              <option className="hidden">Share</option>
              <option>Whatsapp</option>
              <option>SMS</option>
            </select> */}
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-info">
              <TbFileInvoice /> Convert to Invoice
            </button>
          </div>
        </section>

        {/* Invoice template */}
        <section className="mt-3 bg-orange-50 flex justify-center py-1 overflow-y-scroll flex-1">
          {isLoading ? (
            <CustomLoader text={"Loading..."} />
          ) : (
            <section className="mt-3 flex justify-center py-1 overflow-y-scroll flex-1">
              {/* Invoice template */}
              <InvoiceTemplate
                color={"orange"}
                invoice={quotation}
                type="Quotation"
                setInvoiceIdToDownload={setInvoiceIdToDownload}
              />
            </section>
          )}
        </section>
      </div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Are you sure ?</h3>
          <p className="py-4">
            This action cannot be undone. All values associated with this field
            will be lost.
          </p>
          <div className="w-full grid place-items-end">
            <button
              onClick={() => mutation.mutate()}
              className="btn btn-sm bg-[var(--error-text-color)] text-[var(--primary-text-color)]"
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>
    </main>
  );
};

export default QuotationInvoice;
