import { useParams } from "react-router-dom";

const SalesInvoice = () => {
  const { id } = useParams();

  return <div>{id}</div>;
};

export default SalesInvoice;
