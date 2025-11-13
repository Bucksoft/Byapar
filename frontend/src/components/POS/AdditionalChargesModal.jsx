import { Plus, X } from "lucide-react";

const AdditionalChargesModal = ({ data, setData }) => {
  return (
    <dialog id="add_charges_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add Additional Charges</h3>

        {data.additionalCharges.map((chargeItem, index) => (
          <div key={index} className="flex gap-2 my-4 items-end">
            <div>
              <label
                htmlFor={`charge-${index}`}
                className="text-sm text-zinc-600"
              >
                Charge
              </label>
              <input
                type="text"
                value={chargeItem.charge}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    additionalCharges: prev.additionalCharges.map((item, i) =>
                      i === index ? { ...item, charge: e.target.value } : item
                    ),
                  }))
                }
                id={`charge-${index}`}
                className="input input-sm"
                placeholder="Carry bag"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`amount-${index}`}
                  className="text-sm text-zinc-600"
                >
                  Amount
                </label>
                {index > 0 && (
                  <X
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        additionalCharges: prev.additionalCharges.slice(0, -1),
                      }))
                    }
                    className=" hover:text-zinc-700"
                    size={16}
                  />
                )}
              </div>
              <input
                type="number"
                value={chargeItem.amount}
                onChange={(e) =>
                  setData((prev) => {
                    const updatedCharges = prev.additionalCharges.map(
                      (item, i) =>
                        i === index
                          ? { ...item, amount: Number(e.target.value) }
                          : item
                    );

                    const total = updatedCharges.reduce(
                      (acc, item) => acc + item.amount,
                      0
                    );

                    return {
                      ...prev,
                      additionalCharges: updatedCharges,
                      totalAdditionalCharges: total,
                    };
                  })
                }
                id={`amount-${index}`}
                className="input input-sm"
                placeholder="0"
              />
            </div>
          </div>
        ))}

        <button
          onClick={() =>
            setData((prev) => ({
              ...prev,
              additionalCharges: [
                ...prev.additionalCharges,
                { charge: "", amount: 0 },
              ],
            }))
          }
          className="text-info flex items-center my-4"
        >
          <Plus size={16} />{" "}
          <span className="text text-sm ">Add Additional Charge</span>
        </button>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-sm rounded-xl">Close</button>
          </form>
          <button
            onClick={() => document.getElementById("add_charges_modal").close()}
            className="btn btn-sm bg-[var(--primary-btn)] rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default AdditionalChargesModal;
