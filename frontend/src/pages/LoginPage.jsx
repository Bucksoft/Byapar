import { Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import ByaparLogo from "../assets/Byapar.png";
import LoginImage from "../assets/Login_image.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { axiosInstance } from "../config/axios";
import OtpInputForm from "../components/OtpInputForm";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CustomLoader from "../components/Loader";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState(false);
  const inputRef = useRef();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (email) => {
      const res = await axiosInstance.post("/user/login", { email });
      return res;
    },
    onSuccess: () => {
      setOtpInput(true);
      toast.success("Logged In");
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
      <main className="h-screen w-full md:p-16 bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] grid md:place-items-center relative">
        <div className="border md:w-3/4  flex items-center justify-center border-white/10 bg-[var(--login-background)] backdrop-blur-3xl h-full md:rounded-xl shadow-lg overflow-hidden">
          {/* left section */}
          <section className="md:w-1/2  h-full flex flex-col items-center mt-32 justify-start">
            <div className="flex flex-col ">
              {/* <img
                src={ByaparLogo}
                alt="Byapar_logo"
                width={200}
                className="mb-16 -ml-10"
              /> */}

              <h1 className="font-semibold text-xl">Login / Register</h1>
              <span className="text-sm">
                Please enter your email down below
              </span>
              <div className="relative">
                <input
                  type="text"
                  ref={inputRef}
                  className={`input mt-8  ${
                    mutation.isError && "input-error"
                  } `}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {mutation.isError && (
                  <p className="text-xs text-error mt-3">
                    {mutation.error.response?.data?.err}
                  </p>
                )}
                <Mail
                  className="absolute right-3 top-11 text-zinc-500"
                  size={15}
                />
              </div>
              <button
                onClick={() => mutation.mutate(email)}
                className={`btn mt-5 bg-[var(--primary-btn)] ${
                  mutation.isPending && "bg-neutral-content"
                }`}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <CustomLoader text={"Sending email ....."} />
                ) : (
                  <>Get OTP</>
                )}
              </button>

              <div className="flex text-xs text-zinc-500 items-center gap-3 my-5">
                <span className="h-[1px] bg-zinc-400 w-full" />
                <p className="text-nowrap">or continue</p>
                <span className="h-[1px] bg-zinc-400 w-full" />
              </div>

              <button onClick={handleGoogleLogin} className="btn btn-neutral">
                <FcGoogle size={20} /> Log In with Google
              </button>
            </div>
          </section>

          {/* right section */}
          <section className=" md:flex hidden w-1/2 h-full p-3  justify-end">
            <div className="rounded-lg overflow-hidden">
              <img src={LoginImage} alt="Login_image" width={390} />
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
            className="absolute h-screen w-full bg-black/80 backdrop-blur-md flex items-center justify-center"
          >
            <OtpInputForm email={email} />
          </motion.div>
        )}
      </main>
    </>
  );
};

export default LoginPage;
