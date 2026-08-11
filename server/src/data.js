import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { advanceTask, deriveTaskView } from "./utils/calc.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = path.join(__dirname, "..", "data", "store.json");
const SEED_PATH = path.join(__dirname, "..", "data", "store.seed.json");

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

if (!fs.existsSync(STORE_PATH)) {
  const seed = readJSON(SEED_PATH);
  const now = Date.now();
  seed.tasks.forEach((t) => (t.lastTick = now));
  fs.writeFileSync(STORE_PATH, JSON.stringify(seed, null, 2));
}

let db = readJSON(STORE_PATH);

export function save() {
  fs.writeFileSync(STORE_PATH, JSON.stringify(db, null, 2));
}

export function getRaw() {
  return db;
}

/** Settles every task up to now and returns the full snapshot the frontend polls. */
export function buildState() {
  db.tasks.forEach((task) => advanceTask(task, db.employees, db.clockedIn, db.paused));
  save();
  return {
    employees: db.employees,
    tasks: db.tasks.map((t) => deriveTaskView(t, db.employees, db.clockedIn)),
    clockedIn: db.clockedIn,
    paused: db.paused,
  };
}

export function findTask(id) {
  return db.tasks.find((t) => t.id === id);
}
export function findEmployee(id) {
  return db.employees.find((e) => e.id === id);
}
