import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useNavigate } from "react-router-dom";
import CustomLoader from "./Loader";

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
    <>
      {/* <input
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
        
      </button> */}
      <div className="bg-white shadow-lg w-1/4 p-5 rounded-lg">
        <h2 className="mb-3 font-semibold">Verify your OTP</h2>
        <input
          type="text"
          className="input input-sm"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <div className="flex items-center justify-end mt-5">
          <button className="btn btn-sm bg-success">
            {mutation.isPending ? (
              <>
                <CustomLoader text={"Loading......"} />
              </>
            ) : (
              <>Verify OTP</>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default OtpInputForm;
