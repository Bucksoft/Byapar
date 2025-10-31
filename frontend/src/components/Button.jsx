import { CiLogin } from "react-icons/ci";

const Button = ({ text, logo }) => {
  return (
    <button className="font-medium  bg-[var(--primary-btn)] text-white px-8 py-2 rounded-full shadow-md cursor-pointer hover:bg-[var(--primary-btn)] flex items-center gap-2">
      {logo} {text}
    </button>
  );
};

export default Button;
