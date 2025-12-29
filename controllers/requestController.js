import Donor from "../models/Donor.models.js";
import Request from "../models/Request.models.js";
import User from "../models/User.models.js";

// Send Request
export const sendRequest = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const { donorId } = req.body;

    // Find donor
    const donor = await Donor.findById(donorId);
    if (!donor) return res.status(400).json({ message: "Donor not found" });

    // Find requester
    const requester = await User.findById(requesterId);
    if (!requester)
      return res.status(400).json({ message: "Requester not found" });

    // Prevent duplicate request
    const existing = await Request.findOne({ requesterId, donorId });
    if (existing)
      return res.status(400).json({ message: "Request already sent" });

    const newRequest = await Request.create({
      requesterId,
      donorId,
      manualLocation: requester.manualLocation || "",
      location: requester.location
        ? requester.location.coordinates.join(",")
        : "",
    });

    res.status(201).json({
      message: "Request sent successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* reuests that you send */
export const getMyRequest = async (req, res) => {
  try {
    const requesterId = req.user.id;

    const requests = await Request.find({ requesterId })
      .populate("donorId", "name email bloodType phoneNumber manualLocation")
      .populate("requesterId", "name email phoneNumber manualLocation");

    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
  }
};

/* received requests from other */
export const getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find donor profile owned by this user
    const donor = await Donor.findOne({ userId });
    if (!donor)
      return res.status(400).json({ message: "Donor profile not found" });

    const requests = await Request.find({ donorId: donor._id })
      .populate("requesterId", "name email phoneNumber manualLocation")
      .populate("donorId", "name email phoneNumber manualLocation");

    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
  }
};

/* accept the received req */
export const acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const donor = await Donor.findOne({userId});
    if(!donor) return res.status(400).json({message:"no donor found"});
    /* only donor can accept/reject */
    if (request.donorId.toString() !== donor._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.Status = "accepted";
    await request.save();

    res.status(200).json({ message: "Request accepted", request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* reject the received req */
export const rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const donor = await Donor.findOne({userId});
    if(!donor) return res.status(400).json({message:"no donor found"});
    /* only donor can accept/reject */
    if (request.donorId.toString() !== donor._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.Status = "rejected";
    await request.save();

    res.status(200).json({ message: "Request rejected", request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
