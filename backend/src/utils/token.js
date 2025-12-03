import jwt from "jsonwebtoken";
import crypto from "crypto";

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET in environment variables");
  }
  return secret;
};

export const signToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    getSecret(),
    { expiresIn: "1h" } // Access token expires in 1 hour
  );
};

export const signRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      type: "refresh",
    },
    getSecret(),
    { expiresIn: "7d" } // Refresh token expires in 7 days
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, getSecret());
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export default signToken;

