import "./env.js";

import express from "express";
import { migrate } from "./db/migrate.js";
import { pool } from "./db/pool.js";
import { seed } from "./db/seed.js";
import usersRouter from "./routes/users.js";

const PORT = process.env.PORT || "8080";

const app = express();
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "OK", db: "connected" });
  } catch (err) {
    res
      .status(500)
      .json({ status: "ERROR", db: "disconnected", error: err.message });
  }
});

app.use("/api/users", usersRouter);

async function start() {
  await migrate();
  if (process.env.NODE_ENV === "development") await seed();
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}

start();
