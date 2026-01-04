import { NextFunction, Request, Response } from "express";
import User from "../models/User.model";
import { AppError } from "../utils/AppError";

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      data: user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id).populate("favorites");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      data: user.favorites,
      count: user.favorites.length,
    });
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, listingId } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.favorites.includes(listingId as any)) {
      throw new AppError("Listing already in favorites", 400);
    }

    user.favorites.push(listingId as any);
    await user.save();

    const updatedUser = await User.findById(id).populate("favorites");

    res.json({
      success: true,
      data: updatedUser?.favorites,
      message: "Added to favorites",
    });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, listingId } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== listingId
    );
    await user.save();

    const updatedUser = await User.findById(id).populate("favorites");

    res.json({
      success: true,
      data: updatedUser?.favorites,
      message: "Removed from favorites",
    });
  } catch (error) {
    next(error);
  }
};
