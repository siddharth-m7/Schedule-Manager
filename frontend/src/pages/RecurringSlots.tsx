import React, { useEffect } from 'react'
import { useScheduleStore } from '../store/useScheduleStore'
import { DAYS_OF_WEEK } from '../types'
import DaySlots from '../components/DaySlots'
import LoadingSpinner from '../components/LoadingSpinner'

const RecurringSlots: React.FC = () => {
  const { recurringSlots, isLoading, fetchRecurringSlots } = useScheduleStore()

  useEffect(() => {
    fetchRecurringSlots()
  }, [fetchRecurringSlots])

  if (isLoading && recurringSlots.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Recurring Slots</h1>
        <p className="text-gray-600 mb-6">
          Manage your weekly recurring time slots. You can create up to 2 slots per day.
        </p>

        <div className="space-y-6">
          {DAYS_OF_WEEK.slice(1).concat(DAYS_OF_WEEK.slice(0, 1)).map((day, index) => {
            // Adjust index for Monday-first ordering (Monday = 1, Sunday = 0)
            const dayOfWeek = index === 6 ? 0 : index + 1
            return (
              <DaySlots
                key={day}
                day={day}
                dayOfWeek={dayOfWeek}
                slots={recurringSlots.filter(slot => slot.day_of_week === dayOfWeek)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RecurringSlots
