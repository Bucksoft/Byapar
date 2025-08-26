import { LiaRupeeSignSolid } from "react-icons/lia";

const SingleItemDetails = ({ item }) => {
  return (
    <main className="px-10 py-5 text-sm grid grid-cols-2 gap-3">
      <section className="container border border-zinc-200 rounded-md">
        <h4 className="bg-zinc-100 p-2 ">General Details</h4>
        <div className="grid grid-cols-2 ">
          <div className="p-4 space-y-4">
            <span className="text-zinc-500">Item Name</span>
            <p>{item?.itemName}</p>
            <span className="text-zinc-500 ">Item Code</span>
            <p>{item?.itemCode || "-"}</p>
            <span className="text-zinc-500 ">Current Stock</span>
            <p>{item?.openingStock || "-"}</p>
            <span className="text-zinc-500 ">Item Description</span>
            <p>{item?.description || "-"}</p>
          </div>
          <div className="p-4 space-y-4">
            <span className="text-zinc-500 ">Category</span>
            <p>{item?.category || "-"}</p>
            <span className="text-zinc-500 ">Low Stock Quantity</span>
            <p>{item?.category || "-"}</p>
          </div>
        </div>
      </section>

      <section className="container border border-zinc-200 rounded-md">
        <h4 className="bg-zinc-100 p-2 ">General Details</h4>
        <div className="grid grid-cols-2 ">
          <div className="p-4 space-y-4">
            <span className="text-zinc-500">Sales Price</span>
            <p className="flex items-center ">
              {" "}
              <LiaRupeeSignSolid size={15} /> {item?.salesPrice}{" "}
              <span className="text-xs text-zinc-500 ml-1">
                ({item?.salesPriceType})
              </span>
            </p>
            <span className="text-zinc-500 ">HSN Code</span>
            <p>{item?.HSNCode || "-"}</p>
          </div>
          <div className="p-4 space-y-4">
            <span className="text-zinc-500 ">Purchase Price</span>
            <p>{item?.purchasePrice || "-"}</p>
            <span className="text-zinc-500 ">GST Tax rate</span>
            <p>{item?.gstTaxRate || "-"}</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SingleItemDetails;
