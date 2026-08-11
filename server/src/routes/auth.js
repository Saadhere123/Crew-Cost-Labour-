import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = Router();

// Demo admin credentials come from env, hashed once at startup.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "admin123", 10);

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const validUser = username === ADMIN_USERNAME;
  const validPass = validUser && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);

  if (!validUser || !validPass) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign(
    { sub: username, role: "admin" },
    process.env.JWT_SECRET || "dev_secret_change_me",
    { expiresIn: process.env.JWT_EXPIRES_IN || "12h" }
  );

  res.json({ token, user: { username, role: "admin" } });
});

export default router;
