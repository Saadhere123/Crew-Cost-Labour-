import { Router } from "express";
import { getRaw, save, buildState } from "../data.js";
import { advanceTask } from "../utils/calc.js";

const router = Router();

router.post("/pause", (req, res) => {
  const db = getRaw();
  // settle every task under the current paused value before flipping it
  db.tasks.forEach((t) => advanceTask(t, db.employees, db.clockedIn, db.paused));
  db.paused = !db.paused;
  save();
  res.json(buildState());
});

export default router;
