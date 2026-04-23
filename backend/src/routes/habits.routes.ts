import { Router } from "express";
import { 
  createHabit, 
  createHabitLog, 
  deleteHabit, 
  deleteHabitLog, 
  getHabits, 
  updateHabit,
} from "../controllers/habits.controller";

const router = Router();

router.get("/", getHabits);

router.post("/", createHabit);

router.put("/:id", updateHabit);

router.delete("/:id", deleteHabit);

router.post("/:id/log", createHabitLog);

router.delete("/:id/log", deleteHabitLog);


export default router;