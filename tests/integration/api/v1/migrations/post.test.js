import db from "infra/database";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await db.query("drop schema public cascade; create schema public;");
});

test("POST to /api/v1/migrations should return 200", async () => {
  // First request
  const firstRest = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(firstRest.status).toBe(201);

  const firstRestBody = await firstRest.json();
  const migrations = await db.query("SELECT * FROM pgmigrations;");
  expect(Array.isArray(firstRestBody)).toBe(true);
  expect(firstRestBody.length).toBe(migrations.rows.length);

  // Second request
  const secondRes = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(secondRes.status).toBe(200);

  const secondResBody = await secondRes.json();
  expect(Array.isArray(secondResBody)).toBe(true);
  expect(secondResBody.length).toBe(0);

  // Third request
  const thirdRes = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "DELETE",
  });
  expect(thirdRes.status).toBe(405);
});
