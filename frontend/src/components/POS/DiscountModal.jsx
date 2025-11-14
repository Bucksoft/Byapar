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
              name="discount-type"
              className="radio radio-info mr-2 radio-sm"
              id="before_tax"
              checked={data.discountType === "before_tax"}
              onChange={() =>
                setData((prev) => ({
                  ...prev,
                  discountType: "before_tax",
                }))
              }
            />
            <label htmlFor="before_tax" className="text-zinc-600 text-sm">
              Before Tax
            </label>
          </div>

          <div className="py-4">
            <input
              type="radio"
              name="discount-type"
              className="radio radio-info mr-2 radio-sm"
              id="after_tax"
              checked={data.discountType === "after_tax"}
              onChange={() =>
                setData((prev) => ({
                  ...prev,
                  discountType: "after_tax",
                }))
              }
            />
            <label htmlFor="after_tax" className="text-zinc-600 text-sm">
              After Tax
            </label>
          </div>
        </div>

        {/* DISCOUNT PERCENT */}
        {/* DISCOUNT PERCENTAGE */}
        <div className="mt-5 flex flex-col space-y-1">
          <label htmlFor="discountPercent" className="text-sm text-zinc-600">
            Discount Percentage
          </label>

          <input
            type="number"
            value={data.discountPercent}
            onChange={(e) => {
              const percent = Number(e.target.value) || 0;

              const discountAmount = (data.subTotal * percent) / 100;

              setData((prev) => ({
                ...prev,
                discountPercent: percent,
                discountAmount: Number(discountAmount.toFixed(2)),
              }));
            }}
            id="percent"
            className="input w-full input-sm"
            placeholder="0"
          />
        </div>

        {/* DISCOUNT AMOUNT */}
        <div className="mt-5 flex flex-col space-y-1">
          <label htmlFor="discountAmount" className="text-sm text-zinc-600">
            Discount Amount
          </label>

          <input
            type="number"
            value={data.discountAmount.toFixed(2)}
            readOnly
            className="input w-full input-sm"
            placeholder="0"
          />
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-sm rounded-xl">Close</button>
          </form>
          <button
            onClick={() => document.getElementById("discount_modal").close()}
            className="btn bg-[var(--primary-btn)] btn-sm rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DiscountModal;
