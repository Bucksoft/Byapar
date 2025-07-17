import { Loader, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaMoneyBillAlt } from "react-icons/fa";
import loginVector from "../assets/login.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../config/axios";
import OtpInputForm from "../components/OtpInputForm";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (email) => {
      const res = await axiosInstance.post("/user/login", { email });
      console.log("RESPONSE FROM BACKEND : ", res);
      return res;
    },
    onSuccess: () => {
      setOtpInput(true);
      navigate("/dashboard");
    },
  });
  return (
    <>
      <main className="h-screen flex flex-col sm:flex-row w-full mx-auto">
        <section className="bg-white h-full w-full sm:w-1/2 flex px-6 sm:px-24 justify-center flex-col">
          {/* logo */}
          <div className="flex flex-col items-center justify-center p-3">
            <h1 className="text-2xl text-blue-950 font-semibold flex items-center gap-3">
              <FaMoneyBillAlt size={30} />
              ByaPar
            </h1>
            <small className="font-medium text-center">
              Login into your account
            </small>
          </div>

          <div className="mt-6">
            <div className="flex flex-col">
              <label htmlFor="email" className="font-semibold mb-2">
                Email address
              </label>
              <div className="flex relative">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="text"
                  placeholder="Email"
                  className="input w-full"
                />
                <div className=" text-zinc-500 p-2 rounded-r-md absolute right-1 z-10">
                  <Mail />
                </div>
              </div>
            </div>

            {otpInput && (
              <div className="mt-5">
                <OtpInputForm email={email} />
              </div>
            )}

            <button
              onClick={() => mutation.mutate(email)}
              className="btn  btn-info mt-5 w-full"
            >
              {mutation.isPending ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin size-6" />
                </div>
              ) : (
                <>Get OTP</>
              )}
            </button>

            <div className="flex gap-3 text-zinc-400 mt-8 items-center justify-center">
              <div className="h-[0.9px] w-full bg-zinc-200" />
              <div>OR</div>
              <div className="h-[0.9px] w-full bg-zinc-200" />
            </div>

            <button className="btn bg-white text-black border-[#e5e5e5] w-full mt-7">
              <svg
                aria-label="Google logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path
                    fill="#34a853"
                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                  ></path>
                  <path
                    fill="#4285f4"
                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                  ></path>
                  <path
                    fill="#fbbc02"
                    d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                  ></path>
                  <path
                    fill="#ea4335"
                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                  ></path>
                </g>
              </svg>
              Login with Google
            </button>
          </div>
        </section>

        {/* Image - hidden on mobile, visible from sm+ */}
        <section className="hidden sm:flex items-center justify-center h-full w-1/2">
          <img src={loginVector} alt="loginVector" width={550} loading="lazy" />
        </section>
      </main>
    </>
  );
};

export default LoginPage;
