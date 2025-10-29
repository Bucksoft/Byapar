import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useNavigate } from "react-router-dom";
import CustomLoader from "./Loader";
import toast from "react-hot-toast";
import { BsFillShieldLockFill } from "react-icons/bs";
import { useAuthStore } from "../store/authStore";

const OtpInputForm = ({ email }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const { setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (otp) => {
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

  return (
    <>
      <main className="py-10 px-8 bg-white/80 border border-white rounded-4xl flex items-center justify-center  flex-col">
        <div className="bg-[var(--secondary-btn)] p-3 rounded-full border border-green-800">
          <BsFillShieldLockFill size={30} />
        </div>
        <h1 className="mt-2 font-bold text-xl">Enter Code</h1>
        <small className="text-zinc-500 mb-6">
          We have sent OTP code to your email address
        </small>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          placeholder="OTP"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              mutation.mutate(otp);
            }
          }}
          className="input input-sm mt-2 bg-zinc-100 rounded-full"
        />

        {mutation.isError && (
          <p className="text-xs text-red-500">
            {mutation.error.response.data.err}
          </p>
        )}

        <button
          onClick={() => mutation.mutate(otp)}
          className="btn rounded-xl btn-sm rounded-full bg-success mt-5 py-5 w-full hover:bg-success/80 "
        >
          {mutation.isPending ? (
            <>
              <CustomLoader text={"Loading......"} />
            </>
          ) : (
            <>Verify email</>
          )}
        </button>
      </main>
    </>
  );
};

export default OtpInputForm;
