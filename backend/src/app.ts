import express from "express";
import cors from "cors";
import categoriesRoutes from "./routes/categories.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/categories", categoriesRoutes);

export default app;