import { Router } from "express";
import {
  addHabitLog,
  createHabit,
  deleteHabit,
  deleteHabitLog,
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
router.post("/:id/logs", addHabitLog);
router.delete("/:id/logs/:date", deleteHabitLog);

export default router;