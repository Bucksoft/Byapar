import dcsearch from "../../assets/DocSearch.png";
import { PlusIcon } from "lucide-react";

const DashboardItemsCustomFieldsPage = () => {
  return (
    <main className="flex flex-col justify-center items-center  h-full">
      <div className="h-40 w-50">
        <img src={dcsearch} alt="" className="h-40" />
      </div>
      <p>You don't have any custom field created yet</p>
      <button className="btn btn-sm mt-5 bg-[var(--primary-btn)]">
        <PlusIcon size={18} />
        Create Custom Fields
      </button>
    </main>
  );
};

export default DashboardItemsCustomFieldsPage;
