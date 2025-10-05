import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const loginUser = async (req, res) => {
  const { loginID, password } = req.body;

  try {
    const user = await User.findOne({ loginID });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.role);

      // Send token in cookie
      res.cookie("token", token, {
        httpOnly: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        _id: user._id,
        name: user.name,
        loginID: user.loginID,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Invalid loginID or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};