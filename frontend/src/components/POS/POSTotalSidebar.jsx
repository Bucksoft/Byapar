import { IndianRupee, SquarePen } from "lucide-react";
import { motion } from "framer-motion";
import DiscountModal from "./DiscountModal";
import AdditionalChargesModal from "./AdditionalChargesModal";
import CustomerDetails from "./CustomerDetails";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import { useBusinessStore } from "../../store/businessStore";
import toast from "react-hot-toast";

const POSTotalSidebar = ({ data, setData }) => {
  const { business } = useBusinessStore();

  const mutation = useMutation({
    mutationFn: async () => {
      if (data?.items?.length === 0) {
        throw new Error("Please add at least 1 item");
      }

      return await axiosInstance.post(
        `/pos/?businessId=${business?._id}`,
        data
      );
    },
    onSuccess: () => {
      toast.success("Created successfully");
      setData({
        items: [],
        discountPercent: 0,
        discountAmount: 0,
        discountType: "after_tax",
        computedDiscount: 0,
        additionalCharges: [
          {
            charge: "",
            amount: 0,
          },
        ],
        totalAdditionalCharges: 0,
        customerDetails: {
          mobile: "",
          customerName: "",
        },
        subTotal: 0,
        tax: 0,
        totalAmount: 0,
        receivedAmount: 0,
        paymentMode: "cash",
      });
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <>
      <motion.section
        initial={{
          translateX: 100,
          opacity: 0,
        }}
        animate={{
          translateX: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeInOut",
          duration: 0.3,
        }}
        className="p-4 w-1/4"
      >
        <div className="grid grid-cols-1  text-xs gap-3">
          <button
            className="btn btn-sm rounded-xl btn-dash"
            onClick={() =>
              document.getElementById("discount_modal").showModal()
            }
          >
            Add Discount
          </button>
          <button
            onClick={() =>
              document.getElementById("add_charges_modal").showModal()
            }
            className="btn btn-sm text-nowrap rounded-xl btn-dash"
          >
            Add Additional Charge
          </button>
        </div>

        <div className="border mt-4 rounded-md border-zinc-200 p-1 bg-zinc-100">
          <h2 className="p-2 text-sm font-medium">Bill Details</h2>
          <div className="p-2 border-b border-zinc-200 bg-white rounded-md text-sm">
            {/* SUB TOTAL */}
            <p className="flex items-center justify-between">
              Sub Total
              <span className="flex items-center">
                <IndianRupee size={13} />
                {data?.subTotal?.toFixed(2)}
              </span>{" "}
            </p>

            {/* TAX */}
            <p className="flex items-center justify-between mt-2">
              Tax
              <span className="flex items-center">
                <IndianRupee size={13} />
                {data?.tax?.toFixed(2)}
              </span>{" "}
            </p>

            {/* ADDITIONAL CHARGES */}
            {data.additionalCharges.map((item) => (
              <p className="flex items-center justify-between mt-2">
                {item.charge}
                <span className="flex items-center">
                  {item.amount > 0 && (
                    <>
                      <IndianRupee size={13} />
                      {item?.amount?.toFixed(2)}
                    </>
                  )}
                </span>{" "}
              </p>
            ))}

            {/* DISCOUNT */}
            {data.discountAmount > 0 && (
              <p className="flex items-center justify-between mt-2">
                Discount
                <span className="flex items-center">
                  <IndianRupee size={13} />
                  {data.discountAmount?.toFixed(2)}
                </span>{" "}
              </p>
            )}
          </div>
          <h2 className="p-2 text- flex items-center justify-between font-medium">
            Total Amount
            <span className="flex items-center">
              <IndianRupee size={13} />
              {data?.totalAmount?.toFixed(2)}
            </span>
          </h2>
        </div>

        <div className="border mt-4 rounded-md border-zinc-200 p-1 bg-zinc-100">
          <h2 className="p-2  text-sm font-medium">Received Amount</h2>
          <div className="p-2 rounded-md bg-white">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center w-full">
                <IndianRupee size={16} />
                <input
                  type="number"
                  value={data?.receivedAmount}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      receivedAmount: Number(e.target.value),
                    }))
                  }
                  className="input input-sm ml-1"
                  placeholder="0"
                />
              </div>{" "}
              <select defaultValue="Cash" className="select select-sm">
                <option value="cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="card">Card</option>
                {/* <option value="netbanking">Netbanking</option>
                <option value="bank transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option> */}
              </select>
            </div>
          </div>
        </div>

        <div className="border mt-4 rounded-md border-zinc-100 bg-zinc-100 p-1">
          <h2 className="p-2 text-sm font-medium">Customer Details</h2>
          <div className="p-2 text-xs bg-white rounded-md">
            <p className="flex items-center justify-between">
              <span className="flex items-center w-full">Cash Sale</span>{" "}
              <SquarePen
                onClick={() =>
                  document.getElementById("customer_details_modal").showModal()
                }
                size={13}
              />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 p-4">
          <button className="btn rounded-xl btn-sm btn-soft w-1/2 btn-info">
            Save & Print
          </button>
          <button
            onClick={() => mutation.mutate()}
            className="btn rounded-xl btn-sm w-1/2 bg-[var(--primary-btn)]"
          >
            Save Bill
          </button>
        </div>
      </motion.section>

      {/* ADD DISCOUNT POPUP */}
      <DiscountModal data={data} setData={setData} />

      {/* ADD ADDITIONAL CHARGES POPUP */}
      <AdditionalChargesModal data={data} setData={setData} />

      {/* CUSTOMER DETAILS POPUP */}
      <CustomerDetails data={data} setData={setData} />
    </>
  );
};

export default POSTotalSidebar;
