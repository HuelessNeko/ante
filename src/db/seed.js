import { pool } from "./pool.js";

const users = [
  { name: "Gabriel", email: "gabriel@example.com" },
  { name: "Kristian", email: "kristian@example.com" },
  { name: "Kerene", email: "kerene@example.com" },
];

export async function seed() {
  // Skip if already seeded
  const { rows } = await pool.query("SELECT COUNT(*) FROM users");
  if (parseInt(rows[0].count) > 0) {
    console.log("Seed skipped (table not empty)");
    return;
  }

  await Promise.all(
    users.map(({ name, email }) =>
      pool.query(
        "INSERT INTO users (name, email) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [name, email],
      ),
    ),
  );

  console.log(`Seeded ${users.length} users`);
}
