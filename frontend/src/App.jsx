import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import DashboardPartiesPage from "./pages/DashboardPartiesPage";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardItemsPage from "./pages/DashboardItemsPage";
import DashboardPurchasesPage from "./pages/DashboardPurchasesPage";
import DashboardReportPage from "./pages/DashboardReportPage";
import DashboardSalesPage from "./pages/DashboardSalesPage";
import DashboardEInvoicing from "./pages/DashboardEInvoicing";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/dashboard/parties" element={<DashboardPartiesPage />} />
          <Route path="/dashboard/items" element={<DashboardItemsPage />} />
          <Route
            path="/dashboard/purchases"
            element={<DashboardPurchasesPage />}
          />
          <Route path="/dashboard/reports" element={<DashboardReportPage />} />
          <Route path="/dashboard/sales" element={<DashboardSalesPage />} />
          <Route
            path="/dashboard/invoicing"
            element={<DashboardEInvoicing />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
