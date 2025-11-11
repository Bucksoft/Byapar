import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";

const WhatsappProfileCard = ({ profile }) => {
  if (!profile) return null;
  return (
    <div className="flex justify-center my-4">
      <div className="card w-80 bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl border border-green-200">
        <figure className="relative">
          <img
            src={
              profile.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mt-6 border-4 border-green-500"
          />
          <FaWhatsapp
            size={22}
            className="absolute bottom-4 right-[42%] text-green-500 bg-white rounded-full p-1 shadow-md"
          />
        </figure>

        <div className="card-body items-center text-center ">
          {/* Name */}
          <h2 className="card-title text-lg font-bold text-gray-800">
            {profile.name || "Unknown User"}
          </h2>

          {/* Number */}
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MdPhoneIphone size={16} />
            <span>{profile.number}</span>
          </div>

          {/* Platform */}
          <div className="badge badge-outline badge-success px-3 py-3 mt-2">
            {profile.rawClientInfo?.platform || "Unknown Platform"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappProfileCard;
