import React, { useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { ScheduleSlot } from '../types'
import { formatTime } from '../utils/dateHelpers'
import ExceptionForm from './ExceptionForm'
import ConfirmDialog from './ConfirmDialog'
import { useScheduleStore } from '../store/useScheduleStore'

interface ScheduleSlotCardProps {
  slot: ScheduleSlot
}

const ScheduleSlotCard: React.FC<ScheduleSlotCardProps> = ({ slot }) => {
  const [showExceptionForm, setShowExceptionForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { createException, isLoading } = useScheduleStore()

  const handleDeleteException = async () => {
    try {
      await createException({
        recurring_slot_id: slot.recurring_slot_id,
        date: slot.date,
        is_deleted: true
      })
      setShowDeleteDialog(false)
    } catch (error) {
      // Error is handled in the store
    }
  }

  const handleExceptionSuccess = () => {
    setShowExceptionForm(false)
    // The store will handle the refresh via the refreshTrigger
  }

  return (
    <>
      <div className="relative group">
        {/* Action Buttons - Positioned above the card */}
        <div className={`
          absolute 
          -top-2 
          -right-2 
          z-10
          flex 
          space-x-1
          opacity-0 
          group-hover:opacity-100 
          sm:opacity-0 
          sm:group-hover:opacity-100
          transition-all 
          duration-200
          transform
          group-hover:scale-100
          scale-95
        `}>
          {/* Edit Button */}
          <button
            onClick={() => setShowExceptionForm(true)}
            disabled={isLoading}
            className={`
              flex 
              items-center 
              justify-center 
              w-7 
              h-7 
              rounded-full 
              transition-all 
              duration-200 
              disabled:opacity-50
              bg-white 
              shadow-md 
              border 
              border-gray-200 
              hover:border-primary-300 
              hover:bg-primary-50 
              hover:text-primary-600 
              text-gray-500
              hover:scale-110
              active:scale-95
            `}
            title="Edit for this date"
          >
            <Edit2 className="h-3 w-3" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => setShowDeleteDialog(true)}
            disabled={isLoading}
            className={`
              flex 
              items-center 
              justify-center 
              w-7 
              h-7 
              rounded-full 
              transition-all 
              duration-200 
              disabled:opacity-50
              bg-white 
              shadow-md 
              border 
              border-gray-200 
              hover:border-red-300 
              hover:bg-red-50 
              hover:text-red-600 
              text-gray-500
              hover:scale-110
              active:scale-95
            `}
            title="Delete for this date"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>

        {/* Main Card */}
        <div className={`
          relative
          p-4 
          rounded-lg 
          border-l-4 
          min-h-[90px]
          transition-all 
          duration-300 
          hover:shadow-lg 
          hover:scale-[1.02]
          cursor-pointer
          ${slot.from_recurring
            ? 'bg-gradient-to-r from-primary-50 to-primary-25 border-primary-500 hover:from-primary-100 hover:to-primary-50'
            : 'bg-gradient-to-r from-yellow-50 to-yellow-25 border-yellow-500 hover:from-yellow-100 hover:to-yellow-50'
          }
        `}>
          {/* Main Content */}
          <div className="flex items-start space-x-3">
            {/* Icon */}
            {/* <div className={`
              flex-shrink-0 
              p-2 
              rounded-full 
              ${slot.from_recurring 
                ? 'bg-primary-100' 
                : 'bg-yellow-100'
              }
            `}>
              {slot.from_recurring ? (
                <Repeat className="h-4 w-4 text-primary-600" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-600" />
              )}
            </div> */}

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Time Display */}
              <div className="text-base font-semibold text-gray-900 leading-tight">
                {slot.start_time && slot.end_time ? (
                  `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`
                ) : (
                  'Time TBD'
                )}
              </div>
              
              {/* Type Badge */}
              <div className="flex items-center space-x-2">
                <span className={`
                  inline-flex 
                  px-2 
                  py-1 
                  text-xs 
                  font-medium 
                  rounded-full
                  ${slot.from_recurring 
                    ? 'bg-primary-200 text-primary-800' 
                    : 'bg-yellow-200 text-yellow-800'
                  }
                `}>
                  {slot.from_recurring ? 'Recurring' : 'Exception'}
                </span>
              </div>

              {/* Description */}
              {slot.description && (
                <div className="text-sm text-gray-600 leading-relaxed">
                  {slot.description}
                </div>
              )}
            </div>
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>

      {showExceptionForm && (
        <ExceptionForm
          slot={slot}
          onClose={() => setShowExceptionForm(false)}
          onSuccess={handleExceptionSuccess}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Slot for This Date"
        message={`Are you sure you want to delete this slot for ${slot.date}? This will only affect this specific date.`}
        confirmText="Delete"
        onConfirm={handleDeleteException}
        onCancel={() => setShowDeleteDialog(false)}
        isLoading={isLoading}
      />
    </>
  )
}

export default ScheduleSlotCard
