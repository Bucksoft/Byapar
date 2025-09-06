import jwt from "jsonwebtoken";

export async function isAuth(req, res, next) {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return res.status(401).json({ success: false, msg: "Token not found" });
    }
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Authentication failed! Token is invalid or expired" });
  }
}
