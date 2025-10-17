import DashboardNavbar from "../components/DashboardNavbar";
import { ArrowLeft, ArrowRight, Package, Plus, Search } from "lucide-react";
import { FaArrowLeft, FaArrowRight, FaIndianRupeeSign } from "react-icons/fa6";
import { LuPackageSearch } from "react-icons/lu";
import not_found from "../assets/not-found.png";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { motion } from "framer-motion";
import { container } from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import CustomLoader from "../components/Loader";
import { useItemStore } from "../store/itemStore";
import { useEffect, useMemo, useRef, useState } from "react";
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
import no_items from "../assets/no_items.jpg";

const DashboardItemsPage = () => {
  const navigate = useNavigate();
  const { setItems } = useItemStore();
  const { business } = useBusinessStore();
  const [lowStockItems, setLowStockItems] = useState(0);
  const [stockValue, setStockValue] = useState(0);
  const [showLowStock, setShowLowStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const fileRef = useRef();

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

  // FETCHING ALL ITEMS FOR THE BUSINESS
  const {
    data: items,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["items", business?._id],
    queryFn: async () => {
      if (!business?._id) return [];
      const res = await axiosInstance.get(`/item/all/${business._id}`);
      setTotalItems(res?.data?.totalItems);
      return res.data?.items;
    },
    enabled: !!business?._id,
    keepPreviousData: true,
  });

  // CALCULATING STOCK VALUE AND LOW STOCK ITEMS
  useEffect(() => {
    if (isSuccess && items) {
      const products = items?.filter((item) => item?.itemType === "product");

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

  const totalPages = Math.ceil((items?.length || 0) / itemsPerPage);

  // SEARCH ITEMS
  const searchedItems = useMemo(() => {
    if (!items?.length) return [];
    return items.filter((item) =>
      item?.itemName.toLowerCase().includes(searchQuery?.toLowerCase())
    );
  }, [items, searchQuery]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return searchedItems?.slice(startIndex, endIndex) || [];
  }, [currentPage, searchedItems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <main className="h-screen overflow-y-scroll p-2">
      <div className="h-full w-full bg-gradient-to-b from-white to-transparent rounded-lg p-3">
        <DashboardNavbar title={"Items"} isReport={"true"} />

        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-2 "
        >
          <div
            onClick={() => navigate(`/dashboard/reports?type=Stock Value`)}
            className={`border-l-4 border-l-[#9B5DE0] rounded-md p-3 mt-5 shadow-md hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer bg-gradient-to-tl from-[rgba(155,93,224,0.1)] to-white`}
          >
            <p className={`flex items-center gap-3 text-[#9B5DE0]`}>
              <AiOutlineStock /> Stock Value
            </p>
            <span className="font-medium text-2xl flex gap-2 items-center">
              <FaIndianRupeeSign size={14} />
              {Number(stockValue).toLocaleString("en-IN")}
            </span>
          </div>

          <div
            onClick={() => navigate(`/dashboard/reports?type=Low Stock`)}
            className={`rounded-md p-3 mt-5 border-warning bg-warning/10 shadow-md hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer border-l-4 border-l-[#D25D5D] bg-gradient-to-tl from-[rgba(210,93,93,0.1)] to-white`}
          >
            <p className={`flex items-center gap-3 text-[#D25D5D]`}>
              <BsFillBoxSeamFill /> Low Stock
            </p>
            <span className="font-medium text-2xl flex gap-2 items-center">
              {lowStockItems}
            </span>
          </div>

          <div
            className={`border-l-4 rounded-md p-3 mt-5 border-accent bg-accent/10 shadow-md hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer border-l-[#7ADAA5] bg-gradient-to-tl from-[rgba(122,218,165,0.1)] to-white`}
          >
            <p className={`flex items-center gap-3 text-[#7ADAA5]`}>
              <Package size={16} /> Total Items
            </p>
            <span className="font-medium text-2xl flex gap-2 items-center">
              {totalItems}
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
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            ) : (
              <>
                {searchedItems?.length === 0 && searchQuery.trim() !== "" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      ease: "easeInOut",
                      duration: 0.2,
                      delay: 0.2,
                    }}
                    className="flex items-center justify-center flex-col"
                  >
                    <img
                      src={not_found}
                      alt="not_found"
                      width={250}
                      loading="lazy"
                    />
                    <h3 className="font-semibold">No matching items found</h3>
                    <p className="text-zinc-500 text-xs text-center max-w-sm">
                      No items found matching “{searchQuery}”. Try a different
                      name or clear your search.
                    </p>
                    <button
                      className="btn btn-outline btn-sm mt-3"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </button>
                  </motion.div>
                ) : paginatedItems?.length > 0 ? (
                  <>
                    <ItemsList
                      items={paginatedItems}
                      showLowStock={showLowStock}
                    />
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        ease: "easeInOut",
                        duration: 0.2,
                        delay: 0.2,
                      }}
                      className="flex items-center justify-center flex-col"
                    >
                      <img
                        src={no_items}
                        alt="no_items"
                        width={250}
                        loading="lazy"
                      />
                      <h3 className="font-semibold">No items found</h3>
                      <p className="text-zinc-500 text-xs text-center max-w-sm">
                        Start by creating your first item or upload items in
                        bulk using Excel for faster setup.
                      </p>
                    </motion.div>
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* PAGINATION  */}
        <div className="w-full flex items-center justify-end p-4">
          <div className="join join-sm flex items-center">
            <button
              className="btn btn-sm btn-neutral"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ArrowLeft size={14} />
            </button>

            <span className="text-xs px-4">
              {currentPage} of {totalPages}
            </span>

            <button
              className="btn btn-sm btn-neutral"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ArrowRight size={14} />
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
