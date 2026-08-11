import { Router } from "express";
import { getRaw, save, buildState } from "../data.js";
import { advanceTask } from "../utils/calc.js";

const router = Router();

router.post("/in", (req, res) => {
  const db = getRaw();
  const { employeeId, taskId } = req.body || {};
  const employee = db.employees.find((e) => e.id === employeeId);
  const task = db.tasks.find((t) => t.id === taskId);
  if (!employee || !task) return res.status(404).json({ error: "Employee or task not found" });
  if (!task.assigned.includes(employeeId)) {
    return res.status(400).json({ error: "Employee is not assigned to this task" });
  }

  // settle whatever task they were previously on before moving them
  const prevTaskId = db.clockedIn[employeeId];
  if (prevTaskId) {
    const prevTask = db.tasks.find((t) => t.id === prevTaskId);
    if (prevTask) advanceTask(prevTask, db.employees, db.clockedIn, db.paused);
  }
  // settle the target task under its old crew before this employee joins it
  advanceTask(task, db.employees, db.clockedIn, db.paused);

  db.clockedIn[employeeId] = taskId;
  save();
  res.json(buildState());
});

router.post("/out", (req, res) => {
  const db = getRaw();
  const { employeeId } = req.body || {};
  const taskId = db.clockedIn[employeeId];
  if (taskId) {
    const task = db.tasks.find((t) => t.id === taskId);
    if (task) advanceTask(task, db.employees, db.clockedIn, db.paused);
  }
  delete db.clockedIn[employeeId];
  save();
  res.json(buildState());
});

export default router;
