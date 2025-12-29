import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  acceptRequest,
  getMyRequest,
  getReceivedRequests,
  rejectRequest,
  sendRequest,
} from "../controllers/requestController.js";
import { deleteRequest } from "../controllers/deleteRequest.js";

const router = express.Router();

/* post */
router.post("/send", authMiddleware, sendRequest);

/* get */
router.get("/", authMiddleware, getMyRequest);
router.get("/received", authMiddleware, getReceivedRequests);

/* put */
router.put("/accept/:id", authMiddleware, acceptRequest);
router.put("/reject/:id", authMiddleware, rejectRequest);

/* delete */
router.delete("/:id", authMiddleware, deleteRequest);

export default router;
