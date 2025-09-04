import type { Request, Response } from "express";
import * as slotsService from "../services/slotsService.js";

// Recurring Slots
export async function createSlot(req: Request, res: Response) {
  try {
    const slot = await slotsService.createSlot(req.body);
    res.status(201).json(slot);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getSlots(req: Request, res: Response) {
  try {
    const slots = await slotsService.getSlots();
    res.json(slots);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateSlot(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updated = await slotsService.updateSlot(Number(id), req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteSlot(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await slotsService.deleteSlot(Number(id));
    res.json({ message: "Slot deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

// Slot Exceptions
export async function createException(req: Request, res: Response) {
  try {
    const exception = await slotsService.createException(req.body);
    res.status(201).json(exception);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getExceptions(req: Request, res: Response) {
  try {
    const exceptions = await slotsService.getExceptions();
    res.json(exceptions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
