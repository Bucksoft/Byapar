import { states } from "../../utils/constants";
import { LuImagePlus } from "react-icons/lu";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../main";
import { axiosInstance } from "../../config/axios";
import CustomLoader from "../Loader";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { useRef } from "react";
import { useBusinessStore } from "../../store/businessStore";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa";
import { useBusinessBankAccountStore } from "../../store/businessBankAccountStore";

const BusinessForm = ({ businessToBeUpdated }) => {
  const [additionalInformation, setAdditionalInformation] = useState([]);
  const [additionalInfoKey, setAdditionalInfoKey] = useState("");
  const [additionalInfoValue, setAdditionalInfoValue] = useState("");
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
  const [singaturePreviewUrl, setSignaturePreviewUrl] = useState("");
  const [fileSizeError, setFileSizeError] = useState(false);
  const [editIndex, setEditIndex] = useState();

  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [IFSCCode, setIFSCCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [openingBalance, setOpeningBalance] = useState();
  const [bankAndBranchName, setBankAndBranchName] = useState("");
  const [accountHoldersName, setAccountHoldersName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [asOfDate, setAsOfDate] = useState(new Date());
  const [isEdit, setIsEdit] = useState(false);

  const { setActiveAccount } = useBusinessBankAccountStore();

  const logoRef = useRef(null);
  const signatureRef = useRef(null);
  const { setBusiness } = useBusinessStore();
  const navigate = useNavigate();

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
    gstRegistered: false,
    gstNumber: "",
    panNumber: "",
    TDS: false,
    TCS: false,
    pincode: "",
    notes: "",
    termsAndCondition: "",
    bankAccounts: [],
  });

  // QUERY TO FETCH ALL THE BANK ACCOUNTS
  const { data: bankAccounts } = useQuery({
    queryKey: ["bankAccounts"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/bank-account/${businessToBeUpdated?._id}`
      );
      return res.data;
    },
    enabled: !!businessToBeUpdated,
  });

  // THIS IS USED TO AUTOMATICALLY ADD ALL THE FIELDS FOR EDITING
  useEffect(() => {
    if (businessToBeUpdated) {
      setData({
        businessName: businessToBeUpdated.businessName || "",
        businessType: businessToBeUpdated.businessType || "",
        industryType: businessToBeUpdated.industryType || "",
        companyPhoneNo: businessToBeUpdated.companyPhoneNo || "",
        businessRegType: businessToBeUpdated.businessRegType || "",
        companyEmail: businessToBeUpdated.companyEmail || "",
        billingAddress: businessToBeUpdated.billingAddress || "",
        state: businessToBeUpdated.state || "",
        city: businessToBeUpdated.city || "",
        gstRegistered: businessToBeUpdated.gstRegistered || false,
        gstNumber: businessToBeUpdated.gstNumber || "",
        panNumber: businessToBeUpdated.panNumber || "",
        TDS: businessToBeUpdated.TDS || false,
        TCS: businessToBeUpdated.TCS || false,
        pincode: businessToBeUpdated.pincode || "",
        notes: businessToBeUpdated.notes || "",
        termsAndCondition: businessToBeUpdated.termsAndCondition || "",
        bankAccounts: [],
      });
    }
    if (
      businessToBeUpdated &&
      businessToBeUpdated.additionalInformation.length
    ) {
      setAdditionalInformation(businessToBeUpdated.additionalInformation);
    }
  }, [businessToBeUpdated]);

  // HANDLES THE LOGO CHANGE
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      setFileSizeError(true);
      toast.error("File is too big");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setLogoPreviewUrl(base64String);
      const pureBase64 = base64String.split(",")[1];
      // logoRef.current = pureBase64;
    };
    logoRef.current = file;
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  // HANDLES THE SIGNTAURE CHANGE
  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setSignaturePreviewUrl(base64String);

      const pureBase64 = base64String.split(",")[1];
      // signatureRef.current = pureBase64;
    };
    reader.readAsDataURL(file);
    signatureRef.current = file;
    e.target.value = null;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // CREATE BUSINESS
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosInstance.post("/business", formData);
      return res.data.business;
    },
    onSuccess: (data) => {
      toast.success("Business created");
      navigate("/dashboard/my-businesses");
      queryClient.invalidateQueries({ queryKey: ["business"] });
      setBusiness(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || err.response?.data?.err);
    },
  });

  // UPDATE BUSINESS DETAILS
  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosInstance.patch(
        `/business/${businessToBeUpdated?._id}`,
        formData
      );
      return res.data.business;
    },
    onSuccess: (data) => {
      toast.success("Business details updated");
      queryClient.invalidateQueries({ queryKey: [] });
      navigate("/dashboard/my-businesses");
      setBusiness(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || err.response?.data?.err);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (logoRef) {
      formData.append("logo", logoRef.current);
    }

    if (signatureRef) {
      formData.append("signature", signatureRef.current);
    }
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "bankAccounts") {
        formData.append(key, value);
      }
    });

    if (additionalInformation.length > 0) {
      formData.append(
        "additionalInformation",
        JSON.stringify(additionalInformation)
      );
    }

    if (Array.isArray(data.bankAccounts) && data.bankAccounts.length > 0) {
      formData.append("bankAccounts", JSON.stringify(data.bankAccounts));
    }

    if (businessToBeUpdated) {
      updateMutation.mutate(formData);
    } else {
      mutation.mutate(formData);
    }
  };

  // Inside your component
  useEffect(() => {
    if (bankAccounts && businessToBeUpdated) {
      setData((prev) => ({
        ...prev,
        bankAccounts: bankAccounts || [],
      }));
    }
  }, [bankAccounts, businessToBeUpdated]);

  const resetBankForm = () => {
    setAccountName("");
    setBankAccountNumber("");
    setIFSCCode("");
    setBankAndBranchName("");
    setAccountHoldersName("");
    setUpiId("");
    setAsOfDate(new Date());
    setIsEdit(false);
    setEditIndex(null);
  };

  // MARK AS ACTIVE
  const markAsMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.patch(
        `/bank-account/mark-as-active/${id}?businessId=${businessToBeUpdated?._id}`
      );
      return res.data.bankAccount;
    },
    onSuccess: (data) => {
      setActiveAccount(data);
      toast.success("Bank account marked as active ");
      queryClient.invalidateQueries({
        queryKey: ["bankAccounts"],
      });
    },
  });

  // DELETE BANK ACCOUNT
  const deleteBank = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(
        `/bank-account/${id}?businessId=${businessToBeUpdated?._id}`
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Bank account deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["businessBankAccounts"] });
    },
  });

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
        className="flex items-center  p-2 justify-between border-b border-[var(--primary-border)]"
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
          {/* <button className="btn btn-sm  bg-[var(--primary-btn)]">
            <MdOutlineCalendarToday size={14} />
            Close Financial Year
          </button> */}
          <button className="btn btn-sm" onClick={() => navigate(-1)}>
            Cancel
          </button>
          {businessToBeUpdated ? (
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="btn btn-sm bg-[var(--primary-btn)]"
            >
              {updateMutation.isPending ? (
                <CustomLoader text={"Saving..."} />
              ) : (
                "Update Changes"
              )}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="btn btn-sm bg-[var(--primary-btn)]"
            >
              {mutation.isPending ? (
                <CustomLoader text={"Saving..."} />
              ) : (
                "Save Changes"
              )}
            </button>
          )}
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
          <div className="flex gap-7 mb-4 relative">
            <motion.label
              initial={{ filter: "blur(10px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ ease: "easeInOut", duration: 0.3, delay: 0.3 }}
              htmlFor="logo"
              className={`border flex-col items-center justify-center bg-[#F6F9FF] ${
                fileSizeError ? "border-red-500" : "border-blue-500"
              } flex border-dashed cursor-pointer p-5 text-xs gap-2 relative`}
            >
              {logoPreviewUrl ? (
                <img
                  src={logoPreviewUrl}
                  alt="Logo"
                  style={{
                    width: "150px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                  loading="lazy"
                />
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
            {logoPreviewUrl && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  logoRef.current = null;
                  setLogoPreviewUrl(null);
                }}
                className="absolute -left-2 -top-2 z-10 bg-red-500 rounded-full text-white p-1 border border-red-500 cursor-pointer"
              >
                <RxCross2 size={15} />
              </div>
            )}

            <input
              type="file"
              id="logo"
              accept="image/*"
              name="logo"
              className="hidden"
              onChange={handleLogoChange}
            />

            {fileSizeError && (
              <small className="text-red-500">File is too big</small>
            )}
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
                    <option key={state} disabled={state === "Enter state"}>
                      {state}
                    </option>
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
                <label className="text-xs font-semibold cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="gstRegistered"
                    checked={data.gstRegistered}
                    disabled={mutation?.isPending}
                    onChange={handleInputChange}
                    className="checkbox checkbox-sm checkbox-info"
                  />
                  GST Registered
                </label>
              </div>
            </div>
          </div>

          {data.gstRegistered && (
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
          )}

          <div className=" font-semibold mt-3 base flex items-center justify-between w-full p-[5.8px] px-3 text-xs border border-[var(--primary-border)]  rounded text-purple-300">
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
              <p className="text-[13px] text-gray-600 mb-2">Business Type</p>
              <select
                name="businessType"
                value={data.businessType}
                disabled={mutation?.isPending}
                onChange={handleInputChange}
                className="select select-sm"
              >
                <option value="" disabled>
                  -- Select-Business-Type --
                </option>
                <option value="Retailer">Retailer</option>
                <option value="Wholesaler">Wholesaler</option>
                <option value="Distributor">Distributor</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Services">Services</option>
              </select>
              <small className="text-xs text-[var(--error-text-color)] ">
                {
                  mutation.error?.response?.data?.validationError?.businessType
                    ?._errors[0]
                }
              </small>
            </div>

            <div className="w-1/2 flex flex-col justify-between ">
              <p className="text-[13px]  text-gray-600 mb-2">Industry Type</p>
              <select
                name="industryType"
                value={data.industryType}
                disabled={mutation?.isPending}
                onChange={handleInputChange}
                className="select select-sm "
              >
                <option value="" disabled>
                  -- Select-Industry-Type --
                </option>
                <option className="hidden">
                  Accounting and Financial Services
                </option>
                <option>Accounting and Financial Services</option>
                <option>Agriculture</option>
                <option>Automobile</option>
                <option>Battery</option>
                <option>Boardband/ cable/ internet</option>
                <option>Building Material and Construction</option>
                <option>Cleaning and pest Control</option>
                <option>Consulting</option>
                <option>Dairy (Milk)</option>
                <option>Doctor / Clinic / Hospital</option>
                <option>Education-Schooling/Coaching</option>
                <option>Electrical works</option>
                <option>Electronics</option>
                <option>Engineering</option>
                <option>Event planning and management</option>
                <option>FMCG</option>
                <option>Fitness - Gym and Spa</option>
                <option>Footwear</option>
                <option>Fruits and Vegetables</option>
                <option>Furniture</option>
                <option>Garment/Clothing</option>
                <option>General Store(Kirana)</option>
                <option>Gift Shop</option>
                <option>Hardware</option>
                <option>Home services</option>
                <option>Hotels and Hospitality</option>
                <option>Information Technology</option>
                <option>Interiors</option>
                <option>Jewellery</option>
                <option>Liquor</option>
                <option>Machinery</option>
                <option>Meat</option>
                <option>Medical Devices</option>
                <option>Medicine(Pharma)</option>
                <option>Mobile and accessories</option>
                <option>Oil And Gas</option>
                <option>Opticals</option>
                <option>Other services</option>
                <option>Others</option>
                <option>Packaging</option>
                <option>Paints</option>
                <option>Photography</option>
                <option>Plywood</option>
                <option>Printing</option>
                <option>Real estate - Rentals and Lease</option>
                <option>Restaurants/ Cafe/ Catering</option>
                <option>Safety Equipments</option>
                <option>Salon</option>
                <option>Scrap</option>
                <option>Service Centres</option>
                <option>Sports Equipments</option>
                <option>Stationery</option>
                <option>Tailoring/ Boutique</option>
                <option>Textiles</option>
                <option>Tiles/Sanitary Ware</option>
                <option>Tours and Travel</option>
                <option>Transport and Logistics</option>
                <option value="Utensils">Utensils</option>
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
              <option value="" disabled>
                -- Select-Business-Registration-Type --
              </option>
              <option className="hidden">Private Limited Company</option>
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

          {/* NOTES AND TERMS AND CONDITIONS */}
          <div className="my-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="Notes" className="text-xs text-gray-600">
                Notes
              </label>
              <input
                type="text"
                placeholder="Add notes"
                name="notes"
                value={data.notes}
                onChange={handleInputChange}
                className="input input-sm w-full"
              />
            </div>
            <div className="flex flex-col gap-2 mt-3">
              <label htmlFor="Notes" className="text-xs text-gray-600">
                Terms & Conditions
              </label>
              <textarea
                type="text"
                value={data.termsAndCondition}
                name="termsAndCondition"
                onChange={handleInputChange}
                placeholder="Add Terms and Condition"
                className="textarea w-full text-xs"
              />
            </div>
          </div>

          <p className="text-[13px] text-gray-500">Signature</p>
          <div className="flex items-center justify-between py-2 relative ">
            {/* {singaturePreviewUrl ? (
              <img src={singaturePreviewUrl} size={100} loading="lazy"/>
            ) : (
              <>
                <label
                  htmlFor="signature"
                  className="border border-dashed p-11 text-xs border-blue-500 text-blue-500 cursor-pointer"
                >
                  + Add Signature
                </label>
              </>
            )} */}
            {singaturePreviewUrl ? (
              <img
                src={singaturePreviewUrl}
                alt="signature"
                style={{
                  width: "150px",
                  height: "100px",
                  objectFit: "cover",
                }}
                loading="lazy"
                className="border border-dashed p-5 border-blue-500"
              />
            ) : (
              <>
                <label
                  htmlFor="signature"
                  className="border border-dashed p-11 text-xs border-blue-500 text-blue-500 cursor-pointer"
                >
                  + Add Signature
                </label>
              </>
            )}

            <input
              id="signature"
              name="signature"
              type="file"
              accept="image/*"
              onChange={handleSignatureChange}
              className="hidden"
            />

            {singaturePreviewUrl && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  signatureRef.current = null;
                  setSignaturePreviewUrl(null);
                }}
                className="absolute left-33 -top-1 z-10 bg-red-500 rounded-full text-white p-1 border border-red-500 cursor-pointer"
              >
                <RxCross2 size={15} />
              </div>
            )}
          </div>

          <div className="border rounded mt-2 border-[var(--primary-border)]">
            <div className="py-3 border-b border-[var(--primary-border)]">
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
              <div
                onClick={() => {
                  setAdditionalInformation((prev) => [
                    ...prev,
                    {
                      key: additionalInfoKey,
                      value: additionalInfoValue,
                    },
                  ]);
                  setAdditionalInfoKey("");
                  setAdditionalInfoValue("");
                }}
                className="btn btn-sm bg-[var(--primary-btn)] ml-3"
              >
                Add
              </div>
            </div>
            {(
              (Array.isArray(additionalInformation) &&
                additionalInformation.length > 0 &&
                additionalInformation) ||
              []
            ).map((info, index) => (
              <div
                key={index}
                className="px-4 pb-2 text-sm flex items-center justify-between"
              >
                <div>
                  <h3>{info?.key}</h3>
                  <span className="text-zinc-500">{info?.value}</span>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <Trash
                    onClick={() => {
                      setAdditionalInformation((prev) => {
                        const safePrev = Array.isArray(prev) ? prev : [];
                        return safePrev.filter((_, i) => i !== index);
                      });
                    }}
                    size={15}
                    className="text-[var(--error-text-color)] cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </form>

      <div className="divider divider-sm" />

      {/* ------------------------------------------------------------------------------------------------------------------- */}

      {/* DISPLAYING BANK DETAILS */}
      <div className="mt-5 ">
        <h2 className="font-semibold text-sm mb-2 pl-4 text-gray-700">
          Added Bank Accounts
        </h2>

        {!data.bankAccounts || data.bankAccounts.length === 0 ? (
          <p className="text-xs text-gray-500 italic pl-4">
            No bank accounts added yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {data.bankAccounts.map((bank, index) => (
              <div
                key={index}
                className="grid grid-cols-2 border border-gray-200 rounded ml-3 p-3 shadow-sm"
              >
                <div className="text-xs text-gray-700 w-full">
                  <p>
                    <span className="font-semibold">Account Name:</span>{" "}
                    {bank.accountName || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Account No:</span>{" "}
                    {bank.bankAccountNumber || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">IFSC:</span>{" "}
                    {bank.IFSCCode || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Bank:</span>{" "}
                    {bank.bankAndBranchName || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Account Holder:</span>{" "}
                    {bank.accountHoldersName || "-"}
                  </p>
                  {bank.upiId && (
                    <p>
                      <span className="font-semibold">UPI ID:</span>{" "}
                      {bank.upiId}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2  justify-between items-end ">
                  {!bank.isActive ? (
                    <button
                      onClick={() => markAsMutation.mutate(bank._id)}
                      className="text-green-500  text-xs hover:underline"
                    >
                      Mark as Active
                    </button>
                  ) : (
                    <p className="text-green-600 ring ring-green-500/40 p-1 rounded-full px-3 text-xs font-semibold">
                      {bank?.isActive ? "Active Account" : ""}
                    </p>
                  )}
                  <div className="space-x-3">
                    <button
                      onClick={() => {
                        setAccountName(bank.accountName);
                        setBankAccountNumber(bank.bankAccountNumber);
                        setIFSCCode(bank.IFSCCode);
                        setBankAndBranchName(bank.bankAndBranchName);
                        setAccountHoldersName(bank.accountHoldersName);
                        setUpiId(bank.upiId);
                        setAsOfDate(bank.asOfDate);
                        setOpeningBalance(bank.openingBalance);
                        setIsEdit(true);
                        setEditIndex(index);
                        document.getElementById("bank-modal").showModal();
                      }}
                      className="text-blue-500 text-xs hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,
                          bankAccounts: prev.bankAccounts.filter(
                            (_, i) => i !== index
                          ),
                        }));
                        deleteBank.mutate(bank._id);
                      }}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BANK ACCOUNT ADDITION */}
      <div className="w-full flex items-center justify-center py-12">
        <button
          className="text-[var(--primary-btn)] text-xs flex items-center gap-2 p-2 btn btn-dash"
          onClick={() => {
            resetBankForm();
            document.getElementById("bank-modal").showModal();
          }}
        >
          <FaPlus />
          Add Bank Account
        </button>
      </div>

      <dialog id="bank-modal" className="modal text-xs">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-4">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg">Add Bank Account</h3>
          <div className="flex flex-col justify-center bg-white p-5 gap-6">
            <div className="flex justify-between gap-2">
              <div className="flex flex-col  w-full gap-1">
                <p className="text-gray-600 text-xs">
                  Account Name
                  <span className="text-red-500"> *</span>
                </p>
                <input
                  type="text"
                  name="account name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="ex-Personal Account"
                  className="border border-gray-200  rounded w-full p-1"
                />
                <small className="text-red-500">
                  {/* {bankMutation?.error?.response?.data?.errors
                    ?.bankAccountNumber?._errors[0] ||
                    bankMutation?.error?.message} */}
                </small>
              </div>
              <div className="flex flex-col w-full gap-1">
                <p className="text-gray-600 text-xs">
                  Bank Account Number
                  <span className="text-red-500"> *</span>
                </p>
                <input
                  type="number"
                  name="bankAccountNumber"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="ex-123456789"
                  className="border border-gray-200  rounded w-full p-1"
                />
                <small className="text-red-500">
                  {/* {bankMutation?.error?.response?.data?.errors
                    ?.bankAccountNumber?._errors[0] ||
                    bankMutation?.error?.message} */}
                </small>
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex flex-col w-1/2 gap-1">
                <p className="text-gray-600 text-xs">ifsc Code</p>
                <input
                  type="text"
                  placeholder="ex-ICIC0001234"
                  name="IFSCCode"
                  value={IFSCCode}
                  onChange={(e) => setIFSCCode(e.target.value)}
                  className={`border border-gray-200  rounded w-full p-1`}
                  maxLength={11}
                  style={{ textTransform: "uppercase" }}
                />
                {/* <small className="text-red-500">{ifscError}</small> */}
              </div>
              <div className="flex flex-col  w-1/2 gap-1">
                <p className="text-gray-600 text-xs">Bank & Branch Name</p>
                <input
                  type="text"
                  placeholder="ex-ICICI Bank, Jharkhand"
                  name="bankAndBranchName"
                  value={bankAndBranchName}
                  onChange={(e) => setBankAndBranchName(e.target.value)}
                  className="border border-gray-200  rounded w-full p-1"
                />
                <small className="text-red-500">
                  {/* {
                    bankMutation?.error?.response?.data?.errors
                      ?.bankAndBranchName?._errors[0]
                  } */}
                </small>
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex flex-col  w-1/2 gap-1">
                <p className="text-gray-600 text-xs">Account Holder’s Name</p>
                <input
                  type="text"
                  name="accountHoldersName"
                  value={accountHoldersName}
                  onChange={(e) => setAccountHoldersName(e.target.value)}
                  placeholder="ex-Manish"
                  className="border border-gray-200  rounded w-full p-1"
                />
                <small className="text-red-500">
                  {/* {
                    bankMutation?.error?.response?.data?.errors
                      ?.accountHoldersName?._errors[0]
                  } */}
                </small>
              </div>
              <div className="flex flex-col  w-1/2 gap-1">
                <p className="text-gray-600 text-xs">UPI ID</p>
                <input
                  type="text"
                  name="upiId"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="ex:manish@upi"
                  className="border border-gray-200  rounded w-full p-1"
                />
                <small className="text-red-500">
                  {/* {
                    bankMutation?.error?.response?.data?.errors?.upiId
                      ?._errors[0]
                  } */}
                </small>
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex flex-col  w-1/2 gap-1">
                <p className="text-gray-600 text-xs">As of Date</p>
                <input
                  type="date"
                  name="asOfDate"
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
                  placeholder="ex-Manish"
                  className="border border-gray-200  rounded w-full p-1"
                />
                <small className="text-red-500">
                  {/* {
                    bankMutation?.error?.response?.data?.errors
                      ?.accountHoldersName?._errors[0]
                  } */}
                </small>
              </div>
              <div className="flex flex-col  w-1/2 gap-1">
                <p className="text-gray-600 text-xs">Opening Balance</p>
                <input
                  type="number"
                  name="openingBalance"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  placeholder="0"
                  className="border border-gray-200  rounded w-full p-1"
                />
                <small className="text-red-500">
                  {/* {
                    bankMutation?.error?.response?.data?.errors
                      ?.accountHoldersName?._errors[0]
                  } */}
                </small>
              </div>
            </div>
          </div>
          {isEdit ? (
            <div className="flex justify-end mt-2 gap-3">
              <button
                onClick={() => {
                  const updatedBank = {
                    accountName,
                    bankAccountNumber,
                    IFSCCode,
                    bankAndBranchName,
                    accountHoldersName,
                    upiId,
                    asOfDate,
                  };

                  setData((prevData) => {
                    const updatedAccounts = [...prevData.bankAccounts];
                    updatedAccounts[editIndex] = updatedBank;
                    return { ...prevData, bankAccounts: updatedAccounts };
                  });

                  document.getElementById("bank-modal").close();
                }}
                className="btn btn-sm bg-[var(--primary-btn)]"
              >
                Update
              </button>
            </div>
          ) : (
            <div className="flex justify-end mt-2 gap-3 ">
              <button
                onClick={() => {
                  // Create a new bank object
                  const newBankAccount = {
                    accountName,
                    bankAccountNumber,
                    IFSCCode,
                    bankAndBranchName,
                    accountHoldersName,
                    upiId,
                    asOfDate,
                  };

                  setData((prevData) => ({
                    ...prevData,
                    bankAccounts: [...prevData.bankAccounts, newBankAccount],
                  }));

                  setAccountName("");
                  setBankAccountNumber("");
                  setIFSCCode("");
                  setBankAndBranchName("");
                  setAccountHoldersName("");
                  setUpiId("");
                  setAsOfDate(new Date());

                  document.getElementById("bank-modal").close();
                }}
                className="btn btn-sm bg-[var(--primary-btn)]"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};

export default BusinessForm;
