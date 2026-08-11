import { Router } from "express";
import crypto from "crypto";
import { getRaw, save, buildState } from "../data.js";

const router = Router();
const uid = () => crypto.randomBytes(4).toString("hex");

router.post("/", (req, res) => {
  const { name, rate } = req.body || {};
  if (!name || !(Number(rate) > 0)) {
    return res.status(400).json({ error: "name and a positive rate are required" });
  }
  const db = getRaw();
  db.employees.push({ id: uid(), name: String(name).trim(), rate: Number(rate) });
  save();
  res.status(201).json(buildState());
});

router.delete("/:id", (req, res) => {
  const db = getRaw();
  const { id } = req.params;
  db.employees = db.employees.filter((e) => e.id !== id);
  db.tasks.forEach((t) => (t.assigned = t.assigned.filter((eid) => eid !== id)));
  delete db.clockedIn[id];
  save();
  res.json(buildState());
});

export default router;
