import { states } from "../../utils/constants";
import { LuImagePlus } from "react-icons/lu";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../main";
import { MdOutlineCalendarToday } from "react-icons/md";
import { axiosInstance } from "../../config/axios";
import CustomLoader from "../Loader";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";

const BusinessForm = () => {
  const [additionalInformation, setAdditionalInformation] = useState([{}]);
  const [additionalInfoKey, setAdditionalInfoKey] = useState("");
  const [additionalInfoValue, setAdditionalInfoValue] = useState("");
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
  const [logo, setLogo] = useState(null);
  const [signature, setSignature] = useState(null);

  const [data, setData] = useState({
    businessName: "",
    businessType: "",
    industryType: "",
    companyPhoneNo: "",
    businessRegType: "",
    companyEmail: "",
    billingAddress: "",
    state: "",
    city: "",
    gstRegistered: "no",
    gstNumber: "",
    panNumber: "",
    TDS: false,
    TCS: false,
    pincode: "",
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    console.log("logo FILE ", file);
    if (!file) return;
    setLogo(file);
    const url = URL.createObjectURL(file);
    setLogoPreviewUrl(url);
    e.target.value = null;
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (!file) return;
    setSignature(file);
    e.target.value = null;
  };

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    };
  }, [logoPreviewUrl]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosInstance.post("/business", formData);
      return res.data.business;
    },
    onSuccess: () => {
      toast.success("Business created");
      queryClient.invalidateQueries({ queryKey: ["business"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || err.response?.data?.err);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (logo) formData.append("logo", logo);
    if (signature) formData.append("signature", signature);

    if (additionalInformation.length > 0) {
      formData.append(
        "additionalInformation",
        JSON.stringify(additionalInformation)
      );
    }

    mutation.mutate(formData);
  };

  return (
    <>
      <motion.header
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
        className="flex items-center  p-2 justify-between border-b border-gray-300"
      >
        <div className="flex items-center justify-center gap-5  mr-4">
          <div className="flex ml-3 flex-col ">
            <p className="text-md font-normal">Business Settings</p>
            <p className=" text-sm text-gray-500">
              Edit your company settings and information
            </p>
          </div>
          <button className="btn btn-sm bg-[var(--secondary-btn)]">
            Create New Business
          </button>
        </div>

        <div className="flex items-center justify-center mr-3 gap-4 ">
          {/* <p className="text-gray-500 cursor-pointer">
                    <MdKeyboard size={25} />
                  </p> */}
          {/* <button className="btn btn-sm  ">
                    <RiChat1Line size={14} />
                    Chat Support
                  </button> */}
          <button className="btn btn-sm  bg-[var(--primary-btn)]">
            <MdOutlineCalendarToday size={14} />
            Close Financial Year
          </button>
          <button className="btn btn-sm ">Cancel</button>
          <button
            onClick={() => mutation.mutate(data)}
            disabled={mutation.isPending}
            className="btn btn-sm bg-[var(--primary-btn)]"
          >
            {mutation.isPending ? (
              <CustomLoader text={"Saving..."} />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </motion.header>

      <form
        onSubmit={handleSubmit}
        className="min-h-screen  grid grid-cols-2 gap-2"
      >
        {/* left  */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.3,
          }}
          className="flex flex-col  p-4 mt-1 ml-2"
        >
          <div className="flex gap-7 mb-4">
            <motion.label
              initial={{
                filter: "blur(10px)",
                opacity: 0,
              }}
              animate={{
                filter: "blur(0px)",
                opacity: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
                delay: 0.3,
              }}
              htmlFor="logo"
              className="border flex-col items-center justify-center bg-[#F6F9FF] border-blue-500 flex border-dashed  cursor-pointer p-5 text-xs gap-2"
            >
              {logoPreviewUrl ? (
                <img src={logoPreviewUrl} size={100} />
              ) : (
                <>
                  <LuImagePlus size={20} className="text-blue-500" />
                  <span className="text-nowrap text-blue-500 font-semibold">
                    Upload Logo
                  </span>
                  <small className="text-nowrap">JPG/PNG, max-5MB</small>
                </>
              )}
            </motion.label>
            <input
              type="file"
              id="logo"
              name="logo"
              className="hidden"
              onClick={handleLogoChange}
            />
            <div className="flex ml-3 flex-col gap-2 justify-center  w-full">
              <p className="text-[13px]  text-gray-500">
                Business Name<span className="text-red-600">*</span>
              </p>
              <input
                type="text"
                name="businessName"
                value={data.businessName}
                onChange={handleInputChange}
                placeholder="Business Name"
                className="input input-sm"
              />
              <small className="text-xs text-[var(--error-text-color)] ">
                {
                  mutation.error?.response?.data?.validationError?.businessName
                    ?._errors[0]
                }
              </small>
            </div>
          </div>
          <div className="flex gap-5 mb-4 items-center justify-between">
            <div className="flex  flex-col gap-2 justify-center  w-full">
              <p className="text-[13px]  text-gray-500">Phone number</p>
              <input
                type="number"
                name="companyPhoneNo"
                value={data.companyPhoneNo}
                onChange={handleInputChange}
                placeholder="Enter Company Phone Number"
                className="input input-sm"
              />
              <small className="text-xs text-[var(--error-text-color)] ">
                {
                  mutation.error?.response?.data?.validationError
                    ?.companyPhoneNo?._errors[0]
                }
              </small>
            </div>
            <div className="flex ml-3 flex-col gap-2 justify-center  w-full">
              <p className="text-[13px]  text-gray-500">Company Email</p>
              <input
                type="text"
                name="companyEmail"
                value={data.companyEmail}
                onChange={handleInputChange}
                placeholder="Enter Company Email"
                className="input input-sm"
              />
              <small className="text-xs text-[var(--error-text-color)] ">
                {
                  mutation.error?.response?.data?.validationError?.companyEmail
                    ?._errors[0]
                }
              </small>
            </div>
          </div>
          <div className="flex flex-col mb-4 ">
            <p className="text-[13px]  text-gray-500 mb-2">Billing Address</p>
            <textarea
              name="billingAddress"
              value={data.billingAddress}
              onChange={handleInputChange}
              placeholder="Enter Billing Address"
              className="textarea w-full"
            />
            <small className="text-xs text-[var(--error-text-color)] ">
              {
                mutation.error?.response?.data?.validationError?.billingAddress
                  ?._errors[0]
              }
            </small>
          </div>

          <div className=" flex gap-5 mb-4 items-center justify-between">
            <div className="w-full flex flex-col  justify-between">
              <p className="text-[13px]  text-gray-500 ">State</p>
              <fieldset className="fieldset mt-2">
                <select
                  name="state"
                  value={data.state}
                  disabled={mutation?.isPending}
                  onChange={handleInputChange}
                  className="select select-sm "
                >
                  {states?.map((state) => (
                    <option disabled={state === "Enter state"}>{state}</option>
                  ))}
                </select>
              </fieldset>
              <small className="text-xs text-[var(--error-text-color)] ">
                {
                  mutation.error?.response?.data?.validationError?.state
                    ?._errors[0]
                }
              </small>
            </div>
            <div className="flex ml-3 flex-col gap-2 justify-center  w-full">
              <p className="text-[13px]  text-gray-500">PIN Code</p>
              <input
                type="text"
                placeholder="Enter PIN Code"
                className="input input-sm"
                name="pincode"
                value={data.pincode}
                disabled={mutation?.isPending}
                onChange={handleInputChange}
              />
              <small className="text-xs text-[var(--error-text-color)] ">
                {
                  mutation.error?.response?.data?.validationError?.pincode
                    ?._errors[0]
                }
              </small>
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-center  w-full">
            <p className="text-[13px]  text-gray-500">City</p>
            <input
              type="text"
              name="city"
              value={data.city}
              disabled={mutation?.isPending}
              onChange={handleInputChange}
              placeholder="Enter City"
              className="input input-sm"
            />
            <small className="text-xs text-[var(--error-text-color)] ">
              {
                mutation.error?.response?.data?.validationError?.city
                  ?._errors[0]
              }
            </small>
          </div>

          <div className="w-full mt-5 flex relative flex-col">
            <p className="text-[13px]  text-gray-500 mb-2">
              Are you GST Registered?
            </p>
            <div className="flex   ">
              <div className="flex items-center gap-2 w-3/4 justify-between">
                <label className="text-xs font-semibold cursor-pointer flex items-center hover:bg-gray-100 justify-between border w-1/2 p-2 border-gray-300 rounded hover:border-[var(--primary-btn)]">
                  Yes
                  <input
                    type="radio"
                    name="gstRegistered"
                    value="yes"
                    disabled={mutation?.isPending}
                    onChange={handleInputChange}
                    className="radio radio-[var(--primary-btn)] radio-sm"
                    checked={data.gstRegistered === "yes"}
                  />
                </label>

                <label className="text-xs font-semibold cursor-pointer hover:bg-gray-100 w-1/2 p-2 flex items-center justify-between border border-gray-300 rounded hover:border-[var(--primary-btn)]">
                  No
                  <input
                    type="radio"
                    name="gstRegistered"
                    value="no"
                    disabled={mutation?.isPending}
                    onChange={handleInputChange}
                    className="radio radio-[var(--primary-btn)] radio-sm"
                    checked={data.gstRegistered === "no"}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-center mt-3 w-full">
            <p className="text-[13px] text-gray-500">
              GSTIN<span className="text-red-600">*</span>
            </p>
            <input
              type="text"
              name="gstNumber"
              value={data.gstNumber}
              disabled={mutation?.isPending}
              onChange={handleInputChange}
              placeholder="Enter your GST number"
              className="input input-sm"
            />
            <small className="text-xs text-[var(--error-text-color)] ">
              {
                mutation.error?.response?.data?.validationError?.gstNumber
                  ?._errors[0]
              }
            </small>
          </div>

          <div className=" font-semibold mt-3 base flex items-center justify-between w-full p-[5.8px] px-3 text-xs border border-gray-300  rounded text-purple-300">
            Enable e-Invoicing
            <input
              type="checkbox"
              defaultChecked
              className="toggle toggle-sm "
            />
          </div>

          <div className="w-full flex flex-col mb-3 mt-3 justify-between">
            <p className="text-[13px]  text-gray-500 mb-2">PAN Nummber</p>
            <input
              type="text"
              name="panNumber"
              value={data.panNumber}
              disabled={mutation?.isPending}
              onChange={handleInputChange}
              placeholder="Enter PAN number"
              className="input input-sm"
            />
            <small className="text-xs text-[var(--error-text-color)] ">
              {
                mutation.error?.response?.data?.validationError?.panNumber
                  ?._errors[0]
              }
            </small>
          </div>

          <div className="w-full text-sm mt-2 mb-5 flex items-center justify-between">
            Enable TDS
            <input
              type="checkbox"
              name="TDS"
              checked={data.TDS}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  TDS: e.target.checked,
                }))
              }
              className="toggle toggle-sm"
            />
          </div>

          <div className="w-full text-sm mt-2 mb-5 flex items-center justify-between">
            Enable TCS
            <input
              type="checkbox"
              name="TCS"
              checked={data.TCS}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  TCS: e.target.checked,
                }))
              }
              className="toggle toggle-sm"
            />
          </div>
        </motion.div>

        {/* right */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.3,
          }}
          className=" flex flex-col p-4 mt-1 mb-2"
        >
          <div className="flex gap-5 mb-4 items-center justify-between">
            <div className="w-1/2 flex flex-col  justify-between">
              <p className="text-[13px]  text-gray-600 mb-2">
                Business Type (Select multiple, if applicable)
              </p>
              <select
                name="businessType"
                value={data.businessType}
                disabled={mutation?.isPending}
                onChange={handleInputChange}
                className="select select-sm "
              >
                <option>Retailer</option>
                <option>Wholesaler</option>
                <option>Distributor</option>
                <option>Manufacturer</option>
                <option>Services</option>
              </select>
              <small className="text-xs text-[var(--error-text-color)] ">
                {
                  mutation.error?.response?.data?.validationError?.businessType
                    ?._errors[0]
                }
              </small>
            </div>
            <div className="w-1/2 flex flex-col justify-between">
              <p className="text-[13px]  text-gray-600 mb-2">Industry Type</p>
              <select
                name="industryType"
                value={data.industryType}
                disabled={mutation?.isPending}
                onChange={handleInputChange}
                className="select select-sm mt-[15.5px]"
              >
                <option>Accounting and Financial Services</option>
                <option>Agriculture</option>
                <option>Automobile</option>
                <option>Battery</option>
                <option>Boardband/ cable/ internet</option>
                <option>Building Material and Construction</option>
                <option>Cleaning and pest Control</option>
              </select>
              <small className="text-xs text-[var(--error-text-color)] ">
                {
                  mutation.error?.response?.data?.validationError?.industryType
                    ?._errors[0]
                }
              </small>
            </div>
          </div>

          <div className="w-1/2 flex flex-col  justify-between">
            <p className="text-[13px]  text-gray-600 mb-2">
              Business Registration Type{" "}
            </p>
            <select
              name="businessRegType"
              value={data.businessRegType}
              disabled={mutation?.isPending}
              onChange={handleInputChange}
              className="select select-sm "
            >
              <option>Private Limited Company</option>
              <option>Public Limited Company</option>
              <option>Partnerships Films</option>
              <option>Limited Liability Partnership</option>
              <option>One Person Company</option>
              <option>Sole Proprietorship</option>
              <option>Section 8 Company</option>
              <option>Business Not Registered</option>
            </select>
            <small className="text-xs text-[var(--error-text-color)] ">
              {
                mutation.error?.response?.data?.validationError?.businessRegType
                  ?._errors[0]
              }
            </small>
          </div>

          <div className="flex items-center py-2 my-3 justify-center bg-[#F8F9FC]">
            <p className="text-xs font-bold">Note: </p>
            <p className="text-xs text-gray-600">
              Terms & Conditions and Signature added below will be shown on your
              Invoices
            </p>
          </div>

          <p className="text-[13px] text-gray-500">Signature</p>
          <div className="flex items-center justify-between py-2">
            <label
              htmlFor="signature"
              className="border border-dashed p-11 text-xs border-blue-500 text-blue-500 cursor-pointer"
            >
              + Add Signature
            </label>
            <input
              id="signature"
              name="signature"
              type="file"
              onChange={handleSignatureChange}
              className="hidden"
            />
          </div>

          <div className="border rounded mt-2 border-gray-300">
            <div className="py-3 border-b border-gray-300">
              <p className="text-xs ml-5 text-gray-500">Add Business Details</p>
              <p className="text-[12px] ml-5 text-gray-500 ">
                Add additional business information such as MSME number, Website
                etc.
              </p>
            </div>
            <div className="p-3 flex items-center ">
              <input
                type="text"
                placeholder="Websites"
                className="input input-sm "
                value={additionalInfoKey}
                onChange={(e) => setAdditionalInfoKey(e.target.value)}
              />
              <p className="px-3 text-gray-500">=</p>
              <input
                type="text"
                placeholder=" www.websites.com"
                className="input input-sm  "
                value={additionalInfoValue}
                onChange={(e) => setAdditionalInfoValue(e.target.value)}
              />
              <button
                onClick={() =>
                  setAdditionalInformation((prev) => [
                    ...prev,
                    {
                      key: additionalInfoKey,
                      value: additionalInfoValue,
                    },
                  ])
                }
                className="btn btn-sm bg-[var(--primary-btn)] ml-3"
              >
                Add
              </button>
            </div>
            {additionalInformation.length > 0 &&
              additionalInformation.map((info, index) => (
                <div
                  key={index}
                  className="px-4 py-2 text-sm flex items-center justify-between"
                >
                  <div>
                    <h3>{info?.key}</h3>
                    <span className="text-zinc-500">{info?.value}</span>
                  </div>
                  <Trash
                    size={15}
                    className="text-[var(--error-text-color)] cursor-pointer"
                  />
                </div>
              ))}
          </div>
        </motion.div>
      </form>
    </>
  );
};

export default BusinessForm;
