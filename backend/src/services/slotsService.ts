import db from "../config/database.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const ZONE = "Asia/Kolkata";

// =============== RECURRING SLOTS ===============

// Create recurring slot (max 2 slots/day validation)
export async function createSlot(data: {
  day_of_week: number;
  start_time: string;
  end_time: string;
}) {
  if (data.start_time && data.end_time && data.end_time <= data.start_time) {
    throw new Error("End time must be greater than start time");
  }

  // Check max 2 slots per day
  const count = await db("recurring_slots")
    .where({ day_of_week: data.day_of_week })
    .count<{ count: string }>("id as count")
    .first();

  if (Number(count?.count || 0) >= 2) {
    throw new Error("A maximum of 2 slots are allowed per day");
  }

  const [slot] = await db("recurring_slots")
    .insert({
      day_of_week: data.day_of_week,
      start_time: data.start_time,
      end_time: data.end_time,
    })
    .returning("*");

  return slot;
}

// List all recurring slots
export async function getSlots() {
  return db("recurring_slots").select("*").orderBy(["day_of_week", "start_time"]);
}

// Update recurring slot
export async function updateSlot(
  id: number,
  data: Partial<{ day_of_week: number; start_time: string; end_time: string }>
) {
  if (data.start_time && data.end_time && data.end_time <= data.start_time) {
    throw new Error("End time must be greater than start time");
  }

  const [slot] = await db("recurring_slots")
    .where({ id })
    .update(data)
    .returning("*");

  return slot;
}

// Delete recurring slot
export async function deleteSlot(id: number) {
  return db("recurring_slots").where({ id }).del();
}

// =============== SLOT EXCEPTIONS ===============

// Create or replace exception (update/delete for specific week)
export async function createException(data: {
  recurring_slot_id: number;
  date: string; // YYYY-MM-DD
  start_time?: string;
  end_time?: string;
  is_deleted?: boolean;
}) {
  // Normalize date into YYYY-MM-DD in local timezone
  const exDate = dayjs.tz(data.date, ZONE).format("YYYY-MM-DD");

  // Fetch recurring slot
  const slot = await db("recurring_slots")
    .where({ id: data.recurring_slot_id })
    .first();

  if (!slot) {
    throw new Error("Recurring slot does not exist");
  }

  // Validate that date matches the recurring slot's day_of_week
  const dayOfWeek = dayjs(exDate).day(); // 0=Sunday … 6=Saturday
  if (dayOfWeek !== slot.day_of_week) {
    throw new Error(
      `Date ${exDate} does not match the recurring slot’s day_of_week (${slot.day_of_week})`
    );
  }

  // Validate times only if not a delete
  if (
    !data.is_deleted &&
    data.start_time &&
    data.end_time &&
    data.end_time <= data.start_time
  ) {
    throw new Error("End time must be greater than start time");
  }

  // Remove any existing exception for same slot+date
  await db("slot_exceptions")
    .where({
      recurring_slot_id: data.recurring_slot_id,
      date: exDate,
    })
    .del();

  // Insert new exception
  const [exception] = await db("slot_exceptions")
    .insert({
      recurring_slot_id: data.recurring_slot_id,
      date: exDate,
      start_time: data.start_time ?? null,
      end_time: data.end_time ?? null,
      is_deleted: data.is_deleted ?? false,
    })
    .returning("*");

  return exception;
}

// List exceptions
export async function getExceptions() {
  return db("slot_exceptions").select("*").orderBy(["date", "start_time"]);
}
