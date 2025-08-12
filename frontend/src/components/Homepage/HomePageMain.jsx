import mainpageimg from "../../assets/MainPageImg.png";
import { File, IndianRupee, Search } from "lucide-react";

const HomePageMain = () => {
  return (
    <section className="relative pt-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center text-4xl font-semibold">
          <p>
            Smart <span className="text-info">GST Billing</span> & Inventory
          </p>
          <p className=""> Management</p>
        </div>

        {/* search box */}
        <div className="flex items-center justify-center pt-5">
          <div className="relative w-2/4">
            <input
              type="text"
              placeholder="Search"
              className="input w-full rounded-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 z-5 ">
              <Search />
            </div>
          </div>
        </div>

        <div className="shadow-lg shadow-zinc-300  w-fit rounded-full px-5  text-black/60 bg-zinc-500/10 backdrop-blur-2xl mx-auto mt-5 space-x-8 flex items-center justify-center">
          <span>Popular : </span>
          <span>E-Invoicing</span>
          <span>|</span>
          <span>POS Billing</span>
          <span>|</span>
          <span>Expenses</span>
          <span>|</span>
          <span>CA Reports</span>
        </div>

        <div className="flex items-center justify-center">
          <img src={mainpageimg} alt="" className="w-[40%] z-100" />
        </div>
      </div>

      <div className="w-40 h-40 bg-rose-500/50 blur-3xl left-104 absolute bottom-40" />
      <div className="w-40 h-40 bg-purple-500/50 blur-3xl left-204 absolute bottom-80 z-10" />
      <div className="w-150 h-150 bg-zinc-200/20 border border-zinc-100 backdrop-blur-2xl absolute -bottom-60 shadow-lg shadow-purple-500/80 left-100  rounded-full " />
      <div className="w-130 h-130 bg-zinc-200/20 border border-zinc-100 backdrop-blur-2xl absolute -bottom-60 shadow-lg shadow-purple-500/80 left-110  rounded-full " />

      {/* rupess bubble */}
      <div className="absolute top-80 left-70 rounded-full rotate-[-15deg]">
        <div
          className="p-5 cursor-pointer text-white w-full rounded-[2rem] transition-all duration-250 ease-in-out shadow-lg"
          style={{
            boxShadow: `
      inset 0 4px 6px rgba(255, 255, 255, 0.15),
      inset 0 -4px 6px rgba(0, 0, 0, 0.5),
      0 10px 15px rgba(244, 63, 94, 0.4)
    `,
            background: `linear-gradient(to bottom, #f43f5e, #f43f5e)`,
          }}
        >
          <IndianRupee />
        </div>
      </div>

      {/* file bubble */}
      <div className="absolute top-80 right-70 rounded-full rotate-[15deg]">
        <div
          className="p-5 cursor-pointer text-white w-full rounded-[2rem] transition-all duration-250 ease-in-out shadow-lg"
          style={{
            boxShadow: `
        inset 0 4px 6px rgba(255, 255, 255, 0.15),
        inset 0 -4px 6px rgba(0, 0, 0, 0.5),
        0 10px 15px rgba(216, 180, 254, 0.5) /* purple-300 */
      `,
            background: `linear-gradient(to bottom, #d8b4fe, #d8b4fe)`, // purple-300
          }}
        >
          <File className="text-5xl" />
          {/* <FcRules className="text-5xl" /> */}
        </div>
      </div>

      <div className="avatar-group -space-x-6 absolute bottom-25 right-75">
        <div className="avatar">
          <div className="w-12">
            <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
          </div>
        </div>
        <div className="avatar">
          <div className="w-12">
            <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
          </div>
        </div>
        <div className="avatar">
          <div className="w-12">
            <img src="https://img.daisyui.com/images/profile/demo/averagebulk@192.webp" />
          </div>
        </div>
        <div className="avatar">
          <div className="w-12">
            <img src="https://img.daisyui.com/images/profile/demo/wonderperson@192.webp" />
          </div>
        </div>
      </div>

      <div className=" absolute bottom-15 right-60 text-xs font-bold">
        Creating and sending invoices is super{" "}
        <p>quick and professional-looking.</p>
      </div>
      <div className="border bottom-0 max-w-7xl  p-5 bg-black/90 mx-auto rounded-md z-500"></div>

      {/* <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        Streamline your business operations with automated GST calculations, intelligent inventory tracking, and professional bill generation. Built for Indian businesses.
      </p> */}
    </section>
  );
};

export default HomePageMain;
