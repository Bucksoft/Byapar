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
    window.location.href = "http://localhost:8000/api/v1/user";
  };

  return (
    <>
      <main className="h-screen w-full flex items-center justify-center">
        <div className="absolute bottom-0 w-full ">
          <svg
            width="100%"
            height="100%"
            id="svg"
            viewBox="0 0 1440 590"
            xmlns="http://www.w3.org/2000/svg"
            class="transition duration-300 ease-in-out delay-150"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="5%" stop-color="#F78DA7"></stop>
                <stop offset="95%" stop-color="#8ED1FC"></stop>
              </linearGradient>
            </defs>
            <path
              d="M 0,600 L 0,150 C 152.13333333333333,171.06666666666666 304.26666666666665,192.13333333333335 455,180 C 605.7333333333333,167.86666666666665 755.0666666666666,122.53333333333333 919,112 C 1082.9333333333334,101.46666666666667 1261.4666666666667,125.73333333333333 1440,150 L 1440,600 L 0,600 Z"
              stroke="none"
              stroke-width="0"
              fill="url(#gradient)"
              fill-opacity="0.53"
              class="transition-all duration-300 ease-in-out delay-150 path-0"
            ></path>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="5%" stop-color="#F78DA7"></stop>
                <stop offset="95%" stop-color="#8ED1FC"></stop>
              </linearGradient>
            </defs>
            <path
              d="M 0,600 L 0,350 C 156.2666666666667,352.79999999999995 312.5333333333334,355.59999999999997 479,368 C 645.4666666666666,380.40000000000003 822.1333333333332,402.4 984,401 C 1145.8666666666668,399.6 1292.9333333333334,374.8 1440,350 L 1440,600 L 0,600 Z"
              stroke="none"
              stroke-width="0"
              fill="url(#gradient)"
              fill-opacity="1"
              class="transition-all duration-300 ease-in-out delay-150 path-1"
            ></path>
          </svg>
        </div>

        <div
          style={{
            boxShadow:
              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
          }}
          className="border relative z-10 p-2 border-zinc-200 bg-white/10 backdrop-blur-3xl rounded-xl w-3/5 grid grid-cols-2 items-center"
        >
          {/* left section */}
          <section className="flex items-start mt-16 h-full px-10 flex-col ">
            {/* <img
              src={""}
              alt="Byapar_logo"
              width={100}
              className="mb-8"
              loading="lazy"
            /> */}

            <h1 className="font-semibold text-4xl mt-8 flex justify-between w-full items-center">
              Login / Register
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="text-zinc-300 icon icon-tabler icons-tabler-outline icon-tabler-login"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                <path d="M21 12h-13l3 -3" />
                <path d="M11 15l-3 -3" />
              </svg>
            </h1>
            <span className="text-md mt-2 text-zinc-500">
              Please enter your email
            </span>
            <div className=" w-full ">
              <input
                type="text"
                ref={inputRef}
                className={`input input-lg w-full mt-8 rounded-2xl  ${
                  mutation.isError && "input-error"
                } x`}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    mutation.mutate(email);
                  }
                }}
              />
              {mutation.isError && (
                <p className="text-xs text-error mt-3">
                  {mutation.error.response?.data?.err}
                </p>
              )}
              {/* <Mail
                className="absolute right-15 top-12 text-zinc-500"
                size={15}
              /> */}
            </div>
            {mutation.isError && (
              <p className="text-xs text-error mt-3">
                {mutation.error.response?.data?.err}
              </p>
            )}
            <button
              onClick={() => mutation.mutate(email)}
              className={`btn rounded-2xl shadow-md border-b-2 inset-shadow-[0px_4px_2px_rgba(0,0,0,0.2)] btn-lg mt-5 bg-[var(--primary-btn)] hover:bg-[var(--primary-btn)]/80 w-full shadow-zinc-300 ${
                mutation.isPending && "bg-neutral-content"
              }`}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <CustomLoader text={"Sending email ....."} />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="icon icon-tabler icons-tabler-filled icon-tabler-key"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M14.52 2c1.029 0 2.015 .409 2.742 1.136l3.602 3.602a3.877 3.877 0 0 1 0 5.483l-2.643 2.643a3.88 3.88 0 0 1 -4.941 .452l-.105 -.078l-5.882 5.883a3 3 0 0 1 -1.68 .843l-.22 .027l-.221 .009h-1.172c-1.014 0 -1.867 -.759 -1.991 -1.823l-.009 -.177v-1.172c0 -.704 .248 -1.386 .73 -1.96l.149 -.161l.414 -.414a1 1 0 0 1 .707 -.293h1v-1a1 1 0 0 1 .883 -.993l.117 -.007h1v-1a1 1 0 0 1 .206 -.608l.087 -.1l1.468 -1.469l-.076 -.103a3.9 3.9 0 0 1 -.678 -1.963l-.007 -.236c0 -1.029 .409 -2.015 1.136 -2.742l2.643 -2.643a3.88 3.88 0 0 1 2.741 -1.136m.495 5h-.02a2 2 0 1 0 0 4h.02a2 2 0 1 0 0 -4" />
                  </svg>{" "}
                  Get OTP
                </>
              )}
            </button>

            <div className="flex text-xs text-zinc-500 items-center gap-3 my-5 w-full">
              <span className="h-[1px] bg-zinc-200 w-full" />
              <p className="text-nowrap">or continue</p>
              <span className="h-[1px] bg-zinc-200 w-full" />
            </div>

            <button
              onClick={handleGoogleLogin}
              className="btn w-full btn-lg btn-neutral rounded-2xl shadow-md inset-shadow-[0px_4px_2px_rgba(255,255,255,0.2)] shadow-zinc-700 hover:bg-black/80"
            >
              <FcGoogle size={20} /> Log In with Google
            </button>
          </section>

          {/* right section */}
          <section className=" md:flex hidden h-full p-3 justify-end">
            <div className="rounded-lg overflow-hidden">
              <img
                src={LoginImage}
                alt="Login_image"
                width={390}
                loading="lazy"
              />
            </div>
          </section>
        </div>

        {/* OTP INPUT FORM IS DISPLAYED HERE */}
        {otpInput && (
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
            className="absolute h-screen w-full bg-black/70 backdrop-blur-md z-20 flex items-center justify-center"
          >
            <OtpInputForm email={email} />
          </motion.div>
        )}
      </main>
    </>
  );
};

export default LoginPage;
