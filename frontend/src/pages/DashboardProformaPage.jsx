import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";

const DashboardProformaPage = () => {
  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        <DashboardNavbar title={"Proforma Invoice"} />
      </div>
    </main>
  );
};

export default DashboardProformaPage;
