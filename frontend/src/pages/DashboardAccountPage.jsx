import { MessageCircle } from "lucide-react";
import suggestion from "../assets/suggestion.png";
import personhandshake from "../assets/Personhandshake.png";
import truckwithinvoice from "../assets/TruckwithInvoice.png";
import phonesms from "../assets/phoneSMS.png";
import desktop from "../assets/Desktop.png";
import scanner from "../assets/scanner.png";
import warehouse from "../assets/Warehouse.png";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";
import CustomLoader from "../components/Loader";
import { useAuthStore } from "../store/authStore";

const DashboardAccountPage = () => {
  const [data, setData] = useState({
    name: "",
    contact: "",
    email: "",
  });
  const [err, setErr] = useState("");
  const { setUser } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.patch("/user/account", { data });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.msg);
      setUser(data.user);
    },
    onError: (err) => {
      setErr(err.response.data.errors);
    },
  });

  return (
    <main className="h-screen w-full relative flex">
      <section className="w-full p-2 bg-zinc-100">
        <div className=" shadow shadow-gray-200 h-full border border-zinc-200 rounded-md bg-white">
          <motion.div
            initial={{
              translateY: -100,
              opacity: 0,
            }}
            animate={{
              translateY: 0,
              opacity: 1,
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="flex justify-between border-b border-b-zinc-300 p-3 "
          >
            {/* navigation left side*/}
            <div className=" flex flex-col">
              <span className="text-md">Account Settings</span>
              <span className="text-[12px] text-zinc-400">
                Manage your account and subscription
              </span>
            </div>
            {/* navigation right side*/}
            <div className="flex items-center space-x-3 mr-5">
              <button
                className="btn btn-soft bg-[var(--primary-btn)] btn-sm"
                onClick={() => setChatOpen(!chatOpen)}
              >
                <MessageCircle size={16} />
                Chat Support
              </button>
              <button className="btn btn-soft btn-sm ">Cancel</button>

              <button
                onClick={() => mutation.mutate(data)}
                disabled={!data.name || !data.contact || !data.email}
                className={` ${
                  (!data.name || !data.contact || !data.email) &&
                  "bg-zinc-100 text-zinc-300 "
                }  btn bg-[var(--primary-btn)] btn-sm`}
              >
                {mutation.isPending ? (
                  <CustomLoader text="Saving..." />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{
              translateY: -100,
              opacity: 0,
            }}
            animate={{
              translateY: 0,
              opacity: 1,
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
              delay: 0.3,
            }}
            className="border-b  border-b-zinc-300 p-2 flex items-center justify-center bg-indigo-50"
          >
            <span className="font-semibold pr-4 ">
              Help us make Byapar better
            </span>
            <button className="btn bg-[var(--primary-btn)] btn-sm">
              <img src={suggestion} alt="" className="h-5 font-black" />
              <span className=""> Share Suggestion</span>
            </button>
          </motion.div>

          <div className="border-b border-b-zinc-300 pl-3 py-1 bg-gray-50">
            <span className="text-xs">General Information</span>
          </div>

          <motion.div
            initial={{
              translateY: -100,
              opacity: 0,
            }}
            animate={{
              translateY: 0,
              opacity: 1,
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
              delay: 0.5,
            }}
            className="border-b border-b-zinc-300 p-3 flex "
          >
            <form
              action=""
              className="flex items-center justify-between w-full"
            >
              <div className="flex flex-col w-full">
                <label htmlFor="name" className="text-xs pr-40">
                  Name
                </label>
                <input
                  type="text"
                  value={data.name}
                  name="name"
                  onChange={handleInputChange}
                  placeholder="Enter name"
                  className="input input-sm "
                />
                <small className="text-red-500 text-xs">
                  {err && err?.name?._errors[0]}
                </small>
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="number" className="text-xs pr-40">
                  Number
                </label>
                <input
                  type="number"
                  name="contact"
                  value={data.contact}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="input input-sm"
                />
                <small className="text-red-500 text-xs">
                  {err && err?.contact?._errors[0]}
                </small>
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="email" className="text-xs pr-40">
                  Email
                </label>
                <input
                  type="email"
                  value={data.email}
                  name="email"
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="input input-sm"
                />
                <small className="text-red-500">
                  {err && err?.email?._errors[0]}
                </small>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              filter: "0px",
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="border-b border-b-zinc-300 pl-3 py-1 bg-gray-50"
          >
            <span className="text-xs">
              Referral code for subscription discount
            </span>
          </motion.div>

          <div className="border-b border-b-zinc-300 p-3">
            <input
              type="text"
              placeholder="Type here referral code"
              className="input w-fit input-sm"
            />
            <button className="btn bg-[var(--primary-btn)] ml-5 px-15 btn-sm">
              Apply
            </button>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              filter: "0px",
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="border-b border-b-zinc-300 pl-3 py-1 bg-gray-50"
          >
            <span className="text-xs">Subscription Plan</span>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              filter: "0px",
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="grid grid-cols-2"
          >
            {/* left */}
            <div className="pt-5 pl-3">
              <p className="text-xs">CURRENT PLAN</p>
              <p className="text-xl pt-2 font-medium">Free Trial Expired</p>
              <button className="btn bg-[var(--primary-btn)] mt-15 btn-sm">
                Buy Subscription Plan
              </button>
              {/* avatar */}
              <div className="flex items-center">
                <div>
                  <div className="avatar-group -space-x-6 pt-5">
                    <div className="avatar ">
                      <div className="w-7">
                        <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
                      </div>
                    </div>
                    <div className="avatar">
                      <div className="w-7">
                        <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
                      </div>
                    </div>
                    <div className="avatar">
                      <div className="w-7">
                        <img src="https://img.daisyui.com/images/profile/demo/averagebulk@192.webp" />
                      </div>
                    </div>
                    <div className="avatar">
                      <div className="w-7">
                        <img src="https://img.daisyui.com/images/profile/demo/wonderperson@192.webp" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-5 pl-2 text-xs">
                  <p>10,00,000+ Vyaparis running their </p>
                  <p>business on ByaPar premium</p>
                </div>
              </div>
            </div>
            {/* right */}
            <div className="p-5">
              <p className="text-sm pb-3">
                Upgrade your plan today and get access to premium features:
              </p>
              <div className="grid grid-cols-2 bg-gray-100 pr-5 rounded-sm">
                {/* left icon */}
                <div className="px-3 py-1 text-sm">
                  <div className="flex items-center py-1">
                    <img
                      src={personhandshake}
                      alt=""
                      className="h-10 w-10 pr-2"
                    />
                    <span>Multi User and Staff Access</span>
                  </div>
                  <div className="flex items-center py-1">
                    <img
                      src={truckwithinvoice}
                      alt=""
                      className="h-10 w-10 pr-2"
                    />
                    <span>Way Bill Generation</span>
                  </div>
                  <div className="flex items-center py-1">
                    <img src={phonesms} alt="" className="h-10 w-10 pr-2" />
                    <span>SMS Marketing</span>
                  </div>
                </div>
                {/* right icon */}
                <div className="px-3 py-1 text-sm">
                  <div className="flex items-center py-1">
                    <img src={warehouse} alt="" className="h-10 w-10 pr-2" />
                    <span>Multiple Businesses</span>
                  </div>
                  <div className="flex items-center py-1">
                    <img src={desktop} alt="" className="h-10 w-10 pr-2" />
                    <span>Desktop App</span>
                  </div>
                  <div className="flex items-center py-1">
                    <img src={scanner} alt="" className="h-10 w-10 pr-2" />
                    <span>Scan & Print Barcode</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default DashboardAccountPage;
