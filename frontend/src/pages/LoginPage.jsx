import { Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
// import ByaparLogo from "../assets/byaparLogo.png";
import LoginImage from "../assets/Byapar.png";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { axiosInstance } from "../config/axios";
import OtpInputForm from "../components/OtpInputForm";
import { motion } from "framer-motion";
import CustomLoader from "../components/Loader";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState(false);
  const inputRef = useRef();

  const mutation = useMutation({
    mutationFn: async (email) => {
      const res = await axiosInstance.post("/user/login", { email });
      return res;
    },
    onSuccess: () => {
      setOtpInput(true);
    },
    onError: () => {
      inputRef.current.focus();
    },
  });

  const handleGoogleLogin = () => {
    window.location.href = "https://backend.byaparsetu.com/api/v1/user";
  };

  return (
    <>
      <main className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-white to-zinc-50">
        {/* Background Waves */}
        <div className="absolute bottom-0 w-full">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 590"
            xmlns="http://www.w3.org/2000/svg"
            className="transition duration-300 ease-in-out"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="5%" stopColor="#F78DA7" />
                <stop offset="95%" stopColor="#8ED1FC" />
              </linearGradient>
            </defs>
            <path
              d="M 0,600 L 0,150 C 152.13333333333333,171.06666666666666 304.26666666666665,192.13333333333335 455,180 C 605.7333333333333,167.86666666666665 755.0666666666666,122.53333333333333 919,112 C 1082.9333333333334,101.46666666666667 1261.4666666666667,125.73333333333333 1440,150 L 1440,600 L 0,600 Z"
              fill="url(#gradient)"
              fillOpacity="0.4"
            />
            <path
              d="M 0,600 L 0,350 C 156.2666666666667,352.79999999999995 312.5333333333334,355.59999999999997 479,368 C 645.4666666666666,380.40000000000003 822.1333333333332,402.4 984,401 C 1145.8666666666668,399.6 1292.9333333333334,374.8 1440,350 L 1440,600 L 0,600 Z"
              fill="url(#gradient)"
            />
          </svg>
        </div>

        {/* Main Card */}
        <div
          className="relative z-10 border border-zinc-200 bg-white/30 backdrop-blur-2xl 
    rounded-2xl w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] 
    grid grid-cols-1 md:grid-cols-2 items-center p-4 sm:p-6 md:p-8"
          style={{
            boxShadow:
              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
          }}
        >
          {/* Left Section */}
          <section className="flex flex-col justify-center w-full px-3 sm:px-6 md:px-8">
            <h1 className="font-semibold text-2xl sm:text-3xl md:text-4xl mt-4 flex items-center justify-between">
              Login / Register
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-400"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                <path d="M21 12h-13l3 -3" />
                <path d="M11 15l-3 -3" />
              </svg>
            </h1>

            <p className="text-sm sm:text-base mt-2 text-zinc-500">
              Please enter your email to continue
            </p>

            {/* Email Form */}
            <form className="w-full mt-6">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    mutation.mutate(email);
                  }
                }}
                className={`input input-md sm:input-lg w-full rounded-2xl ${
                  mutation.isError ? "input-error" : ""
                }`}
              />
              {mutation.isError && (
                <p className="text-xs text-error mt-2">
                  {mutation.error.response?.data?.err}
                </p>
              )}
            </form>

            {/* Submit */}
            <button
              onClick={() => mutation.mutate(email)}
              disabled={mutation.isPending}
              className={`btn w-full btn-md sm:btn-lg rounded-2xl mt-5 
          bg-[var(--primary-btn)] hover:bg-[var(--primary-btn)]/80 
          text-white border-none shadow-md ${
            mutation.isPending && "bg-neutral-content text-gray-700"
          }`}
            >
              {mutation.isPending ? (
                <CustomLoader text="Sending email..." />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-2"
                  >
                    <path d="M14.52 2a3.88 3.88 0 0 1 2.742 1.136l3.602 3.602a3.877 3.877 0 0 1 0 5.483l-2.643 2.643a3.88 3.88 0 0 1 -4.941 .452l-.105 -.078l-5.882 5.883a3 3 0 0 1 -1.68 .843h-1.172a2 2 0 0 1 -2 -2v-1.172a3 3 0 0 1 .879 -2.121l.414 -.414a1 1 0 0 1 .707 -.293h1v-1a1 1 0 0 1 .883 -.993h1v-1a1 1 0 0 1 .293 -.707l1.469 -1.469a3.9 3.9 0 0 1 -.678 -1.963a3.88 3.88 0 0 1 1.136 -2.742l2.643 -2.643a3.88 3.88 0 0 1 2.741 -1.136z" />
                  </svg>
                  Get OTP
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-xs text-zinc-500 my-6 w-full">
              <span className="h-px bg-zinc-300 w-full" />
              <p className="text-nowrap">or continue</p>
              <span className="h-px bg-zinc-300 w-full" />
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="btn w-full btn-md sm:btn-lg btn-neutral rounded-2xl shadow-md hover:bg-black/80"
            >
              <FcGoogle size={20} /> Log In with Google
            </button>
          </section>

          {/* Right Section (Hidden on small screens) */}
          <section className="hidden md:flex h-full justify-center items-center">
            <div className="rounded-lg overflow-hidden">
              <img
                src={LoginImage}
                alt="Login"
                className="w-80 h-auto object-cover"
                loading="lazy"
              />
            </div>
          </section>
        </div>

        {/* OTP Overlay */}
        {otpInput && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-20 flex items-center justify-center">
            <OtpInputForm email={email} setOtpInput={setOtpInput} />
          </div>
        )}
      </main>
    </>
  );
};

export default LoginPage;
