import { FaFilePdf } from "react-icons/fa6";
import { dateRanges } from "../../utils/constants";

const SingleItemStockDetails = ({ item }) => {
  return (
    <main className="px-5 py-4">
      <header className="w-full flex justify-between">
        <select defaultValue="Select Date" className="select select-sm">
          <option disabled={true}>Select Date</option>
          {dateRanges.map((range, index) => (
            <option>{range}</option>
          ))}
        </select>
        <button className="btn btn-sm flex items-center gap-2">
          <FaFilePdf size={15} />
          Download PDF
        </button>
      </header>
      <div className="overflow-x-auto mt-4">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="bg-zinc-100">
              <th>Date</th>
              <th>Transaction Type</th>
              <th>Quantity</th>
              <th>Invoice Number</th>
              <th>Closing Stock</th>
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

export default SingleItemStockDetails;
