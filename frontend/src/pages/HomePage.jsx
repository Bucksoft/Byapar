import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div>
      <Link
        to={"/login"}
        className="bg-[var(--primary-btn-background)] text-[var(--primary-btn-color)] px-5 py-2 "
      >
        Login
      </Link>
      <Link
        to={"/dashboard"}
        className="bg-[var(--primary-btn-background)] text-[var(--primary-btn-color)] px-5 py-2 ml-3"
      >
        Dashboard
      </Link>
    </div>
  );
};
