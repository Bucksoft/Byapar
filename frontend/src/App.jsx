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
import DashboardExpenses from "./pages/DashboardExpenses";
import DashboardCashAndBank from "./pages/DashboardCashAndBank";
import DashboardBills from "./pages/DashboardBills";
import DashboardPOS from "./pages/DashboardPOS";

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
          <Route path="/dashboard/expenses" element={<DashboardExpenses />} />
          <Route
            path="/dashboard/cashandbank"
            element={<DashboardCashAndBank />}
          />
          <Route path="/dashboard/bills" element={<DashboardBills />} />
          <Route path="/dashboard/pos" element={<DashboardPOS />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
