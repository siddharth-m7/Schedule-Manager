import { Router } from "express";
import * as slotsController from "../controllers/slotsController.js";

const router = Router();

// recurring slots
router.post("/", slotsController.createSlot);
router.get("/", slotsController.getSlots);
router.put("/:id", slotsController.updateSlot);
router.delete("/:id", slotsController.deleteSlot);

// slot exceptions
router.post("/exceptions", slotsController.createException);
router.get("/exceptions", slotsController.getExceptions);

export default router;
