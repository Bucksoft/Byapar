import DashboardNavbar from "../components/DashboardNavbar";
import { Plus, Search } from "lucide-react";
import { FaArrowLeft, FaArrowRight, FaIndianRupeeSign } from "react-icons/fa6";
import { LuPackageSearch } from "react-icons/lu";
import no_items from "../assets/no_items.jpg";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { motion } from "framer-motion";
import { container } from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import CustomLoader from "../components/Loader";
import { useItemStore } from "../store/itemStore";
import { useEffect, useRef, useState } from "react";
import ItemsList from "../components/Items/ItemsList";
import { useBusinessStore } from "../store/businessStore";
import { AiOutlineStock } from "react-icons/ai";
import { BsFillBoxSeamFill } from "react-icons/bs";
import DashboardItemsBasicDetailPage from "./Items/DashboardItemsBasicDetailPage";
import DashboardItemsSidebar from "./Items/DashboardItemsSidebar";
import { uploadExcel } from "../../helpers/uploadExcel";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import { useDebounce } from "../../helpers/useDebounce";

const DashboardItemsPage = () => {
  const navigate = useNavigate();
  const { setItems } = useItemStore();
  const { business } = useBusinessStore();
  const [lowStockItems, setLowStockItems] = useState(0);
  const [stockValue, setStockValue] = useState(0);
  const [showLowStock, setShowLowStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const fileRef = useRef();
  const limit = 10;

  // MUTATION TO UPLOAD ITEMS IN BULK
  const bulkMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post(`/item/bulk/${business?._id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.msg || "Uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    const sanitizedData = await uploadExcel(selectedFile);
    if (sanitizedData) {
      bulkMutation.mutate(sanitizedData);
    }
    e.target.value = null;
  };

  const debouncedSearch = useDebounce(searchQuery, 400);

  // FETCHING ALL ITEMS FOR THE BUSINESS
  const {
    data: items,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["items", page, business?._id, debouncedSearch],
    queryFn: async () => {
      if (!business?._id) return [];
      const res = await axiosInstance.get(
        `/item/all/${
          business._id
        }?page=${page}&limit=${limit}&search=${encodeURIComponent(
          debouncedSearch || ""
        )}`
      );
      return res.data;
    },
    enabled: !!business?._id,
    keepPreviousData: true,
  });

  // CALCULATING STOCK VALUE AND LOW STOCK ITEMS
  useEffect(() => {
    if (isSuccess && items) {
      const products = items?.items.filter(
        (item) => item?.itemType === "product"
      );

      const totalStockValue = products.reduce(
        (sum, product) =>
          sum + (product?.purchasePrice || 0) * (product?.currentStock || 0),
        0
      );

      const lowStockCount = products.filter(
        (product) =>
          typeof product?.lowStockQuantity === "number" &&
          product?.currentStock < product?.lowStockQuantity
      ).length;

      setStockValue(totalStockValue);
      setLowStockItems(lowStockCount);
      setItems(items);
    }
  }, [isSuccess, items]);

  // SEARCH ITEMS
  const searchedItems =
    items &&
    items.items
      ?.filter((item) =>
        item?.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      )

      ?.filter((item) => {
        if (showLowStock) {
          return (
            item?.itemType === "product" &&
            typeof item?.lowStockQuantity === "number" &&
            item?.currentStock < item?.lowStockQuantity
          );
        }
        return true;
      });

  return (
    <main className="h-screen overflow-y-scroll p-2">
      <div className="h-full w-full bg-gradient-to-b from-white to-transparent rounded-lg p-3">
        <DashboardNavbar title={"Items"} isReport={"true"} />

        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-2 "
        >
          <div
            onClick={() => navigate(`/dashboard/reports?type=Stock Value`)}
            className={`border rounded-md p-3 mt-5 bg-error/10 border-error shadow-md  hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
          >
            <p className={`flex items-center gap-3`}>
              <AiOutlineStock /> Stock Value
            </p>
            <span className="font-medium text-2xl flex gap-2 items-center">
              <FaIndianRupeeSign size={14} />
              {Number(stockValue).toLocaleString("en-IN")}
            </span>
          </div>

          <div
            onClick={() => navigate(`/dashboard/reports?type=Low Stock`)}
            className={`border rounded-md p-3 mt-5 border-warning bg-warning/10 shadow-md hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
          >
            <p className={`flex items-center gap-3`}>
              <BsFillBoxSeamFill /> Low Stock
            </p>
            <span className="font-medium text-2xl flex gap-2 items-center">
              {lowStockItems}
            </span>
          </div>
        </motion.section>

        <motion.div
          initial={{
            opacity: 0,
            scaleY: 0,
          }}
          animate={{
            opacity: 1,
            scaleY: 1,
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.2,
          }}
          className="flex items-center justify-between mt-8 "
        >
          <div className="flex items-center gap-2">
            <label className="input input-sm">
              <Search size={16} className="text-zinc-400" />
              <input
                type="search"
                required
                placeholder="Search By Item Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
            <button
              onClick={() => setShowLowStock(!showLowStock)}
              className="btn btn-ghost btn-sm "
            >
              <LuPackageSearch className="flex items-center" /> Show{" "}
              {!showLowStock ? "Low Stock" : "All Items"}
            </button>
          </div>

          {/* CREATE ITEM */}
          <button
            onClick={() => document.getElementById("my_modal_3").showModal()}
            className="btn btn-sm bg-[var(--primary-btn)]"
          >
            <Plus size={14} /> Create Item
          </button>

          <dialog id="my_modal_3" className="modal ">
            <div className="modal-box w-11/12 max-w-5xl h-3/4">
              <DashboardItemsSidebar data={items} modalId={"my_modal_3"} />
            </div>
          </dialog>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 ">
            <CustomLoader text={"Getting all items..."} />
          </div>
        ) : (
          <>
            {items ? (
              <>
                {/* Component to render List items */}
                <ItemsList items={searchedItems} showLowStock={showLowStock} />
              </>
            ) : (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  ease: "easeInOut",
                  duration: 0.2,
                  delay: 0.2,
                }}
                className="flex items-center justify-center  flex-col"
              >
                <img src={no_items} alt="no_items" width={250} loading="lazy" />
                <h3 className="font-semibold">No items found</h3>
                <p className="text-zinc-500 text-xs">
                  Start by creating your first item or upload items in bulk
                  using Excel for faster setup.
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* PAGINATION  */}
        <div className="w-full flex items-center justify-end p-4">
          <div className="join join-sm">
            <button
              className="join-item btn btn-neutral btn-sm"
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={page === 1}
            >
              <FaArrowLeft />
            </button>

            <button className="join-item btn btn-sm">
              {page}/{items?.totalPages || 1}
            </button>

            <button
              onClick={() => {
                if (items && page < items.totalPages) {
                  setPage((old) => old + 1);
                }
              }}
              disabled={!items || page >= items.totalPages}
              className="join-item btn btn-neutral btn-sm"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* HANDLING BULK UPLOAD */}
        <div className="p-5 w-full border mb-5 border-zinc-300 shadow-md bg-gradient-to-r from-zinc-100 to-sky-200 ">
          <h1 className="font-semibold">Add Multiple Items at once</h1>
          <p className="text-zinc-500 text-sm">
            Bulk upload all your items to Byapar using excel
          </p>
          <small className="mt-1 text-red-500">
            Note* You must follow the sample items excel.
          </small>
          <br />
          <input
            type="file"
            className="file-input file-input-sm hidden"
            ref={fileRef}
            onChange={handleFileUpload}
          />

          <button
            onClick={() => fileRef.current.click()}
            disabled={bulkMutation.isPending}
            className="btn btn-success btn-sm mt-3 "
          >
            {bulkMutation.isPending ? (
              <CustomLoader text={"Adding items..."} />
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-file-spreadsheet"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                  <path d="M8 11h8v7h-8z" />
                  <path d="M8 15h8" />
                  <path d="M11 11v7" />
                </svg>{" "}
                Upload Excel
              </>
            )}
          </button>

          <button
            onClick={() => window.open("/sample-items.xlsx", "_blank")}
            className="btn text-neutral btn-link btn-xs mt-3 ml-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-download"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
              <path d="M7 11l5 5l5 -5" />
              <path d="M12 4l0 12" />
            </svg>
            Download Sample
          </button>
        </div>
      </div>
    </main>
  );
};

export default DashboardItemsPage;
