export interface RecurringSlot {
  id: number
  day_of_week: number
  start_time: string
  end_time: string
  description?: string
}

export interface SlotException {
  id: number
  recurring_slot_id: number
  date: string
  start_time: string | null
  end_time: string | null
  is_deleted: boolean
}

export interface WeekSchedule {
  start_date: string
  end_date: string
  slots: ScheduleSlot[]
}

export interface ScheduleSlot {
  date: string
  recurring_slot_id: number
  start_time: string | null
  end_time: string | null
  from_recurring: boolean
  description?: string
}

export interface CreateSlotData {
  day_of_week: number
  start_time: string
  end_time: string
  description?: string
}

export interface UpdateSlotData {
  day_of_week?: number
  start_time?: string
  end_time?: string
  description?: string
}

// New interfaces for exceptions
export interface CreateExceptionData {
  recurring_slot_id: number
  date: string
  start_time?: string
  end_time?: string
  is_deleted?: boolean
}

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday', 
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]
