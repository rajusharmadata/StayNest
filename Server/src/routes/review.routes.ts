import express from "express";
import * as reviewController from "../controllers/review.controller";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.get("/listing/:listingId", reviewController.getListingReviews);
router.post("/", authenticate, reviewController.createReview);
router.put("/:id", authenticate, reviewController.updateReview);
router.delete("/:id", authenticate, reviewController.deleteReview);

export default router;
