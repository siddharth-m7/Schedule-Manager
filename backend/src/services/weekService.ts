import db from "../config/database.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const ZONE = "Asia/Kolkata";

function getWeekRange(startDate: string) {
  const date = dayjs.tz(startDate, ZONE);

  const startOfWeek = date.startOf("week");
  const endOfWeek = startOfWeek.add(6, "day");

  const weekDates = Array.from({ length: 7 }).map((_, i) =>
    startOfWeek.add(i, "day").format("YYYY-MM-DD")
  );

  return {
    startDate: startOfWeek.format("YYYY-MM-DD"),
    endDate: endOfWeek.format("YYYY-MM-DD"),
    weekDates,
  };
}

export async function getWeekSchedule(inputDate: string) {
  const { startDate, endDate, weekDates } = getWeekRange(inputDate);

  const recurringSlots = await db("recurring_slots").select("*");

  let expandedSlots = weekDates.flatMap((date) => {
    const dayOfWeek = dayjs.tz(date, ZONE).day();
    return recurringSlots
      .filter((slot) => slot.day_of_week === dayOfWeek)
      .map((slot) => ({
        date,
        recurring_slot_id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        from_recurring: true,
      }));
  });

  const exceptions = await db("slot_exceptions")
    .whereBetween("date", [startDate, endDate])
    .select("*");

  for (const ex of exceptions) {
  // Normalize exception.date into YYYY-MM-DD in ZONE
  const exDate = dayjs(ex.date).tz(ZONE).format("YYYY-MM-DD");

  // Always remove the base recurring slot
  expandedSlots = expandedSlots.filter(
    (slot) => !(slot.recurring_slot_id === ex.recurring_slot_id && slot.date === exDate)
  );

  if (!ex.is_deleted) {
    expandedSlots.push({
      date: exDate, // use normalized date
      recurring_slot_id: ex.recurring_slot_id,
      start_time: ex.start_time ?? null,
      end_time: ex.end_time ?? null,
      from_recurring: false,
    });
  }
}

  expandedSlots.sort((a, b) =>
    `${a.date} ${a.start_time}`.localeCompare(`${b.date} ${b.start_time}`)
  );

  return {
    start_date: startDate,
    end_date: endDate,
    slots: expandedSlots,
  };
}
