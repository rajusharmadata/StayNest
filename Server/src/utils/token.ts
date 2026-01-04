import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

export const generateRefreshToken = (userId: string) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "30d",
  });
