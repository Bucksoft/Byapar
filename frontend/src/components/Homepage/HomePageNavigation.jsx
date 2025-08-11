import React from "react";
import { Link } from "react-router-dom";
import Byapar from "../../assets/Byapar.png";
import Button from "../Button";

const HomePageNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <nav className="bg-white/30 backdrop-blur-2xl sticky top-0 z-150 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex ">
          <img src={Byapar} alt="WebsiteLogo" width={80} />
          <div className="hidden md:flex items-center space-x-8 pl-80">
            <a
              href="#features"
              className="text-gray-700 hover:text-info font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-info font-medium transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-info font-medium transition-colors"
            >
              Reviews
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-info font-medium transition-colors"
            >
              Contact
            </a>
          </div>
          <div className="flex items-center justify-center pl-80">
            <Link to={"/login"}>
              <Button text={"LOGIN"} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomePageNavigation;
