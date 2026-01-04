import express from "express";
import * as userController from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.get("/profile/:id", authenticate, userController.getUserProfile);
router.put("/profile/:id", authenticate, userController.updateUserProfile);
router.get("/:id/favorites", authenticate, userController.getUserFavorites);
router.post(
  "/:id/favorites/:listingId",
  authenticate,
  userController.addFavorite
);
router.delete(
  "/:id/favorites/:listingId",
  authenticate,
  userController.removeFavorite
);

export default router;
