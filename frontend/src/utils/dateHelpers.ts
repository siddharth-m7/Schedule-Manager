import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

const TIMEZONE = 'Asia/Kolkata'

export const formatTime = (time: string | null): string => {
  if (!time) return ''
  
  try {
    // Handle different time formats
    const [hours, minutes] = time.split(':')
    const hour24 = parseInt(hours, 10)
    const min = parseInt(minutes, 10)
    
    // Create a proper date object for formatting
    const date = new Date()
    date.setHours(hour24, min, 0, 0)
    
    return dayjs(date).format('h:mm A')
  } catch (error) {
    console.warn('Error formatting time:', time, error)
    return time
  }
}

export const getWeekStartDate = (date: string | Date, weekOffset = 0): string => {
  return dayjs(date)
    .tz(TIMEZONE)
    .add(weekOffset, 'week')
    .startOf('week')
    .format('YYYY-MM-DD')
}

export const getWeekEndDate = (startDate: string): string => {
  return dayjs(startDate)
    .tz(TIMEZONE)
    .add(6, 'day')
    .format('YYYY-MM-DD')
}

export const getWeekDates = (startDate: string): string[] => {
  const dates = []
  const start = dayjs(startDate).tz(TIMEZONE)
  
  for (let i = 0; i < 7; i++) {
    dates.push(start.add(i, 'day').format('YYYY-MM-DD'))
  }
  
  return dates
}

export const formatDateHeader = (date: string): string => {
  return dayjs(date).tz(TIMEZONE).format('ddd, MMM D')
}

export const getCurrentWeekStart = (): string => {
  return dayjs().tz(TIMEZONE).startOf('week').format('YYYY-MM-DD')
}

export const getWeekNumber = (date: string): number => {
  return dayjs(date).tz(TIMEZONE).isoWeek()
}

export const isTimeValid = (startTime: string, endTime: string): boolean => {
  if (!startTime || !endTime) return false
  
  try {
    // Normalize time strings to ensure consistent format
    const normalizeTime = (time: string): string => {
      const [hours, minutes] = time.split(':')
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
    }
    
    const normalizedStart = normalizeTime(startTime)
    const normalizedEnd = normalizeTime(endTime)
    
    return dayjs(`2000-01-01 ${normalizedEnd}`).isAfter(dayjs(`2000-01-01 ${normalizedStart}`))
  } catch (error) {
    console.warn('Error validating times:', startTime, endTime, error)
    return false
  }
}

// Updated to generate weeks starting from current week
export const generateInitialWeekRange = (currentWeek: string, pastWeeks = 5): string[] => {
  const weeks = []
  const baseWeek = dayjs(currentWeek).tz(TIMEZONE).startOf('week')
  
  // Generate past weeks
  for (let i = -pastWeeks; i < 0; i++) {
    weeks.push(baseWeek.add(i, 'week').format('YYYY-MM-DD'))
  }
  
  // Add current week
  weeks.push(baseWeek.format('YYYY-MM-DD'))
  
  // Generate future weeks (more future weeks for better UX)
  for (let i = 1; i <= 15; i++) {
    weeks.push(baseWeek.add(i, 'week').format('YYYY-MM-DD'))
  }
  
  return weeks
}

// New function to generate weeks AFTER a given week (no overlap)
export const generateMoreWeeks = (lastWeek: string, count = 5): string[] => {
  const weeks = []
  const baseWeek = dayjs(lastWeek).tz(TIMEZONE)
  
  // Generate only future weeks starting from the next week
  for (let i = 1; i <= count; i++) {
    weeks.push(baseWeek.add(i, 'week').startOf('week').format('YYYY-MM-DD'))
  }
  
  return weeks
}

// Keep the old function for backward compatibility but mark as deprecated
export const generateWeekRange = generateInitialWeekRange
