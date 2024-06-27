import db from "infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(req, res) {
  const allowedMethods = ["GET", "POST"];
  const method = req.method;
  if (!allowedMethods.includes(method)) {
    return res.status(405).json({ error: `Method "${method}" not allowed` });
  }

  let dbClient;

  try {
    dbClient = await db.getNewClient();
    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    switch (method) {
      case "GET":
        const pendingMigrations = await migrationRunner(
          defaultMigrationOptions,
        );
        return res.status(200).json(pendingMigrations);

      case "POST":
        const migratedmigrations = await migrationRunner({
          ...defaultMigrationOptions,
          dryRun: false,
        });

        if (migratedmigrations.length > 0) {
          return res.status(201).json(migratedmigrations);
        }

        return res.status(200).json(migratedmigrations);
    }
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await dbClient.end();
  }
}
