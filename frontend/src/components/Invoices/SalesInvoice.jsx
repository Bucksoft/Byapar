import {
  ArrowLeft,
  Download,
  EllipsisVertical,
  Printer,
  Send,
  Share2,
  User,
  X,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { sendWhatsapp } from "../../../helpers/sendWhatsapp";
import Indian_flag from "../../assets/Indian_flag.png";
import { useBusinessStore } from "../../store/businessStore";

const SalesInvoice = () => {
  const [number, setNumber] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { business } = useBusinessStore();
  const [connectionStatus, setConnectionStatus] = useState("");
  const printRef = useRef();
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [invoiceIdToDownload, setInvoiceIdToDownload] = useState();
  const [invoiceIdToDelete, setInvoiceIdToDelete] = useState();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [checkingConn, setCheckingConn] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isPosFromParams = searchParams.get("isPos") === "true";

  // THIS IS THE QUERY TO GET THE INVOICE BASED ON ID
  const { isLoading, data: invoice } = useQuery({
    queryKey: ["invoice", id],

    queryFn: async () => {
      const endpoint = isPosFromParams
        ? `/pos/invoice/${id}`
        : `/sales-invoice/invoice/${id}`;
      const res = await axiosInstance.get(endpoint);
      console.log(res);
      if (res.data?.invoice) {
        return res.data?.invoice;
      } else {
        return res.data?.pos;
      }
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

  // generate qr code mutation
  const qrMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/sales-invoice/qr`);
      return res.data;
    },
  });

  //   use Effect to check if logged in or not
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axiosInstance.get("/sales-invoice/whatsapp-status");
        if (res.data?.status === "qr") {
          setQrCode(res?.data.qr);
          setConnectionStatus("qr");
        } else if (res.data?.status === "connected") {
          clearInterval(interval);
          setConnectionStatus("connected");
        } else {
          setConnectionStatus("waiting");
        }
        setCheckingConn(false);
      } catch (error) {
        console.error("Error fetching WhatsApp status:", error);
        setCheckingConn(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // set the number by default if party's number is available
  useEffect(() => {
    if (invoice?.partyId?.mobileNumber?.length > 0) {
      setNumber(invoice?.partyId?.mobileNumber);
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
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("whatsapp_dialog").showModal();
                    }}
                  >
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

            {/* Modal to send whatsapp to customer */}
            <dialog id="whatsapp_dialog" className="modal">
              {checkingConn ? (
                <div className="modal-box rounded-2xl flex items-center justify-center ">
                  <CustomLoader text={"Checking connection..."} />
                </div>
              ) : connectionStatus === "connected" ? (
                <div>
                  <div className="modal-box rounded-2xl">
                    <h3 className="font-bold text-xl text-center mb-3 text-green-600">
                      Send Invoice on WhatsApp
                    </h3>

                    <p className="text-center text-sm text-gray-600 mb-4">
                      Click the button below to send the invoice on WhatsApp.
                    </p>

                    <label className="text-xs text-zinc-500">Phone no.</label>
                    <div className="flex items-center gap-1 mb-2">
                      <button className="btn btn-sm">
                        <img src={Indian_flag} alt="flag" width={"10px"} />
                        +91
                      </button>
                      <input
                        type="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Enter Phone Number"
                        className="input w-full input-sm"
                      />
                      <button
                        onClick={() => {
                          if (!number) return;
                          const cleaned = number
                            .toString()
                            .replace(/^\+?91/, "")
                            .trim();
                          const fullNumber = `+91${cleaned}`;
                          setPhoneNumbers([...phoneNumbers, fullNumber]);
                          setNumber("");
                        }}
                        className="btn btn-sm rounded-xl"
                      >
                        Add
                      </button>
                    </div>

                    {phoneNumbers?.map((no, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex items-center justify-between text-xs p-2 bg-zinc-100 shadow-md rounded-xl">
                          <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-zinc-300">
                              <User size={15} />
                            </div>

                            <span>{no}</span>
                          </div>
                          <button
                            onClick={() =>
                              setPhoneNumbers(
                                phoneNumbers.filter((n) => n !== no)
                              )
                            }
                            className="btn btn-sm btn-circle"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="flex flex-col items-center gap-2">
                      <button
                        className="btn bg-green-500 hover:bg-green-600 text-white w-full rounded-xl"
                        onClick={() =>
                          sendWhatsapp(
                            invoiceIdToDownload,
                            phoneNumbers,
                            setIsSending,
                            business?.businessName,
                            invoice?.partyId?.partyName,
                            invoice?.totalAmount,
                            "whatsapp_dialog"
                          )
                        }
                      >
                        {isSending ? (
                          <CustomLoader text={"Sending..."} />
                        ) : (
                          "Send"
                        )}
                      </button>
                      <button
                        className="btn btn-sm btn-ghost rounded-xl"
                        onClick={() =>
                          document.getElementById("whatsapp_dialog").close()
                        }
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="modal-box rounded-2xl">
                  <h3 className="font-bold text-xl text-center mb-3 text-green-600">
                    Link Your WhatsApp
                  </h3>

                  <p className="text-center text-sm text-gray-600 mb-4">
                    To send invoices directly on WhatsApp, please connect your
                    WhatsApp account. A QR code will appear after clicking the
                    button below.
                  </p>

                  <div className="flex flex-col items-center gap-4">
                    {qrMutation.isSuccess ? (
                      <img src={qrMutation.data?.qr} alt="qr" />
                    ) : (
                      <button
                        className="btn bg-green-500 hover:bg-green-600 text-white w-full rounded-xl"
                        onClick={() => qrMutation.mutate()}
                      >
                        {qrMutation.isPending ? (
                          <CustomLoader text={"Generating QR..."} />
                        ) : (
                          <>
                            <MdWhatsapp size={15} />
                            Link WhatsApp
                          </>
                        )}
                      </button>
                    )}

                    <p className="text-xs text-gray-500 text-center px-4">
                      Make sure your WhatsApp Web session is active on your
                      phone to complete the connection.
                    </p>
                  </div>

                  <div className="modal-action mt-4 justify-center">
                    <button
                      className="btn btn-sm btn-ghost rounded-xl"
                      onClick={() =>
                        document.getElementById("whatsapp_dialog").close()
                      }
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </dialog>

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
                color={currentTheme?.selectedColor || "#E56E2A"}
                invoice={invoice}
                type={`${isPosFromParams ? "POS" : "Sales Invoice"}`}
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
