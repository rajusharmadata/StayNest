import { NextFunction, Request, Response } from "express";
import Booking from "../models/Booking.model";
import Listing from "../models/Listing.model";
import { AppError } from "../utils/AppError";

export const getUserBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId })
      .populate("listingId", "title location price image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
      count: bookings.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "name email avatar")
      .populate("listingId");

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, listingId, checkIn, checkOut, guests, totalPrice } =
      req.body;

    // Validate listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw new AppError("Listing not found", 404);
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      throw new AppError("Check-in date cannot be in the past", 400);
    }

    if (checkOutDate <= checkInDate) {
      throw new AppError("Check-out date must be after check-in date", 400);
    }

    // Validate guest count
    if (guests > listing.guests) {
      throw new AppError(
        `This property can accommodate maximum ${listing.guests} guests`,
        400
      );
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      listingId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          checkIn: { $lte: checkInDate },
          checkOut: { $gte: checkInDate },
        },
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkOutDate },
        },
        {
          checkIn: { $gte: checkInDate },
          checkOut: { $lte: checkOutDate },
        },
      ],
    });

    if (overlappingBooking) {
      throw new AppError("Property is not available for selected dates", 400);
    }

    // Calculate total price
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const calculatedPrice = nights * listing.price;

    // Create booking
    const booking = await Booking.create({
      userId,
      listingId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice: totalPrice || calculatedPrice,
      status: "confirmed",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("listingId", "title location price image")
      .populate("userId", "name email");

    res.status(201).json({
      success: true,
      data: populatedBooking,
      message: "Booking created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, guests } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    // Cannot update cancelled or completed bookings
    if (booking.status === "cancelled" || booking.status === "completed") {
      throw new AppError(`Cannot update ${booking.status} booking`, 400);
    }

    // If updating dates, validate them
    if (checkIn || checkOut) {
      const newCheckIn = checkIn ? new Date(checkIn) : booking.checkIn;
      const newCheckOut = checkOut ? new Date(checkOut) : booking.checkOut;

      if (newCheckOut <= newCheckIn) {
        throw new AppError("Check-out date must be after check-in date", 400);
      }

      // Check for overlapping bookings (excluding current booking)
      const overlappingBooking = await Booking.findOne({
        _id: { $ne: id },
        listingId: booking.listingId,
        status: { $in: ["pending", "confirmed"] },
        $or: [
          {
            checkIn: { $lte: newCheckIn },
            checkOut: { $gte: newCheckIn },
          },
          {
            checkIn: { $lte: newCheckOut },
            checkOut: { $gte: newCheckOut },
          },
          {
            checkIn: { $gte: newCheckIn },
            checkOut: { $lte: newCheckOut },
          },
        ],
      });

      if (overlappingBooking) {
        throw new AppError("Property is not available for selected dates", 400);
      }
    }

    // If updating guests, validate capacity
    if (guests) {
      const listing = await Listing.findById(booking.listingId);
      if (listing && guests > listing.guests) {
        throw new AppError(
          `This property can accommodate maximum ${listing.guests} guests`,
          400
        );
      }
    }

    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("listingId", "title location price image")
      .populate("userId", "name email");

    res.json({
      success: true,
      data: updatedBooking,
      message: "Booking updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    if (booking.status === "cancelled") {
      throw new AppError("Booking is already cancelled", 400);
    }

    if (booking.status === "completed") {
      throw new AppError("Cannot cancel completed booking", 400);
    }

    // Check if cancellation is within allowed time (e.g., 24 hours before check-in)
    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    const hoursUntilCheckIn =
      (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 24) {
      throw new AppError(
        "Cancellation must be made at least 24 hours before check-in",
        400
      );
    }

    booking.status = "cancelled";
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("listingId", "title location price image")
      .populate("userId", "name email");

    res.json({
      success: true,
      data: populatedBooking,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const checkAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { listingId, checkIn, checkOut } = req.query;

    if (!listingId || !checkIn || !checkOut) {
      throw new AppError("Missing required parameters", 400);
    }

    const checkInDate = new Date(checkIn as string);
    const checkOutDate = new Date(checkOut as string);

    // Find overlapping bookings
    const overlappingBookings = await Booking.find({
      listingId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          checkIn: { $lte: checkInDate },
          checkOut: { $gte: checkInDate },
        },
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkOutDate },
        },
        {
          checkIn: { $gte: checkInDate },
          checkOut: { $lte: checkOutDate },
        },
      ],
    });

    const isAvailable = overlappingBookings.length === 0;

    res.json({
      success: true,
      data: {
        available: isAvailable,
        conflictingBookings: overlappingBookings.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const totalBookings = await Booking.countDocuments({ userId });
    const confirmedBookings = await Booking.countDocuments({
      userId,
      status: "confirmed",
    });
    const cancelledBookings = await Booking.countDocuments({
      userId,
      status: "cancelled",
    });
    const completedBookings = await Booking.countDocuments({
      userId,
      status: "completed",
    });

    // Calculate total spent
    const bookings = await Booking.find({
      userId,
      status: { $ne: "cancelled" },
    });
    const totalSpent = bookings.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0
    );

    // Upcoming bookings
    const upcomingBookings = await Booking.countDocuments({
      userId,
      status: "confirmed",
      checkIn: { $gte: new Date() },
    });

    res.json({
      success: true,
      data: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        completedBookings,
        upcomingBookings,
        totalSpent,
      },
    });
  } catch (error) {
    next(error);
  }
};
