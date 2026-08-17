import express from "express";
import cors from "cors";
import categoriesRoutes from "./routes/categories.routes";
import habitsRoutes from "./routes/habits.routes";
import { getAllowedCorsOrigins, jsonBodyLimit } from "./config/http";
import { errorHandler } from "./middleware/errors";

const app = express();

app.use(
  cors({
    origin: getAllowedCorsOrigins(),
  })
);
app.use(express.json({ limit: jsonBodyLimit }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/categories", categoriesRoutes);
app.use("/api/habits", habitsRoutes);

app.use(errorHandler);

export default app;
