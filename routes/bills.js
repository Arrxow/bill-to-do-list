import express from "express";
import Bill from "../models/Bill.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

function startOfMonth(date) {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfMonth(date) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
}

router.get("/", async (req, res) => {
  try {
    const { month, status } = req.query;
    const filter = { userId: req.user._id };
    if (status && ["incomplete", "pending", "completed"].includes(status)) {
      filter.status = status;
    }
    if (month) {
      const [y, m] = month.split("-").map(Number);
      if (!isNaN(y) && !isNaN(m)) {
        const start = new Date(y, m - 1, 1);
        const end = endOfMonth(start);
        filter.dueDate = { $gte: start, $lte: end };
      }
    }
    const bills = await Bill.find(filter).sort({ dueDate: 1, status: 1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch bills" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, dueDate, status, amount, notes, recurring } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Title required" });
    const due = dueDate ? new Date(dueDate) : new Date();
    const bill = new Bill({
      userId: req.user._id,
      title: title.trim(),
      dueDate: due,
      status: ["incomplete", "pending", "completed"].includes(status) ? status : "incomplete",
      amount: amount != null ? Number(amount) : undefined,
      notes: notes?.trim() || undefined,
      recurring: Boolean(recurring),
    });
    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to create bill" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const bill = await Bill.findOne({ _id: req.params.id, userId: req.user._id });
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch bill" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const bill = await Bill.findOne({ _id: req.params.id, userId: req.user._id });
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    const { title, dueDate, status, amount, notes, recurring } = req.body;
    if (title !== undefined) bill.title = title.trim();
    if (dueDate !== undefined) bill.dueDate = new Date(dueDate);
    if (status !== undefined && ["incomplete", "pending", "completed"].includes(status)) bill.status = status;
    if (amount !== undefined) bill.amount = amount == null ? undefined : Number(amount);
    if (notes !== undefined) bill.notes = notes?.trim() || undefined;
    if (recurring !== undefined) bill.recurring = Boolean(recurring);
    await bill.save();
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update bill" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const bill = await Bill.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to delete bill" });
  }
});

export default router;
