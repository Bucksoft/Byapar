import mongoose from "mongoose";

export const userCredentialSchema = new mongoose.Schema(
  {
    userCode: {
      type: String,
      required: true,
    },
    passCode: {
      type: String,
    },
    userType: {
      type: String,
      enum: ["retailer", "wholeseller"],
      default: "retailer",
    },
    loginBy: {
      type: String,
      required: true,
    },
    referBy: {
      type: String,
    },
    alreadyLoggedIn: {
      type: Boolean,
    },
    status: {
      type: String,
    },
    last_login: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const UserCredential = mongoose.model(
  "UserCredential",
  userCredentialSchema
);
