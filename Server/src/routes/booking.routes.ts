import express from "express";
import * as bookingController from "../controllers/booking.controller";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.use(authenticate); // All routes are protected

router.get("/user/:userId", bookingController.getUserBookings);
router.get("/user/:userId/stats", bookingController.getBookingStats);
router.get("/availability", bookingController.checkAvailability);
router.get("/:id", bookingController.getBookingById);
router.post("/", bookingController.createBooking);
router.put("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.cancelBooking);

export default router;
