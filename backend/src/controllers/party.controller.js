import { partySchema } from "../config/validation";

export function createParty(req, res) {
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
    const validationResult = partySchema.safeParse(req.body);
    // ----> VALIDATION FAILED --- return res 400
    if (!validationResult.success) {
      const validationErrors = validationResult.error.format();
      return res
        .status(422)
        .json({ success: false, msg: "Validation failed", validationErrors });
    }

    // 3. CHECK IF PARTY ALREADY EXISTS OR NOT
    // IF EXISTS, RETURN FAILURE RESPONSE

    // 4. STORE DATA IN DATABASE
    // ------> FAILED TO STORE DATA IN DATABASE

    // 5. SUCCESS RESPONSE
  } catch (error) {
    console.log("ERROR IN CREATING PARTY ");
    return res.status(500).json({ err: "Internal server error" });
  }
}
