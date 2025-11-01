import { useState } from "react";

import { templateThemes } from "../utils/constants";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { axiosInstance } from "../config/axios";
import { useAuthStore } from "../store/authStore";
import { useInvoiceStore } from "../store/invoicesStore";
import { useQuery } from "@tanstack/react-query";
import InvoiceTemplate1 from "../components/InvoiceTemplate/InvoiceTemplate1";
import InvoiceTemplate2 from "../components/InvoiceTemplate/InvoiceTemplate2";
import InvoiceTemplate3 from "../components/InvoiceTemplate/InvoiceTemplate3";
import DefaultTemplate from "../components/InvoiceTemplate/DefaultTemplate";
import CustomLoader from "../components/Loader";
import toast from "react-hot-toast";

const DashboardInvoicePage = () => {
  const [currentTheme, SetCurrentTheme] = useState("Default");
  const [currentColor, setCurrentColor] = useState();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState();
  const [textColor, setTextColor] = useState("");
  const [openSection, setOpenSection] = useState(null);
  const { invoice } = useInvoiceStore();
  const [checkBoxSetting, setCheckBoxSetting] = useState({
    showPartyBalance: false,
    enableFreeItemQty: false,
    showItemDesc: false,
    showAltUnit: false,
    showPhone: false,
    showTime: false,
    priceHistory: false,
    autoApplyLuxuryTheme: false,
    poNumber: false,
    eWayBillNo: false,
    vechileNumber: false,
    billTo: true,
    shipTo: true,
    showHSN: true,
    showRate: true,
    showQty: true,
    batchNo: true,
    expDate: true,
    mfgDate: false,
  });

  const [pageData, setPageData] = useState({
    theme: "",
    selectedColor: "",
    options: [],
  });

  // Update options array automatically when checkboxes change
  useEffect(() => {
    const selectedOptions = Object.entries(checkBoxSetting)
      .filter(([_, checked]) => checked)
      .map(([name, checked]) => ({ name, checked }));

    setPageData((prev) => ({
      ...prev,
      options: selectedOptions,
    }));
  }, [checkBoxSetting]);

  // SAVE SETTINGS MUTATION
  const saveSettings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/invoiceTheme/settings", pageData);
      if (res.data.success) {
        toast.success(res.data?.message);
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getInvoiceSettings = async () => {
      const res = await axiosInstance.get(
        `/invoiceTheme/settings/${currentTheme}`
      );
      setSettings(res.data);
      localStorage.setItem("invoiceTheme", JSON.stringify(currentTheme));
    };
    getInvoiceSettings();
  }, [currentTheme]);

  // Handle checkbox toggle
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckBoxSetting((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // UPDATE THE CHECKBOX SETTINGS ON PAGE LOAD FROM THE BACKEND
  useEffect(() => {
    if (settings?.options?.length) {
      const updatedSettings = settings.options.reduce((acc, item) => {
        acc[item.name] = item.checked;
        return acc;
      }, {});
      setCheckBoxSetting(updatedSettings);
    }
  }, [settings, currentTheme]);

  // Theme selection with text color logic
  const selectTheme = (theme) => {
    SetCurrentTheme(theme);
    const color = theme.replace("#", "");
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    setTextColor(brightness > 128 ? "#000000" : "#FFFFFF");
  };

  return (
    <section className="h-screen flex flex-col pb-5">
      {/* Header (fixed) */}
      <div className="flex items-center justify-between p-1 py-3 sticky top-0 bg-white w-full shadow z-10 ">
        <p>Invoice Settings</p>
        <span className="badge badge-error badge-soft animate-pulse">Note : This feature is under development</span>
        <button onClick={saveSettings} className="btn btn-info btn-sm">
          {loading ? <CustomLoader text={""} /> : "Save Changes"}
        </button>
      </div>

      {/* Body (two scrollable divs side by side) */}
      <div className="flex overflow-hidden mt-2">
        {/* Left */}
        <div className="w-full flex justify-center items-start bg-sky-100  py-6 overflow-y-auto px-3">
          {currentTheme === "Default" ? (
            <DefaultTemplate
              color={currentColor}
              textColor={textColor}
              checkBoxSetting={checkBoxSetting}
            />
          ) : currentTheme === "Stylish" ? (
            <InvoiceTemplate1
              color={currentColor}
              textColor={textColor}
              checkBoxSetting={checkBoxSetting}
            />
          ) : currentTheme === "Luxury" ? (
            <InvoiceTemplate2
              color={currentColor}
              textColor={textColor}
              checkBoxSetting={checkBoxSetting}
            />
          ) : (
            <InvoiceTemplate3
              color={currentColor}
              textColor={textColor}
              checkBoxSetting={checkBoxSetting}
            />
          )}
        </div>

        {/* Right */}
        <div className=" border border-zinc-300 overflow-y-auto mr-2 rounded-md w-3/10">
          <div className="flex items-center pl-2 pt-2">
            <p className="pl-2 font-semibold">Theme</p>
          </div>
          {/* Right content goes here */}
          <div className="border-b border-b-black-300 flex items-center justify-center w-full gap-3">
            {templateThemes?.map((item) => (
              <div
                onClick={() => {
                  selectTheme(item?.title);
                  setPageData((prev) => ({ ...prev, theme: item?.title }));
                }}
                key={item.id}
                className="pt-2"
              >
                <img
                  src={item.img}
                  alt="item.image"
                  className={`w-20 border ${
                    currentTheme === item.title
                      ? "border-[#00A9E7]"
                      : "border-zinc-300"
                  } rounded`}
                />
                <p className="text-center text-sm py-1">{item.title}</p>
              </div>
            ))}
            {/* <button className="btn btn-dash py-10 mb-6 mt-2">See All</button> */}
          </div>

          {/* Color selection */}
          <h1 className="p-2 font-medium">Choose Custom Color</h1>
          <input
            type="color"
            value={currentColor}
            onChange={(e) => {
              setCurrentColor(e.target.value);
              setPageData((prev) => ({
                ...prev,
                selectedColor: e.target.value,
              }));
            }}
            className="w-full h-10 cursor-pointer px-2"
          />

          <h1 className="p-2 font-medium">Select Color</h1>
          <div className="px-5 flex gap-2">
            <button
              value="#1D4ED8"
              onClick={(e) => {
                setCurrentColor(e.target.value);
                setPageData((prev) => ({
                  ...prev,
                  selectedColor: e.target.value,
                }));
              }}
              className="w-[50px] h-10 bg-blue-700 rounded-full p-2"
            />

            <button
              value="#DC2626"
              onClick={(e) => {
                setCurrentColor(e.target.value);
                setPageData((prev) => ({
                  ...prev,
                  selectedColor: e.target.value,
                }));
              }}
              className="w-[50px] h-10 bg-red-600 rounded-full p-2"
            />
            <button
              value="#166534"
              onClick={(e) => {
                setCurrentColor(e.target.value);
                setPageData((prev) => ({
                  ...prev,
                  selectedColor: e.target.value,
                }));
              }}
              className="w-[50px] h-10 bg-green-800 rounded-full p-2"
            />
            <button
              value="#A78BFA"
              onClick={(e) => {
                setCurrentColor(e.target.value);
                setPageData((prev) => ({
                  ...prev,
                  selectedColor: e.target.value,
                }));
              }}
              className="w-[50px] h-10 bg-purple-300 rounded-full p-2"
            />
            <button
              value="#374151"
              onClick={(e) => {
                setCurrentColor(e.target.value);
                setPageData((prev) => ({
                  ...prev,
                  selectedColor: e.target.value,
                }));
              }}
              className="w-[50px] h-10 bg-gray-700 rounded-full p-2"
            />
            <button
              value="#B45309"
              onClick={(e) => {
                setCurrentColor(e.target.value);
                setPageData((prev) => ({
                  ...prev,
                  selectedColor: e.target.value,
                }));
              }}
              className="w-[50px] h-10 bg-yellow-800 rounded-full p-2"
            />
          </div>
          <h1 className="p-2 font-medium">Theme Setting</h1>
          <div className="space-y-1.5 text-xs">
            {[
              {
                key: "showPartyBalance",
                label: "Show party balance in invoice",
              },
              { key: "enableFreeItemQty", label: "Enable free item quantity" },
              {
                key: "showItemDesc",
                label: "Show item description in invoice",
              },
              { key: "showAltUnit", label: "Show Alternate Unit in Invoice" },
              { key: "showPhone", label: "Show phone number on Invoice" },
              { key: "showTime", label: "Show time on Invoices" },
              { key: "priceHistory", label: "Price History" },
              {
                key: "autoApplyLuxuryTheme",
                label: "Auto-apply luxury theme for sharing",
              },
            ].map(({ key, label }) => {
              const backendChecked = settings?.options?.some(
                (opt) => opt.name === key && opt.checked
              );
              const isChecked =
                checkBoxSetting[key] !== undefined
                  ? checkBoxSetting[key]
                  : backendChecked || false;

              return (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={key}
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="ml-3 w-4 h-4"
                  />
                  <span>{label}</span>
                </div>
              );
            })}
          </div>

          <div
            className="flex items-center justify-between"
            onClick={() =>
              setOpenSection(openSection === "invoice" ? null : "invoice")
            }
          >
            <h1 className="p-2 font-medium flex">Invoice Details </h1>
            <ChevronDown className="mr-2" size={20} />
          </div>
          {openSection === "invoice" && (
            <div className="px-3 text-xs">
              <p>Industry Type</p>
              <select name="" id="" className="border w-full rounded-xs py-1">
                <option value="">bhnjmk</option>
              </select>

              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="poNumber"
                    checked={settings?.options.find(
                      (option) =>
                        option.name === "poNumber" && option.checked === true
                    )}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4"
                  />
                  <span>PO Number</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="eWayBillNo"
                    checked={settings?.options.find(
                      (option) =>
                        option.name === "eWayBillNo" && option.checked === true
                    )}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4"
                  />
                  <span>E-way Bill Number</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="vechileNumber"
                    checked={settings?.options.find(
                      (option) =>
                        option.name === "vechileNumber" &&
                        option.checked === true
                    )}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4"
                  />
                  <span>Vehicle Number</span>
                </div>
              </div>
            </div>
          )}

          <div
            className="flex items-center justify-between"
            onClick={() =>
              setOpenSection(openSection === "party" ? null : "party")
            }
          >
            <h1 className="p-2 font-medium flex">Party Details </h1>
            <ChevronDown className="mr-2" size={20} />
          </div>
          {openSection === "party" && (
            <div className="px-3 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="shipTo"
                  checked={settings?.options.find(
                    (option) =>
                      option.name === "shipTo" && option.checked === true
                  )}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                <span>Ship To</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="billTo"
                  checked={settings?.options.find(
                    (option) =>
                      option.name === "billTo" && option.checked === true
                  )}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                <span>Bill To</span>
              </div>
            </div>
          )}

          <div
            className="flex items-center justify-between"
            onClick={() =>
              setOpenSection(openSection === "itemTable" ? null : "itemTable")
            }
          >
            <h1 className="p-2 font-medium flex">Item Table Columns </h1>
            <ChevronDown className="mr-2" size={20} />
          </div>
          {openSection === "itemTable" && (
            <div className="px-3 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="showRate"
                  checked={settings?.options.find(
                    (option) =>
                      option.name === "showRate" && option.checked === true
                  )}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                <span>Price/Item</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="showQty"
                  checked={settings?.options.find(
                    (option) =>
                      option.name === "showQty" && option.checked === true
                  )}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                <span>Quantity</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="batchNo"
                  checked={settings?.options.find(
                    (option) =>
                      option.name === "batchNo" && option.checked === true
                  )}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                <span>Batch No.</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="expDate"
                  checked={settings?.options.find(
                    (option) =>
                      option.name === "expDate" && option.checked === true
                  )}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                <span>Exp. Date</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="mfgDate"
                  checked={settings?.options.find(
                    (option) =>
                      option.name === "mfgDate" && option.checked === true
                  )}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                <span>Mfg Date</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardInvoicePage;
