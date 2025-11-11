import WhatsappLogo from "../assets/WhatsappLogo.png";
import Whatsapp_background from "../assets/Whatsapp_background.png";
import User from "../assets/user.png";
import Contact from "../assets/contact.png";
import Send from "../assets/send.png";
import { BsWhatsapp } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import CustomLoader from "../components/Loader";
import { MdWhatsapp } from "react-icons/md";
import { axiosInstance } from "../config/axios";
import { sendWhatsapp } from "../../helpers/sendWhatsapp";
import WhatsappProfileCard from "../components/WhatsappProfileCard";

const DashboardWhatsappPage = () => {
  const [connectionStatus, setConnectionStatus] = useState("");
  const [checkingConn, setCheckingConn] = useState(true);
  const [number, setNumber] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // generate qr code mutation
  const qrMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/sales-invoice/qr`);
      return res.data;
    },
  });

  // use Effect to check if logged in or not
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axiosInstance.get("/sales-invoice/whatsapp-status");
        if (res.data?.status === "qr") {
          setQrCode(res?.data.qr);
          setConnectionStatus("qr");
        } else if (res.data?.status === "connected") {
          clearInterval(interval);
          setConnectionStatus("connected");
        } else {
          setConnectionStatus("waiting");
        }

        setCheckingConn(false);
      } catch (error) {
        console.error("Error fetching WhatsApp status:", error);
        setCheckingConn(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // useEffect to get profile once whatsapp gets connected
  useEffect(() => {
    async function getWhatsappProfile() {
      try {
        setLoading(true);
        if (connectionStatus === "connected") {
          const res = await axiosInstance.get(
            "/sales-invoice/whatsapp-profile"
          );
          setProfile(res);
        }
      } catch (error) {
        console.log("error in fetching whatsapp profile", error);
      } finally {
        setLoading(false);
        document.getElementById("whatsapp_dialog").close();
      }
    }
    getWhatsappProfile();
  }, [connectionStatus]);

  return (
    <main className="h-screen w-full flex flex-col gap-2 items-center justify-start py-5">
      {/* Whatsapp Logo & heading */}
      <div className="flex flex-col items-center gap-1 mt-5">
        <img src={WhatsappLogo} alt="logo" width={40} />
        <h1 className="text-zinc-600 font-semibold">
          Seamless WhatsApp Integration with ByaparSetu — Instantly Share
          Invoices, Receipts & Updates
        </h1>
      </div>

      <img src={Whatsapp_background} alt="background" className="mt-1" />

      {/* Steps to integrate */}
      <div className="flex items-center justify-center my-12 gap-3 px-4 w-full">
        {/* Step 1 */}
        <div className="flex items-center gap-1">
          <img src={User} alt="user" width={80} />
          <div>
            <h2 className="text-zinc-500 font-semibold">Step 1</h2>
            <p>Connect your Whatsapp account.</p>
          </div>
        </div>
        <div className="h-[0.5px] w-1/9 bg-zinc-200 " />
        {/* Step 2 */}
        <div className="flex items-center gap-1">
          <img src={Contact} alt="user" width={80} />
          <div>
            <h2 className="text-zinc-500 font-semibold">Step 2</h2>
            <p>Add your contacts number.</p>
          </div>
        </div>
        <div className="h-[0.5px] w-1/9 bg-zinc-200 " />
        {/* Step 3 */}
        <div className="flex items-center gap-1">
          <img src={Send} alt="user" width={80} />
          <div>
            <h2 className="text-zinc-500 font-semibold">Step 3</h2>
            <p>Send your invoice.</p>
          </div>
        </div>
      </div>

      {/* {connectionStatus === "connected" && (
        <button className="btn btn-info rounded-full shadow-lg shadow-sky-600 text-white hover:shadow-none  hover:text-white">
          <BsWhatsapp /> Whatsapp Linked
        </button>
      )} */}

      {checkingConn ? (
        <div>
          <CustomLoader text={"Loading profile..."} />
        </div>
      ) : (
        profile && (
          <div className="mb-2">
            <WhatsappProfileCard profile={profile?.data} />
          </div>
        )
      )}

      {connectionStatus === "waiting" && (
        <button
          onClick={() => document.getElementById("whatsapp_dialog").showModal()}
          className="btn btn-info rounded-full shadow-lg shadow-sky-600 text-white hover:shadow-none  hover:text-white"
        >
          <BsWhatsapp /> Link My Whatsapp
        </button>
      )}

      {/* MODAL TO DISPLAY QR CODE */}
      <dialog id="whatsapp_dialog" className="modal">
        {checkingConn && (
          <div className="modal-box rounded-2xl flex items-center justify-center ">
            <CustomLoader text={"Checking connection..."} />
          </div>
        )}

        <div className="modal-box rounded-2xl">
          <h3 className="font-bold text-xl text-center mb-3 text-green-600">
            Link Your WhatsApp
          </h3>

          <p className="text-center text-sm text-gray-600 mb-4">
            To send invoices directly on WhatsApp, please connect your WhatsApp
            account. A QR code will appear after clicking the button below.
          </p>

          <div className="flex flex-col items-center gap-4">
            {qrMutation.isSuccess ? (
              <img src={qrMutation.data?.qr} alt="qr" />
            ) : (
              <button
                className="btn bg-green-500 hover:bg-green-600 text-white w-full rounded-xl"
                onClick={() => qrMutation.mutate()}
              >
                {qrMutation.isPending ? (
                  <CustomLoader text={"Generating QR..."} />
                ) : (
                  <>
                    <MdWhatsapp size={15} />
                    Link WhatsApp
                  </>
                )}
              </button>
            )}

            <p className="text-xs text-gray-500 text-center px-4">
              Make sure your WhatsApp Web session is active on your phone to
              complete the connection.
            </p>
          </div>

          <div className="modal-action mt-4 justify-center">
            <button
              className="btn btn-sm btn-ghost rounded-xl"
              onClick={() => document.getElementById("whatsapp_dialog").close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </main>
  );
};

export default DashboardWhatsappPage;
