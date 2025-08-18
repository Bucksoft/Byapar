import React from "react";
import { GrDocumentExcel } from "react-icons/gr";

const PartyTransactions = ({ party }) => {
  return (
    <section>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="bg-zinc-100">
              <th>S.No.</th>
              <th>Date</th>
              <th>Transaction Type</th>
              <th>Transaction Number</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          {/* <tbody>
                    <tr>
                      <th>1</th>
                      <td>Cy Ganderton</td>
                      <td>Quality Control Specialist</td>
                      <td>Blue</td>
                    </tr>
                    <tr>
                      <th>2</th>
                      <td>Hart Hagerty</td>
                      <td>Desktop Support Technician</td>
                      <td>Purple</td>
                    </tr>
                    <tr>
                      <th>3</th>
                      <td>Brice Swyre</td>
                      <td>Tax Accountant</td>
                      <td>Red</td>
                    </tr>
                  </tbody> */}
        </table>
        <div className="flex items-center justify-center w-full py-16 flex-col text-zinc-500 gap-2">
          <GrDocumentExcel size={25} />
          No transactions yet
        </div>
      </div>
    </section>
  );
};

export default PartyTransactions;
