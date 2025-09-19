import React from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";

const PaymentIn = () => {
  return (
    <main className="p-10">
      <div className="flex justify-between">
        <div>
          <span className="font-medium">Business Name</span>
        </div>
        <div className="flex flex-col mr-20 gap-2">
          <span className="font-medium py-2">Receipt Voucher</span>
          <p className="text-sm">
            Payment Number <span className="pl-9">1</span>
          </p>
          <p className="text-sm">
            Payment Date: <span className="pl-14">16-09-2025</span>
          </p>
          <p className="text-sm">
            Payment Mode: <span className="pl-13">cash</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <span className="border p-1 w-30  text-center rounded-xs bg-zinc-200 border-zinc-400">
          PAYMENT FROM
        </span>
        <span className="">Customer Party</span>
        <span className="border p-1 w-30  text-center rounded-xs bg-zinc-200 border-zinc-400">
          RECEIPT FOR
        </span>
      </div>
      {/* TABLE */}
      <div className="overflow-x-auto pt-5">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="bg-zinc-300">
              <th>#</th>
              <th>INVOICE NUMBER</th>
              <th>INVOICE DATE</th>
              <th>INVOICE AMOUNT</th>
              <th>PAYMENT AMOUNT</th>
              <th>TDS</th>
              <th>BALANCE DUE</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>1</th>
              <td>5</td>
              <td>225-09-15</td>
              <td>50000</td>
              <td>50000</td>
              <td>0.0</td>
              <td>50000</td>
            </tr>
          </tbody>
        </table>
        <div className="pl-122 p-2 bg-zinc-200 font-semibold text-gray-700">
          <span className="pr-43 ">Total</span> <span>50000</span>
        </div>

        <div className="flex justify-between pt-8">
          <div className="">
            <p className="flex text-sm pb-2">
              <span className="pr-5 flex">Total</span>
              <span className="flex items-center font-semibold">
                <FaIndianRupeeSign size={14} />
                50000
              </span>
            </p>
            <span className=" text-sm">Amount Paid In Word</span>
            <p className="font-semibold text-sm">Fifty Thousand Rupees </p>
          </div>
          <div className="flex flex-col text-sm ">
            <span>Authorized signature for </span>
            <span>Business Name</span>
            <div className="border w-80 h-25"></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentIn;
