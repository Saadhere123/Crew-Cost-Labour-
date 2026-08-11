import { Router } from "express";
import crypto from "crypto";
import { getRaw, save, buildState } from "../data.js";

const router = Router();
const uid = () => crypto.randomBytes(4).toString("hex");

router.post("/", (req, res) => {
  const { name, budget } = req.body || {};
  if (!name || !(Number(budget) > 0)) {
    return res.status(400).json({ error: "name and a positive budget are required" });
  }
  const db = getRaw();
  db.tasks.push({
    id: uid(),
    name: String(name).trim(),
    budget: Number(budget),
    assigned: [],
    consumed: 0,
    overBudget: 0,
    laborBy: {},
    hoursBy: {},
    lastTick: Date.now(),
  });
  save();
  res.status(201).json(buildState());
});

router.delete("/:id", (req, res) => {
  const db = getRaw();
  const { id } = req.params;
  db.tasks = db.tasks.filter((t) => t.id !== id);
  Object.entries(db.clockedIn).forEach(([empId, taskId]) => {
    if (taskId === id) delete db.clockedIn[empId];
  });
  save();
  res.json(buildState());
});

router.post("/:id/assign", (req, res) => {
  const db = getRaw();
  const task = db.tasks.find((t) => t.id === req.params.id);
  const { employeeId } = req.body || {};
  if (!task) return res.status(404).json({ error: "Task not found" });
  if (!db.employees.find((e) => e.id === employeeId)) {
    return res.status(404).json({ error: "Employee not found" });
  }
  if (!task.assigned.includes(employeeId)) task.assigned.push(employeeId);
  save();
  res.json(buildState());
});

router.delete("/:id/assign/:employeeId", (req, res) => {
  const db = getRaw();
  const task = db.tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.assigned = task.assigned.filter((eid) => eid !== req.params.employeeId);
  if (db.clockedIn[req.params.employeeId] === task.id) {
    delete db.clockedIn[req.params.employeeId];
  }
  save();
  res.json(buildState());
});

export default router;
