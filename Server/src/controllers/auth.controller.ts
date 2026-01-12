import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model";
import { AppError } from "../utils/AppError";
import { generateAvatar } from "../utils/generateAvatar";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

/* REGISTER */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) throw new AppError("User already exists", 400);

    const user = await User.create({
      name,
      email,
      password,
      avatar: generateAvatar(name),
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* LOGIN */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select(
      "+password +refreshToken"
    );
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid credentials", 401);
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        favorites: user.favorites,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* GET CURRENT USER */
export const getCurrentUser = (req: Request, res: Response) => {
  const user = req.user as any;

  res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

/* REFRESH TOKEN */
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new AppError("Unauthorized", 401);

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== token) {
      throw new AppError("Invalid refresh token", 401);
    }

    const newAccessToken = generateAccessToken(user.id);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

/* LOGOUT (REAL PRODUCTION LOGOUT) */
export const logout = async (req: Request, res: Response) => {
  const user = req.user as any;

  await User.findByIdAndUpdate(user._id, { refreshToken: null });

  res.clearCookie("refreshToken");

  res.json({
    success: true,
    message: "Logged out securely",
  });
};
