import {
  ArrowLeft,
  Download,
  EllipsisVertical,
  Printer,
  Send,
  Share2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import InvoiceTemplate from "./InvoiceTemplate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import CustomLoader from "../Loader";
import { handlePrint } from "../../../helpers/print";
import { downloadPDF } from "../../../helpers/downloadPdf";
import { MdOutlineMailOutline, MdWhatsapp } from "react-icons/md";
import InvoiceTemplate1 from "../InvoiceTemplate/InvoiceTemplate1";
import InvoiceTemplate3 from "../InvoiceTemplate/InvoiceTemplate3";
import InvoiceTemplate2 from "../InvoiceTemplate/InvoiceTemplate2";
import { sendEmail } from "../../../helpers/sendEmail";

const SalesInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [isDownloading, setIsDownloading] = useState(false);
  const [invoiceIdToDownload, setInvoiceIdToDownload] = useState();
  const [invoiceIdToDelete, setInvoiceIdToDelete] = useState();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  // THIS IS THE QUERY TO GET THE INVOICE BASED ON ID
  const { isLoading, data: invoice } = useQuery({
    queryFn: async () => {
      const res = await axiosInstance.get(`/sales-invoice/invoice/${id}`);
      return res.data?.invoice;
    },
  });

  // THIS IS THE MUTATION TO DELETE THE INVOICE
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(
        `/sales-invoice/${invoiceIdToDelete}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      navigate("/dashboard/sales");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      document.getElementById("my_modal_3").close();
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

  useEffect(() => {
    if (invoice?.partyId?.email?.length > 0) {
      setEmail(invoice?.partyId?.email);
    }
  }, [invoice]);

  return (
    <main className="p-2 h-screen">
      <div className="h-full w-full bg-white rounded-lg p-4 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowLeft onClick={() => navigate(-1)} />
            <h1 className="font-medium">Sales Invoice</h1>
            <div
              className={`badge  ${
                invoice?.status === "cancelled"
                  ? "badge-primary"
                  : "badge-success"
              }  badge-soft`}
            >
              {invoice?.status}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* <button className="btn btn-sm">
              <GiProfit />
              Profit Details
            </button> */}
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

            {/* DROPDOWN TO SHARE IN WHATSAPP AND EMAIL */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-sm rounded-xl btn-info btn-soft"
              >
                <Share2 size={14} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-38 text-xs p-1 shadow-sm"
              >
                <li>
                  <button>
                    <MdWhatsapp size={15} /> Whatsapp
                  </button>
                </li>

                <li>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("mail_dialog").showModal();
                    }}
                  >
                    <MdOutlineMailOutline size={15} /> Email
                  </button>
                </li>
              </ul>
            </div>

            {/* Modal to send email to customer */}
            <dialog id="mail_dialog" className="modal">
              <div className="modal-box rounded-2xl">
                <h3 className="font-bold text-xl text-center mb-4">
                  Enter Receipient Email
                </h3>

                <form method="dialog" className="flex flex-col gap-2">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text font-semibold">
                        Email Address
                      </span>
                    </div>
                    <input
                      type="email"
                      placeholder="Enter receipient email"
                      className="input input-sm w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>

                  <div className="modal-action flex justify-end">
                    <div>
                      <button
                        onClick={() =>
                          document.getElementById("mail_dialog").close()
                        }
                        className="btn btn-sm btn-ghost rounded-xl mr-2"
                      >
                        Close
                      </button>

                      <button
                        type="submit"
                        className="btn btn-sm bg-[var(--primary-btn)] rounded-xl"
                        onClick={() =>
                          sendEmail(invoiceIdToDownload, email, setIsSending)
                        }
                      >
                        {isSending ? (
                          <CustomLoader text={""} />
                        ) : (
                          <>
                            <Send size={15} /> Send
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </dialog>

            {/* DROPDOWN FOR EDIT AND DELETE */}
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
                        `/dashboard/update/${invoice?._id}?type=sales invoice`
                      )
                    }
                  >
                    Edit
                  </button>
                </li>

                <li className="text-[var(--error-text-color)]">
                  <button
                    onClick={() => {
                      document.getElementById("my_modal_3").showModal();
                      setInvoiceIdToDelete(invoice?._id);
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
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-2 ">
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
            <button className="btn btn-sm btn-soft btn-info rounded-xl">
              Generate E-way Bill
            </button>
            <button className="btn btn-sm btn-soft btn-info rounded-xl">
              <TbFileInvoice /> Generate e-Invoice
            </button>
          </div> */}
        </section>

        {isLoading ? (
          <div className="w-full flex items-center justify-center py-16">
            <CustomLoader text={"Loading..."} />
          </div>
        ) : (
          <section className="mt-3 bg-sky-50 flex justify-center py-1 flex-1">
            {/* Invoice template */}
            {currentTheme && currentTheme?.theme === "Luxury" ? (
              <>
                <InvoiceTemplate2
                  color={
                    currentTheme.selectedColor
                      ? currentTheme.selectedColor
                      : "#E56E2A"
                  }
                  invoice={invoice}
                  type={"Sales Invoice"}
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
                  invoice={invoice}
                  type={"Sales Invoice"}
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
                  invoice={invoice}
                  type="Sales Invoice"
                  printRef={printRef}
                  setInvoiceIdToDownload={setInvoiceIdToDownload}
                />
              </>
            ) : (
              <InvoiceTemplate
                color={"#E56E2A"}
                invoice={invoice}
                type={"Sales Invoice"}
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

export default SalesInvoice;
