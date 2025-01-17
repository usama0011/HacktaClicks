import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware to verify token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded; // Attach decoded user info to request
    next();
  });
};

// Middleware to allow access to users
export const verifyUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Access denied: Users only" });
  }
  next();
};

// Middleware to allow access to admins
export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

// Middleware to allow access to superadmins
export const verifySuperAdmin = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Access denied: SuperAdmins only" });
  }
  next();
};
