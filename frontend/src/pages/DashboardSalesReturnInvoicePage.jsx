import InvoicesForm from "../components/Invoices/InvoicesForm";

const DashboardSalesReturnInvoicePage = () => {
  return (
    <main className="max-h-screen flex w-full overflow-auto">
      <section className=" w-full bg-gray-100  h-screen p-2">
        <div className=" border border-zinc-300 h-full rounded-md bg-white overflow-auto ">
          <InvoicesForm title={"Sales Return"} />
        </div>
      </section>
    </main>
  );
};

export default DashboardSalesReturnInvoicePage;
