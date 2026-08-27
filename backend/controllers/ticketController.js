import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";
const priorities = ["Low", "Medium", "High"];
const statuses = ["Open", "In Progress", "Resolved"];
const createTicket = async (req, res, next) => {
  try {
    const { title, description, priority = "Medium" } = req.body;
    if (!title?.trim() || !description?.trim())
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    if (!priorities.includes(priority))
      return res.status(400).json({ message: "Invalid priority" });
    const attachment = req.file
      ? {
          url: `/uploads/${req.file.filename}`,
          filename: req.file.filename,
          mimetype: req.file.mimetype,
          size: req.file.size,
        }
      : undefined;
    const ticket = await Ticket.create({
      title: title.trim(),
      description: description.trim(),
      priority,
      user: req.user.id,
      attachment,
      status: "Open",
      statusHistory: [{ status: "Open", changedAt: new Date() }],
    });
    return res.status(201).json({ ticket });
  } catch (error) {
    return next(error);
  }
};
const getTickets = async (req, res, next) => {
  try {
    const query = req.user.role === "customer" ? { user: req.user.id } : {};
    const { search, status, priority } = req.query;
    if (status && !statuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });
    if (priority && !priorities.includes(priority))
      return res.status(400).json({ message: "Invalid priority" });
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search?.trim()) {
      const term = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
      ];
    }
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      100,
    );
    const total = await Ticket.countDocuments(query);
    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "name email role");
    return res.json({
      tickets,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return next(error);
  }
};
const getTicketById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: "Invalid ticket ID" });
    const ticket = await Ticket.findById(req.params.id).populate(
      "user",
      "name email role",
    );
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (
      req.user.role === "customer" &&
      ticket.user._id.toString() !== req.user.id
    )
      return res.status(404).json({ message: "Ticket not found" });
    return res.json({ ticket });
  } catch (error) {
    return next(error);
  }
};
const updateTicketStatus = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: "Invalid ticket ID" });
    const { status } = req.body;
    if (!statuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (ticket.status === status)
      return res.json({ message: "Ticket status is unchanged", ticket });
    const nextStatus = {
      Open: "In Progress",
      "In Progress": "Resolved",
      Resolved: null,
    };
    if (nextStatus[ticket.status] !== status)
      return res
        .status(400)
        .json({
          message: `Invalid status transition from ${ticket.status} to ${status}`,
        });
    ticket.status = status;
    ticket.statusHistory.push({ status, changedAt: new Date() });
    await ticket.save();
    return res.json({ ticket });
  } catch (error) {
    return next(error);
  }
};
const getAnalytics = async (_req, res, next) => {
  try {
    const [analytics] = await Ticket.aggregate([
      {
        $facet: {
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          byPriority: [{ $group: { _id: "$priority", count: { $sum: 1 } } }],
          total: [{ $count: "count" }],
        },
      },
      {
        $project: {
          byStatus: 1,
          byPriority: 1,
          total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
        },
      },
    ]);
    return res.json(analytics || { total: 0, byStatus: [], byPriority: [] });
  } catch (error) {
    return next(error);
  }
};
export {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  getAnalytics,
};
