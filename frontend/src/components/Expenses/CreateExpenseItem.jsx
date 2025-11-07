import { useMemo, useState } from "react";
import { gstRates, uomList } from "../../utils/constants";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import toast from "react-hot-toast";
import { useBusinessStore } from "../../store/businessStore";
import { queryClient } from "../../main";

const CreateExpenseItem = () => {
  const [searchUOM, setSearchUOM] = useState("");
  const { business } = useBusinessStore();
  const [data, setData] = useState({
    itemName: "",
    purchasePrice: "",
    hsnSac: "",
    gstRate: "",
    taxType: "without_tax",
    measuringUnit: "",
    itemType: "product",
    itc: "eligible",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        `/expense/item/?businessId=${business?._id}`,
        data
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      setData({
        itemName: "",
        purchasePrice: "",
        hsnSac: "",
        gstRate: "",
        taxType: "without_tax",
        measuringUnit: "",
        itemType: "product",
        itc: "eligible",
      });
      document.getElementById("create_item_modal").close();
      queryClient.invalidateQueries({ queryKey: ["expenseItems"] });
    },
  });

  // FILTER UOM
  const filteredUOM = useMemo(() => {
    if (!searchUOM) return uomList;
    return uomList.filter((uom) =>
      uom?.label.toLowerCase().includes(searchUOM?.toLowerCase())
    );
  });

  return (
    <div>
      <dialog id="create_item_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create New Expense Item</h3>

          <div className="grid grid-cols-2 gap-5">
            {/* LEFT SECTION */}
            <div className="space-y-4">
              {/* ITEM NAME */}
              <div className="mt-5">
                <label className="text-zinc-600 text-xs">Item Name</label>
                <input
                  type="text"
                  value={data.itemName}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, itemName: e.target.value }))
                  }
                  className="input input-sm w-full"
                  placeholder="Enter Item Name"
                />
              </div>

              {/* PURCHASE PRICE */}
              <div>
                <label className="text-zinc-600 text-xs">Purchase Price</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    className="input input-sm w-[55%]"
                    value={data.purchasePrice}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        purchasePrice: e.target.value,
                      }))
                    }
                    placeholder="0"
                  />
                  <select
                    value={data.taxType}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, taxType: e.target.value }))
                    }
                    className="select select-sm w-[45%] bg-zinc-100"
                  >
                    <option value="without_tax">Without tax</option>
                    <option value="with_tax">With tax</option>
                  </select>
                </div>
              </div>

              {/* HSN/SAC */}
              <div className="mt-5">
                <label className="text-zinc-600 text-xs">
                  {data.itemType === "product" ? "HSN" : "SAC"}
                </label>
                <input
                  type="text"
                  value={data.hsnSac}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, hsnSac: e.target.value }))
                  }
                  className="input input-sm w-full"
                  placeholder="Enter Item Name"
                />
              </div>

              {/* ITC APPLICABLE */}
              <div className="mt-5 flex flex-col gap-1">
                <label className="text-zinc-600 text-xs">ITC Applicable</label>
                <select
                  value={data.itc}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, itc: e.target.value }))
                  }
                  className="select select-sm w-full bg-zinc-100"
                >
                  <option value="eligible">Eligible</option>
                  <option value="ineligible">Ineligible</option>
                  <option value="ineligible_others">Ineligible Others</option>
                </select>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="space-y-4">
              {/* ITEM TYPE */}
              <div className="mt-5">
                <label className="text-xs text-zinc-600">Item Type</label>
                <select
                  value={data.itemType}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, itemType: e.target.value }))
                  }
                  className="select select-sm bg-zinc-100"
                >
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                </select>
              </div>

              {/* MEASURING TYPE */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-600 mt-1">
                  Measuring Unit
                </label>
                <div className="dropdown w-full">
                  <div
                    tabIndex={0}
                    role="button"
                    className="select select-sm w-full text-left bg-zinc-100"
                  >
                    {data.measuringUnit ? data.measuringUnit : "Select Unit"}
                  </div>

                  <ul
                    tabIndex={-1}
                    className="dropdown-content bg-base-100 rounded-box w-52 max-h-52 overflow-y-auto p-2 shadow text-xs"
                  >
                    <input
                      type="text"
                      className="input input-xs mb-2 w-full"
                      placeholder="Search"
                      value={searchUOM}
                      onChange={(e) => setSearchUOM(e.target.value)}
                    />

                    {filteredUOM?.map((m, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          setData((prev) => ({
                            ...prev,
                            measuringUnit: m.label,
                          }));
                          setSearchUOM("");
                        }}
                        className="cursor-pointer hover:bg-zinc-100 p-1 rounded-sm"
                      >
                        <a>
                          {m.label} ({m.code})
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* GST TAX RATE */}
              <div className="mt-5">
                <label className="text-xs text-zinc-600">GST Tax Rate</label>
                <select
                  value={data.gstRate}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, gstRate: e.target.value }))
                  }
                  className="select select-sm bg-zinc-100"
                >
                  {gstRates?.map((g) => (
                    <option key={g} value={g.label}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm">Close</button>
            </form>
            <button
              className="btn btn-sm bg-[var(--primary-btn)]"
              onClick={() => mutation.mutate()}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CreateExpenseItem;
