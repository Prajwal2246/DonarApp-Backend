import Donor from "../models/Donor.models.js";
import axios from "axios";

export const registerDonor = async (req, res) => {
  const convertAddressToCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: { q: address, format: "json", limit: 1 },
        },
      );
      if (response.data.length > 0) {
        return {
          longitude: Number(response.data[0].lon),
          latitude: Number(response.data[0].lat),
        };
      }
      return null;
    } catch (err) {
      console.error("Geocoding error:", err);
      return null;
    }
  };

  const convertCoordinatesToAddress = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            lat: lat,
            lon: lon,
            format: "json",
          },
          headers: {
            "User-Agent": "BloodDonationApp/1.0 (contact@yourdomain.com)",
          },
        },
      );

      if (response.data && response.data.display_name) {
        // display_name gives the full string address
        return response.data.display_name;
      }

      return "Address not found";
    } catch (err) {
      console.error("Reverse Geocoding error:", err.message);
      return null;
    }
  };
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user.id;

    const existingUser = await Donor.findOne({ userId });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "You are already registered as a donor" });
    }

    const {
      name,
      email,
      bloodType,
      phoneNumber,
      latitude,
      longitude,
      manualLocation,
    } = req.body;

    let finalLat = Number(latitude);
    let finalLon = Number(longitude);

    // 👉 FIX: consider 0, null, undefined as missing
    const coordsMissing =
      finalLat === undefined ||
      finalLon === undefined ||
      finalLat === null ||
      finalLon === null ||
      isNaN(finalLat) ||
      isNaN(finalLon);

    // 👉 Auto geocode when coords are missing
    if (coordsMissing && manualLocation) {
      const geoData = await convertAddressToCoordinates(manualLocation);
      if (!geoData) {
        return res.status(400).json({ message: "Invalid address" });
      }
      finalLat = geoData.latitude;
      finalLon = geoData.longitude;
    }

    if (!finalLat || !finalLon) {
      return res.status(400).json({ message: "Could not retrieve location" });
    }

    const address = await convertCoordinatesToAddress(latitude, longitude);

    const donor = await Donor.create({
      userId,
      name,
      email,
      phoneNumber,
      bloodType,
      manualLocation: address,
      location: { type: "Point", coordinates: [finalLon, finalLat] },
    });

    res.status(201).json({ message: "Donor registered", donor });
  } catch (error) {
    console.error("RegisterDonor Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
