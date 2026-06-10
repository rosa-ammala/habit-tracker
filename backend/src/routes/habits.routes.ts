import { Router } from "express";
import {
  createHabit,
  deleteHabit,
  getHabitById,
  getHabits,
  updateHabit,
} from "../controllers/habits.controller";

const router = Router();

router.get("/", getHabits);
router.get("/:id", getHabitById);
router.post("/", createHabit);
router.patch("/:id", updateHabit);
router.delete("/:id", deleteHabit);

export default router;