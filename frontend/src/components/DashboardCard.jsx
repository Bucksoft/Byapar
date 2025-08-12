import React from "react";

const DashboardCard = ({ details }) => {
  return (
    <div
      className={` ${
        details.id === 2 ? "bg-warning" : "bg-secondary"
      } w-full px-5 py-3 mt-3 rounded-lg `}
    >
      <h1 className="text-white font-semibold">{details.title}</h1>
      <p
        className={` ${
          details.id === 2 ? "text-md text-white" : "text-xs"
        }  text-white mt-2`}
      >
        {details.content}
      </p>
      <button className="btn btn-sm mt-8">{details.btnText}</button>
    </div>
  );
};

export default DashboardCard;
