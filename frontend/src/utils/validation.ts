import { CreateSlotData, UpdateSlotData, RecurringSlot } from '../types'
import { isTimeValid } from './dateHelpers'

export const validateSlotData = (data: CreateSlotData | UpdateSlotData): string[] => {
  const errors: string[] = []

  if (
    'day_of_week' in data &&
    data.day_of_week !== undefined &&
    (data.day_of_week < 0 || data.day_of_week > 6)
  ) {
    errors.push('Invalid day of week')
  }

  if (data.start_time && data.end_time && !isTimeValid(data.start_time, data.end_time)) {
    errors.push('End time must be after start time')
  }

  // Updated regex to handle both HH:MM and H:MM formats
  const timeRegex = /^\d{1,2}:\d{2}$/

  if (data.start_time && !timeRegex.test(data.start_time)) {
    errors.push('Invalid start time format')
  }

  if (data.end_time && !timeRegex.test(data.end_time)) {
    errors.push('Invalid end time format')
  }

  return errors
}

// New validation function specifically for exceptions
export const validateExceptionData = (data: {
  start_time?: string
  end_time?: string
  is_deleted?: boolean
}): string[] => {
  const errors: string[] = []

  // Skip time validation if deleting
  if (data.is_deleted) {
    return errors
  }

  if (!data.start_time || !data.end_time) {
    errors.push('Start time and end time are required')
    return errors
  }

  // Validate time format
  const timeRegex = /^\d{1,2}:\d{2}$/
  
  if (!timeRegex.test(data.start_time)) {
    errors.push('Invalid start time format')
  }

  if (!timeRegex.test(data.end_time)) {
    errors.push('Invalid end time format')
  }

  // Validate that end time is after start time
  if (data.start_time && data.end_time && !isTimeValid(data.start_time, data.end_time)) {
    errors.push('End time must be after start time')
  }

  return errors
}

export const checkSlotOverlap = (
  newSlot: CreateSlotData | (UpdateSlotData & { day_of_week: number }),
  existingSlots: RecurringSlot[],
  excludeId?: number
): boolean => {
  const slotsForDay = existingSlots.filter(
    slot => slot.day_of_week === newSlot.day_of_week && slot.id !== excludeId
  )

  if (!newSlot.start_time || !newSlot.end_time) return false

  for (const slot of slotsForDay) {
    // Check for overlap
    const newStart = newSlot.start_time
    const newEnd = newSlot.end_time
    const existingStart = slot.start_time
    const existingEnd = slot.end_time

    if (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    ) {
      return true
    }
  }

  return false
}
