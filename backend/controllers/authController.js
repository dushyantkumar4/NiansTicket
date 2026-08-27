import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const createToken = (user) => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};
const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name?.trim() || !email?.trim() || !password)
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail }))
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      role: "customer",
    });
    return res
      .status(201)
      .json({
        message: "User registered successfully",
        token: createToken(user),
        user: userResponse(user),
      });
  } catch (error) {
    return next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email?.trim() || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");
    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    )
      return res.status(401).json({ message: "Invalid credentials" });
    return res.json({
      message: "Login successful",
      token: createToken(user),
      user: userResponse(user),
    });
  } catch (error) {
    return next(error);
  }
};
const getMe = (req, res) => res.json({ user: req.user });
const adminTest = (_req, res) => res.json({ message: "Admin access granted" });
export { signup, login, getMe, adminTest };
