import { Router } from "express";
import { createCategory, getCategories } from "../controllers/categories.controller";

const router = Router();

router.get("/", getCategories);

router.post("/", createCategory);

export default router;