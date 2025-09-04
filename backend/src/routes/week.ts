import { Router } from "express";
import * as WeekController from "../controllers/weekController.js";

const router = Router();

// GET /week?start_date=YYYY-MM-DD
router.get("/", WeekController.getWeekScheduleController);

export default router;
