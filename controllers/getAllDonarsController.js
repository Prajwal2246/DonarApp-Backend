import Donor from "../models/Donor.models.js";
import mongoose from "mongoose";

export const getAllDonars = async (req, res) => {
  try {
    const userId = req.user?.id;
    let query = {};
    if (userId) {
      query = { userId: { $ne: new mongoose.Types.ObjectId(userId) } }; //exclude the  logged-in user
    }
    const donors = await Donor.find(query);

    res.status(200).json(donors);
  } catch (error) {
    console.error("error fetching donors", error);
    res.status(500).json({ message: "ServerError" });
  }
};
