import { RxCross2 } from "react-icons/rx";

const SettingPricingCard = ({ plan }) => {
  return (
    <div className="border-gray-300 rounded-md ">
      <div className=" rounded-md overflow-hidden ">
        <div
          className={`border-3 ${
            plan.id === 1
              ? "border-error"
              : plan.id === 2
              ? "border-accent-content"
              : "border-warning"
          }`}
        ></div>
        <div className="flex flex-col mt-3 p-2 border-b border-b-zinc-400">
          <span className=" text-lg font-medium py-3">{plan.name}</span>
          <span className={`text-sm text-success font-semibold`}>
            {plan.tagline}
          </span>
          <div className="flex">
            {(plan.id === 2 || plan.id === 3) && (
              <span className="flex mt-4 font-bold text-xl line-through text-gray-400 items-center">
                ₹{plan.originalMonthlyPrice}
              </span>
            )}
            <span className="flex font-bold text-3xl items-center mt-4 p-2">
              ₹{plan.monthlyPrice}
              <span className="text-xs font-medium ">/Month</span>
            </span>
          </div>
          <span className="text-md font-medium ">{plan.yearlyPrice}</span>
          <button
            className={`p-2  cursor-pointer border font-semibold ${
              plan.id === 1
                ? "border-error text-error hover:bg-error/10 "
                : plan.id === 2
                ? "border-accent-content text-accent-content hover:bg-accent-content/10 "
                : "border-warning text-warning hover:bg-warning/10"
            } my-3 w-full transition-all ease-in-out duration-300`}
          >
            {plan.name}
          </button>
        </div>
        <div className="mt-3 p-3 border-b border-b-zinc-400 text-xs">
          <p className="text-gray-500  font-medium mb-3">
            Manage
            <span className="text-black ml-2 font-normal">{plan.manage}</span>
          </p>
          <p className="text-gray-500  font-medium mb-3">
            Access for
            <span className="text-black ml-2 font-normal">{plan.access}</span>
          </p>
          <p className="text-gray-500  font-medium mb-3">
            Auto Sync
            <span className="text-black ml-2 font-normal">{plan.Auto}</span>
          </p>
          <p className="text-gray-500  font-medium mb-2 flex">
            Access on
            <span className="text-black ml-2 flex gap-3 font-normal">
              {plan.accessOn?.map((item, index) => (
                <p key={index} className="text-black">
                  {item}
                </p>
              ))}
            </span>
          </p>
        </div>
        <p className=" text-sm mb-3 ml-3 mt-3">
          {plan.feature}
          <span
            className={`ml-2 font-semibold ${
              plan.id === 1
                ? " text-error"
                : plan.id === 2
                ? " text-accent-content"
                : " text-warning"
            }`}
          >
            {plan.name}
          </span>
        </p>
        <div className="mt-5 pl-3  text-sm  ">
          <p className="p-3 ">
            {plan.name === "Diamond Plan" &&
              plan.features.slice(0, 4).map((item, index) => (
                <>
                  <div className="bg-emerald-900/10 p-2 rounded-md text-xs">
                    {item}
                  </div>
                </>
              ))}
            {plan.name === "Diamond Plan" &&
              plan.features.slice(4).map((item, index) => (
                <>
                  <div className="p-2 flex items-center gap-2 line-through text-zinc-500 text-xs">
                    <RxCross2 size={20} className="text-red-600 " />
                    {item}
                  </div>
                </>
              ))}

            {plan.name === "Platinum Plan" &&
              plan.features.slice(0, 10).map((item, index) => (
                <>
                  <div className="bg-emerald-900/10 p-2 rounded-md text-xs">
                    {item}
                  </div>
                </>
              ))}
            {plan.name === "Platinum Plan" &&
              plan.features.slice(10).map((item, index) => (
                <>
                  <div className="p-2 flex items-center gap-2 line-through text-zinc-500 text-xs">
                    <RxCross2 size={20} className="text-red-600 " />
                    {item}
                  </div>
                </>
              ))}

            {plan.name === "Enterprise Plan" &&
              plan.features.map((item, index) => (
                <>
                  <div className="bg-emerald-900/10 p-2 rounded-md text-xs">
                    {item}
                  </div>
                </>
              ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingPricingCard;
