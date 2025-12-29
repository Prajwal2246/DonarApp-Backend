import express from "express";
import { registerDonor } from "../controllers/registerDonors.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getAllDonars } from "../controllers/getAllDonarsController.js";
import { getNearbyDonors } from "../controllers/nearbyDonorController.js";

const router = express.Router();

router.post("/registeredDonors",authMiddleware,registerDonor);
router.get("/",authMiddleware,getAllDonars);
router.get("/nearby",authMiddleware,getNearbyDonors)

export default router;