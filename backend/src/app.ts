import express from "express";
import cors from "cors";

import habitsRoutes from "./routes/habits.routes";
import categoriesRoutes from "./routes/categories.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/habits", habitsRoutes);
app.use("/api/categories", categoriesRoutes);

export default app;