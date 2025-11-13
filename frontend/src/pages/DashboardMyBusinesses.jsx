import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import CustomLoader from "../components/Loader";
import { useBusinessStore } from "../store/businessStore";
import { IoBusinessSharp, IoLocationSharp } from "react-icons/io5";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { PenSquare, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { queryClient } from "../main";
import { BsTrash3 } from "react-icons/bs";
import businessImg from "../assets/business.svg";

const DashboardMyBusinesses = () => {
  const {
    setBusinesses,
    setBusiness,
    business: currentlyActiveBusiness,
  } = useBusinessStore();
  const [activeBusinessId, setActiveBusinessId] = useState();

  const navigate = useNavigate();

  // fetch all the businesses
  const { isLoading, data: businesses } = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      const res = await axiosInstance.get("/business");
      setBusinesses(res.data?.businesses);
      return res.data?.businesses;
    },
  });

  // handle active business
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.patch("/business/active", data);
      setBusiness(res.data?.updatedBusiness);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      queryClient.invalidateQueries({ queryKey: ["business"] });
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
    },
  });

  // handle business deletion
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/business/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      document.getElementById("my_modal_2").close();
      queryClient.invalidateQueries({
        queryKey: [
          "business",
          "invoices",
          "quotations",
          "paymentIns",
          "deliveryChallans",
          "proformaInvoice",
          "items",
          "purchaseInvoice",
          "debitNotes",
          id,
        ],
      });
      localStorage.clear();
    },
  });

  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">My Businesses</h1>
          {businesses && businesses.length > 0 && (
            <button
              onClick={() => navigate("/dashboard/business")}
              className="btn rounded-xl btn-sm bg-[var(--primary-btn)]"
            >
              {" "}
              <Plus size={15} /> Create new business
            </button>
          )}
        </div>

        {/* Businesses Cards */}
        {isLoading ? (
          <div className="w-full flex justify-center py-16">
            <CustomLoader text={"Loading..."} />
          </div>
        ) : (
          <section className="grid grid-cols-3 gap-8 py-8">
            {businesses &&
              businesses.length > 0 &&
              businesses.map((business) => (
                <div
                  key={business?._id}
                  style={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                  }}
                  className="card w-96 bg-gradient-to-b rounded-2xl card-md overflow-hidden"
                >
                  <div className="overflow-hidden">
                    <div className="flex items-start gap-3 bg-[#030F21] p-4 text-white ">
                      {/* Business Logo */}
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center  overflow-hidden">
                        {business?.logo !== "null" ? (
                          <img
                            src={business.logo}
                            alt="Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="bg-success/10 p-3 rounded-md">
                            <IoBusinessSharp
                              size={16}
                              className="text-success"
                            />
                          </span>
                        )}
                      </div>

                      <div className="leading-4 flex-1">
                        <h2 className="card-title">{business?.businessName}</h2>
                        <small className="text-zinc-100">
                          {business?.businessRegType}
                        </small>
                      </div>

                      <div className="rounded-full px-2 py-1 text-xs bg-white/10">
                        {business?.businessType}
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Displaying city and state */}
                      <p className="flex items-center gap-1 mt-2 text-zinc-700 text-sm">
                        <IoLocationSharp className="text-[#4A7DF0]" />
                        {business?.city}, {business?.state}
                      </p>

                      {/* Business Details */}
                      <h3 className="text-zinc-700 font-semibold mt-3">
                        Business Details
                      </h3>

                      <div className="grid grid-cols-2 gap-2 min-h-[120px]">
                        <p className="text-xs mt-1 p-2 bg-white border border-zinc-100 rounded-lg inset-shadow-2xs  hover:scale-105 transition-all break-all whitespace-normal">
                          <span className="text-zinc-500 font-medium">
                            Company email
                          </span>
                          <br />
                          {business?.companyEmail}
                        </p>

                        <p className="text-xs mt-1 p-2 bg-white border border-zinc-100 rounded-lg inset-shadow-2xs  hover:scale-105 transition-all">
                          <span className="text-zinc-500 font-medium">
                            Company Phone number
                          </span>
                          <br /> {business?.companyPhoneNo}
                        </p>

                        {/* GST number */}
                        <p className="text-xs mt-1 p-2 bg-white border border-zinc-100 rounded-lg inset-shadow-2xs  hover:scale-105 transition-all">
                          {business?.gstNumber ? (
                            <>
                              <span className="text-zinc-500 font-medium">
                                GST number
                              </span>
                              <br /> {business?.gstNumber}
                            </>
                          ) : (
                            <span className="text-zinc-400 italic">
                              GST number not available
                            </span>
                          )}
                        </p>

                        {/* PAN number */}
                        <p className="text-xs mt-1 p-2 bg-white border border-zinc-100 rounded-lg inset-shadow-2xs  hover:scale-105 transition-all">
                          {business?.panNumber ? (
                            <>
                              <span className="text-zinc-500 font-medium">
                                PAN number
                              </span>
                              <br /> {business?.panNumber}
                            </>
                          ) : (
                            <span className="text-zinc-400 italic">
                              PAN number not available
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="justify-end card-actions mt-5">
                        <div className="inline-flex rounded-lg overflow-hidden shadow ">
                          {/* Edit Button */}
                          <button
                            onClick={() =>
                              navigate("/dashboard/business", {
                                state: { businessId: business?._id },
                              })
                            }
                            className="flex items-center gap-1 px-3 py-1 bg-[#DFECFF] text-blue-500 hover:bg-blue-50 transition-colors text-xs font-medium"
                          >
                            <PenSquare size={15} /> Edit
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() =>
                              document.getElementById("my_modal_2").showModal()
                            }
                            className="flex items-center gap-1 px-3 py-1 bg-[#FBF1F1] text-red-500 hover:bg-red-100 transition-colors text-xs font-medium border-l border-zinc-200"
                          >
                            <BsTrash3 size={15} /> Delete
                          </button>

                          {/* Activate / Active Button */}
                          <button
                            onClick={() => {
                              setActiveBusinessId(business?._id);
                              mutation.mutate({
                                id: business?._id,
                                status: "active",
                              });
                            }}
                            disabled={mutation?.isPending}
                            className={`flex items-center gap-1 px-3 py-1 text-xs font-medium border-l border-zinc-200 transition-colors ${
                              currentlyActiveBusiness?._id === business?._id &&
                              "bg-[#EDF5F0] text-green-500 hover:bg-green-50"
                            }`}
                          >
                            {mutation?.isPending &&
                            business?._id === activeBusinessId ? (
                              <CustomLoader text={""} />
                            ) : (
                              <>
                                <IoMdCheckmarkCircleOutline size={15} />
                                {currentlyActiveBusiness?._id === business?._id
                                  ? "Active"
                                  : "Mark Active"}
                              </>
                            )}
                          </button>
                        </div>

                        <dialog id="my_modal_2" className="modal">
                          <div className="modal-box">
                            <h3 className="font-bold text-lg">
                              Confirm Deletion
                            </h3>
                            <p className="py-4 text-sm">
                              Are you sure you want to delete the selected
                              item(s)? This action cannot be undone.
                            </p>
                            <div className="flex w-full">
                              <button
                                onClick={() =>
                                  deleteMutation.mutate(business?._id)
                                }
                                className="btn rounded-xl btn-sm btn-ghost  ml-auto text-[var(--error-text-color)]"
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
                    </div>
                  </div>
                </div>
              ))}
          </section>
        )}
        <div className="w-full flex justify-center py-16">
          {businesses && businesses.length <= 0 && (
            <div className="flex flex-col items-center">
              <img
                src={businessImg}
                alt="businessBackground"
                width={400}
                loading="lazy"
              />
              <h1 className="text-xl font-semibold text-zinc-600">
                Create your first business
              </h1>
              <button
                onClick={() => navigate("/dashboard/business")}
                className="btn rounded-xl btn-sm bg-[var(--primary-btn)] mt-5"
              >
                {" "}
                <Plus size={15} /> Create new business
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DashboardMyBusinesses;
