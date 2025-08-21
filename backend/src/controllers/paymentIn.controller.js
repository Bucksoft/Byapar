import { paymentInSchema } from "../config/validation.js";

export async function createPaymentIn(req, res) {
  try {
    // GET THE PAYMENT IN DATA
    const data = req.body;

    // VALIDATE THE DATA
    const validatedResult = paymentInSchema.safeParse(data);
    if (!validatedResult.success) {
      const validationError = validatedResult.error.format();
      return res.status(400).json({
        status: false,
        msg: "Validation failed",
        validationError,
      });
    }

    //
  } catch (error) {
    console.log("ERROR IN CREATING PAYMENT IN ");
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}
