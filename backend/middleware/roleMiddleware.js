const roleMiddleware =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Authentication is required" });
    if (!allowedRoles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });
    return next();
  };

export default roleMiddleware;
