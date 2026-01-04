import express from "express";
import * as listingController from "../controllers/listing.controller";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.get("/", listingController.getAllListings);
router.get("/category/:category", listingController.getListingsByCategory);
router.get("/search", listingController.searchListings);
router.get("/:id", listingController.getListingById);

// Protected routes
router.post("/", authenticate, listingController.createListing);
router.put("/:id", authenticate, listingController.updateListing);
router.delete("/:id", authenticate, listingController.deleteListing);

export default router;
