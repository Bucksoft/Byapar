import { useQuery } from "@tanstack/react-query";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { axiosInstance } from "../../config/axios";
import { LuIndianRupee } from "react-icons/lu";

const PartyProfile = ({ party }) => {
  const { data: bankInfo } = useQuery({
    queryKey: ["bankAccount"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/bank-account/party/${party?._id}`);
      return res.data;
    },
  });

  return (
    <section className="grid grid-cols-2 gap-5">
      {/* general details */}
      <div className="border border-zinc-200 rounded-md">
        <h1 className="font-medium bg-zinc-100 border-b p-2  border-zinc-200">
          General Details
        </h1>
        <div className="grid grid-cols-2 text-sm p-4 gap-5">
          <div>
            <label className="text-zinc-500">Party Name</label>
            <p className="mt-1">{party?.partyName}</p>
          </div>
          <div>
            <label className="text-zinc-500">Party Type</label>
            <p className="mt-1">{party?.partyType}</p>
          </div>
          <div>
            <label className="text-zinc-500">Mobile Number</label>
            <p className="mt-1">{party?.mobileNumber}</p>
          </div>
          <div>
            <label className="text-zinc-500">Party Category</label>
            <p className="mt-1">{party?.categoryName || "-"}</p>
          </div>
          <div>
            <label className="text-zinc-500">Email</label>
            <p className="mt-1">{party?.email || "-"}</p>
          </div>
          <div>
            <label className="text-zinc-500">Opening Balance</label>
            <p className="mt-1 flex items-center">
              {party?.openingBalance ? (
                <>
                  <LiaRupeeSignSolid />
                  {party?.openingBalance}
                </>
              ) : (
                <>-</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* business details */}
      <div className=" border border-zinc-200 rounded-md">
        <h1 className="font-medium bg-zinc-100 border-b p-2  border-zinc-200">
          Business Details
        </h1>
        <div className="grid grid-cols-2 text-sm p-4 gap-5">
          <div>
            <label className="text-zinc-500">GSTIN</label>
            <p className="mt-1">{party?.GSTIN || "-"}</p>
          </div>
          <div>
            <label className="text-zinc-500">PAN Number</label>
            <p className="mt-1">{party?.PANno || "-"}</p>
          </div>
          <div>
            <label className="text-zinc-500">Billing Address</label>
            <p className="mt-1">{party?.billingAddress || "-"}</p>
          </div>
          <div>
            <label className="text-zinc-500"></label>
            <p className="mt-1"></p>
          </div>
          <div>
            <label className="text-zinc-500">Shipping Address</label>
            <p className="mt-1">
              {party?.fullShippingAddress &&
              party.fullShippingAddress.length > 0 ? (
                party?.fullShippingAddress?.map((party, index) => (
                  <div key={party?._id} className="flex items-start justify-start gap-1 my-2">
                    <span>{index + 1}.</span>
                    <p>{party?.streetAddress}</p>
                  </div>
                ))
              ) : (
                <></>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* credit details */}
      <div className=" border border-zinc-200 rounded-md">
        <h1 className="font-medium bg-zinc-100 border-b p-2  border-zinc-200">
          Credit Details
        </h1>
        <div className="grid grid-cols-2 text-sm p-4 gap-5">
          <div>
            <label className="text-zinc-500">Credit Period (in days)</label>
            <p className="mt-1">{party?.creditPeriod || "-"}</p>
          </div>
          <div>
            <label className="text-zinc-500">Credit Limit</label>
            <p className="mt-1 flex items-center">
              {party?.creditLimit ? (
                <>
                  <LiaRupeeSignSolid />
                  {party?.creditLimit}
                </>
              ) : (
                <>-</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* bank details */}
      <div className=" border border-zinc-200 rounded-md">
        <h1 className="font-medium bg-zinc-100 border-b p-2 border-zinc-200">
          Party Bank Details
        </h1>
        <div className="grid grid-cols-2 text-sm p-4 gap-5">
          <div>
            <label className="text-zinc-500">Account Number</label>
            <p className="mt-1">{bankInfo?.bankAccountNumber || "-"}</p>
          </div>
          <div>
            <label className="text-zinc-500">Account Holder's Name</label>
            <p className="mt-1">{bankInfo?.accountHoldersName || "-"}</p>
          </div>
          <div>
            <label className="text-zinc-500">Bank and Branch</label>
            <p className="mt-1">{bankInfo?.bankAndBranchName || "-"}</p>
          </div>
          <div>
            <label className="text-zinc-500">IFSC Code</label>
            <p className="mt-1">{bankInfo?.IFSCCode || "-"}</p>
          </div>
          <div>
            <label className="text-zinc-500">Opening Balance</label>
            <p className="mt-1 flex items-center gap-1">
              <LuIndianRupee size={15} />
              {bankInfo?.openingBalance || 0}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartyProfile;
