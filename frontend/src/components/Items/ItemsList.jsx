import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { axiosInstance } from "../../config/axios";
import toast from "react-hot-toast";
import { BsTrash3 } from "react-icons/bs";
import { queryClient } from "../../main";
import { useNavigate } from "react-router-dom";
import { PackagePlus } from "lucide-react";

const ItemsList = ({ items }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const handleCheck = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

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

  return (
    <div className="overflow-x-auto">
      {selectedItems.length > 0 && (
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
      )}
      <table className="table mt-5 w-full ">
        {/* head */}
        <thead className="">
          <tr className="bg-zinc-100 ">
            <th></th>
            <th>Sr No.</th>
            <th>Item Name</th>
            <th>Item Code</th>
            <th>Stock Quantity</th>
            <th>Selling Price</th>
            <th>Purchase Price</th>
            <th>Adjust Stock</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {items.map((item, index) => (
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
              <td>{item?.itemName}</td>
              <td>{item?.itemCode || "-"}</td>
              <td>
                {item?.openingStock} {item?.measuringUnit}
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
                      {item?.purchasePrice}
                    </>
                  ) : (
                    "-"
                  )}
                </div>
              </td>
              <td>
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById("my_modal_1").showModal();
                  }}
                >
                  <PackagePlus className="cursor-pointer" size={18} />
                </button>
                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Hello!</h3>
                    <p className="py-4">
                      Press ESC key or click the button below to close
                    </p>

                    <div className="modal-action">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button
                          className="btn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Close
                        </button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsList;
