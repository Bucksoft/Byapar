import { FaFileInvoice } from "react-icons/fa";
import DashboardNavbar from "../components/DashboardNavbar";
import SalesNavigationMenus from "../components/SalesNavigationMenus";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import CustomLoader from "../components/Loader";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useBusinessStore } from "../store/businessStore";
import { useQuotationStore } from "../store/quotationStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardQuotationPage = () => {
  const { business } = useBusinessStore();
  const { setQuotations } = useQuotationStore();
  const [searchedQuery, setSearchedQuery] = useState("");
  const navigate = useNavigate();

  const { isLoading, data: quotations = [] } = useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/quotation/all/${business?._id}`);
      setQuotations(res.data.quotations);
      return Array.isArray(res.data.quotations) ? res.data.quotations : [];
    },
  });

  const searchedQuotations = quotations?.filter(
    (quotation) => quotation?.quotationNumber === Number(searchedQuery)
  );

  return (
    <main className="h-screen w-full flex">
      <section className="h-full w-full bg-gray-100 p-2 ">
        <div className="border border-zinc-300 h-full rounded-md bg-white p-3">
          <DashboardNavbar title={"Quotation / Estimate"} />
          <SalesNavigationMenus
            title={"Quotation / Estimate"}
            btnText={"Quotation"}
            selectText={"quotation"}
            setSearchedQuery={setSearchedQuery}
          />

          {/* table */}
          <div className="mt-5 h-80 rounded-md mx-4">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <CustomLoader text={"Loading..."} />
              </div>
            ) : quotations.length > 0 ? (
              <table className="table">
                {/* head */}
                <thead>
                  <tr className="text-xs bg-gray-100">
                    <th className="w-60">Date</th>
                    <th className="w-60">Quotation Number</th>
                    <th className="w-60">Party Name</th>
                    <th className="w-60">Due In</th>
                    <th className="w-60">Amount</th>
                    <th className="w-60">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(searchedQuery ? searchedQuotations : quotations)?.length >
                  0 ? (
                    (searchedQuery ? searchedQuotations : quotations).map(
                      (quotation) => (
                        <tr
                          key={quotation._id}
                          onClick={() =>
                            navigate(`/dashboard/quotations/${quotation?._id}`)
                          }
                          className="cursor-pointer"
                        >
                          <td>{quotation?.quotationDate?.split("T")[0]}</td>
                          <td>{quotation?.quotationNumber}</td>
                          <td>{quotation?.partyId?.partyName}</td>
                          <td>-</td>
                          <td>
                            <div className="flex items-center">
                              <LiaRupeeSignSolid />
                              {Number(
                                quotation?.totalAmount || 0
                              ).toLocaleString("en-IN")}
                            </div>
                          </td>
                          <td>
                            <div className="badge badge-accent badge-soft">
                              {quotation?.status}
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center text-zinc-400 py-6"
                      >
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
                <FaFileInvoice size={40} />
                <span className="text-sm">
                  No transactions matching the current filter
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardQuotationPage;
