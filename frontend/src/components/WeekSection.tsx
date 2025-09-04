import { forwardRef, useEffect, useState } from 'react'
import { useScheduleStore } from '../store/useScheduleStore'
import { WeekSchedule, ScheduleSlot } from '../types'
import { formatDateHeader, getWeekDates } from '../utils/dateHelpers'
import { DAYS_OF_WEEK } from '../types'
import LoadingSpinner from './LoadingSpinner'
import ScheduleSlotCard from './ScheduleSlotCard'
import { Calendar } from 'lucide-react'

interface WeekSectionProps {
  weekStart: string
  isActive: boolean
}

const WeekSection = forwardRef<HTMLElement, WeekSectionProps>(({ weekStart, isActive }, ref) => {
  const [weekData, setWeekData] = useState<WeekSchedule | null>(null)
  const [loading, setLoading] = useState(false)
  const { fetchWeekSchedule, getWeekSchedule, refreshTrigger } = useScheduleStore()

  const loadWeekData = async (forceRefresh = false) => {
    // Check if data is already loaded and no force refresh
    if (!forceRefresh) {
      const cachedData = getWeekSchedule(weekStart)
      if (cachedData) {
        setWeekData(cachedData)
        return
      }
    }

    setLoading(true)
    const data = await fetchWeekSchedule(weekStart, forceRefresh)
    setWeekData(data)
    setLoading(false)
  }

  // Initial load
  useEffect(() => {
    loadWeekData()
  }, [weekStart])

  // Refresh when refreshTrigger changes (after exceptions are created/deleted)
  useEffect(() => {
    if (refreshTrigger > 0) {
      loadWeekData(true) // Force refresh
    }
  }, [refreshTrigger, weekStart])

  const weekDates = getWeekDates(weekStart)
  
  // Group slots by date
  const slotsByDate = weekData?.slots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = []
    }
    acc[slot.date].push(slot)
    return acc
  }, {} as Record<string, ScheduleSlot[]>) || {}

  return (
    <section 
      ref={ref}
      className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-300 ${
        isActive ? 'border-primary-500 shadow-lg' : 'border-gray-200'
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-primary-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              {formatDateHeader(weekStart)} - {formatDateHeader(weekDates[6])}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            {isActive && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                Current Week
              </span>
            )}
            <button
              onClick={() => loadWeekData(true)}
              disabled={loading}
              className="text-sm text-gray-500 hover:text-primary-500 disabled:opacity-50"
              title="Refresh week data"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {weekDates.map((date, index) => {
              const daySlots = slotsByDate[date] || []
              const dayName = DAYS_OF_WEEK[index === 6 ? 0 : index + 1] // Adjust for Monday-first
              
              return (
                <div key={date} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">
                    {dayName}
                    <div className="text-sm text-gray-500 font-normal">
                      {formatDateHeader(date).split(', ')[1]}
                    </div>
                  </h3>
                  
                  {daySlots.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                      No slots
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {daySlots.map((slot, slotIndex) => (
                        <ScheduleSlotCard
                          key={`${slot.recurring_slot_id}-${slot.date}-${slotIndex}-${refreshTrigger}`}
                          slot={slot}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
})

WeekSection.displayName = 'WeekSection'

export default WeekSection
