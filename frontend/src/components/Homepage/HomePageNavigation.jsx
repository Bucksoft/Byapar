import wave from "../../assets/wave.svg";
import Button from "../../components/Button";
import { CiLogin } from "react-icons/ci";
import { Link } from "react-router-dom";

const HomePageNavigation = ({ user }) => {
  return (
    <div className="relative">
      <img src={wave} alt="wave.png" loading="lazy" />
      <header className="absolute top-0 w-full p-5">
        <nav className="w-3/4 mx-auto flex items-center justify-between bg-white/10 rounded-full backdrop-blur-xl p-2  shadow-md px-3 border border-white/30">
          {/* Logo */}
          <h1 className="font-semibold text-white">Byapar</h1>

          {/* Navlinks */}
          <ul className="text-sm text-[var(--primary-text-color)] flex items-center gap-5">
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>

          {/* Login Button */}
          {user ? (
            <Link to={"/dashboard"}>
              <Button text="Dashboard" />
            </Link>
          ) : (
            <Link to={"/login"}>
              <Button text="Login" logo={<CiLogin />} />
            </Link>
          )}
        </nav>
      </header>
    </div>
  );
};

export default HomePageNavigation;
