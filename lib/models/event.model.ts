import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide an event title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide an event description"],
    },
    date: {
      type: Date,
      required: [true, "Please provide an event date"],
    },
    category: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
