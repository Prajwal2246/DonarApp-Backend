import mongoose from "mongoose";

const DonorSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    bloodType: {
      type: String,
      required: true,
      trim: true,
    },
    manualLocation: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
);

DonorSchema.index({ location: "2dsphere" });

export default mongoose.model("Donor", DonorSchema);
