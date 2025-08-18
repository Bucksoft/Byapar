import { partySchema } from "../config/validation.js";
import Party from "../models/party.schema.js";

export async function createParty(req, res) {
  try {
    // 1. GET THE DATA FROM THE FRONTEND
    const data = req.body;
    // IF NO DATA ---> RETURN RESPONSE
    if (!data) {
      return res
        .status(400)
        .json({ success: false, msg: "Please enter all the fields" });
    }

    // 2. VALIDATION
    const validaionResult = partySchema.safeParse(data);
    // ----> VALIDATION FAILED --- return res 400
    if (!validaionResult.success) {
      const validationError = validaionResult.error.format();
      return res
        .status(422)
        .json({ success: false, msg: "Validation failed", validationError });
    }

    // 3. CHECK IF PARTY ALREADY EXISTS OR NOT
    const { email } = data;
    const partyExists = await Party.findOne({ email });
    // IF EXISTS, RETURN FAILURE RESPONSE
    if (partyExists) {
      return res
        .status(400)
        .json({ success: false, msg: "Party already exists" });
    }

    // 4. STORE DATA IN DATABASE
    const party = await Party.create(req.body);
    // ------> FAILED TO STORE DATA IN DATABASE
    if (!party) {
      return res
        .status(422)
        .json({ success: false, msg: "Failed to create party" });
    }
    // 5. SUCCESS RESPONSE
    return res
      .status(201)
      .json({ success: true, msg: "Party created successfully", party });
  } catch (error) {
    console.log("ERROR IN CREATING PARTY");
    console.log(error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

// get All parties
export async function getAllParties(req, res) {
  try {
    const parties = await Party.find();
    if (!parties) {
      return res.status(400).json({ success: false, msg: "Parties not found" });
    }
    return res.status(200).json(parties);
  } catch (error) {
    console.log("ERROR IN FETCHING ALL PARTIES ");
    return res.status(500).json({ err: "Internal server error", error });
  }
}
