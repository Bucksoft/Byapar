import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";

const DashboardPaymentInPage = () => {
  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        <DashboardNavbar title={"Payment In"} />
      </div>
    </main>
  );
};

export default DashboardPaymentInPage;
