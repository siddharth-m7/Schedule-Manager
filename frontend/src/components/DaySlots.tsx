import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { RecurringSlot } from '../types'
import { useScheduleStore } from '../store/useScheduleStore'
import SlotCard from './SlotCard'
import SlotForm from './SlotForm'

interface DaySlotsProps {
  day: string
  dayOfWeek: number
  slots: RecurringSlot[]
}

const DaySlots: React.FC<DaySlotsProps> = ({ day, dayOfWeek, slots }) => {
  const [showForm, setShowForm] = useState(false)
  const { isLoading } = useScheduleStore()

  const canAddSlot = slots.length < 2

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{day}</h2>
        {canAddSlot && (
          <button
            onClick={() => setShowForm(true)}
            disabled={isLoading}
            className="btn-primary flex items-center text-sm disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Slot
          </button>
        )}
      </div>

      <div className="space-y-3">
        {slots.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No recurring slots for {day}
          </p>
        ) : (
          slots.map(slot => (
            <SlotCard key={slot.id} slot={slot} />
          ))
        )}

        {!canAddSlot && (
          <p className="text-sm text-gray-400 text-center mt-4">
            Maximum 2 slots per day reached
          </p>
        )}
      </div>

      {showForm && (
        <SlotForm
          dayOfWeek={dayOfWeek}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default DaySlots
