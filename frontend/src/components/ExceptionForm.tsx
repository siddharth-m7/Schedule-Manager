import React, { useState } from 'react'
import { X } from 'lucide-react'
import { ScheduleSlot, CreateExceptionData } from '../types'
import { useScheduleStore } from '../store/useScheduleStore'
import { formatDateHeader } from '../utils/dateHelpers'
import { validateExceptionData } from '../utils/validation'

interface ExceptionFormProps {
  slot: ScheduleSlot
  onClose: () => void
  onSuccess?: () => void
}

const ExceptionForm: React.FC<ExceptionFormProps> = ({ slot, onClose, onSuccess }) => {
  // Ensure time format is correct for inputs
  const formatTimeForInput = (time: string | null): string => {
    if (!time) return ''
    // Convert to HH:MM format if needed
    const [hours, minutes] = time.split(':')
    return `${hours.padStart(2, '0')}:${minutes}`
  }

  const [formData, setFormData] = useState({
    start_time: formatTimeForInput(slot.start_time),
    end_time: formatTimeForInput(slot.end_time),
    is_deleted: false
  })
  const [errors, setErrors] = useState<string[]>([])
  
  const { createException, isLoading } = useScheduleStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    // Use the new validation function for exceptions
    const validationErrors = validateExceptionData(formData)

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      const exceptionData: CreateExceptionData = {
        recurring_slot_id: slot.recurring_slot_id,
        date: slot.date,
        start_time: formData.is_deleted ? undefined : formData.start_time,
        end_time: formData.is_deleted ? undefined : formData.end_time,
        is_deleted: formData.is_deleted
      }

      await createException(exceptionData)
      onSuccess?.()
      onClose()
    } catch (error) {
      // Error handling is done in the store
    }
  }

  const handleTimeChange = (field: 'start_time' | 'end_time', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Edit Slot for Specific Date
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {formatDateHeader(slot.date)}
            </p>
          </div>
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

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> This will create an exception for this specific date only. 
              The recurring slot will remain unchanged for other weeks.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_deleted"
                checked={formData.is_deleted}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  is_deleted: e.target.checked 
                }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_deleted" className="ml-2 block text-sm text-gray-900">
                Delete this slot for this date only
              </label>
            </div>

            {!formData.is_deleted && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.start_time}
                      onChange={(e) => handleTimeChange('start_time', e.target.value)}
                      className="input"
                      step="60"
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
                      onChange={(e) => handleTimeChange('end_time', e.target.value)}
                      className="input"
                      step="60"
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  <p><strong>Original:</strong> {formatTimeForInput(slot.start_time)} - {formatTimeForInput(slot.end_time)}</p>
                  <p><strong>New:</strong> {formData.start_time} - {formData.end_time}</p>
                </div>
              </>
            )}
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
              className={`${
                formData.is_deleted 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'btn-primary'
              } text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50`}
            >
              {isLoading ? 'Processing...' : (formData.is_deleted ? 'Delete for This Date' : 'Update for This Date')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExceptionForm
