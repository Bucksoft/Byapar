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
import { FaCalculator, FaRegFileLines } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import toast from "react-hot-toast";
import CustomLoader from "../Loader";
import { queryClient } from "../../main";
import { LuFileUser } from "react-icons/lu";

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
            {item?.currentStock === 0 && item?.itemType === "product" ? (
              <div className="badge badge-soft badge-secondary">
                Out of Stock
              </div>
            ) : (
              item?.currentStock > 0 &&
              item?.itemType === "product" && (
                <div className="badge badge-soft badge-secondary">In Stock</div>
              )
            )}
          </div>

          <div className="text-sm space-x-3">
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
          {item?.itemType === "product" ? (
            dashboardSingleItemPageMenus?.map((menu) => (
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
            ))
          ) : (
            <>
              <div className="pl-8">
                <p
                  onClick={() => setSelectedMenu(1)}
                  className={`${
                    selectedMenu === 1 && "text-[var(--badge)] border-b "
                  }  text-sm flex gap-3 items-center px-5 py-1  cursor-pointer hover:bg-[var(--badge)]/10  `}
                >
                  <span>
                    <FaRegFileLines />
                  </span>
                  Item Details
                </p>
              </div>
              <div className="pl-8">
                <p
                  onClick={() => setSelectedMenu(5)}
                  className={`${
                    selectedMenu === 5 && "text-[var(--badge)] border-b "
                  }  text-sm flex gap-3 items-center px-5 py-1  cursor-pointer hover:bg-[var(--badge)]/10  `}
                >
                  <span>
                    <LuFileUser />
                  </span>
                  Party Wise Prices
                </p>
              </div>
            </>
          )}
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
