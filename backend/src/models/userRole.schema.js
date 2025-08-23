import mongoose from "mongoose";

const userRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
    enum: [
      "admin",
      "subadmin",
      "cashier",
      "account",
      "salesmanWithEditAccess",
      "salesmanWihtoutEditAccess",
      "deliveryBoy",
      "stockManager",
      "partner",
    ],
    default: "admin",
  },
});

const UserRole = mongoose.model("UserRole", userRoleSchema);
export default UserRole;
