import { FaFilePdf } from "react-icons/fa6";
import { dateRanges } from "../../utils/constants";

const SingleItemPartyWiseDetails = ({ item }) => {
  return (
    <main className="px-5 py-4">
      <header className="w-full flex justify-between">
        <select defaultValue="Select Date" className="select select-sm">
          <option disabled={true}>Select Date</option>
          {dateRanges.map((range, index) => (
            <option>{range}</option>
          ))}
        </select>
        <button className="btn rounded-xl btn-sm flex items-center gap-2">
          <FaFilePdf size={15} />
          Download PDF
        </button>
      </header>
      <div className="overflow-x-auto mt-4">
        <table className="table table-zebra bg-zinc-300 border border-zinc-200">
          {/* head */}
          <thead>
            <tr className="bg-zinc-100">
              <th>Party Name</th>
              <th>Sales Quantity</th>
              <th>Sales Amount</th>
              <th>Purchase Quantity</th>
              <th>Purchase Amount</th>
            </tr>
          </thead>
          <tbody>
            {
              // To be written
            }
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default SingleItemPartyWiseDetails;
