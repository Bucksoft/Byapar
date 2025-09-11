import { bankAccountSchema, partySchema } from "../config/validation.js";
import Party from "../models/party.schema.js";
import BankAccount from "../models/bankAccount.schema.js";

import mongoose from "mongoose";

export async function createParty(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        msg: "Please enter all the fields",
      });
    }

    // 1. PARTY VALIDATION
    const validationResult = partySchema.safeParse(data);
    if (!validationResult.success) {
      return res.status(422).json({
        success: false,
        msg: "Validation failed",
        validationError: validationResult.error.format(),
      });
    }

    // 2. BANK ACCOUNT VALIDATION
    const {
      bankAccountNumber,
      IFSCCode,
      bankAndBranchName,
      accountHoldersName,
      upiId,
    } = data;

    const bankValidationResult = bankAccountSchema.safeParse({
      bankAccountNumber,
      IFSCCode,
      bankAndBranchName,
      accountHoldersName,
      upiId,
    });
    if (!bankValidationResult.success) {
      return res.status(422).json({
        success: false,
        msg: "Validation failed",
        validationError: bankValidationResult.error.format(),
      });
    }

    const { partyName } = data;

    // 3. CHECK IF PARTY ALREADY EXISTS
    const partyExists = await Party.findOne({ partyName }).session(session);
    if (partyExists) {
      return res.status(400).json({
        success: false,
        msg: `Party already exists. Please provide another name`,
      });
    }

    // 4. CREATE PARTY
    const party = await Party.create(
      [
        {
          ...validationResult.data,
          businessId: req.body?.businessId,
          clientId: req.user?.id,
        },
      ],
      { session }
    );

    const partyData = party[0];

    // 5. CREATE BANK ACCOUNT with partyId
    const bankAccount = await BankAccount.create(
      [
        {
          ...bankValidationResult.data,
          clientId: req.user?.id,
          businessId: req.body?.businessId,
          partyId: partyData._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      msg: "Party created successfully",
      party: partyData,
      bankAccount: bankAccount[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.log("ERROR IN CREATING PARTY:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        msg: `${field} "${error.keyValue[field]}" already exists`,
      });
    }

    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
}

// get All parties
export async function getAllParties(req, res) {
  try {
    // FETCH THE BUSINESS ID
    const id = req.params?.id;
    // FETCH THE DETAILS OF THE PARTIES OF A PARTICULAR BUSINESS
    const parties = await Party.find({
      $and: [{ businessId: id }, { clientId: req.user?.id }],
    });
    //  GIVE A PROPER RESPONSE IF THERE ARE NO PARTIES
    if (!parties) {
      return res.status(400).json({ success: false, msg: "Parties not found" });
    }
    // GIVE SUCCESS RESPONSE IF PARTIES ARE FOUND
    return res.status(200).json(parties);
  } catch (error) {
    console.log("ERROR IN FETCHING ALL PARTIES ");
    console.log(error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

// function to get single party details
export async function getSingleParty(req, res) {
  try {
    // GET THE ID OF THE PARTY FROM PARMAS
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide party ID" });
    }
    const party = await Party.findById(id);
    //  GIVE A PROPER RESPONSE IF THERE ARE NO PARTIES
    if (!party) {
      return res.status(400).json({ success: false, msg: "Party not found" });
    }
    return res.status(200).json({ success: true, party });
  } catch (error) {
    console.log("ERROR IN FETCHING SINGLE PARTY ");
    return res.status(500).json({ err: "Internal server error", error });
  }
}

// function to update party details
export async function updatePartyDetails(req, res) {
  try {
    // GET THE ID OF THE PARTY AND DATA
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide party ID" });
    }
    const data = req.body;
    // FIND THE PARTY AND UPDATE ITS FIELDS.
    const updatedParty = await Party.findByIdAndUpdate(id, data, { new: true });
    if (!updatedParty) {
      return res
        .status(400)
        .json({ success: false, msg: "Party could not be updated" });
    }
    return res
      .status(200)
      .json({ msg: "Party updated successfully", updatedParty });
  } catch (error) {
    console.log("ERROR IN UPDATING PARTY DETAILS");
    return res.status(500).json({ err: "Internal server error", error });
  }
}

// function to delete party
export async function deleteParty(req, res) {
  try {
    // get the id of the party
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide party ID" });
    }
    const party = await Party.findByIdAndDelete(id);
    if (!party) {
      return res
        .status(400)
        .json({ success: false, msg: "Party could not be deleted" });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Party deleted successfully" });
  } catch (error) {
    console.log("ERROR IN DELETING PARTY DETAILS");
    return res.status(500).json({ err: "Internal server error", error });
  }
}
