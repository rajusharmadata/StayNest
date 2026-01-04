import { NextFunction, Request, Response } from "express";
import Booking from "../models/Booking.model";
import Listing from "../models/Listing.model";
import Review from "../models/Review.model";
import { AppError } from "../utils/AppError";

export const getListingReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { listingId } = req.params;

    const reviews = await Review.find({ listingId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
      count: reviews.length,
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, listingId, rating, comment } = req.body;

    // Check if user has completed booking for this listing
    const completedBooking = await Booking.findOne({
      userId,
      listingId,
      status: "completed",
    });

    if (!completedBooking) {
      throw new AppError(
        "You can only review properties you have stayed at",
        400
      );
    }

    // Check if user has already reviewed this listing
    const existingReview = await Review.findOne({ userId, listingId });
    if (existingReview) {
      throw new AppError("You have already reviewed this property", 400);
    }

    // Create review
    const review = await Review.create({
      userId,
      listingId,
      rating,
      comment,
    });

    // Update listing rating
    const allReviews = await Review.find({ listingId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Listing.findByIdAndUpdate(listingId, {
      rating: Number(avgRating.toFixed(1)),
      reviews: allReviews.length,
    });

    const populatedReview = await Review.findById(review._id).populate(
      "userId",
      "name avatar"
    );

    res.status(201).json({
      success: true,
      data: populatedReview,
      message: "Review created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { rating, comment },
      { new: true, runValidators: true }
    ).populate("userId", "name avatar");

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    // Recalculate listing rating
    const allReviews = await Review.find({ listingId: review.listingId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Listing.findByIdAndUpdate(review.listingId, {
      rating: Number(avgRating.toFixed(1)),
    });

    res.json({
      success: true,
      data: review,
      message: "Review updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      throw new AppError("Review not found", 404);
    }

    // Recalculate listing rating
    const allReviews = await Review.find({ listingId: review.listingId });
    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    await Listing.findByIdAndUpdate(review.listingId, {
      rating: allReviews.length > 0 ? Number(avgRating.toFixed(1)) : undefined,
      reviews: allReviews.length,
    });

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
