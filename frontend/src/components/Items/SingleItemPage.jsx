import { useNavigate, useParams } from "react-router-dom";
import { useItemStore } from "../../store/itemStore";
import { useEffect, useState } from "react";
import { ArrowLeft, Package } from "lucide-react";
import { BsTrash3 } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { dashboardSingleItemPageMenus } from "../../utils/constants";
import SingleItemPartyWisePricesDetails from "./SingleItemPartyWisePricesDetails";
import SingleItemGodownDetails from "./SingleItemGodownDetails";
import SingleItemPartyWiseDetails from "./SingleItemPartyWiseDetails";
import SingleItemStockDetails from "./SingleItemStockDetails";
import SingleItemDetails from "./SingleItemDetails";
import { DayPicker } from "react-day-picker";
import { FaCalculator } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import toast from "react-hot-toast";
import CustomLoader from "../Loader";
import { queryClient } from "../../main";

const SingleItemPage = () => {
  const { id } = useParams();
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [item, setItem] = useState({});
  const [selectedMenu, setSelectedMenu] = useState(1);
  const { items } = useItemStore();
  const navigate = useNavigate();

  useEffect(() => {
    const singleItem = items.find((item) => item?._id === id);
    setItem(singleItem);
  }, [id]);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/item/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.msg);
      document.getElementById("my_modal_2").close();
      queryClient.invalidateQueries({ queryKey: ["items"] });
      navigate("/dashboard/items");
    },
  });

  return (
    <main className="w-full h-screen overflow-y-scroll p-2">
      <div className="h-full w-full bg-white rounded-lg">
        {/* Header part */}
        <header className="p-4 flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <ArrowLeft size={18} onClick={() => navigate(-1)} />
            <span>{item?.itemName}</span>
            {item?.openingStock === 0 ? (
              <div className="badge badge-soft badge-secondary">
                Out of Stock
              </div>
            ) : (
              <div className="badge badge-soft badge-secondary">In Stock</div>
            )}
          </div>

          <div className="text-sm space-x-3">
            <button
              onClick={() => document.getElementById("my_modal_1").showModal()}
              className="btn btn-sm btn-ghost"
            >
              <Package size={15} /> Adjust Stock
            </button>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="my_modal_1" className="modal">
              <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">Adjust Stock Quantity</h3>
                <div className="flex items-start gap-3">
                  <div className="w-3/5 flex flex-col">
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-500 mt-5">Date</span>
                      <button
                        type="button"
                        onClick={() => setShowDatepicker((prev) => !prev)}
                        className="btn btn-sm btn-outline border-zinc-300"
                      >
                        <p>{"Pick a date"}</p>
                      </button>
                      {showDatepicker && <DayPicker mode="single" />}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-500 mt-5">Godown</span>
                      <select
                        defaultValue="Godown"
                        className="select select-sm w-full"
                      >
                        <option disabled={true}>Pick a color</option>
                        <option>Crimson</option>
                        <option>Amber</option>
                        <option>Velvet</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-500 mt-5">
                        Add or Reduce Stock
                      </span>
                      <select
                        defaultValue="add"
                        className="select select-sm w-full"
                      >
                        <option disabled={true}>Add or Reduce Stock</option>
                        <option>Add (+)</option>
                        <option>Reduce (-)</option>
                      </select>
                    </div>

                    <div className="flex flex-col relative">
                      <span className="text-xs text-zinc-500 mt-5">
                        Adjust Quantity
                      </span>
                      <input
                        type="number"
                        className="input input-sm w-full"
                        placeholder="0"
                      />
                      <p className="absolute text-xs top-10 right-1 px-3 bg-zinc-200 p-1">
                        PCS
                      </p>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-500 mt-5">
                        Remarks (optional)
                      </span>
                      <textarea
                        name="remarks"
                        className="textarea w-full p-2"
                        placeholder="Add your remarks"
                      />
                    </div>
                  </div>

                  {/* right side */}
                  <div className="p-4 w-full">
                    <p className="text-xs font-medium">Item Name</p>
                    <span className="text-zinc-500 text-xs">
                      {item?.itemName}
                    </span>
                    <div className="divider " />
                    <span className="text-xs font-medium flex items-center gap-2">
                      <FaCalculator />
                      Stock Calculation
                    </span>
                    <p className="text-zinc-500 text-xs mt-2 p-5 border border-zinc-200">
                      {item?.itemName}
                    </p>
                  </div>
                </div>

                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm">Close</button>
                  </form>
                  <div>
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm bg-[var(--primary-btn)]">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </dialog>
            <button
              className="btn btn-sm"
              onClick={() =>
                navigate("/dashboard/items/basic-details", { state: item?._id })
              }
            >
              <FaRegEdit /> Edit
            </button>

            <button
              disabled={mutation.isPending}
              className="btn btn-sm btn-outline text-[var(--error-text-color)] "
              onClick={() => document.getElementById("my_modal_2").showModal()}
            >
              {mutation.isPending ? (
                <CustomLoader text={"Deleting..."} />
              ) : (
                <BsTrash3 />
              )}
            </button>
            <dialog id="my_modal_2" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Confirm Deletion</h3>
                <p className="py-4 text-sm">
                  Are you sure you want to delete the selected item? This action
                  cannot be undone.
                </p>
                <div className="flex w-full">
                  <button
                    onClick={() => mutation.mutate()}
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
        </header>

        <div className="flex items-center mt-4 ">
          {dashboardSingleItemPageMenus?.map((menu) => (
            <div key={menu?.id} className="pl-8">
              <p
                onClick={() => setSelectedMenu(menu?.id)}
                className={`${
                  selectedMenu === menu?.id && "text-[var(--badge)] border-b "
                }  text-sm flex gap-3 items-center px-5 py-1  cursor-pointer hover:bg-[var(--badge)]/10  `}
              >
                <span>{menu?.icon}</span>
                {menu?.title}
              </p>
            </div>
          ))}
        </div>

        {selectedMenu === 1 ? (
          <SingleItemDetails item={item} />
        ) : selectedMenu === 2 ? (
          <SingleItemStockDetails item={item} />
        ) : selectedMenu === 3 ? (
          <SingleItemPartyWiseDetails item={item} />
        ) : selectedMenu === 4 ? (
          <SingleItemGodownDetails item={item} />
        ) : (
          <SingleItemPartyWisePricesDetails item={item} />
        )}
      </div>
    </main>
  );
};

export default SingleItemPage;
