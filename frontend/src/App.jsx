import { Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
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
import DashboardAccountPage from "./pages/DashboardAccountPage";
import DashboardManageBusinessPage from "./pages/DashboardManageBusinessPage";
import DashboardInvoicePage from "./pages/DashboardInvoicePage";
import DashboardPrintSettingsPage from "./pages/DashboardPrintSettingsPage";
import DashboardManageUsersPage from "./pages/DashboardManageUsersPage";
import DashboardRemindersPage from "./pages/DashboardRemindersPage";
import DashboardCAReportsSharingPage from "./pages/DashboardCAReportsSharingPage";
import DashboardPricingPage from "./pages/DashboardPricingPage";
import DashboardReferAndEarnPage from "./pages/DashboardReferAndEarnPage";
import DashboardHelpAndSupportPage from "./pages/DashboardHelpAndSupportPage";
import DashboardStaffPage from "./pages/DashboardStaffPage";
import DashboardOnlineStorePage from "./pages/DashboardOnlineStorePage";
import DashboardSMSMarketingPage from "./pages/DashboardSMSMarketingPage";
import DashboardLoanPage from "./pages/DashboardLoanPage";
import DashboardPOS from "./pages/DashboardPOS";
import DashboardGodownPage from "./pages/DashboardGodownPage";
import DashboardPaymentOutPage from "./pages/DashboardPaymentOutPage";
import DashboardPurchaseReturnPage from "./pages/DashboardPurchaseReturnPage";
import DashboardDebitNotePage from "./pages/DashboardDebitNotePage";
import DashoardPurchaseOrderPage from "./pages/DashoardPurchaseOrderPage";
import DashboardQuotationPage from "./pages/DashboardQuotationPage";
import DashboardPaymentInPage from "./pages/DashboardPaymentInPage";
import DashboardSalesReturnPage from "./pages/DashboardSalesReturnPage";
import DashboardCreditNotePage from "./pages/DashboardCreditNotePage";
import DashboardDeliveryChallanPage from "./pages/DashboardDeliveryChallanPage";
import DashboardProformaPage from "./pages/DashboardProformaPage";
import DashboardAddPartyPage from "./pages/DashboardAddPartyPage";
import HomePage from "./pages/HomePage";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./config/axios";
import { useAuthStore } from "./store/authStore";
import DashboardPartyPage from "./pages/DashboardPartyPage";
import PartyEditPage from "./components/Party/PartyEditPage";
import DashboardSalesInvoicePage from "./pages/DashboardSalesInvoicePage";
import DashboardQuotationInvoiceForm from "./pages/DashboardQuotationInvoiceForm";
import DashboardProformaInvoicePage from "./pages/DashboardProformaInvoicePage";
import DashboardSalesReturnInvoicePage from "./pages/DashboardSalesInvoicePage";
import DashboardItemsBasicDetailPage from "./pages/Items/DashboardItemsBasicDetailPage";
import DashboardItemsSidebar from "./pages/Items/DashboardItemsSidebar";

function App() {
  const { user, setUser } = useAuthStore();
  const { isLoading } = useQuery({
    queryFn: async () => {
      const res = await axiosInstance.get("/user/me");
      setUser(res.data?.user);
      return res.data;
    },
  });

  // if (isLoading) {
  //   return (
  //     <div className="h-screen w-full flex items-center justify-center">
  //       <CustomLoader text={"Loading...."} />
  //     </div>
  //   );

  // }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/dashboard/parties" element={<DashboardPartiesPage />} />
          <Route
            path="/dashboard/parties/:id"
            element={<DashboardPartyPage />}
          />

          <Route
            path="/dashboard/parties/sales-invoice"
            element={<DashboardSalesInvoicePage />}
          />

          <Route
            path="/dashboard/parties/create-quotation"
            element={<DashboardQuotationInvoiceForm />}
          />

          <Route
            path="/dashboard/parties/proforma-invoice"
            element={<DashboardProformaInvoicePage />}
          />

          <Route
            path="/dashboard/parties/sales-return"
            element={<DashboardSalesReturnInvoicePage />}
          />

          <Route path="/dashboard/items" element={<DashboardItemsPage />} />
          <Route
            path="/dashboard/items/basic-details"
            element={<DashboardItemsSidebar />}
          />

          <Route path="/dashboard/godown" element={<DashboardGodownPage />} />

          <Route
            path="/dashboard/purchases"
            element={<DashboardPurchasesPage />}
          />

          <Route
            path="/dashboard/add-party"
            element={<DashboardAddPartyPage />}
          />

          <Route path="/dashboard/edit-party/:id" element={<PartyEditPage />} />

          <Route
            path="/dashboard/payment-out"
            element={<DashboardPaymentOutPage />}
          />

          <Route
            path="/dashboard/purhase-return"
            element={<DashboardPurchaseReturnPage />}
          />

          <Route
            path="/dashboard/debit-note"
            element={<DashboardDebitNotePage />}
          />

          <Route
            path="/dashboard/purchase-return"
            element={<DashboardPurchaseReturnPage />}
          />

          <Route
            path="/dashboard/purchase-order"
            element={<DashoardPurchaseOrderPage />}
          />

          <Route path="/dashboard/reports" element={<DashboardReportPage />} />
          <Route path="/dashboard/sales" element={<DashboardSalesPage />} />
          <Route
            path="/dashboard/quotations"
            element={<DashboardQuotationPage />}
          />
          <Route
            path="/dashboard/payment-in"
            element={<DashboardPaymentInPage />}
          />
          <Route
            path="/dashboard/sales-return"
            element={<DashboardSalesReturnPage />}
          />

          <Route
            path="/dashboard/credit-note"
            element={<DashboardCreditNotePage />}
          />

          <Route
            path="/dashboard/delivery-challan"
            element={<DashboardDeliveryChallanPage />}
          />

          <Route
            path="/dashboard/proforma"
            element={<DashboardProformaPage />}
          />

          <Route
            path="/dashboard/invoicing"
            element={<DashboardEInvoicing />}
          />
          <Route path="/dashboard/expenses" element={<DashboardExpenses />} />
          <Route path="/dashboard/pos" element={<DashboardPOS />} />
          <Route
            path="/dashboard/cashandbank"
            element={<DashboardCashAndBank />}
          />
          <Route path="/dashboard/bills" element={<DashboardBills />} />
          <Route path="/dashboard/account" element={<DashboardAccountPage />} />
          <Route
            path="/dashboard/business"
            element={<DashboardManageBusinessPage />}
          />
          <Route path="/dashboard/invoice" element={<DashboardInvoicePage />} />
          <Route
            path="/dashboard/print"
            element={<DashboardPrintSettingsPage />}
          />
          <Route
            path="/dashboard/users"
            element={<DashboardManageUsersPage />}
          />
          <Route
            path="/dashboard/reminders"
            element={<DashboardRemindersPage />}
          />
          <Route
            path="/dashboard/ca-reports"
            element={<DashboardCAReportsSharingPage />}
          />
          <Route path="/dashboard/pricing" element={<DashboardPricingPage />} />
          <Route
            path="/dashboard/refer-and-earn"
            element={<DashboardReferAndEarnPage />}
          />
          <Route
            path="/dashboard/help-and-support"
            element={<DashboardHelpAndSupportPage />}
          />
          <Route path="/dashboard/staff" element={<DashboardStaffPage />} />
          <Route
            path="/dashboard/online-store"
            element={<DashboardOnlineStorePage />}
          />
          <Route
            path="/dashboard/sms-marketing"
            element={<DashboardSMSMarketingPage />}
          />
          <Route path="/dashboard/loan" element={<DashboardLoanPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
