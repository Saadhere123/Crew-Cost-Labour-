import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import taskRoutes from "./routes/tasks.js";
import clockRoutes from "./routes/clock.js";
import systemRoutes from "./routes/system.js";
import { requireAuth } from "./middleware/auth.js";
import { buildState } from "./data.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true, service: "crewcost-server" }));

app.use("/api/auth", authRoutes);

// everything below this line requires a valid login token
app.use("/api", requireAuth);

app.get("/api/state", (req, res) => res.json(buildState()));
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/clock", clockRoutes);
app.use("/api/system", systemRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`CrewCost API listening on http://localhost:${PORT}`);
});
