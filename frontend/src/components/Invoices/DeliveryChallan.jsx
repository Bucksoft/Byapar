import { ArrowLeft, Download, EllipsisVertical, Printer } from "lucide-react";
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

const DeliveryChallan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [invoiceIdToDownload, setInvoiceIdToDownload] = useState("invoice");

  // THIS IS THE QUERY TO GET THE INVOICE BASED ON ID
  const { isLoading, data: deliveryChallan } = useQuery({
    queryFn: async () => {
      const res = await axiosInstance.get(`/delivery-challan/invoice/${id}`);
      return res.data?.deliveryChallan;
    },
  });

  // THIS IS THE MUTATION TO DELETE THE INVOICE
  const mutation = useMutation({
    mutationFn: async (invoiceId) => {
      const res = await axiosInstance.delete(`/delivery-challan/${invoiceId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      queryClient.invalidateQueries({ queryKey: ["deliveryChallans"] });
    },
  });

  return (
    <main className="p-2 h-screen ">
      <div className="h-full w-full bg-white rounded-lg p-4 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowLeft onClick={() => navigate(-1)} />
            <h1 className="font-medium">Delivery Challan</h1>
            <div className="badge badge-success badge-soft">
              {deliveryChallan?.status}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* <button className="btn btn-sm">
              <GiProfit />
              Profit Details
            </button> */}
            <button
              onClick={() => handlePrint(printRef)}
              className="btn btn-sm btn-dash"
            >
              <Printer size={15} /> Print PDF
            </button>
            <button
              onClick={() => downloadPDF(invoiceIdToDownload)}
              className="btn btn-sm"
            >
              <Download size={15} /> Download PDF
            </button>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-sm">
                <EllipsisVertical size={14} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <li>
                  <button>Edit</button>
                </li>
                {/* <li>
                  <button>Edit History</button>
                </li>
                <li>
                  <button>Duplicate</button>
                </li> */}
                {/* <li>
                  <button>Issue Credit Note</button>
                </li> */}
                <li className="text-[var(--error-text-color)]">
                  <button
                    onClick={() => {
                      document.getElementById("my_modal_3").showModal();
                      setInvoiceIdToDelete(invoice?._id);
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
          <div className="flex items-center gap-2 ">
            {/* <select className="select select-sm">
              <option className="hidden">Print PDF</option>
              <option>Print PDF</option>
              <option>Print Thermal</option>
              <option>Print Duplicate</option>
              <option>Print Triplicate</option>
            </select> */}

            {/* <select className="select select-sm">
              <option className="hidden">Share</option>
              <option>Whatsapp</option>
              <option>SMS</option>
            </select> */}
          </div>
          {/* 
          <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-soft btn-info">
              Generate E-way Bill
            </button>
            <button className="btn btn-sm btn-soft btn-info">
              <TbFileInvoice /> Generate e-Invoice
            </button>
          </div> */}
        </section>

        {isLoading ? (
          <div className="w-full flex justify-center py-5">
            <CustomLoader text={"Loading..."} />
          </div>
        ) : (
          <section className="mt-3 bg-neutral-100 flex justify-center py-1 overflow-y-scroll flex-1">
            {/* Invoice template */}
            <InvoiceTemplate
              color={"#91ADC8"}
              invoice={deliveryChallan}
              type={"Delivery Challan"}
              printRef={printRef}
              setInvoiceIdToDownload={setInvoiceIdToDownload}
            />
          </section>
        )}
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

export default DeliveryChallan;
