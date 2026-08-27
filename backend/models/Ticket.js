import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    url: String,
    filename: String,
    mimetype: String,
    size: Number,
  },
  { _id: false },
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      required: true,
    },
    changedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    attachment: { type: attachmentSchema, default: undefined },
    statusHistory: { type: [statusHistorySchema], default: [] },
  },
  { timestamps: true },
);

ticketSchema.pre("validate", function addInitialHistory() {
  if (this.isNew && this.statusHistory.length === 0)
    this.statusHistory.push({
      status: this.status || "Open",
      changedAt: new Date(),
    });
});

export default mongoose.model("Ticket", ticketSchema);
