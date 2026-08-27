import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  const token = authorization.slice(7).trim();
  if (!token)
    return res.status(401).json({ message: "Authorization token is required" });
  if (!process.env.JWT_SECRET)
    return res
      .status(500)
      .json({ message: "Server authentication is not configured" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({
        message:
          error.name === "TokenExpiredError"
            ? "Token has expired"
            : "Invalid token",
      });
  }
};

export default authMiddleware;
