import {
  ArrowLeft,
  Download,
  EllipsisVertical,
  Printer,
  Trash2,
} from "lucide-react";
import { GiProfit } from "react-icons/gi";
import { TbFileInvoice } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import InvoiceTemplate from "./InvoiceTemplate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import { downloadPDF } from "../../../helpers/downloadPdf";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import CustomLoader from "../Loader";
import { handlePrint } from "../../../helpers/print";
import InvoiceTemplate1 from "../InvoiceTemplate/InvoiceTemplate1";
import InvoiceTemplate3 from "../InvoiceTemplate/InvoiceTemplate3";
import InvoiceTemplate2 from "../InvoiceTemplate/InvoiceTemplate2";

const QuotationInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [quotationIdToDelete, setQuotationIdToDelete] = useState();
  const [isDownloading, setIsDownloading] = useState(false);
  const [invoiceIdToDownload, setInvoiceIdToDownload] = useState();

  // THIS IS THE QUERY TO GET THE INVOICE BASED ON ID
  const { isLoading, data: quotation } = useQuery({
    queryFn: async () => {
      const res = await axiosInstance.get(`/quotation/${id}`);
      return res.data?.quotation;
    },
  });

  const currentInvoiceTheme = JSON.parse(localStorage.getItem("invoiceTheme"));
  const { data: currentTheme } = useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/invoiceTheme/settings/${currentInvoiceTheme}`
      );
      return res.data;
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
            <h1 className="font-medium">Quotation</h1>
            <div className="badge badge-success badge-soft">
              {quotation?.status}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePrint(printRef)}
              className="btn rounded-xl btn-sm btn-dash"
            >
              <Printer size={15} /> Print PDF
            </button>

            <button
              disabled={mutation.isPending}
              onClick={() =>
                downloadPDF(
                  invoiceIdToDownload,
                  `${invoice?.partyName
                    ?.split(" ")
                    .join("_")
                    .concat("_invoice")}`,
                  setIsDownloading
                )
              }
              className="btn btn-sm rounded-xl btn-soft btn-info"
            >
              {isDownloading ? (
                <div className="">
                  <CustomLoader text={"Downloading..."} />
                </div>
              ) : (
                <>
                  <Download size={15} /> Download PDF
                </>
              )}
            </button>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-sm rounded-xl">
                <EllipsisVertical size={14} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-38 text-xs p-1 shadow-sm"
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
                <li>
                  <button
                    onClick={() => {
                      document.getElementById("my_modal_3").showModal();
                      setQuotationIdToDelete(quotation?._id);
                    }}
                    className="text-error "
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Subheading */}
        <section className="flex items-center justify-between ">
          <div className="flex items-center gap-2 mt-7">
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

          {/* <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-info rounded-xl">
              <TbFileInvoice /> Convert to Invoice
            </button>
          </div> */}
        </section>

        {/* Invoice template */}

        {isLoading ? (
          <div className="w-full flex items-center justify-center py-16">
            <CustomLoader text={"Loading..."} />
          </div>
        ) : (
          <section className="mt-3 bg-orange-50 flex justify-center py-1 flex-1">
            {currentTheme && currentTheme?.theme === "Luxury" ? (
              <>
                <InvoiceTemplate2
                  color={
                    currentTheme.selectedColor
                      ? currentTheme.selectedColor
                      : "#E56E2A"
                  }
                  invoice={quotation}
                  type={"Quotation"}
                  printRef={printRef}
                  checkBoxSetting={currentTheme?.options}
                  setInvoiceIdToDownload={setInvoiceIdToDownload}
                />
              </>
            ) : currentTheme && currentTheme?.theme === "Advanced" ? (
              <>
                <InvoiceTemplate3
                  color={
                    currentTheme.selectedColor
                      ? currentTheme.selectedColor
                      : "#E56E2A"
                  }
                  invoice={quotation}
                  type={"Quotation"}
                  printRef={printRef}
                  checkBoxSetting={currentTheme?.options}
                  setInvoiceIdToDownload={setInvoiceIdToDownload}
                />
              </>
            ) : currentTheme && currentTheme?.theme === "Stylish" ? (
              <>
                <InvoiceTemplate1
                  color={currentTheme?.selectedColor || "#E56E2A"}
                  checkBoxSetting={currentTheme?.options}
                  invoice={quotation}
                  type="Quotation"
                  printRef={printRef}
                  setInvoiceIdToDownload={setInvoiceIdToDownload}
                />
              </>
            ) : (
              <InvoiceTemplate
                color={currentTheme?.selectedColor || "#E56E2A"}
                invoice={quotation}
                type={"Quotation"}
                printRef={printRef}
                setInvoiceIdToDownload={setInvoiceIdToDownload}
              />
            )}
          </section>
        )}
      </div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn rounded-xl btn-sm btn-circle btn-ghost absolute right-2 top-2">
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
              className="btn rounded-xl btn-sm bg-[var(--error-text-color)] text-[var(--primary-text-color)]"
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
