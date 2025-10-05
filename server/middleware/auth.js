import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const protect = async (req, res, next) => {
  const token = req.cookies?.token;
  
  if (!token) {
    return res.status(401).json({ 
      message: "Not authorized, no token",
      redirect: "/login" // Add redirect hint for frontend
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) { 
      return res.status(401).json({ 
        message: "User not found",
        redirect: "/login"
      });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ 
      message: "Not authorized, token failed",
      redirect: "/login"
    });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
};
