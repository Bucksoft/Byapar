export async function createSalesReturn(req, res) {
  try {
    
  } catch (error) {
    console.log("ERROR IN CREATING SALES RETURN");
    console.log(error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}
