export async function createSalesReturn(req, res) {
  try {
    console.log("REQUEST BODY ", req.body);
    const businessId = req.params?.id;
    res.json({ msg: "OK" });
  } catch (error) {
    console.log("ERROR IN CREATING SALES RETURN");
    console.log(error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}
