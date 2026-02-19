import mongoose from "mongoose";

const statusEnum = ["incomplete", "pending", "completed"];

const billSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: statusEnum, default: "incomplete" },
    amount: { type: Number },
    notes: { type: String },
    recurring: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Bill", billSchema);
