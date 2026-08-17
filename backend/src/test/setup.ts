import dotenv from "dotenv";

const testEnv = dotenv.config({
  path: ".env.test",
  override: true,
});

if (testEnv.error) {
  throw new Error(
    "Missing backend/.env.test. Create it from backend/.env.test.example and use a dedicated test database."
  );
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in backend/.env.test");
}

const databaseName = new URL(databaseUrl).pathname.replace("/", "");

if (!databaseName.includes("test")) {
  throw new Error(
    `Refusing to run tests against database "${databaseName}". Use a dedicated test database whose name includes "test".`
  );
}
