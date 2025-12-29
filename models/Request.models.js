import mongoose from "mongoose";

const requestSchema = mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    Status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    Location: {
      type: String,
      trim: true,
    },
    manualLocation:{
      type:String,
      trim:true,
      default:"",
    }
  },
  { timesStamps: true }
);

export default mongoose.model("Request", requestSchema);
