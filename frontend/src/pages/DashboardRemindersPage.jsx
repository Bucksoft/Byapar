import { Keyboard, MessageCircle } from "lucide-react";
import { useState } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { RxCheckbox } from "react-icons/rx";

const DashboardRemindersPage = () => {
  const [open, setOpen] = useState(false);
  const [inneropen, setInneropen] = useState(false);
  const [secondopen, setSecondopen] = useState(false);

  function handleSecondAccordion() {
    setSecondopen(!secondopen);
    setOpen(false);
  }

  function handleFirstAccordion() {
    setOpen(!open);
    setSecondopen(false);
  }

  return (
    <main className="h-screen w-full flex">
      <section className="w-full p-3 bg-gray-200">
        <div className=" shadow shadow-gray-200 h-full rounded-md bg-white">
          <div className="flex justify-between border-b border-b-zinc-300 p-3 ">
            {/* navigation left side*/}
            <div className=" flex flex-col">
              <span className="text-md">Reminder Settings</span>
              <span className="text-[12px] text-zinc-400">
                Select which reminders are sent to you and your parties
              </span>
            </div>
            {/* navigation right side*/}
            <div className="flex items-center space-x-3 mr-5">
              <Keyboard />
              <button className="btn btn-soft btn-info ">
                <MessageCircle size={16} /> Chat Support
              </button>
              <button className="btn btn-info">Cancel</button>
              <button className="btn btn-info">Save Changes</button>
            </div>
          </div>
          {/* toggle section */}

          <div className="border-t border-b border-zinc-300 grid grid-cols-2 py-4 gap-5">
            {/* left */}
            <div className="border border-zinc-300 rounded-md ml-3 p-3">
              <div className="overflow-hidden flex justify-between items-center">
                <p className="text-[13px] ">Send billing SMS to Party</p>
                <input
                  type="checkbox"
                  defaultChecked
                  className="toggle toggle-sm mr-5 text-info "
                />
              </div>
              <p className="text-[12px] text-zinc-400">
                Send SMS to your Party on creating any transaction
              </p>
            </div>
            {/* right */}
            <div className="border border-zinc-300 rounded-md mr-3 p-3">
              <div className="overflow-hidden flex justify-between items-center">
                <p className="text-[13px] ">Send billing SMS to Party</p>
                <input
                  type="checkbox"
                  defaultChecked
                  className="toggle toggle-sm mr-5 text-info"
                />
              </div>
              <p className="text-[12px] text-zinc-400">
                Send SMS to your Party on creating any transaction
              </p>
            </div>
          </div>

          {/*  first accordion */}
          <div className="">
            <div
              className="border-b border-b-zinc-300 flex cursor-pointer items-center justify-between p-2 bg-gray-100"
              onClick={handleFirstAccordion}
            >
              <span className="text-md pl-3 py-1 text-[13px]">
                To Party (Reminders will be sent through SMS)
              </span>
              {open ? (
                <span className="mr-3">
                  <FaSortUp />
                </span>
              ) : (
                <span className="mr-3">
                  <FaSortDown />
                </span>
              )}
            </div>
            {open && (
              <>
                <div className="p-3 border border-zinc-300 ">
                  <div className="border border-zinc-300 w-[49%] p-4 rounded-sm ">
                    <p className="text-[13px]">Sales Invoice</p>
                    <p className="text-[12px] text-zinc-400">
                      Get reminded to collect payments on time
                    </p>
                    <p className="text-[13px] pt-3 flex justify-between items-center">
                      3 days before due date
                      <input
                        type="checkbox"
                        defaultChecked
                        className="checkbox size-4 rounded-sm mr-3 text-info"
                      />
                    </p>
                    <p className="text-[13px] pt-3 flex justify-between items-center">
                      On due date
                      <input
                        type="checkbox"
                        defaultChecked
                        className="checkbox size-4 rounded-sm mr-3 text-info"
                      />
                    </p>

                    {/* inner accordian */}
                    <div className="pt-3">
                      <div
                        className="rounded-sm border p-1 border-zinc-300 flex items-start  justify-between bg-gray-100"
                        onClick={() => setInneropen(!inneropen)}
                      >
                        <div className="text-md  text-[12px]">
                          View sample SMS
                          {inneropen && (
                            <>
                              <div className="text-[10px] text-zinc-400">
                                <p>
                                  {" "}
                                  Hello Mehta Enterprises, just a gentle
                                  reminder - your payment of Rs 2000 against
                                  purchase is due today. Request you to make the
                                  payment soon.
                                </p>
                                <p>- Abc Book Stores</p>
                                <p>See invoice at http://xxxxxxxxxxx.com</p>
                              </div>
                            </>
                          )}
                        </div>
                        {
                          <div
                            className={`flex items-center justify-center pt-1 transition-all ease-in-out duration-200 ${
                              inneropen ? "" : "rotate-180"
                            } `}
                          >
                            <FaSortUp className={``} />
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* second accordian */}
          <div className="">
            <div
              className="border-b cursor-pointer border-zinc-300 flex items-center justify-between p-2 bg-gray-100"
              onClick={handleSecondAccordion}
            >
              <span className="text-md pl-3 py-1 text-[13px]">
                To You (Reminders will be sent on Mobile App and WhatsApp)
              </span>
              {secondopen ? (
                <span className="mr-3">
                  <FaSortUp />
                </span>
              ) : (
                <span className="mr-3">
                  <FaSortDown />
                </span>
              )}
            </div>
            {secondopen && (
              <>
                {/* top */}
                <div className="p-3 border-b border-b-gray-300 grid grid-cols-2 gap-5">
                  {/* left */}
                  <div className="border border-zinc-300 p-4 rounded-sm ">
                    <p className="text-[13px]">Sales Invoice</p>
                    <p className="text-[12px] text-zinc-400">
                      Get reminded to collect payments on time
                    </p>
                    <p className="text-[13px] pt-3 flex justify-between items-center">
                      3 days before due date
                      <input
                        type="checkbox"
                        defaultChecked
                        className="checkbox size-4 rounded-sm mr-3 text-info"
                      />
                    </p>
                    <p className="text-[13px] pt-3 flex justify-between items-center">
                      On due date
                      <input
                        type="checkbox"
                        defaultChecked
                        className="checkbox size-4 rounded-sm mr-3 text-info"
                      />
                    </p>
                  </div>
                  {/* right */}
                  <div className="border border-zinc-300 p-4 rounded-sm ">
                    <p className="text-[13px]">Low Stock</p>
                    <p className="text-[12px] text-zinc-400">
                      Get remainder to buy stock
                    </p>
                    <p className="text-[13px] pt-3 flex justify-between items-center">
                      When stock is below low stock level
                      <input
                        type="checkbox"
                        defaultChecked
                        className="checkbox size-4 rounded-sm mr-3 text-info"
                      />
                    </p>
                  </div>
                </div>

                {/* bottom */}
                <div className="p-3 border-b border-b-gray-300 grid grid-cols-2 gap-5">
                  {/* left */}
                  <div className="border border-zinc-300 p-4 rounded-sm ">
                    <p className="text-[13px]">Purchase Invoice</p>
                    <p className="text-[12px] text-zinc-400">
                      Get reminded to send payments on time
                    </p>
                    <p className="text-[13px] pt-3 flex justify-between items-center">
                      3 days before due date
                      <input
                        type="checkbox"
                        defaultChecked
                        className="checkbox size-4 rounded-sm mr-3 text-info"
                      />
                    </p>
                    <p className="text-[13px] pt-3 flex justify-between items-center">
                      On due date
                      <input
                        type="checkbox"
                        defaultChecked
                        className="checkbox size-4 rounded-sm mr-3 text-info"
                      />
                    </p>
                  </div>
                  {/* right */}
                  <div className="border border-zinc-300 p-4 rounded-sm ">
                    <p className="text-[13px]">Daily Summary</p>
                    <p className="text-[12px] text-zinc-400">
                      Get daily updates about
                    </p>
                    <p className="text-[13px] pt-3 flex justify-between items-center">
                      Outstanding Collections and Payments
                      <input
                        type="checkbox"
                        defaultChecked
                        className="checkbox size-4 rounded-sm mr-3 text-info"
                      />
                    </p>
                    <p className="text-[13px] pt-3 flex justify-between items-center">
                      Yesterday’s Sales
                      <input
                        type="checkbox"
                        defaultChecked
                        className="checkbox size-4 rounded-sm mr-3 text-info"
                      />
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardRemindersPage;
