import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const OtpInputForm = ({ email }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const mutation = useMutation({
    mutationFn: async ({ otp }) => {
      const res = await axiosInstance.post("/user/verify-otp", { otp, email });
      console.log("OTP INPUT FORM RESPONSE", res);
      return res;
    },
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  return (
    <main className="flex">
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter your OTP"
        className="outline-0 w-full p-2 bg-zinc-200 rounded-tl-md rounded-bl-md shadow-md"
      />

      <button
        onClick={() => mutation.mutate({ otp })}
        className="bg-[var(--primary-btn-dark)] cursor-pointer text-white p-2 rounded-tr-md rounded-br-md shadow-md"
      >
        {mutation.isPending ? (
          <>
            <Loader className="size-4 animate-spin" />
          </>
        ) : (
          <>Verify</>
        )}
      </button>
    </main>
  );
};

export default OtpInputForm;
