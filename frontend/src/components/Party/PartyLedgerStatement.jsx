import { ChevronDown, Download, MessageSquare, Printer, Share } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";

const PartyLedgerStatement = ({ party }) => {
  return (
    <section>
      <div>
        <button className="btn btn-sm w-1/8">
          {" "}
          <Download size={14} /> Download
        </button>
        <button className="btn btn-sm ml-2 w-1/8">
          {" "}
          <Printer size={14} /> Print
        </button>
        <button
          className="btn btn-sm ml-2 w-1/8"
          popoverTarget="popover-1"
          style={{ anchorName: "--anchor-1" } /* as React.CSSProperties */}
        >
          <Share size={14} />
          Share
          <ChevronDown size={14} className="ml-10" />
        </button>

        <ul
          className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
          popover="auto"
          id="popover-1"
          style={{ positionAnchor: "--anchor-1" } /* as React.CSSProperties */}
        >
          <li>
            <a>
              {" "}
              <MessageSquare size={13} /> Send SMS
            </a>
          </li>
          <li>
            <a>
              {" "}
              <BsWhatsapp size={13} /> Whatsapp
            </a>
          </li>
        </ul>
      </div>

      <div className="h-full border rounded-md mt-4 border-zinc-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold">Business Name</h1>
            <p className="text-xs text-zinc-500">Phone no. 6789274002</p>
          </div>
          Party Ledger
        </div>
        <div className="divider" />
        <div className=" text-xs flex items-start justify-between">
          <div className="leading-4.5">
            To, <br />
            <span className="font-semibold">{party?.partyName}</span> <br />
            9873090327
          </div>
          <div className="text-right border-2 border-zinc-200 p-2 flex flex-col">
            <p className="pb-2 border-b-2 border-zinc-200">
              2025-08-19 - 2025-08-18
            </p>
            <h4 className="mt-3 ">Total Payable</h4>
            <p className="font-semibold">0</p>
          </div>
        </div>
        <div className="overflow-x-auto mt-5 rounded-box border border-base-content/5 bg-base-100">
          <table className="table text-xs ">
            {/* head */}
            <thead>
              <tr className="bg-zinc-200">
                <th>Date</th>
                <th>Voucher</th>
                <th>Sr No</th>
                <th>Credit</th>
                <th>Debit</th>
                <th>TDS deducted by party</th>
                <th>TDS deducted by self</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th></th>
                <td>Opening Balance</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>0.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PartyLedgerStatement;
