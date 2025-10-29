import { FaArrowLeft, FaFilePdf } from "react-icons/fa6";
import { GiQueenCrown } from "react-icons/gi";
import { FaRegStar } from "react-icons/fa6";
import itemratelist from "../assets/itemratelist.png";
import { useNavigate } from "react-router-dom";
import { useItemStore } from "../store/itemStore";
import { LiaRupeeSignSolid } from "react-icons/lia";

const DashboardRateListPage = () => {
  const navigate = useNavigate();
  const { items } = useItemStore();
  return (
    <main className="flex p-2  shadow-2xs h-full gap-2 bg-[var(--primary-text-color)]">
      <section className="w-full ">
        <div className="w-full flex flex-col">
          {/* Header */}
          <header className="w-full flex items-center border-b border-gray-200 p-3 gap-4">
            <div className=" flex items-center gap-2 ">
              <p className=" flex items-center text-base gap-3">
                <FaArrowLeft onClick={() => navigate(-1)} />
                Rate List
              </p>
              <p className="text-amber-500 text-lg">
                <GiQueenCrown />
              </p>
            </div>
            <button className=" flex items-center gap-2 text-sm bg-gray-100 p-1 px-2 rounded">
              <FaRegStar className="text-gray-500" />
              Favourite
            </button>
          </header>

          {/* Body Section */}
          <section className="p-6 flex flex-col">
            <div className="w-full flex mb-5">
              <button className="btn rounded-xl btn-sm ml-auto flex items-center">
                <FaFilePdf size={15} />
                Download PDF
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                {/* head */}
                <thead>
                  <tr className="bg-zinc-100">
                    <th>Name</th>
                    <th>Item Code</th>
                    <th>MRP</th>
                    <th>Selling Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items &&
                    items.map((item) => (
                      <tr>
                        <td>{item?.itemName || "-"}</td>
                        <td>{item?.itemCode || "-"}</td>
                        <td>{item?.MRP || "-"}</td>
                        <td className="flex items-center">
                          <LiaRupeeSignSolid size={15} />{" "}
                          {item?.salesPrice || "-"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {!items && (
              <div className="flex flex-col items-center justify-center mt-30">
                <img
                  src={itemratelist}
                  alt="src/assets/itemratelist"
                  className="w-50"
                  loading="lazy"
                />
                <p className="text-sm text-gray-500 font-normal">
                  No transactions available to generate report
                </p>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default DashboardRateListPage;
