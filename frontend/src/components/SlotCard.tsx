import React, { useState } from 'react'
import { Edit2, Trash2, Clock } from 'lucide-react'
import { RecurringSlot } from '../types'
import { useScheduleStore } from '../store/useScheduleStore'
import { formatTime } from '../utils/dateHelpers'
import SlotForm from './SlotForm'
import ConfirmDialog from './ConfirmDialog'

interface SlotCardProps {
  slot: RecurringSlot
}

const SlotCard: React.FC<SlotCardProps> = ({ slot }) => {
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { deleteSlot, isLoading } = useScheduleStore()

  const handleDelete = async () => {
    await deleteSlot(slot.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary-500 transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-primary-500" />
            <div>
              <div className="font-medium text-gray-900">
                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
              </div>
              {slot.description && (
                <div className="text-sm text-gray-600 mt-1">
                  {slot.description}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEditForm(true)}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-primary-500 transition-colors disabled:opacity-50"
              title="Edit slot"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              title="Delete slot"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {showEditForm && (
        <SlotForm
          dayOfWeek={slot.day_of_week}
          initialData={slot}
          onClose={() => setShowEditForm(false)}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Slot"
        message={`Are you sure you want to delete the ${formatTime(slot.start_time)} - ${formatTime(slot.end_time)} slot?`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        isLoading={isLoading}
      />
    </>
  )
}

export default SlotCard
