import type { Request, Response } from "express";
import { getWeekSchedule } from "../services/weekService.js";

export async function getWeekScheduleController(req: Request, res: Response) {
  try {
    const { start_date } = req.query;

    if (!start_date) {
      return res.status(400).json({ error: "start_date is required" });
    }

    const schedule = await getWeekSchedule(start_date as string);
    res.json(schedule);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
