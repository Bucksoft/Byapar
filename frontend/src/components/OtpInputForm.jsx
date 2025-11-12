import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useNavigate } from "react-router-dom";
import CustomLoader from "./Loader";
import toast from "react-hot-toast";
import { BsFillShieldLockFill } from "react-icons/bs";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";

const OtpInputForm = ({ email, setOtpInput }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const { setUser } = useAuthStore();
  const [timerLeft, setTimerLeft] = useState(600);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }

    if (e.key === "Enter") {
      mutation.mutate(otp);
    }
  };

  const mutation = useMutation({
    mutationFn: async (otp) => {
      otp = otp.join("");
      const res = await axiosInstance.post("/user/verify-otp", { otp, email });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.status === "Success") {
        navigate("/dashboard");
      }
      setUser(data.user);
      toast.success("logged In successfully");
    },
  });

  const resendOTPmutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/user/resend-otp", { email });
    },
    onSuccess: (data) => {
      toast.success("OTP sent successfully");
      setTimerLeft(60);
    },
  });

  useEffect(() => {
    if (timerLeft <= 0) {
      setOtp(["", "", "", "", "", ""]);
      return;
    }

    const timer = setInterval(() => {
      setTimerLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timerLeft]);

  return (
    <>
      <motion.main
        initial={{
          rotateY: -90,
          opacity: 0,
        }}
        animate={{
          rotateY: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeInOut",
          duration: 0.3,
        }}
        className="py-10 px-8 bg-white border border-white rounded-4xl flex items-center justify-center flex-col"
      >
        <div className="bg-[var(--secondary-btn)] p-3 rounded-full border border-green-800">
          <BsFillShieldLockFill size={30} />
        </div>
        <h1 className="mt-2 font-bold text-xl">Enter Code</h1>
        <small className="text-zinc-500 mb-6">
          We have sent OTP code to your email address
        </small>
        <div className="flex items-center gap-2 mb-2">
          {otp?.length > 0 &&
            otp?.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-10 text-center border border-gray-300 rounded-md text-lg font-semibold focus:outline-none focus:border-success"
              />
            ))}
        </div>
        {mutation.isError && (
          <p className="text-xs text-red-500">
            {mutation.error.response.data.err}
          </p>
        )}

        <div className="my-2 text-xs text-gray-600">
          <p>
            OTP will expire in{" "}
            <span className="font-semibold ">
              {formatTime(timerLeft)}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-1 w-full my-4">
          {timerLeft === 0 ? (
            <button
              onClick={() => resendOTPmutation.mutate()}
              className="btn w-1/2 rounded-3xl btn-xs bg-success shadow-md py-4 hover:bg-success/80 "
            >
              {mutation.isPending ? (
                <>
                  <CustomLoader text={"Loading......"} />
                </>
              ) : (
                <>Resend OTP</>
              )}
            </button>
          ) : (
            <button
              onClick={() => mutation.mutate(otp)}
              className="btn rounded-3xl btn-xs bg-success py-4 w-1/2 shadow-md hover:bg-success/80 "
            >
              {mutation.isPending ? (
                <>
                  <CustomLoader text={"Loading......"} />
                </>
              ) : (
                <>Verify email</>
              )}
            </button>
          )}

          <button
            onClick={() => setOtpInput(false)}
            className="btn w-1/2 rounded-3xl btn-xs border shadow-md  text-zinc-500 border-zinc-500/30 py-4  hover:bg-zinc-500/10 hover:text-zinc-500 bg-transparent"
          >
            Close
          </button>
        </div>
      </motion.main>
    </>
  );
};

export default OtpInputForm;
