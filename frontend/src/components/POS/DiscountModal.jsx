import React from "react";

const DiscountModal = ({ data, setData }) => {
  return (
    <dialog id="discount_modal" className="modal">
      <div className="modal-box">
        <h2 className="font-bold text-lg ">Add Discount</h2>

        {/* DISCOUNT TYPE */}
        <div className="flex flex-col">
          <div className="py-4">
            <input
              type="radio"
              name="radio-9"
              className="radio radio-info mr-2 radio-sm"
              id="before_tax"
            />
            <label htmlFor="before_tax" className="text-zinc-600 text-sm">
              Before Tax
            </label>
          </div>
          <div>
            <input
              type="radio"
              name="radio-9"
              className="radio radio-info mr-2 radio-sm"
              id="after_tax"
            />
            <label htmlFor="after_tax" className="text-zinc-600 text-sm">
              After Tax
            </label>
          </div>
        </div>

        {/* DISCOUNT PERCENT */}
        <div className="mt-5 flex flex-col space-y-1">
          <label htmlFor="percent" className="text-sm text-zinc-600">
            Discount percentage
          </label>
          <input
            type="number"
            id="percent"
            className="input w-full input-sm"
            placeholder="0"
          />
        </div>

        {/* DISCOUNT AMOUNT */}
        <div className="mt-5 flex flex-col space-y-1">
          <label htmlFor="percent" className="text-sm text-zinc-600">
            Discount Amount
          </label>
          <input
            type="number"
            id="percent"
            className="input w-full input-sm"
            placeholder="0"
          />
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-sm rounded-xl">Close</button>
          </form>
          <button className="btn bg-[var(--primary-btn)] btn-sm rounded-xl">
            Done
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DiscountModal;
