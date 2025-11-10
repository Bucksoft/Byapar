import { Download } from "lucide-react";
import { BsTelephone } from "react-icons/bs";
import { Link } from "react-router-dom";

const DashboardCard = ({ details }) => {
  return (
    <div
      className={`relative w-full px-5 py-3 mt-3 rounded-3xl overflow-hidden inset-shadow-[1px_1px_10px_rgba(0,0,0,0.2)] shadow-lg border border-white ${
        details.id === 2
          ? "bg-gradient-to-r from-cyan-400 to-cyan-600"
          : "bg-gradient-to-r bg-rose-600 to-rose-400"
      }`}
    >
      <div
        className={`absolute inset-0 bg-cover opacity-90 left-40 ${
          details.id === 1 ? "top-16" : "top-15"
        } `}
        style={{
          backgroundImage: `url(${details.img})`,
        }}
      ></div>

      <div className="relative z-10">
        <h1 className="text-white font-semibold">{details.title}</h1>

        <div className="flex items-start flex-col">
          <p
            className={`${
              details.id === 2 ? "text-md text-white" : "text-lg"
            } text-white mt-2`}
          >
            {details.content}
          </p>

          {details.id === 1 && (
            <Link
              to={details.link}
              className="my-2 text-sm flex items-center gap-2 border p-2 w-fit rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download size={14}/>
              Download AnyDesk
            </Link>
          )}
        </div>

        {details.id === 1 ? (
          <Link className="btn btn-sm mt-8 rounded-xl flex items-center gap-1 w-fit">
            <BsTelephone size={14} /> {details.btnText}
          </Link>
        ) : details.id === 2 ? (
          <Link to={details?.link} className="btn btn-sm mt-8 rounded-xl">
            Custom theme
          </Link>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
