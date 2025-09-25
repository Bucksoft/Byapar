import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { axiosInstance } from "../../config/axios";
import toast from "react-hot-toast";
import { BsTrash3 } from "react-icons/bs";
import { queryClient } from "../../main";
import { useNavigate } from "react-router-dom";
import { PackagePlus, Plus } from "lucide-react";
import { GrFormSubtract } from "react-icons/gr";
import { FiPackage } from "react-icons/fi";
import { AiOutlineProduct } from "react-icons/ai";

const ItemsList = ({ showLowStock, items }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [choice, setChoice] = useState("add");
  const [stockUpdationDate, setStockUpdationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [activeItem, setActiveItem] = useState({
    name: "",
    quantity: 0,
    updatedStock: 0,
  });
  const [remarks, setRemarks] = useState("");
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();

  const handleCheck = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  useEffect(() => {
    setActiveItem((prev) => ({
      ...prev,
      updatedStock:
        choice === "add"
          ? activeItem?.quantity + quantity
          : activeItem?.quantity - quantity,
    }));
  }, [quantity, choice]);

  // deleting item
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.delete("/item", { data });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        data?.deletedCount +
          " " +
          `${data?.deletedCount === 1 ? "Item deleted" : data.msg}`
      );
      document.getElementById("my_modal_2").close();
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  // adjusting stock mutation
  const stockMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.patch("/item/stock", { data });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.msg);
      document.getElementById("my_modal_1").close();
      setActiveItem({
        name: "",
        quantity: 0,
        updatedStock: 0,
      });
      setQuantity(0);
      setRemarks("");
      setChoice("add");
      setStockUpdationDate(new Date().toISOString().split("T")[0]);

      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  return (
    <div className="overflow-x-auto ">
      {selectedItems.length > 0 ? (
        <div className="py-3 w-full flex justify-start">
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <button
            className="btn btn-sm text-[var(--primary-text-color)] bg-[var(--error-text-color)] mr-2"
            onClick={() => document.getElementById("my_modal_2").showModal()}
          >
            <BsTrash3 /> Delete Items
          </button>
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
              <p className="py-4 text-sm">
                Are you sure you want to delete the selected item(s)? This
                action cannot be undone.
              </p>
              <div className="flex w-full">
                <button
                  onClick={() => mutation.mutate(selectedItems)}
                  className="btn btn-sm btn-ghost  ml-auto text-[var(--error-text-color)]"
                >
                  Delete
                </button>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
      ) : (
        ""
      )}
      <table className="table border border-[var(--table-border)]  mb-5 mt-5 w-full table-zebra">
        {/* head */}
        <thead className="">
          <tr className="bg-[var(--primary-background)]">
            <th></th>
            <th>Sr No.</th>
            <th>Item Name</th>
            <th>Item Type</th>
            <th>Item Code</th>
            <th>Stock Quantity</th>
            <th>Selling Price</th>
            <th>Purchase Price</th>
            <th>Adjust Stock</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr
                key={item?._id}
                className="hover:bg-zinc-100 cursor-pointer"
                onClick={() => navigate(`/dashboard/items/${item?._id}`)}
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs"
                    onChange={() => handleCheck(item?._id)}
                    checked={selectedItems.includes(item?._id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>
                  <div className="flex flex-col gap-1">{item?.itemName}</div>
                </td>
                <td>{item?.itemType}</td>
                <td>{item?.itemCode || item?.serviceCode || "-"}</td>
                <td>
                  {item.itemType === "product" ? (
                    <>
                      {item?.currentStock} {item?.measuringUnit}
                    </>
                  ) : (
                    <>-</>
                  )}
                </td>
                <td>
                  <div className="flex items-center">
                    {item?.salesPrice ? (
                      <>
                        <LiaRupeeSignSolid size={15} />
                        {Number(item?.salesPrice).toLocaleString("en-IN")}
                      </>
                    ) : (
                      "-"
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex items-center">
                    {item?.purchasePrice ? (
                      <>
                        <LiaRupeeSignSolid size={15} />
                        {Number(item?.purchasePrice).toLocaleString("en-IN")}
                      </>
                    ) : (
                      "-"
                    )}
                  </div>
                </td>
                {item?.itemType === "product" ? (
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById("my_modal_1").showModal();
                        setActiveItem({
                          name: item?.itemName,
                          quantity: item?.currentStock,
                        });
                      }}
                    >
                      <PackagePlus className="cursor-pointer" size={18} />
                    </button>
                    <dialog
                      id="my_modal_1"
                      className="modal z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="modal-box w-11/12 max-w-5xl mt-5">
                        <h3 className="font-bold text-lg flex items-center  gap-2">
                          {" "}
                          <PackagePlus className="cursor-pointer" size={18} />
                          Adjust Stock Quantity
                        </h3>
                        <div className="flex items-start gap-3 ">
                          <div className="w-1/2 py-5">
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-[var(--gray-text)]">
                                Date
                              </span>
                              <input
                                type="date"
                                className="input input-sm w-full"
                                value={
                                  stockUpdationDate ||
                                  new Date().toISOString().split("T")[0]
                                }
                                onChange={(e) =>
                                  setStockUpdationDate(e.target.value)
                                }
                              />
                            </div>
                            <div className="flex items-center gap-4 mt-5 justify-between">
                              <div className="flex flex-col gap-1 w-full">
                                <span className="font-medium text-[var(--gray-text)]">
                                  Add or Reduce Stock
                                </span>
                                {/* choice to add or reduce stock */}
                                <select
                                  name="stock"
                                  className="select select-sm"
                                  value={choice}
                                  onChange={(e) => setChoice(e.target.value)}
                                >
                                  <option value="add" className="hidden">
                                    Add
                                  </option>
                                  <option value="add">Add</option>
                                  <option value="reduce">Reduce</option>
                                </select>
                              </div>
                              <div className="w-full flex flex-col gap-1">
                                <span className="font-medium text-[var(--gray-text)]">
                                  Quantity
                                </span>
                                <input
                                  type="number"
                                  value={quantity}
                                  min={0}
                                  onChange={(e) =>
                                    setQuantity(Number(e.target.value))
                                  }
                                  className="input input-sm"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 mt-5 w-full">
                              <span className="font-medium text-[var(--gray-text)]">
                                Remarks(optional)
                              </span>
                              <textarea
                                name="remarks"
                                className="textarea w-full"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Enter remarks"
                              />
                            </div>
                          </div>
                          {/* stock calculation details */}
                          <div className="w-1/2 py-5 flex flex-col gap-1">
                            <h3 className="font-medium text-[var(--gray-text)]">
                              {" "}
                              Stock Calculation
                            </h3>
                            <div className="flex items-center justify-between px-2 py-5  border border-zinc-200 rounded-md">
                              <span className="font-medium">Item Name</span>
                              <p className="text-[var(--gray-text)]">
                                {activeItem?.name}
                              </p>
                            </div>
                            {quantity > 0 && (
                              <div className="flex flex-col items-start justify-between p-3 gap-3 border border-zinc-200 rounded-md">
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium">
                                    Current Stock
                                  </span>
                                  <p className="text-[var(--gray-text)]">
                                    {activeItem?.quantity}
                                  </p>
                                </div>
                                <div
                                  className={`flex items-center justify-between   rounded-md w-full `}
                                >
                                  <span
                                    className={`font-medium ${
                                      choice === "add"
                                        ? "text-[var(--secondary-btn)]"
                                        : "text-[var(--error-text-color)]"
                                    } `}
                                  >
                                    Stock{" "}
                                    {choice === "add" ? "added" : "reduced"}
                                  </span>
                                  <p
                                    className={` flex items-center  ${
                                      choice === "add"
                                        ? "text-[var(--secondary-btn)]"
                                        : "text-[var(--error-text-color)]"
                                    } `}
                                  >
                                    {choice === "add" ? (
                                      <Plus size={15} />
                                    ) : (
                                      <GrFormSubtract size={15} />
                                    )}{" "}
                                    {Number(quantity)}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-semibold">
                                    Updated Stock
                                  </span>
                                  <p className="font-semibold">
                                    {choice === "add"
                                      ? activeItem?.quantity + quantity
                                      : activeItem?.quantity - quantity}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="modal-action">
                          {/* if there is a button in form, it will close the modal */}
                          <button
                            className="btn btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById("my_modal_1").close();
                            }}
                          >
                            Close
                          </button>
                          <button
                            className="btn btn-sm bg-[var(--primary-btn)] ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              stockMutation.mutate({
                                activeItem,
                                stockUpdationDate,
                                remarks,
                              });
                            }}
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </dialog>
                  </td>
                ) : (
                  <td>-</td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              {!showLowStock && (
                <td colSpan="9" className="text-center py-4 ">
                  <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
                    <AiOutlineProduct size={40} />
                    <span className="text-sm">
                      No items matching the current filter
                    </span>
                  </div>
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
      <>
        {showLowStock && (
          <div className="mt-16">
            <p className="flex flex-col items-center gap-2 text-center text-gray-400 mt-4">
              <FiPackage size={30} />
              No products are below the low stock level
            </p>
          </div>
        )}
      </>
    </div>
  );
};

export default ItemsList;
