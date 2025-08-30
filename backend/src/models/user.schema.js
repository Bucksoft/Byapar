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
    email: {
      type: String,
      required: true,
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
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    contact: {
      type: String,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserRole",
    },
  },
  { timestamps: true }
);

export const UserCredential = mongoose.model(
  "UserCredential",
  userCredentialSchema
);
