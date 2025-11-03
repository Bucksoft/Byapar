import Button from "../components/Button";
import HomePageNavigation from "../components/Homepage/HomePageNavigation";
import { BsBoxArrowInUpRight } from "react-icons/bs";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { axiosInstance } from "../config/axios";
import HomePageFeature from "../components/Homepage/HomePageFeature";

const HomePage = () => {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axiosInstance.get("/user/me");
        console.log(res);
        if (res.data?.user) {
          setDefaultResultOrder(res.data?.user);
        }
      } catch (error) {
        try {
          await axiosInstance.get("/refresh");
          const res = await axiosInstance.get("/user/me");
          console.log("USER", res);
        } catch (error) {
          console.log("User not logged in");
        }
      }
    };
    verifyUser();
  }, []);

  return (
    <main className="min-h-screen">
      <HomePageNavigation user={user} />
      <div className=" -mt-10 flex items-center justify-center flex-col gap-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
          Byapar
        </h1>
        <p className="text-3xl text-zinc-700 font-medium">
          The Powerhouse for Billing & Inventory
        </p>
        <p className="text-zinc-500 w-3/4 text-center">
          Byapar empowers your business with effortless GST billing, smart
          inventory tracking, and customer management — saving time, reducing
          errors, and boosting growth.
        </p>
        <div className="mt-8">
          <Button text={"Get Started"} logo={<BsBoxArrowInUpRight />} />
        </div>
      </div>

      {/* <HomePageFeature /> */}
    </main>
  );
};

export default HomePage;
