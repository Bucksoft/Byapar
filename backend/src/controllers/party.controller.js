import { partySchema } from "../config/validation.js";
import Party from "../models/party.schema.js";

export async function createParty(req, res) {
  try {
    // 1. GET THE DATA FROM THE FRONTEND
    const data = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        msg: "Please enter all the fields",
      });
    }

    // 2. VALIDATION
    const validationResult = partySchema.safeParse(data);
    if (!validationResult.success) {
      const validationError = validationResult.error.format();
      return res.status(422).json({
        success: false,
        msg: "Validation failed",
        validationError,
      });
    }

    const { email, GSTIN, PANno } = data;

    // 3. CHECK IF PARTY ALREADY EXISTS BY EMAIL
    const partyExists = await Party.findOne({ email });
    if (partyExists) {
      return res.status(400).json({
        success: false,
        msg: `Party with email "${email}" already exists`,
      });
    }

    // 4. CHECK IF GSTIN already exists
    if (GSTIN) {
      const gstinExists = await Party.findOne({ GSTIN });
      if (gstinExists) {
        return res.status(400).json({
          success: false,
          msg: `GSTIN "${GSTIN}" already exists`,
        });
      }
    }

    // 5. CHECK IF PAN already exists
    if (PANno) {
      const panExists = await Party.findOne({ PANno });
      if (panExists) {
        return res.status(400).json({
          success: false,
          msg: `PAN "${PANno}" already exists`,
        });
      }
    }

    // 6. STORE DATA IN DATABASE
    const party = await Party.create({
      ...validationResult.data,
      businessId: req.body?.businessId,
      clientId: req.user?.id,
    });

    if (!party) {
      return res.status(422).json({
        success: false,
        msg: "Failed to create party",
      });
    }

    // 7. SUCCESS RESPONSE
    return res.status(201).json({
      success: true,
      msg: "Party created successfully",
      party,
    });
  } catch (error) {
    console.log("ERROR IN CREATING PARTY:", error);

    // Handle duplicate key errors from MongoDB
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]; // GSTIN or PAN
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
