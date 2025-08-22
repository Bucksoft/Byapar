import dcrupees from "../../assets/DocumentRupees.png";

const DashboardItemsPartyWisePricesPage = () => {
  return (
    <main className="flex flex-col justify-center items-center  mt-30">
      <div className="h-40 w-50">
        <img src={dcrupees} alt="" className="h-40" />
      </div>
      <p>
        To enable Party Wise Prices and set custom prices for parties, please
        save the item first
      </p>
    </main>
  );
};

export default DashboardItemsPartyWisePricesPage;
