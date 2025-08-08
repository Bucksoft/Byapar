import DashboardNavbar from "../components/DashboardNavbar";

const DashoardPurchaseOrderPage = () => {
  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        <DashboardNavbar title={"Purchase Orders"} isReport="true" />
      </div>
    </main>
  );
};

export default DashoardPurchaseOrderPage;
