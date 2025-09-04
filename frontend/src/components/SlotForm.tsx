import React, { useState } from 'react'
import { X } from 'lucide-react'
import { RecurringSlot, CreateSlotData } from '../types'
import { useScheduleStore } from '../store/useScheduleStore'
import { validateSlotData, checkSlotOverlap } from '../utils/validation'

interface SlotFormProps {
  dayOfWeek: number
  initialData?: RecurringSlot
  onClose: () => void
}

const SlotForm: React.FC<SlotFormProps> = ({ dayOfWeek, initialData, onClose }) => {
  const [formData, setFormData] = useState({
    start_time: initialData?.start_time || '',
    end_time: initialData?.end_time || '',
    description: initialData?.description || ''
  })
  const [errors, setErrors] = useState<string[]>([])
  
  const { createSlot, updateSlot, isLoading, recurringSlots } = useScheduleStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    // Validate form data
    const slotData = { ...formData, day_of_week: dayOfWeek }
    const validationErrors = validateSlotData(slotData)

    // Check for overlapping slots
    if (checkSlotOverlap(slotData, recurringSlots, initialData?.id)) {
      validationErrors.push('This time slot overlaps with an existing slot')
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      if (initialData) {
        await updateSlot(initialData.id, formData)
      } else {
        await createSlot(slotData as CreateSlotData)
      }
      onClose()
    } catch (error) {
      // Error handling is done in the store
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {initialData ? 'Edit Slot' : 'Create New Slot'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <ul className="text-red-600 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                required
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                required
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Morning workout, Study time..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SlotForm
