import { bankAccountSchema, partySchema } from "../config/validation.js";
import Party from "../models/party.schema.js";
import BankAccount from "../models/bankAccount.schema.js";
import Category from "../models/category.schema.js";

import mongoose from "mongoose";

export async function createParty(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const data = req.body;
    const { categoryName } = req.body;

    if (categoryName.length > 0) {
      const existingCategory = await Category.findOne({ categoryName });
      if (!existingCategory) {
        await Category.create({
          categoryName,
        });
      }
    }

    if (!data) {
      return res.status(400).json({
        success: false,
        msg: "Request body is missing",
      });
    }

    const validationResult = partySchema.safeParse(data);
    if (!validationResult.success) {
      return res.status(422).json({
        success: false,
        msg: "Please fill all the details",
        validationError: validationResult.error.format(),
      });
    }

    const {
      bankAccountNumber,
      IFSCCode,
      bankAndBranchName,
      accountHoldersName,
      upiId,
    } = data;

    let bankValidationResult = { success: true };
    if (
      bankAccountNumber ||
      IFSCCode ||
      bankAndBranchName ||
      accountHoldersName ||
      upiId
    ) {
      bankValidationResult = bankAccountSchema.safeParse({
        bankAccountNumber,
        IFSCCode,
        bankAndBranchName,
        accountHoldersName,
        upiId,
      });

      if (!bankValidationResult.success) {
        return res.status(422).json({
          success: false,
          msg: "Bank account validation failed",
          validationError: bankValidationResult.error.format(),
        });
      }
    }

    const { partyName } = validationResult.data;

    const partyExists = await Party.findOne({
      partyName,
      businessId: req.body?.businessId,
    }).session(session);

    if (partyExists) {
      return res.status(400).json({
        success: false,
        msg: `Party "${partyName}" already exists in this business`,
      });
    }

    const partyDoc = {
      ...validationResult.data,
      businessId: req.body?.businessId,
      clientId: req.user?.id,
    };

    partyDoc.currentBalance = validationResult.data.openingBalance || 0;

    const party = await Party.create([partyDoc], { session });
    const partyData = party[0];

    let bankAccount = null;
    if (
      bankValidationResult.success &&
      bankValidationResult.data?.bankAccountNumber
    ) {
      bankAccount = await BankAccount.create(
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
      bankAccount = bankAccount[0];
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      msg: "Party created successfully",
      party: partyData,
      bankAccount,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        msg: `Duplicate value: ${field} "${error.keyValue[field]}" already exists`,
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
    const businessId = req.params?.id;
    if (!businessId) {
      return res.status(400).json({
        success: false,
        msg: "Business ID is required",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim() || "";

    const filter = {
      businessId: new mongoose.Types.ObjectId(businessId),
      clientId: req.user?.id,
    };

    if (search.length > 0) {
      filter.$or = [
        { partyName: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { GSTIN: { $regex: search, $options: "i" } },
        { billingAddress: { $regex: search, $options: "i" } },
      ];
    }

    const parties = await Party.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalParties = await Party.countDocuments(filter);
    const totalPages = Math.ceil(totalParties / limit);

    let toCollect = 0;
    let toPay = 0;

    const allFilteredParties = await Party.find({
      businessId: new mongoose.Types.ObjectId(businessId),
      clientId: req.user?.id,
    });

    allFilteredParties.forEach((party) => {
      const balance = party?.currentBalance || 0;
      if (balance > 0) toCollect += balance;
      else if (balance < 0) toPay += Math.abs(balance);
    });

    return res.status(200).json({
      success: true,
      page,
      totalPages,
      limit,
      totalParties,
      toCollect,
      toPay,
      data: parties,
    });
  } catch (error) {
    console.error("❌ ERROR IN FETCHING ALL PARTIES:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
}

// function to get single party detail
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

    const businessId = new mongoose.Types.ObjectId(req.params.id);
    const data = req.body;

    const {
      bankAccountNumber,
      IFSCCode,
      upiId,
      accountHoldersName,
      bankAndBranchName,
    } = req.body;

    // Only proceed with bank update if at least one field is provided
    const hasBankDetails =
      bankAccountNumber ||
      IFSCCode ||
      upiId ||
      accountHoldersName ||
      bankAndBranchName;

    if (hasBankDetails) {
      let bankAccount = await BankAccount.findOne({ partyId: id });

      if (bankAccount) {
        // Update only provided fields (not overwrite existing)
        if (bankAccountNumber)
          bankAccount.bankAccountNumber = bankAccountNumber;
        if (IFSCCode) bankAccount.IFSCCode = IFSCCode;
        if (upiId) bankAccount.upiId = upiId;
        if (accountHoldersName)
          bankAccount.accountHoldersName = accountHoldersName;
        if (bankAndBranchName)
          bankAccount.bankAndBranchName = bankAndBranchName;

        await bankAccount.save();
      } else {
        // Create only if new details are provided
        const newBankAccount = new BankAccount({
          bankAccountNumber,
          IFSCCode,
          upiId,
          accountHoldersName,
          bankAndBranchName,
          partyId: id,
          businessId,
        });
        await newBankAccount.save();
      }
    }

    // FIND THE PARTY AND UPDATE ITS FIELDS
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
    console.log("ERROR IN UPDATING PARTY DETAILS", error);
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

// function to update party shipping address
export async function updateShippingAddress(req, res) {
  try {
    const businessId = req.params.id;
    const partyId = req.query.id;
    const data = req.body;

    // finding the party first
    const party = await Party.findOne({
      _id: partyId,
      businessId: businessId,
    });

    if (!party) {
      return res
        .status(400)
        .json({ success: false, msg: "Party does not exists" });
    }

    const nextId = (party.fullShippingAddress?.length || 0) + 1;

    const updatedParty = await Party.findByIdAndUpdate(
      partyId,
      {
        $push: {
          fullShippingAddress: {
            id: nextId,
            shippingName: data?.shippingData?.shippingName,
            streetAddress: data?.shippingData?.streetAddress,
            state: data?.shippingData?.state,
            pincode: data?.shippingData?.pincode,
            city: data?.shippingData?.city,
          },
        },
      },
      { new: true }
    );

    if (!updatedParty) {
      return res.status(400).json({
        success: false,
        msg: "Party's shipping address could not be updated",
      });
    }

    // set the shipping address field also
    if (data?.shippingData?.streetAddress) {
      updatedParty.shippingAddress = data?.shippingData?.streetAddress;
      await updatedParty.save();
    }

    return res.status(200).json({
      success: true,
      msg: "Shipping address updated successfully",
      updatedParty,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

// function to update full shipping address
export async function updateFullShippingAddress(req, res) {
  try {
    const data = req.body.shippingData;
    const partyId = req.query?.id;
    const addressId = Number(req.query?.addressId);
    const businessId = req.params.id;

    // FINDING THE PARTY
    const party = await Party.findOne({
      _id: partyId,
      businessId: businessId,
    });

    if (!party) {
      return res
        .status(400)
        .json({ success: false, msg: "Party does not exists" });
    }

    // FILTER OUT THE SHIPPING ADDRESS
    const shippingAddressToEdit = party?.fullShippingAddress.filter(
      (add) => add?.id === addressId
    );
    if (!shippingAddressToEdit) {
      return res
        .status(400)
        .json({ success: false, msg: "Shipping Address not found" });
    }

    shippingAddressToEdit[0].shippingName = data?.shippingName;
    shippingAddressToEdit[0].streetAddress = data?.streetAddress;
    shippingAddressToEdit[0].pincode = data?.pincode;
    shippingAddressToEdit[0].state = data?.state;
    shippingAddressToEdit[0].city = data?.city;

    await party.save();

    return res
      .status(200)
      .json({ success: false, msg: "Updated successfully", party });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

// bulk add multiple parties
export async function bulkAddParties(req, res) {
  try {
    const data = req.body;
    const businessId = req.params.id;

    const transformParties = (data, businessId, clientId) => {
      return data
        .filter((item) => item.Name && item.Name.trim() !== "")
        .map((item) => {
          // if (item.ReceivableBalance && item.ReceivableBalance > 0) {
          //   openingBalance = item.ReceivableBalance;
          //   openingBalanceStatus = "To Collect";
          // } else if (item.PayableBalance && item.PayableBalance > 0) {
          //   openingBalance = item.PayableBalance;
          //   openingBalanceStatus = "To Pay";
          // }

          return {
            partyName: item.Name,
            mobileNumber: item.PhoneNo || "",
            email: item.Email || "",
            billingAddress: item.Address || "",
            GSTIN: item.GSTIN || "",
            currentBalance: item?.ReceivableBalance,
            businessId,
            clientId,
          };
        });
    };

    const dataToInsert = transformParties(data, businessId, req.user.id);
    const inserted = await Party.insertMany(dataToInsert, { ordered: false });
    if (!inserted) {
      return res.status(400).json({ success: false, msg: "Failed to insert!" });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Inserted successfully", inserted });
  } catch (error) {
    console.log("ERROR ", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

// get parties without pagination
export async function allParties(req, res) {
  try {
    const businessId = req.params.id;
    if (!businessId) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide the business id" });
    }
    const totalParties = await Party.countDocuments({ businessId: businessId });
    let toCollect = 0;
    let toPay = 0;
    const parties = await Party.find({
      businessId: businessId,
      clientId: req.user.id,
    });
    parties.forEach((party) => {
      const balance = party?.currentBalance || 0;
      if (balance > 0) toCollect += balance;
      else if (balance < 0) toPay += Math.abs(balance);
    });

    return res
      .status(200)
      .json({ totalParties, toCollect, toPay, data: parties });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}
