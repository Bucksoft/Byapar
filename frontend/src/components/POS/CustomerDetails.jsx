const CustomerDetails = ({ data, setData }) => {
  return (
    <dialog id="customer_details_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Customer Details</h3>

        {/* MOBILE NUMBER */}
        <div className="flex flex-col mt-5 gap-1">
          <label htmlFor="mobile" className="label text-sm text-zinc-600">
            Mobile Number
          </label>
          <div className="flex">
            <button className="btn btn-sm">+91</button>
            <input
              type="number"
              id="mobile"
              value={data.customerDetails.mobile}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  customerDetails: {
                    ...prev.customerDetails,
                    mobile: e.target.value,
                  },
                }))
              }
              className="input input-sm w-full"
              placeholder="6205617975"
            />
          </div>
        </div>

        <div className="flex flex-col mt-5 gap-1">
          <label
            htmlFor="customer_name"
            className="label text-sm text-zinc-600"
          >
            Customer Name
          </label>
          <input
            id="customer_name"
            type="text"
            value={data.customerDetails.customerName}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                customerDetails: {
                  ...prev.customerDetails,
                  customerName: e.target.value,
                },
              }))
            }
            className="input input-sm w-full"
            placeholder="Rohit Kumar"
          />
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-sm rounded-xl">Close</button>
          </form>
          <button
            onClick={() =>
              document.getElementById("customer_details_modal").close()
            }
            className="btn btn-sm bg-[var(--primary-btn)] rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default CustomerDetails;
