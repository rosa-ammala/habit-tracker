import express from "express";
import cors from "cors";
import categoriesRoutes from "./routes/categories.routes";
import habitsRoutes from "./routes/habits.routes";
import { errorHandler } from "./middleware/errors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/categories", categoriesRoutes);
app.use("/api/habits", habitsRoutes);

app.use(errorHandler);

export default app;
