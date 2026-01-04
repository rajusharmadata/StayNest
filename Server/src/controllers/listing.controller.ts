import { NextFunction, Request, Response } from "express";
import Listing from "../models/Listing.model";
import { AppError } from "../utils/AppError";

export const getAllListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 50, offset = 0, minPrice, maxPrice } = req.query;

    const query: any = {};

    if (minPrice) query.price = { $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: listings,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getListingsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category } = req.params;
    const listings = await Listing.find({ category });

    res.json({
      success: true,
      data: listings,
      count: listings.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      throw new AppError("Listing not found", 404);
    }

    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

export const createListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listing = await Listing.create(req.body);

    res.status(201).json({
      success: true,
      data: listing,
      message: "Listing created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!listing) {
      throw new AppError("Listing not found", 404);
    }

    res.json({
      success: true,
      data: listing,
      message: "Listing updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);

    if (!listing) {
      throw new AppError("Listing not found", 404);
    }

    res.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const searchListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q, location, minPrice, maxPrice } = req.query;

    const query: any = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (minPrice) query.price = { $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

    const listings = await Listing.find(query);

    res.json({
      success: true,
      data: listings,
      count: listings.length,
    });
  } catch (error) {
    next(error);
  }
};
